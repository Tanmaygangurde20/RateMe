const express = require('express');
const pool = require('../db');
const { verifyToken, checkRole } = require('../auth');

const router = express.Router();

// Manual Validation for Rating
const validateRating = (body) => {
  const { rating, comment } = body;
  if (!rating || rating < 1 || rating > 5) return 'Rating must be 1-5';
  if (comment && comment.length > 500) return 'Comment max 500 characters';
  return null;
};

// GET /customer/stores - List/search stores
router.get('/stores', verifyToken, checkRole(['normal']), async (req, res) => {
  const { name, address, sort = 'name asc' } = req.query;
  const [field, order] = sort.split(' ');
  let query = `
    SELECT s.id, s.name, s.address, AVG(r.rating) as overall_rating,
           (SELECT rating FROM ratings WHERE user_id = $1 AND store_id = s.id) as user_rating,
           (SELECT comment FROM ratings WHERE user_id = $1 AND store_id = s.id) as user_comment
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    WHERE 1=1
  `;
  const params = [req.user.id];
  if (name) {
    params.push(`%${name}%`);
    query += ` AND s.name ILIKE $${params.length}`;
  }
  if (address) {
    params.push(`%${address}%`);
    query += ` AND s.address ILIKE $${params.length}`;
  }
  query += ` GROUP BY s.id ORDER BY s.${field} ${order.toUpperCase()}`;
  const result = await pool.query(query, params);
  res.json(result.rows);
});

// POST /customer/ratings - Submit/modify rating
router.post('/ratings', verifyToken, checkRole(['normal']), async (req, res) => {
  try {
    const error = validateRating(req.body);
    if (error) return res.status(400).json({ error });
    
    const { rating, comment, store_id } = req.body;
    
    // Validate store exists
    const storeExists = await pool.query('SELECT id FROM stores WHERE id = $1', [store_id]);
    if (!storeExists.rows[0]) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    const existing = await pool.query(
      'SELECT id FROM ratings WHERE user_id = $1 AND store_id = $2',
      [req.user.id, store_id]
    );
    
    if (existing.rows[0]) {
      await pool.query(
        'UPDATE ratings SET rating = $1, comment = $2 WHERE id = $3',
        [rating, comment || null, existing.rows[0].id]
      );
      return res.json({ message: 'Rating and comment updated' });
    }
    
    await pool.query(
      'INSERT INTO ratings (rating, comment, user_id, store_id) VALUES ($1, $2, $3, $4)',
      [rating, comment || null, req.user.id, store_id]
    );
    res.status(201).json({ message: 'Rating and comment submitted' });
  } catch (err) {
    console.error('Error in rating submission:', err);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});

// GET /customer/my-ratings - Get customer's own ratings
router.get('/my-ratings', verifyToken, checkRole(['normal']), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.id, r.rating, r.comment, r.created_at,
             s.name as store_name, s.address as store_address
      FROM ratings r
      JOIN stores s ON r.store_id = s.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
    `, [req.user.id]);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching user ratings:', err);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});

// PATCH /customer/password - Update customer password
router.patch('/password', verifyToken, checkRole(['normal']), async (req, res) => {
  const { newPassword } = req.body;
  const bcrypt = require('bcrypt');
  if (!newPassword.match(/^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$/)) {
    return res.status(400).json({ error: 'Invalid password format' });
  }
  const hashed = await bcrypt.hash(newPassword, 10);
  await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, req.user.id]);
  res.json({ message: 'Password updated' });
});

module.exports = router;
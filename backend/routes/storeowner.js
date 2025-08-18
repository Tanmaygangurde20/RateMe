const express = require('express');
const pool = require('../db');
const { verifyToken, checkRole } = require('../auth');

const router = express.Router();

// GET /storeowner/ratings - View store ratings
router.get('/ratings', verifyToken, checkRole(['store_owner']), async (req, res) => {
  const storeResult = await pool.query('SELECT id FROM stores WHERE owner_id = $1', [req.user.id]);
  const store = storeResult.rows[0];
  if (!store) return res.status(404).json({ error: 'Store not found' });
  const ratingsResult = await pool.query(
    'SELECT r.id, r.rating, r.comment, u.name, u.email FROM ratings r JOIN users u ON r.user_id = u.id WHERE r.store_id = $1',
    [store.id]
  );
  const avgResult = await pool.query('SELECT AVG(rating) as avg_rating FROM ratings WHERE store_id = $1', [store.id]);
  res.json({
    ratings: ratingsResult.rows,
    avgRating: avgResult.rows[0].avg_rating ? parseFloat(avgResult.rows[0].avg_rating) : null,
  });
});

// PATCH /storeowner/password - Update store owner password
router.patch('/password', verifyToken, checkRole(['store_owner']), async (req, res) => {
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
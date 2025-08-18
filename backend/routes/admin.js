const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');
const { verifyToken, checkRole } = require('../auth');

const router = express.Router();

// Manual Validation for User
const validateUser = (body) => {
    const { name, email, address, password, role } = body;
    if (!name || name.length < 20 || name.length > 60) return 'Name must be 20-60 characters';
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Invalid email';
    if (!address || address.length > 400) return 'Address max 400 characters';
    if (password && !password.match(/^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$/)) return 'Password must be 8-16 chars with uppercase and special char';
    if (role && !['admin', 'normal', 'store_owner'].includes(role)) return 'Invalid role';
    return null;
};

// Manual Validation for Store
const validateStore = (body) => {
    const { name, email, address } = body;
    if (!name) return 'Name required';
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Invalid email';
    if (!address || address.length > 400) return 'Address max 400 characters';
    return null;
};

// POST /admin/users - Add user
router.post('/users', verifyToken, checkRole(['admin']), async (req, res) => {
    const error = validateUser(req.body);
    if (error) return res.status(400).json({ error });
    const { name, email, address, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
        'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [name, email, hashed, address, role || 'normal']
    );
    res.status(201).json({ id: result.rows[0].id });
});

// GET /admin/dashboard - View dashboard
router.get('/dashboard', verifyToken, checkRole(['admin']), async (req, res) => {
    const users = await pool.query('SELECT COUNT(*) FROM users');
    const stores = await pool.query('SELECT COUNT(*) FROM stores');
    const ratings = await pool.query('SELECT COUNT(*) FROM ratings');
    res.json({
        totalUsers: parseInt(users.rows[0].count),
        totalStores: parseInt(stores.rows[0].count),
        totalRatings: parseInt(ratings.rows[0].count),
    });
});

// GET /admin/users - List/filter users
router.get('/users', verifyToken, checkRole(['admin']), async (req, res) => {
    const { name, email, address, role, sort = 'name asc' } = req.query;
    const [field, order] = sort.split(' ');
    
    // Validate sort parameters to prevent SQL injection
    const allowedFields = ['name', 'email', 'address', 'role', 'id', 'created_at'];
    const allowedOrders = ['asc', 'desc'];
    
    if (!allowedFields.includes(field) || !allowedOrders.includes(order)) {
        return res.status(400).json({ error: 'Invalid sort parameters' });
    }
    
    let query = `SELECT id, name, email, address, role FROM users WHERE 1=1`;
    const params = [];
    if (name) {
        params.push(`%${name}%`);
        query += ` AND name ILIKE $${params.length}`;
    }
    if (email) {
        params.push(`%${email}%`);
        query += ` AND email ILIKE $${params.length}`;
    }
    if (address) {
        params.push(`%${address}%`);
        query += ` AND address ILIKE $${params.length}`;
    }
    if (role) {
        params.push(role);
        query += ` AND role = $${params.length}`;
    }
    query += ` ORDER BY ${field} ${order.toUpperCase()}`;
    const result = await pool.query(query, params);
    res.json(result.rows);
});

// GET /admin/admins - List all admin users
router.get('/admins', verifyToken, checkRole(['admin']), async (req, res) => {
    try {
        const result = await pool.query("SELECT id, name, email, address, role FROM users WHERE role = 'admin' ORDER BY name asc");
        res.json(result.rows);
    } catch (err) {
        console.error('Get admins error:', err);
        res.status(500).json({ error: 'Failed to load admins' });
    }
});

// GET /admin/stores - List/filter stores
router.get('/stores', verifyToken, checkRole(['admin']), async (req, res) => {
    const { name, email, address, sort = 'name asc' } = req.query;
    const [field, order] = sort.split(' ');
    
    // Validate sort parameters to prevent SQL injection
    const allowedFields = ['name', 'email', 'address', 'id', 'created_at'];
    const allowedOrders = ['asc', 'desc'];
    
    if (!allowedFields.includes(field) || !allowedOrders.includes(order)) {
        return res.status(400).json({ error: 'Invalid sort parameters' });
    }
    
    let query = `
    SELECT s.id, s.name, s.email, s.address, AVG(r.rating) as avg_rating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    WHERE 1=1
  `;
    const params = [];
    if (name) {
        params.push(`%${name}%`);
        query += ` AND s.name ILIKE $${params.length}`;
    }
    if (email) {
        params.push(`%${email}%`);
        query += ` AND s.email ILIKE $${params.length}`;
    }
    if (address) {
        params.push(`%${address}%`);
        query += ` AND s.address ILIKE $${params.length}`;
    }
    query += ` GROUP BY s.id ORDER BY s.${field} ${order.toUpperCase()}`;
    const result = await pool.query(query, params);
    res.json(result.rows);
});

// POST /admin/stores - Add store
router.post('/stores', verifyToken, checkRole(['admin']), async (req, res) => {
    const error = validateStore(req.body);
    if (error) return res.status(400).json({ error });
    const { name, email, address, owner_id } = req.body;
    const result = await pool.query(
        'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING id',
        [name, email, address, owner_id || null]
    );
    res.status(201).json({ id: result.rows[0].id });
});

// GET /admin/users/:id - View user details
router.get('/users/:id', verifyToken, checkRole(['admin']), async (req, res) => {
    const result = await pool.query('SELECT id, name, email, address, role FROM users WHERE id = $1', [req.params.id]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: 'User not found' });
    let details = { ...user };
    if (user.role === 'store_owner') {
        const storeResult = await pool.query('SELECT id FROM stores WHERE owner_id = $1', [user.id]);
        const store = storeResult.rows[0];
        if (store) {
            const avgResult = await pool.query('SELECT AVG(rating) as avg_rating FROM ratings WHERE store_id = $1', [store.id]);
            details.avgRating = avgResult.rows[0].avg_rating ? parseFloat(avgResult.rows[0].avg_rating) : null;
        }
    }
    res.json(details);
});

// GET /admin/stores/:id - View store details
router.get('/stores/:id', verifyToken, checkRole(['admin']), async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT s.id, s.name, s.email, s.address, s.owner_id, s.created_at,
                   u.name as owner_name, u.email as owner_email,
                   AVG(r.rating) as avg_rating, COUNT(r.id) as total_ratings
            FROM stores s
            LEFT JOIN users u ON s.owner_id = u.id
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE s.id = $1
            GROUP BY s.id, u.name, u.email
        `, [req.params.id]);
        
        const store = result.rows[0];
        if (!store) return res.status(404).json({ error: 'Store not found' });
        
        res.json(store);
    } catch (err) {
        console.error('Store details error:', err);
        res.status(500).json({ error: 'Failed to fetch store details' });
    }
});

// PATCH /admin/password - Update admin password
router.patch('/password', verifyToken, checkRole(['admin']), async (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword.match(/^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$/)) {
        return res.status(400).json({ error: 'Invalid password format' });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, req.user.id]);
    res.json({ message: 'Password updated' });
});

module.exports = router;
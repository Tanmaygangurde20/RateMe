const express = require('express');
const cors = require('cors');
const adminRoutes = require('./routes/admin');
const customerRoutes = require('./routes/customer');
const storeownerRoutes = require('./routes/storeowner');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Mount role-specific routes
app.use('/admin', adminRoutes);
app.use('/customer', customerRoutes);
app.use('/storeowner', storeownerRoutes);

// Shared routes: signup, login
app.post('/signup', async (req, res) => {
  const validateUser = (body) => {
    const { name, email, address, password, role } = body;
    
    // Validate required fields
    if (!name || name.length < 20 || name.length > 60) {
      return 'Name must be 20-60 characters';
    }
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return 'Invalid email format';
    }
    if (!address || address.length > 400) {
      return 'Address must be maximum 400 characters';
    }
    if (!password || !password.match(/^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$/)) {
      return 'Password must be 8-16 characters with at least one uppercase letter and one special character';
    }
    // Only allow 'normal' role for signup
    if (role !== 'normal') {
      return 'Only customer accounts can be created through signup';
    }
    
    return null;
  };

  const error = validateUser(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const { name, email, address, password, role } = req.body;
  const bcrypt = require('bcrypt');
  const pool = require('./db');
  
  try {
    // Check if email already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password and create user (only normal users can sign up)
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role',
      [name, email, hashedPassword, address, 'normal']
    );

    res.status(201).json({ 
      message: 'User created successfully', 
      user: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        role: result.rows[0].role
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const pool = require('./db');
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    
    // Find user by email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role,
        name: user.name,
        email: user.email
      }, 
      process.env.JWT_SECRET || 'your-secret-key', 
      { expiresIn: '24h' }
    );
    
    res.json({ 
      token, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get user profile (protected route)
app.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const jwt = require('jsonwebtoken');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const pool = require('./db');
    
    const result = await pool.query('SELECT id, name, email, address, role FROM users WHERE id = $1', [decoded.id]);
    const user = result.rows[0];
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Logout endpoint
app.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
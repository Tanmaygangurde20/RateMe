const bcrypt = require('bcrypt');
const pool = require('./db');

async function setupAdmin() {
  try {
    console.log('🔧 Setting up initial admin user...');
    
    // Check if admin already exists
    const existingAdmin = await pool.query('SELECT id FROM users WHERE email = $1', ['admin@test.com']);
    
    if (existingAdmin.rows.length > 0) {
      console.log('✅ Admin user already exists');
      return;
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    
    const result = await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [
        'System Administrator Test User',
        'admin@test.com',
        hashedPassword,
        '123 Admin Street, Admin City, AC 12345',
        'admin'
      ]
    );
    
    console.log('✅ Admin user created with ID:', result.rows[0].id);
    console.log('📧 Email: admin@test.com');
    console.log('🔑 Password: Admin@123');
    
  } catch (error) {
    console.error('❌ Error setting up admin:', error.message);
  } finally {
    await pool.end();
  }
}

setupAdmin();

// test-db.js
const Pool = require('pg').Pool;

const pool = require('./db');
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('Connection error:', err);
  else console.log('Connected:', res.rows[0]);
});
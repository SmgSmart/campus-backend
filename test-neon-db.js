const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  console.log('Testing connection to:', process.env.DATABASE_URL.split('@')[1]);
  try {
    const client = await pool.connect();
    console.log('Successfully connected to Neon DB!');
    const res = await client.query('SELECT NOW()');
    console.log('Current time from DB:', res.rows[0]);
    client.release();
  } catch (err) {
    console.error('Connection error:', err.message);
    console.error('Full error:', err);
  } finally {
    await pool.end();
  }
}

testConnection();

import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testConnection() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Attempting to connect to database...');
    const result = await pool.query('SELECT NOW()');
    console.log('Connection successful!');
    console.log('Current database time:', result.rows[0].now);
  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    await pool.end();
  }
}

testConnection(); 
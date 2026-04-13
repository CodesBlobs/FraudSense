import pool from './connection.js';
import dotenv from 'dotenv';

dotenv.config();

async function migrateHints() {
  const client = await pool.connect();
  try {
    console.log('🔄 Migrating database to add hint column...');
    await client.query('ALTER TABLE scenarios ADD COLUMN IF NOT EXISTS hint TEXT;');
    console.log('✅ Migration successful: Added hint column to scenarios table.');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrateHints();

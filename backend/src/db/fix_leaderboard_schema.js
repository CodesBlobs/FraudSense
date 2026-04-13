import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('🔧 Running emergency schema fix...');

    console.log('Migrating users table...');
    await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS best_duration INTEGER DEFAULT 999999;');
    
    console.log('Migrating game_sessions table...');
    await client.query('ALTER TABLE game_sessions ADD COLUMN IF NOT EXISTS duration INTEGER DEFAULT 0;');
    
    console.log('✅ Migration complete!');
  } catch (err) {
    if (err.code === '42701') {
      console.log('💡 Columns already exist, skipping.');
    } else {
      console.error('❌ Migration failed:', err);
    }
  } finally {
    client.release();
    pool.end();
  }
}

migrate();

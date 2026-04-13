import pool from './connection.js';

async function initDatabase() {
  const client = await pool.connect();
  try {
    console.log('🔧 Initializing ScamShield database...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS scenarios (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        content TEXT NOT NULL,
        is_scam BOOLEAN NOT NULL,
        category TEXT NOT NULL DEFAULT 'other',
        difficulty TEXT NOT NULL DEFAULT 'medium',
        sender_name TEXT,
        message_type TEXT DEFAULT 'sms',
        hint TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ scenarios table ready');

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        high_score INTEGER DEFAULT 0,
        best_duration INTEGER DEFAULT 999999,
        total_games INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ users table ready');

    await client.query(`
      CREATE TABLE IF NOT EXISTS attempts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        scenario_id UUID REFERENCES scenarios(id) ON DELETE CASCADE,
        user_answer TEXT NOT NULL,
        is_correct BOOLEAN NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ attempts table ready');

    await client.query(`
      CREATE TABLE IF NOT EXISTS game_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        score INTEGER DEFAULT 0,
        total_questions INTEGER DEFAULT 0,
        duration INTEGER DEFAULT 0,
        completed_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ game_sessions table ready');

    console.log('🎉 Database initialization complete!');
  } catch (err) {
    console.error('❌ Database initialization failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

initDatabase();

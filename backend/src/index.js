import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import scenarioRoutes from './routes/scenarios.js';
import evaluateRoutes from './routes/evaluate.js';
import authRoutes from './routes/auth.js';
import scoreRoutes from './routes/scores.js';

import pool from './db/connection.js';

dotenv.config();

// --- EMERGENCY MIGRATION ---
(async () => {
  const client = await pool.connect();
  try {
    console.log('🔧 Running auto-migration for leaderboard columns...');
    await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS best_duration INTEGER DEFAULT 999999;');
    await client.query('ALTER TABLE game_sessions ADD COLUMN IF NOT EXISTS duration INTEGER DEFAULT 0;');
    console.log('✅ Auto-migration successful!');
  } catch (err) {
    console.error('❌ Auto-migration failed:', err);
  } finally {
    client.release();
  }
})();
// ----------------------------

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/evaluate', evaluateRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/scores', scoreRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🛡️  ScamShield Backend running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});

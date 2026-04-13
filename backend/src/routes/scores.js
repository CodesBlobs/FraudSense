import { Router } from 'express';
import pool from '../db/connection.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/scores
 * Saves a game session score. Requires authentication.
 */
router.post('/', requireAuth, async (req, res) => {
  try {
    const { score, totalQuestions, duration } = req.body;
    const userId = req.user.id;

    if (score == null || totalQuestions == null) {
      return res.status(400).json({ error: 'score and totalQuestions are required' });
    }

    const finalDuration = duration || 0;

    // Save game session
    await pool.query(
      `INSERT INTO game_sessions (user_id, score, total_questions, duration)
       VALUES ($1, $2, $3, $4)`,
      [userId, score, totalQuestions, finalDuration]
    );

    // Get current high score to compare
    const currentStatus = await pool.query(
      'SELECT high_score, best_duration FROM users WHERE id = $1',
      [userId]
    );
    
    const oldScore = currentStatus.rows[0]?.high_score || 0;
    const oldDuration = currentStatus.rows[0]?.best_duration || 999999;

    let updateScore = false;
    if (score > oldScore) {
      updateScore = true;
    } else if (score === oldScore && finalDuration < oldDuration) {
      updateScore = true;
    }

    if (updateScore) {
      await pool.query(
        `UPDATE users 
         SET high_score = $1,
             best_duration = $2,
             total_games = total_games + 1
         WHERE id = $3`,
        [score, finalDuration, userId]
      );
    } else {
      await pool.query(
        `UPDATE users 
         SET total_games = total_games + 1
         WHERE id = $1`,
        [userId]
      );
    }

    // Get updated user stats
    const userResult = await pool.query(
      'SELECT high_score, best_duration, total_games FROM users WHERE id = $1',
      [userId]
    );

    res.json({
      saved: true,
      highScore: userResult.rows[0].high_score,
      bestDuration: userResult.rows[0].best_duration,
      totalGames: userResult.rows[0].total_games,
    });
  } catch (err) {
    console.error('Error saving score:', err);
    res.status(500).json({ error: 'Failed to save score' });
  }
});

/**
 * GET /api/leaderboard
 * Returns the top 20 users by high score (primary) and best duration (tie-breaker).
 */
router.get('/leaderboard', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT username, high_score, best_duration, total_games
       FROM users
       WHERE high_score > 0
       ORDER BY high_score DESC, best_duration ASC
       LIMIT 20`
    );

    res.json({
      leaderboard: result.rows.map((row, index) => ({
        rank: index + 1,
        username: row.username,
        highScore: row.high_score,
        bestDuration: row.best_duration,
        totalGames: row.total_games,
      })),
    });
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

export default router;

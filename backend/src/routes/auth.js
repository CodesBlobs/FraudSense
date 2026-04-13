import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db/connection.js';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

/**
 * POST /api/auth/register
 * Creates a new user account with username and password.
 */
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({ error: 'Username must be 3-20 characters' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if username already exists
    const existing = await pool.query(
      'SELECT id FROM users WHERE LOWER(username) = LOWER($1)',
      [username]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    // Hash password and create user
    const passwordHash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO users (username, password_hash)
       VALUES ($1, $2)
       RETURNING id, username, high_score, total_games, created_at`,
      [username, passwordHash]
    );

    const user = result.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        highScore: user.high_score,
        totalGames: user.total_games,
      },
    });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

/**
 * POST /api/auth/login
 * Authenticates a user and returns a JWT.
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const result = await pool.query(
      'SELECT id, username, password_hash, high_score, total_games FROM users WHERE LOWER(username) = LOWER($1)',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        highScore: user.high_score,
        totalGames: user.total_games,
      },
    });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

export default router;

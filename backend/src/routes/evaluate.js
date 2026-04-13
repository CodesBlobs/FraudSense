import { Router } from 'express';
import pool from '../db/connection.js';
import { optionalAuth } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

import { callOllama } from '../utils/ai.js';

const SYSTEM_PROMPT = `You are ScamShield AI, a cybersecurity educator designed for senior citizens.

Your job is to:
- Analyze messages (SMS, email, chat)
- Decide if they are scams or legitimate
- Explain reasoning in very simple, friendly language

Rules:
- No technical jargon
- Keep response short and clear
- Use bullet points when helpful
- Never shame the user
- Be calm and supportive
- Always include:
  1. Verdict (SCAM or LEGIT)
  2. Key warning signs (if scam)
  3. Safety advice

You MUST respond in valid JSON with this exact structure and nothing else:
{
  "verdict": "SCAM" or "LEGIT",
  "isCorrect": true or false (whether the user's answer matches the verdict),
  "explanation": "A short, friendly explanation of why this message is a scam or legitimate",
  "redFlags": ["flag1", "flag2"] (empty array if legitimate),
  "safetyTips": ["tip1", "tip2"]
}

IMPORTANT: Output ONLY valid JSON. No markdown, no code fences, no extra text.`;

/**
 * POST /api/evaluate
 * Evaluates a user's answer against a scenario using Ollama Cloud AI.
 */
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { scenarioId, message, userAnswer } = req.body;

    if (!message || !userAnswer) {
      return res.status(400).json({ error: 'message and userAnswer are required' });
    }

    // Validate user answer
    const normalizedAnswer = userAnswer.toLowerCase();
    if (!['scam', 'safe'].includes(normalizedAnswer)) {
      return res.status(400).json({ error: 'userAnswer must be "scam" or "safe"' });
    }

    // 1. First, get ground truth from DB if scenarioId exists
    let actualIsScam = null;
    let isCorrect = null;
    
    if (scenarioId) {
      const scenarioResult = await pool.query(
        'SELECT is_scam FROM scenarios WHERE id = $1',
        [scenarioId]
      );
      
      if (scenarioResult.rows.length > 0) {
        actualIsScam = scenarioResult.rows[0].is_scam;
        isCorrect = (normalizedAnswer === 'scam') === actualIsScam;
      }
    }

    // 2. Inject ground truth context into AI to prevent hallucinated verdicts
    const truthContext = actualIsScam !== null 
      ? `\nGround Truth: This message is officially ${actualIsScam ? 'a SCAM' : 'LEGITIMATE'}.\nYour verdict MUST be "${actualIsScam ? 'SCAM' : 'LEGIT'}".`
      : '';

    const userPrompt = `Message:
"""
${message}
"""

User Answer: ${normalizedAnswer}
${truthContext}

Explain whether the user is correct and why. Respond in JSON format only.`;

    const rawContent = await callOllama(SYSTEM_PROMPT, userPrompt);

    // Parse JSON — handle potential markdown fences
    let jsonStr = rawContent.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    }
    const aiResponse = JSON.parse(jsonStr);

    // 3. Force alignment to local DB state so UI doesn't freak out
    if (actualIsScam !== null) {
      aiResponse.verdict = actualIsScam ? 'SCAM' : 'LEGIT';
      aiResponse.isCorrect = isCorrect;

      // Record the attempt
      await pool.query(
        `INSERT INTO attempts (user_id, scenario_id, user_answer, is_correct)
         VALUES ($1, $2, $3, $4)`,
        [req.user?.id || null, scenarioId, normalizedAnswer, isCorrect]
      );
    }

    res.json(aiResponse);
  } catch (err) {
    console.error('Error evaluating answer:', err);
    res.status(500).json({ error: 'Failed to evaluate answer' });
  }
});

export default router;

import { Router } from 'express';
import pool from '../db/connection.js';
import { callOllama } from '../utils/ai.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

async function processScenarioLinks(scenario) {
  if (!scenario.content.includes('[link]')) return scenario;

  const systemPrompt = `You are a cybersecurity expert building a phishing simulator.
Your task is to generate ONE single realistic, deceptive phishing URL based on the provided message context.
Rules:
1. The domain should look highly deceptive and hyper-specific to the message content.
2. Include a path that matches the action requested in the content (e.g., /claim, /update-billing).
3. Do not include http:// or https://.
4. Return ONLY the raw URL as plain text. No quotes, no markdown, no explanation.`;

  const userPrompt = `Message Category: ${scenario.category || 'Unknown'}
Sender Name: ${scenario.sender_name || 'Unknown'}
Message Content: "${scenario.content || ''}"

Generate the deceptive URL:`;

  try {
    let generatedLink = await callOllama(systemPrompt, userPrompt);
    generatedLink = generatedLink.trim().replace(/^["']|["']$/g, '');
    if (!generatedLink || generatedLink.includes(' ')) {
      generatedLink = 'secure-portal-auth.com/verify';
    }

    const fullUrl = 'http://' + generatedLink;
    const newContent = scenario.content.replace(/\[link\]/g, fullUrl);

    // Save back to DB to permanently cache the AI response!
    await pool.query('UPDATE scenarios SET content = $1 WHERE id = $2', [newContent, scenario.id]);
    
    return { ...scenario, content: newContent };
  } catch (err) {
    console.error('Failed to generate contextual link for scenario:', scenario.id, err);
    return scenario;
  }
}

/**
 * GET /api/scenarios/random
 * Returns a random scenario from the database.
 * Optionally filter by difficulty or category via query params.
 */
router.get('/random', async (req, res) => {
  try {
    const { difficulty, category } = req.query;
    let query = 'SELECT id, content, is_scam, category, difficulty, sender_name, message_type FROM scenarios';
    const params = [];
    const conditions = [];

    if (difficulty) {
      conditions.push(`difficulty = $${params.length + 1}`);
      params.push(difficulty);
    }
    if (category) {
      conditions.push(`category = $${params.length + 1}`);
      params.push(category);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY RANDOM() LIMIT 1';

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No scenarios found' });
    }

    const processedScenario = await processScenarioLinks(result.rows[0]);

    // Don't send is_scam to the client — that's the answer!
    res.json({
      id: processedScenario.id,
      content: processedScenario.content,
      category: processedScenario.category,
      difficulty: processedScenario.difficulty,
      senderName: processedScenario.sender_name,
      messageType: processedScenario.message_type,
    });
  } catch (err) {
    console.error('Error fetching scenario:', err);
    res.status(500).json({ error: 'Failed to fetch scenario' });
  }
});

/**
 * GET /api/scenarios/batch
 * Dynamically generates multiple unique scenarios for a game session on the fly.
 */
router.get('/batch', async (req, res) => {
  try {
    const count = Math.min(parseInt(req.query.count) || 10, 20);

    const systemPrompt = `You are a dataset generator for ScamShield. You MUST return ONLY a raw JSON array. DO NOT format the output in markdown code blocks. DO NOT output any text before or after the JSON array.`;

    const userPrompt = `Generate exactly ${count} unique, realistic scam and legitimate message scenarios.

IMPORTANT: Return simply a raw JSON array of objects.

EACH OBJECT IN THE ARRAY MUST HAVE:
{
  "content": "the message text, 1-4 sentences. If the scenario naturally requires a link, embed a URL directly into this text. DO NOT embed a link if it isn't required; many scenarios (both scam and legit) should be plain text without any links. FOR SCAMS ONLY: Make the scam slightly more obvious (e.g. use excessive urgency, slight grammar mistakes) and make any embedded links noticeably fake or suspicious (e.g. http://amazon-refund-security.xyz/claim). For legitimate messages, keep them totally normal.",
  "is_scam": boolean,
  "category": "one of: banking, delivery, tech, government, social, shopping, healthcare, employment, lottery, romance, other",
  "difficulty": "one of: easy, medium, hard",
  "sender_name": "realistic sender name",
  "message_type": "one of: sms, email, chat"
}

DISTRIBUTION:
- Mix of scam and legit (approx 60/40)
- For scams: strictly 50% should include a malicious link, and 50% should have NO links at all.
- Spread across various categories

DO NOT WRITE ANY TEXT EXCEPT THE JSON ARRAY. NO MARKDOWN FENCES.`;

    console.log(`\n🤖 Sending request to Ollama AI model to generate ${count} brand-new scenarios on the fly...`);
    console.time('⏱️  Ollama Generation Time');
    
    let generatedText = await callOllama(systemPrompt, userPrompt, { num_predict: 10000, temperature: 0.8 });
    
    console.timeEnd('⏱️  Ollama Generation Time');
    console.log(`✅ Success! Received ${generatedText.length} raw characters of JSON from Ollama.`);

    generatedText = generatedText.trim();
    if (generatedText.startsWith('```')) {
      generatedText = generatedText.replace(/^\`\`\`(?:json)?\s*/, '').replace(/\s*\`\`\`$/, '');
    }

    const scenariosArray = JSON.parse(generatedText);
    const processedScenarios = [];

    // Save newly generated scenarios into the DB for tracking and hint generation
    for (const s of scenariosArray) {
      const id = uuidv4();
      await pool.query(
        'INSERT INTO scenarios (id, content, is_scam, category, difficulty, sender_name, message_type) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [id, s.content, s.is_scam, s.category, s.difficulty, s.sender_name, s.message_type]
      );

      processedScenarios.push({
        id,
        content: s.content,
        category: s.category,
        difficulty: s.difficulty,
        senderName: s.sender_name,
        messageType: s.message_type,
      });
    }

    res.json({
      scenarios: processedScenarios,
      total: processedScenarios.length,
    });
  } catch (err) {
    console.error('Error generating on-the-fly batch:', err);
    res.status(500).json({ error: 'Failed to generate dynamic scenarios' });
  }
});

/**
 * GET /api/scenarios/:id/hint
 * Returns a hint for the given scenario. Generates one using AI if it doesn't exist.
 */
router.get('/:id/hint', async (req, res) => {
  try {
    const { id } = req.params;
    
    // First, try to get existing hint
    const scenarioResult = await pool.query(
      'SELECT content, is_scam, hint FROM scenarios WHERE id = $1',
      [id]
    );

    if (scenarioResult.rows.length === 0) {
      return res.status(404).json({ error: 'Scenario not found' });
    }

    const scenario = scenarioResult.rows[0];

    // If hint exists, return it instantly
    if (scenario.hint) {
      return res.json({ hint: scenario.hint });
    }

    // Generate a new hint using Ollama
    const systemPrompt = `You are a helpful assistant for a scam-spotting game. 
Your job is to provide ONE SINGLE SENTENCE as a very perceptive hint.
If it is a scam: gently point out a specific detail in the text like a suspicious domain extension (.net, .xyz, dashes), a subtle typo in the URL, or extremely aggressive/threatening urgency.
If it is legitimate: gently point out a specific clean detail, like a standard tone, an expected domain pattern, or a lack of aggressive demands.
CRITICAL: Base your hint on the exact message text. DO NOT give away the exact answer (never explicitly say "This is a scam" or "This is safe"). Just highlight a single detail to think about. Return ONLY plain text.`;
    
    const userPrompt = `Message content: "${scenario.content}"
Ground Truth (do not reveal directly): ${scenario.is_scam ? 'SCAM' : 'SAFE'}

Provide exactly ONE short sentence hint.`;

    let generatedHint = await callOllama(systemPrompt, userPrompt);
    generatedHint = generatedHint.trim().replace(/^["']|["']$/g, ''); // strip quotes if any
    
    // Save it to the DB
    await pool.query(
      'UPDATE scenarios SET hint = $1 WHERE id = $2',
      [generatedHint, id]
    );

    return res.json({ hint: generatedHint });
  } catch (err) {
    console.error('Error generating hint:', err);
    res.status(500).json({ error: 'Failed to generate hint' });
  }
});

export default router;

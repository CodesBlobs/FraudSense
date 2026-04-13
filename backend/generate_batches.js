import fs from 'fs';
import path from 'path';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'https://ollama.com';
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY || '8c4241fbb5674d6bb27fd8433d5722ff.fm3ZcGSsUjxLgaI1DO-FG07z';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma3:27b';

async function generateBatch(batchNum) {
  const systemPrompt = "You are a dataset generator for ScamShield. You MUST return ONLY a raw JSON array. DO NOT format the output in markdown code blocks. DO NOT output any text before or after the JSON array.";

  const batchFocus = {
    1: "Extra banking & delivery",
    2: "Extra tech & government",
    3: "Extra social & shopping",
    4: "Extra healthcare & employment",
    5: "Extra lottery & romance & other",
    6: "Extra banking & tech (modern: crypto, AI scams)",
    7: "Extra delivery & government & social",
    8: "Extra shopping & healthcare & employment",
    9: "Extra lottery & romance & other (hard difficulty focus)",
    10: "MIX of everything, all hard difficulty"
  };

  const currentFocus = batchFocus[batchNum];
  
  const userPrompt = `Generate BATCH ${batchNum} OF 10: exactly 100 unique, realistic scam and legitimate message scenarios.

IMPORTANT: Return simply a raw JSON array of objects.

EACH OBJECT IN THE ARRAY MUST HAVE:
{
  "content": "the message text, 1-4 sentences",
  "is_scam": boolean,
  "category": "one of: banking, delivery, tech, government, social, shopping, healthcare, employment, lottery, romance, other",
  "difficulty": "one of: easy, medium, hard",
  "sender_name": "realistic sender name",
  "message_type": "one of: sms, email, chat"
}

DISTRIBUTION FOR THIS BATCH (100 total):
- 60 scam, 40 legit
- 30 easy, 40 medium, 30 hard
- Spread across ALL 11 categories
- Mix of sms, email, chat

RULES:
1. NO REAL BRAND NAMES. Use generic names like "Your Bank"
2. EVERY CONTENT MUST BE UNIQUE.
3. For BATCH ${batchNum}: Focus heavily on ${currentFocus}.
4. DO NOT WRITE ANY TEXT EXCEPT THE JSON ARRAY. NO MARKDOWN FENCES.`;

  console.log(`Starting Batch ${batchNum}...`);
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OLLAMA_API_KEY}`,
        },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          stream: false,
          format: 'json',
          options: {
            temperature: 0.8,
            num_predict: 20000,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`API error (${response.status})`);
      }

      const data = await response.json();
      let content = data.message.content.trim();
      
      // Clean markdown if present despite format: json
      if (content.startsWith('```')) {
        content = content.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
      }

      const parsed = JSON.parse(content);
      if (!Array.isArray(parsed)) throw new Error("Result is not an array");
      
      return parsed;

    } catch (err) {
      console.log(`Attempt ${attempt} failed for batch ${batchNum}: ${err.message}`);
      if (attempt === 3) throw err;
    }
  }
}

async function main() {
  const batchesDir = path.join(process.cwd(), 'batches');
  if (!fs.existsSync(batchesDir)) {
    fs.mkdirSync(batchesDir);
  }

  for (let i = 1; i <= 10; i++) {
    try {
      const data = await generateBatch(i);
      fs.writeFileSync(path.join(batchesDir, `batch${i}.json`), JSON.stringify(data, null, 2));
      console.log(`Batch ${i} saved. (${data.length} items)`);
    } catch (err) {
      console.error(`Failed Batch ${i} after 3 attempts.`);
    }
  }
}

main();

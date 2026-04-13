/**
 * Bulk import scenarios from a JSON file into the database.
 * 
 * Usage:
 *   node src/db/bulk-import.js scenarios.json
 * 
 * The JSON file should be an array of objects with:
 *   content, is_scam, category, difficulty, sender_name, message_type
 */

import { readFileSync } from 'fs';
import pool from './connection.js';
import dotenv from 'dotenv';

dotenv.config();

async function bulkImport() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('❌ Usage: node src/db/bulk-import.js <path-to-json-file>');
    process.exit(1);
  }

  let scenarios;
  try {
    const raw = readFileSync(filePath, 'utf-8');
    scenarios = JSON.parse(raw);
  } catch (err) {
    console.error(`❌ Failed to read/parse ${filePath}:`, err.message);
    process.exit(1);
  }

  if (!Array.isArray(scenarios)) {
    console.error('❌ JSON file must contain an array of scenario objects.');
    process.exit(1);
  }

  // Validate structure
  const required = ['content', 'is_scam', 'category', 'difficulty', 'sender_name', 'message_type'];
  const validCategories = ['banking', 'delivery', 'tech', 'government', 'social', 'shopping', 'healthcare', 'employment', 'lottery', 'romance', 'other'];
  const validDifficulties = ['easy', 'medium', 'hard'];
  const validTypes = ['sms', 'email', 'chat'];

  const errors = [];
  scenarios.forEach((s, i) => {
    for (const key of required) {
      if (!(key in s)) {
        errors.push(`Scenario ${i}: missing field "${key}"`);
      }
    }
    if (s.category && !validCategories.includes(s.category)) {
      errors.push(`Scenario ${i}: invalid category "${s.category}"`);
    }
    if (s.difficulty && !validDifficulties.includes(s.difficulty)) {
      errors.push(`Scenario ${i}: invalid difficulty "${s.difficulty}"`);
    }
    if (s.message_type && !validTypes.includes(s.message_type)) {
      errors.push(`Scenario ${i}: invalid message_type "${s.message_type}"`);
    }
  });

  if (errors.length > 0) {
    console.error(`❌ Validation failed with ${errors.length} errors:`);
    errors.slice(0, 10).forEach(e => console.error(`   - ${e}`));
    if (errors.length > 10) console.error(`   ... and ${errors.length - 10} more`);
    process.exit(1);
  }

  const client = await pool.connect();
  try {
    console.log(`📦 Importing ${scenarios.length} scenarios...`);

    await client.query('BEGIN');

    let imported = 0;
    for (const s of scenarios) {
      await client.query(
        `INSERT INTO scenarios (content, is_scam, category, difficulty, sender_name, message_type)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [s.content, s.is_scam, s.category, s.difficulty, s.sender_name, s.message_type]
      );
      imported++;
      if (imported % 50 === 0) {
        console.log(`   ✓ ${imported} / ${scenarios.length}`);
      }
    }

    await client.query('COMMIT');

    // Print summary
    const stats = await client.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_scam THEN 1 ELSE 0 END) as scams,
        SUM(CASE WHEN NOT is_scam THEN 1 ELSE 0 END) as safe
      FROM scenarios
    `);

    const { total, scams, safe } = stats.rows[0];
    console.log(`\n✅ Import complete!`);
    console.log(`   Total scenarios in DB: ${total}`);
    console.log(`   Scam: ${scams} | Safe: ${safe}`);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Import failed, rolled back:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

bulkImport();

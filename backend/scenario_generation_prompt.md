# ScamShield — 1000 Scenario Generation Prompt

> **How to use:** Most AIs can't output 1000 scenarios at once. Copy **Prompt A** below and run it 10 times, changing the batch number each time (Batch 1, Batch 2, ... Batch 10). Each run produces 100 scenarios. Save each output as `batch1.json`, `batch2.json`, etc., then merge them into one file and run the import.

---

## Prompt A — Copy This Into Your AI

```
You are a dataset generator for a cybersecurity education app called ScamShield, designed for senior citizens.

Generate BATCH [X] OF 10: exactly 100 unique, realistic scam and legitimate message scenarios.

OUTPUT FORMAT: Return ONLY a raw JSON array. No markdown fences, no explanation, no commentary. Just the array.

EACH OBJECT IN THE ARRAY:
{
  "content": "string — the message body, 1-4 sentences, realistic",
  "is_scam": boolean,
  "category": "string — one of: banking, delivery, tech, government, social, shopping, healthcare, employment, lottery, romance, other",
  "difficulty": "string — one of: easy, medium, hard",
  "sender_name": "string — realistic sender name",
  "message_type": "string — one of: sms, email, chat"
}

DISTRIBUTION FOR THIS BATCH OF 100:
- 60 scam messages, 40 legitimate messages
- 30 easy, 40 medium, 30 hard
- Spread across ALL 11 categories (at least 5 per category)
- Mix of sms (40), email (45), chat (15)

CATEGORY GUIDE:

banking (scam): Phishing links, fake fraud alerts, fake account verification, wire transfer requests, fake loan approvals
banking (legit): Deposit confirmations, statement reminders, new card mailings, interest summaries, branch hour changes

delivery (scam): Fake redelivery fees, customs charges, tracking link phishing, missed package scams
delivery (legit): Tracking updates, delivery ETAs, signature confirmations, pickup ready notices

tech (scam): Fake virus alerts, account lockout warnings, subscription auto-renewal scams, fake cloud storage warnings, remote access scams
tech (legit): Software updates, password change confirmations, two-factor codes, storage usage alerts

government (scam): Fake tax refunds, arrest warrants, social security suspension, census scams, fake voting registration
government (legit): DMV reminders, jury duty notices, property tax due dates, voter registration confirmations

social (scam): Grandparent scams, friend impersonation asking for gift cards, fake emergency money requests, "is this you in the video" links
social (legit): Real birthday messages, reunion invites, neighborhood group updates, church event reminders

shopping (scam): Fake order confirmations with phishing, fake refund processing, too-good-to-be-true deals, fake store closing sales
shopping (legit): Real purchase receipts, sale notifications, loyalty reward updates, return confirmations

healthcare (scam): Fake insurance claims, Medicare scams, fake prescription discount cards, medical data phishing
healthcare (legit): Appointment reminders, prescription ready, lab results available, insurance renewal notices

employment (scam): Work-from-home scams, fake job offers, check-cashing schemes, resume phishing, fake recruiter messages
employment (legit): Interview confirmations, onboarding paperwork, shift schedule updates, HR policy reminders

lottery (scam): Prize winnings, survey rewards, sweepstakes, inheritance claims from foreign relatives
lottery (legit): Loyalty points earned, cashback notifications, real raffle results from known events

romance (scam): Catfishing openers requesting money, fake military personnel needing funds, crypto investment romance scams
romance (legit): Dating app match notifications, event invitation from a friend, community meetup RSVPs

other (scam): QR code payment scams, crypto investment scams, charity scams, AI voice clone warnings, fake toll fees, utility shutoff threats
other (legit): Weather alerts, community board posts, library notices, local utility maintenance schedules

DIFFICULTY RULES:

easy scams: Obvious red flags — ALL CAPS urgency, "click NOW", suspicious .xyz/.tk URLs, asks for SSN/password directly, laughably too good to be true ("You won $1M!")
easy legit: Clearly mundane — appointment reminders, deposit confirmations, no links at all

medium scams: Plausible but suspicious — creates moderate urgency, uses somewhat believable URLs, impersonates a real service type, asks to "verify" information
medium legit: Could look suspicious but isn't — mentions partial account numbers, asks to call back, sends from an unfamiliar but real service

hard scams: Very convincing — professional tone, perfect grammar, realistic scenario, uses legitimate-looking domains, subtle pressure
hard legit: Unusual but real — unexpected refund notification, security alert asking to review activity (but not click), unfamiliar government notice that's actually real

CRITICAL RULES:
1. Do NOT use real brand names. Use generic names: "Your Bank", "Online Store", "Delivery Service"
2. Every "content" field must be UNIQUE — no duplicates or near-duplicates
3. Scam messages should feel realistic and educational, not cartoonish
4. Legitimate messages should be mundane, routine, and boring
5. VARY the writing style — some formal, some casual, some with typos (scams), some corporate
6. Include modern scam types: QR codes, cryptocurrency, AI voice clones, one-time password interception
7. For BATCH [X] — focus extra on these categories: [see batch focus below]

BATCH CATEGORY FOCUS (ensures variety across all 10 batches):
- Batch 1: Extra banking & delivery
- Batch 2: Extra tech & government
- Batch 3: Extra social & shopping
- Batch 4: Extra healthcare & employment
- Batch 5: Extra lottery & romance & other
- Batch 6: Extra banking & tech (modern: crypto, AI scams)
- Batch 7: Extra delivery & government & social
- Batch 8: Extra shopping & healthcare & employment
- Batch 9: Extra lottery & romance & other (hard difficulty focus)
- Batch 10: MIX of everything, all hard difficulty

NOW GENERATE EXACTLY 100 SCENARIOS AS A JSON ARRAY. NO OTHER TEXT.
```

---

## Step-by-step instructions

### 1. Generate batches
Run the prompt above 10 times, replacing `[X]` with 1 through 10. Save each output:
- `batch1.json`
- `batch2.json`
- ...
- `batch10.json`

### 2. Place files in the backend folder
```
FraudSense/backend/batches/batch1.json
FraudSense/backend/batches/batch2.json
...
```

### 3. Merge into one file
```bash
cd /Users/fred_rhac/FraudSense/backend
node -e "
const fs = require('fs');
const merged = [];
for (let i = 1; i <= 10; i++) {
  const data = JSON.parse(fs.readFileSync('batches/batch' + i + '.json', 'utf-8'));
  merged.push(...data);
}
console.log('Total scenarios:', merged.length);
fs.writeFileSync('scenarios_1000.json', JSON.stringify(merged, null, 2));
console.log('Saved to scenarios_1000.json');
"
```

### 4. Import into database
```bash
npm run import scenarios_1000.json
```

Done! The import script validates every scenario and inserts them in a single transaction.

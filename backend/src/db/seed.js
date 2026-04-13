import pool from './connection.js';

/**
 * Pre-seeded scenarios for ScamShield.
 * A mix of scam and legitimate messages across categories and difficulties.
 */
const scenarios = [
  // ===== BANKING SCAMS (Easy) =====
  {
    content: "URGENT: Your bank account has been compromised! Click here immediately to verify your identity: http://securebank-verify.xyz/login",
    is_scam: true,
    category: "banking",
    difficulty: "easy",
    sender_name: "BankAlert",
    message_type: "sms"
  },
  {
    content: "Your card ending in 4821 was charged $499.99 at ELECTRONICS WORLD. If this wasn't you, call 1-800-555-0199 NOW to cancel!",
    is_scam: true,
    category: "banking",
    difficulty: "easy",
    sender_name: "Card Services",
    message_type: "sms"
  },
  {
    content: "Dear Customer, we noticed unusual activity on your account. Please verify your SSN and account number by replying to this message.",
    is_scam: true,
    category: "banking",
    difficulty: "easy",
    sender_name: "Security Team",
    message_type: "email"
  },

  // ===== BANKING LEGIT (Easy) =====
  {
    content: "Your direct deposit of $2,150.00 from EMPLOYER INC has been posted to your checking account ending in 7832.",
    is_scam: false,
    category: "banking",
    difficulty: "easy",
    sender_name: "Your Bank",
    message_type: "sms"
  },
  {
    content: "Your new debit card has been mailed and should arrive in 5-7 business days. If you did not request a new card, please call the number on the back of your current card.",
    is_scam: false,
    category: "banking",
    difficulty: "easy",
    sender_name: "Your Bank",
    message_type: "email"
  },

  // ===== DELIVERY SCAMS (Easy) =====
  {
    content: "Your package could not be delivered. Pay $1.99 redelivery fee here: http://delivery-resch3dule.com/pay",
    is_scam: true,
    category: "delivery",
    difficulty: "easy",
    sender_name: "Parcel Service",
    message_type: "sms"
  },
  {
    content: "FINAL NOTICE: Your parcel #US9482710 is being held at customs. Pay the $3.50 fee within 24 hours or it will be returned: bit.ly/paynow99",
    is_scam: true,
    category: "delivery",
    difficulty: "easy",
    sender_name: "Customs Dept",
    message_type: "sms"
  },

  // ===== DELIVERY LEGIT (Easy) =====
  {
    content: "Your order has shipped! Estimated delivery: Thursday, March 15. Track your package in our app or at our website using order #ORD-28491.",
    is_scam: false,
    category: "delivery",
    difficulty: "easy",
    sender_name: "Online Store",
    message_type: "email"
  },
  {
    content: "Hi! Your grocery delivery is on its way. Your driver Alex is about 10 minutes away. You can track the delivery in the app.",
    is_scam: false,
    category: "delivery",
    difficulty: "easy",
    sender_name: "Grocery App",
    message_type: "sms"
  },

  // ===== TECH SUPPORT SCAMS (Easy) =====
  {
    content: "⚠️ WARNING: Your computer has been infected with 3 viruses! Call our tech support immediately at 1-888-555-0147 to avoid data loss!",
    is_scam: true,
    category: "tech",
    difficulty: "easy",
    sender_name: "System Alert",
    message_type: "email"
  },
  {
    content: "Your email account will be DELETED in 48 hours if you do not verify your password. Click here to keep your account: http://mail-verify-now.tk",
    is_scam: true,
    category: "tech",
    difficulty: "easy",
    sender_name: "Email Service",
    message_type: "email"
  },

  // ===== TECH LEGIT (Easy) =====
  {
    content: "A software update is available for your phone. Go to Settings > Software Update to install the latest version.",
    is_scam: false,
    category: "tech",
    difficulty: "easy",
    sender_name: "Phone Update",
    message_type: "sms"
  },

  // ===== GOVERNMENT SCAMS (Easy) =====
  {
    content: "You are eligible for a $1,200 government stimulus payment! Claim your money now by providing your bank details at gov-stimulus-pay.com",
    is_scam: true,
    category: "government",
    difficulty: "easy",
    sender_name: "Gov Benefits",
    message_type: "sms"
  },
  {
    content: "IRS NOTICE: You owe back taxes of $4,329. A warrant for your arrest has been issued. Call 1-800-555-0188 immediately to settle.",
    is_scam: true,
    category: "government",
    difficulty: "easy",
    sender_name: "Tax Authority",
    message_type: "sms"
  },

  // ===== GOVERNMENT LEGIT (Easy) =====
  {
    content: "Reminder: Your vehicle registration expires on April 30. Visit your local DMV or our official website to renew. Processing takes 2-3 weeks.",
    is_scam: false,
    category: "government",
    difficulty: "easy",
    sender_name: "DMV",
    message_type: "email"
  },

  // ===== BANKING SCAMS (Medium) =====
  {
    content: "We detected a login from a new device in Houston, TX. If this was you, no action is needed. If not, secure your account here: secure-mybank.co/verify",
    is_scam: true,
    category: "banking",
    difficulty: "medium",
    sender_name: "Account Security",
    message_type: "email"
  },
  {
    content: "Your automatic payment of $127.50 to Electric Company failed. Update your payment information to avoid service interruption: update-billing.net/electric",
    is_scam: true,
    category: "banking",
    difficulty: "medium",
    sender_name: "Billing Dept",
    message_type: "email"
  },

  // ===== BANKING LEGIT (Medium) =====
  {
    content: "Your savings account earned $12.47 in interest this month. Current balance: $8,421.33. View your full statement in our mobile app.",
    is_scam: false,
    category: "banking",
    difficulty: "medium",
    sender_name: "Your Bank",
    message_type: "email"
  },
  {
    content: "Your scheduled transfer of $500.00 to your savings account was completed successfully on 03/12. Reference #TRF-88291.",
    is_scam: false,
    category: "banking",
    difficulty: "medium",
    sender_name: "Your Bank",
    message_type: "sms"
  },

  // ===== DELIVERY SCAMS (Medium) =====
  {
    content: "We tried to deliver your package today but no one was home. Schedule a new delivery time: http://package-reschedule-now.com/delivery",
    is_scam: true,
    category: "delivery",
    difficulty: "medium",
    sender_name: "Delivery Notice",
    message_type: "sms"
  },
  {
    content: "Congratulations! You've won a free iPhone 15 from our holiday giveaway! Just pay $9.99 shipping. Claim at prize-center.co/claim",
    is_scam: true,
    category: "other",
    difficulty: "medium",
    sender_name: "Prize Center",
    message_type: "email"
  },

  // ===== SOCIAL / OTHER SCAMS (Medium) =====
  {
    content: "Hey, it's me! I lost my phone and this is my new number. Can you send me $200 through a gift card? I'll pay you back tomorrow. It's urgent!",
    is_scam: true,
    category: "other",
    difficulty: "medium",
    sender_name: "Unknown",
    message_type: "sms"
  },
  {
    content: "Hi Grandma! I'm stuck at the airport and lost my wallet. Can you wire me $500 for a ticket home? Please don't tell Mom and Dad. Love you!",
    is_scam: true,
    category: "other",
    difficulty: "medium",
    sender_name: "Unknown",
    message_type: "sms"
  },
  {
    content: "You've been selected for a $500 gift card survey! Complete our 2-minute survey and claim your reward: survey-rewards-now.com",
    is_scam: true,
    category: "other",
    difficulty: "medium",
    sender_name: "Survey Rewards",
    message_type: "email"
  },

  // ===== LEGIT (Medium) =====
  {
    content: "Your prescription for Lisinopril 10mg is ready for pickup at your pharmacy. Store hours: Mon-Sat 8AM-9PM, Sun 10AM-6PM.",
    is_scam: false,
    category: "other",
    difficulty: "medium",
    sender_name: "Pharmacy",
    message_type: "sms"
  },
  {
    content: "Reminder: Your dentist appointment is scheduled for Tuesday, March 18 at 2:30 PM. Reply YES to confirm or call us to reschedule.",
    is_scam: false,
    category: "other",
    difficulty: "medium",
    sender_name: "Dental Office",
    message_type: "sms"
  },
  {
    content: "Thank you for your recent purchase of $43.21 at Garden Supply Store. Your receipt is available in the app. Return policy: 30 days with receipt.",
    is_scam: false,
    category: "other",
    difficulty: "medium",
    sender_name: "Garden Supply",
    message_type: "email"
  },

  // ===== HARD SCAMS =====
  {
    content: "Hi, this is Sarah from your doctor's office. We need to update your insurance information before your upcoming appointment. Can you reply with your policy number and date of birth?",
    is_scam: true,
    category: "other",
    difficulty: "hard",
    sender_name: "Sarah",
    message_type: "sms"
  },
  {
    content: "Your cloud storage is 95% full. Upgrade to our premium plan for only $2.99/month or your files will be automatically deleted in 7 days. Upgrade now: cloud-storage-upgrade.com",
    is_scam: true,
    category: "tech",
    difficulty: "hard",
    sender_name: "Cloud Storage",
    message_type: "email"
  },
  {
    content: "Dear valued customer, as part of our annual security review, we need you to confirm your account details. Please log in at secure-banking-review.com to complete the verification process. This is required by federal regulations.",
    is_scam: true,
    category: "banking",
    difficulty: "hard",
    sender_name: "Compliance Dept",
    message_type: "email"
  },
  {
    content: "Your neighbor at 42 Oak Street recommended you for our community watch program. To join, please verify your identity and home address at community-watch-verify.net",
    is_scam: true,
    category: "other",
    difficulty: "hard",
    sender_name: "Neighborhood Watch",
    message_type: "email"
  },
  {
    content: "Hi! I found your resume online and think you'd be perfect for a work-from-home position. Earn $3,000-$5,000/week with just 2 hours of work per day. Reply YES to learn more.",
    is_scam: true,
    category: "other",
    difficulty: "hard",
    sender_name: "Recruiter",
    message_type: "email"
  },
  {
    content: "Action required: Your auto-renewal for antivirus protection is set to charge $299.99 tomorrow. If you did not authorize this, call 1-800-555-0134 to cancel and receive a refund.",
    is_scam: true,
    category: "tech",
    difficulty: "hard",
    sender_name: "Antivirus Support",
    message_type: "email"
  },

  // ===== HARD LEGIT =====
  {
    content: "A new sign-in to your account was detected from Chrome on Windows. Location: your city. If this was you, you can ignore this message. If not, review your recent activity in your account security settings.",
    is_scam: false,
    category: "tech",
    difficulty: "hard",
    sender_name: "Account Security",
    message_type: "email"
  },
  {
    content: "Your flight has been delayed by 45 minutes. New departure time: 3:15 PM. Gate change: B22. We apologize for the inconvenience.",
    is_scam: false,
    category: "other",
    difficulty: "hard",
    sender_name: "Airline",
    message_type: "sms"
  },
  {
    content: "Important: Your homeowner's insurance policy is up for renewal on April 1. Your annual premium is $1,842. Log into your account at our official website or call your agent at the number on your policy documents to review coverage options.",
    is_scam: false,
    category: "other",
    difficulty: "hard",
    sender_name: "Insurance Company",
    message_type: "email"
  },
  {
    content: "Your library books are due in 3 days. Title: 'The Thursday Murder Club'. Return to any branch location or renew online at your library's website. No fees if returned on time.",
    is_scam: false,
    category: "other",
    difficulty: "hard",
    sender_name: "Public Library",
    message_type: "email"
  },
  {
    content: "We noticed you started an application but didn't finish. Your progress has been saved and you can continue anytime by logging into your account on our official website.",
    is_scam: false,
    category: "banking",
    difficulty: "hard",
    sender_name: "Your Bank",
    message_type: "email"
  },
  {
    content: "Reminder: Your property tax payment of $2,847.50 is due by March 31. Pay online through your county's official website, by mail, or in person at the County Treasurer's office.",
    is_scam: false,
    category: "government",
    difficulty: "hard",
    sender_name: "County Tax Office",
    message_type: "email"
  },

  // ===== MORE MEDIUM SCAMS =====
  {
    content: "Your account has been locked due to too many failed login attempts. Click here to unlock your account: myaccount-unlock.xyz/restore",
    is_scam: true,
    category: "tech",
    difficulty: "medium",
    sender_name: "Account Team",
    message_type: "email"
  },
  {
    content: "LAST CHANCE! You've been pre-approved for a $25,000 personal loan at 0% interest! This offer expires in 2 hours. Apply now: easy-loans-approved.com",
    is_scam: true,
    category: "banking",
    difficulty: "medium",
    sender_name: "Fast Loans",
    message_type: "sms"
  },
  {
    content: "Medicare update: You qualify for a new benefits card with additional coverage. Call 1-800-555-0176 to claim your free upgraded card today.",
    is_scam: true,
    category: "government",
    difficulty: "medium",
    sender_name: "Medicare",
    message_type: "sms"
  },

  // ===== MORE MEDIUM LEGIT =====
  {
    content: "Your water bill for this month is $45.32. Payment is due by March 25. Pay through our website, mobile app, or by mail. Thank you for being a valued customer.",
    is_scam: false,
    category: "other",
    difficulty: "medium",
    sender_name: "Water Utility",
    message_type: "email"
  },
  {
    content: "Hello! Just confirming your haircut appointment tomorrow at 11:00 AM with Lisa. See you then! — Downtown Salon",
    is_scam: false,
    category: "other",
    difficulty: "medium",
    sender_name: "Downtown Salon",
    message_type: "sms"
  },
  {
    content: "Your monthly bank statement for February is now available. Log into your account through our official app or website to view it.",
    is_scam: false,
    category: "banking",
    difficulty: "medium",
    sender_name: "Your Bank",
    message_type: "email"
  },

  // ===== ADDITIONAL HARD =====
  {
    content: "This is a courtesy call follow-up via text. We spoke to you earlier about your extended car warranty. Your coverage is about to expire. Reply with your VIN number so we can provide a quote.",
    is_scam: true,
    category: "other",
    difficulty: "hard",
    sender_name: "Auto Warranty",
    message_type: "sms"
  },
  {
    content: "Hi, I'm from the electric company. We're doing maintenance in your area tomorrow and need to schedule access to your meter. Can you confirm your address and a good time? We need your account number for verification.",
    is_scam: true,
    category: "other",
    difficulty: "hard",
    sender_name: "Electric Co.",
    message_type: "sms"
  },
  {
    content: "Your Social Security number has been suspended due to suspicious activity. To reactivate, call the Social Security Administration at 1-800-555-0123 immediately.",
    is_scam: true,
    category: "government",
    difficulty: "medium",
    sender_name: "SSA Alert",
    message_type: "sms"
  },
  {
    content: "Your recent blood test results are ready. Please log into the patient portal at your healthcare provider's official website to view them, or call our office during business hours.",
    is_scam: false,
    category: "other",
    difficulty: "hard",
    sender_name: "Health Clinic",
    message_type: "email"
  }
];

async function seedDatabase() {
  const client = await pool.connect();
  try {
    console.log('🌱 Seeding ScamShield database...');

    // Check if scenarios already exist
    const existing = await client.query('SELECT COUNT(*) FROM scenarios');
    if (parseInt(existing.rows[0].count) > 0) {
      console.log(`⚠️  Database already has ${existing.rows[0].count} scenarios. Skipping seed.`);
      console.log('   To re-seed, clear the scenarios table first.');
      return;
    }

    for (const scenario of scenarios) {
      await client.query(
        `INSERT INTO scenarios (content, is_scam, category, difficulty, sender_name, message_type)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [scenario.content, scenario.is_scam, scenario.category, scenario.difficulty, scenario.sender_name, scenario.message_type]
      );
    }

    console.log(`✅ Seeded ${scenarios.length} scenarios successfully!`);
    
    // Print summary
    const stats = await client.query(`
      SELECT 
        category,
        difficulty,
        COUNT(*) as count,
        SUM(CASE WHEN is_scam THEN 1 ELSE 0 END) as scam_count,
        SUM(CASE WHEN NOT is_scam THEN 1 ELSE 0 END) as safe_count
      FROM scenarios 
      GROUP BY category, difficulty
      ORDER BY category, difficulty
    `);
    
    console.log('\n📊 Scenario Breakdown:');
    console.table(stats.rows);

  } catch (err) {
    console.error('❌ Seeding failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase();

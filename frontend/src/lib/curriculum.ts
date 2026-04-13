import { BookOpen, ShieldAlert, MonitorSmartphone, DollarSign, Users, LucideIcon, FileText } from 'lucide-react';

export interface LessonData {
  id: string;
  title: string;
  description: string;
  tips: string[];
  content: string;
  quiz: {
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
  };
}

export interface UnitData {
  id: number;
  title: string;
  icon: LucideIcon;
  color: string;
  lessons: LessonData[];
}

export const curriculum: UnitData[] = [
  {
    id: 1,
    title: "Phishing Fundamentals",
    icon: BookOpen,
    color: "#2563eb",
    lessons: [
      {
        id: "anatomy-of-a-fake-email",
        title: "Anatomy of a Fake Email",
        description: "Learn how to dissect an email header. Scammers often use 'display name spoofing' to make an email look like it comes from a trusted brand.",
        tips: ["Always click/tap the sender name to reveal the actual <email@address.com>", "Look for spelling errors in the domain"],
        content: `Phishing is the most common form of cyber-attack. It relies on psychological manipulation (social engineering) rather than technical hacking. The first thing you must check is the Sender Header. A scammer can hide behind a "Display Name" like "Amazon Support," but they cannot hide their actual email address if you look closely.`,
        quiz: { question: "What is the most reliable way to verify an email sender's identity?", options: ["Check the Display Name", "Check the profile picture", "Click the sender name to reveal the full email address", "Reply and ask"], answerIndex: 2, explanation: "Display names are easily spoofed; the actual email domain is harder to fake." }
      },
      {
        id: "urgent-password-reset",
        title: "The Urgent Password Reset",
        description: "A terrifying message claims your account was hacked and demands an instant password change.",
        tips: ["Real companies rarely force immediate 24-hour limits on resets", "Navigate to the website manually in your browser instead"],
        content: `Scammers use urgency to make you panic. They want you to click a link to a fake login page where they can harvest your credentials. Never use the link in the email; type the web address manually.`,
        quiz: { question: "If you receive a suspicious 'password reset' email, what should you do?", options: ["Click the link", "Log in directly via the official website", "Reply with your password", "Ignore everything"], answerIndex: 1, explanation: "Manual navigation bypasses phishing links entirely." }
      },
      { id: "spear-phishing", title: "Spear Phishing", description: "Highly targeted phishing using your real name and personal details.", tips: ["Public info isn't private."], content: "Spear phishing uses personal details to gain trust.", quiz: { question: "Who is the target of spear phishing?", options: ["Everyone", "Random people", "A specific individual or organization", "Only celebrities"], answerIndex: 2, explanation: "It is a targeted attack based on research." } },
      { id: "whaling", title: "Whaling (CEO Fraud)", description: "Phishing aimed at top executives.", tips: ["Execs should use strict 2FA."], content: "Whaling targets high-profile individuals.", quiz: { question: "What is Whaling?", options: ["A fishing sport", "Cyber-attacks on high-level executives", "Attacks on small businesses", "Underwater internet cables"], answerIndex: 1, explanation: "It targets the 'big fish' of a company." } },
      { id: "clone-phishing", title: "Clone Phishing", description: "A legitimate email is cloned with malicious links.", tips: ["Be wary of 'updates' to old threads."], content: "Scammers copy real emails and change the links.", quiz: { question: "What is Clone Phishing?", options: ["Creating a new email", "Copying a real email and swapping links", "Using a clone of yourself", "None of the above"], answerIndex: 1, explanation: "It uses the trust of a previous real email." } },
      { id: "invoice-fraud", title: "Invoice Fraud", description: "Fake invoices with malware.", tips: ["Don't open unexpected attachments."], content: "Malicious PDFs pretending to be invoices.", quiz: { question: "What should you do with an unexpected invoice attachment?", options: ["Open it", "Forward it", "Verify the sender via a known phone number", "Print it"], answerIndex: 2, explanation: "Always verify outside the email thread." } },
      { id: "account-suspended-trick", title: "The 'Account Suspended' Trick", description: "Emails claiming your service is suspended.", tips: ["Log into the app directly."], content: "Scaring you into 'fixing' billing issues.", quiz: { question: "How to check if your account is really suspended?", options: ["Click the email link", "Log in directly to the service provider", "Call the number in the email", "Do nothing"], answerIndex: 1, explanation: "Official portals are the only safe source." } },
      { id: "free-gift-prize-lures", title: "Free Gift/Prize Lures", description: "Winning prizes you didn't enter a contest for.", tips: ["If you didn't enter, you didn't win."], content: "Too-good-to-be-true offers.", quiz: { question: "You won a prize for a contest you didn't enter. Is it real?", options: ["Yes", "Maybe", "No, it's a scam", "Only if it looks official"], answerIndex: 2, explanation: "Legitimate prizes require entry." } },
      { id: "survey-scams", title: "Survey Scams", description: "Prizes for surveys that ask for too much info.", tips: ["Legit surveys don't ask for SSN."], content: "Trading info for fake rewards.", quiz: { question: "Is it normal for a retail survey to ask for your SSN?", options: ["Yes", "No", "Only for high-value prizes", "Sometimes"], answerIndex: 1, explanation: "Surveys should not require highly sensitive personal data." } },
      { id: "fake-receipt", title: "The Fake Receipt", description: "Receipts for items you didn't buy.", tips: ["Verify the sender address."], content: "Baiting you with ghost transactions.", quiz: { question: "Why do scammers send fake receipts?", options: ["To be nice", "To bait you into clicking 'Cancel Order'", "To show off", "By mistake"], answerIndex: 1, explanation: "Panic cancels often lead to phishing sites." } }
    ]
  },
  {
    id: 2,
    title: "Impersonation & Spoofing",
    icon: Users,
    color: "#059669",
    lessons: [
      { id: "bank-government-vishing", title: "Bank & Government Vishing", description: "Calls claiming to be from the IRS or bank.", tips: ["Caller ID is faked."], content: "Voice phishing tactics.", quiz: { question: "Does the IRS call demanding gift cards?", options: ["Yes", "Sometimes", "No", "Only on weekends"], answerIndex: 2, explanation: "Agencies never accept gift cards." } },
      { id: "ceo-boss-urgent-request", title: "CEO / Boss 'Urgent Request'", description: "Emails from 'boss' asking for gift cards.", tips: ["Call your boss directly."], content: "Exploiting internal trust.", quiz: { question: "Should you buy gift cards for your boss if they email you urgently?", options: ["Yes", "No, verify via phone first", "Only if they sound mean", "Yes, if you want a promotion"], answerIndex: 1, explanation: "Hierarchy isn't an excuse for bypassing security." } },
      { id: "grandparent-scam", title: "The Grandparent Scam", description: "Pretending to be a grandchild in trouble.", tips: ["Ask a secret question."], content: "Emotional exploitation of elders.", quiz: { question: "How can you test a caller claiming to be your grandchild?", options: ["Ask for their name", "Ask a question only the real person would know", "Believe them", "Give them money"], answerIndex: 1, explanation: "Personal secrets defeat impersonators." } },
      { id: "fake-charity-appeals", title: "Fake Charity Appeals", description: "Scams after natural disasters.", tips: ["Use Charity Navigator."], content: "Profiting from tragedy.", quiz: { question: "Where should you donate?", options: ["Links in texts", "Established, verified organizations", "Random social media posts", "Anonymous callers"], answerIndex: 1, explanation: "Trust only established platforms." } },
      { id: "law-enforcement-spoofing", title: "Law Enforcement Spoofing", description: "Threats of arrest over the phone.", tips: ["Police don't call first."], content: "Using legal threats to steal.", quiz: { question: "Will police call you to negotiate an arrest warrant?", options: ["Yes", "No", "Usually", "Sometimes"], answerIndex: 1, explanation: "Police do not call to give head-ups or accept phone payments." } },
      { id: "tech-support-impersonation", title: "Tech Support Impersonation", description: "Fake calls from Microsoft/Apple.", tips: ["They don't call you first."], content: "Claiming your PC is infected.", quiz: { question: "Does Microsoft call you to fix your computer?", options: ["Yes", "No", "Only if you have Windows", "Sometimes"], answerIndex: 1, explanation: "They do not monitor your PC to call you." } },
      { id: "utility-shut-off-scam", title: "Utility Shut-Off Scam", description: "Threats of immediate power cut.", tips: ["Utilities send multiple notices."], content: "Exploiting basic needs.", quiz: { question: "How to verify a utility threat?", options: ["Pay now", "Call the utility's official number", "Ask the caller", "Do nothing"], answerIndex: 1, explanation: "Always use official contact channels." } },
      { id: "real-estate-wire-fraud", title: "Real Estate Wire Fraud", description: "Spoofed emails with 'updated' instructions.", tips: ["Verify via voice call."], content: "Attacking large financial transfers.", quiz: { question: "Before wiring money for a house, what should you do?", options: ["Check the email", "Call and voice-verify instructions", "Trust the agent", "None of the above"], answerIndex: 1, explanation: "Wire instructions should always be double-verified." } },
      { id: "romance-impersonation", title: "Romance Impersonation", description: "Fake profiles asking for money.", tips: ["Reverse image search."], content: "Building trust to steal funds.", quiz: { question: "Is it safe to send money to someone you only met online?", options: ["Yes", "Only if they are handsome", "No, never", "Maybe"], answerIndex: 2, explanation: "Romance scams are incredibly common." } },
      { id: "wrong-number-scam", title: "The 'Wrong Number' Scam", description: "Conversations that lead to crypto hooks.", tips: ["Do not engage."], content: "Pig butchering/long-con hooks.", quiz: { question: "What should you do with a 'wrong number' text that tries to befriend you?", options: ["Chat with them", "Ignore and block", "Send them a joke", "Ask for their name"], answerIndex: 1, explanation: "This is a common start for complex scams." } }
    ]
  },
  {
    id: 3,
    title: "Finance & E-Commerce",
    icon: DollarSign,
    color: "#dc2626",
    lessons: [
      { id: "overpayment-refund", title: "The Overpayment Refund", description: "Fake refunds begging for wiring difference.", tips: ["Check bank balance."], content: "Manipulating your bank view.", quiz: { question: "What is an overpayment scam?", options: ["Getting lucky", "A scammer sending too much and asking for 'change' back", "A real bank error", "None"], answerIndex: 1, explanation: "The initial deposit is usually fake or stolen." } },
      { id: "fake-shipping-delivery", title: "Fake Shipping & Delivery", description: "Texts about stuck packages for small fees.", tips: ["Track via official sites."], content: "Harvesting cards with tiny charges.", quiz: { question: "Will UPS text you to pay $1.50 for a stuck package?", options: ["Yes", "No", "Sometimes", "Only on holidays"], answerIndex: 1, explanation: "They do not demand small fees via random texts." } },
      { id: "fake-online-stores", title: "Fake Online Stores", description: "Luxury items at 90% off.", tips: ["Too good to be true."], content: "Baiting with impossible deals.", quiz: { question: "Ad for $2,000 laptop for $100. Is it real?", options: ["Yes", "No", "Maybe", "Only if it's on Facebook"], answerIndex: 1, explanation: "Extreme discounts are red flags." } },
      { id: "crypto-investment-fraud", title: "Crypto Investment Fraud", description: "Guaranteed high returns.", tips: ["No guaranteed returns exist."], content: "Exploiting FOMO (Fear of missing out).", quiz: { question: "Are high guaranteed returns in crypto real?", options: ["Yes", "No", "Only with bots", "Usually"], answerIndex: 1, explanation: "Guarantees in volatile markets are lies." } },
      { id: "check-cashing-fraud", title: "Check Cashing Fraud", description: "Cashing checks for strangers.", tips: ["Checks bounce weeks later."], content: "Using your account to launder.", quiz: { question: "If a stranger sends you a check to cash, what happens?", options: ["You get free money", "The check will likely bounce later", "The bank loves it", "Nothing"], answerIndex: 1, explanation: "You will be liable for the funds when it bounces." } },
      { id: "zelle-venmo-accidental-transfer", title: "Zelle / Venmo 'Accidental' Transfer", description: "Requests to send 'accidental' money back.", tips: ["Contact support instead."], content: "Laundering stolen funds.", quiz: { question: "Should you return an 'accidental' Zelle transfer?", options: ["Yes", "No, tell them to contact support", "Yes, it's polite", "Maybe half"], answerIndex: 1, explanation: "Direct returns facilitate money laundering." } },
      { id: "gift-card-scams", title: "Gift Card Scams", description: "Demands for Best Buy/Apple cards.", tips: ["Gift cards are for gifts."], content: "Untraceable currency for thieves.", quiz: { question: "Who accepts payment via gift cards?", options: ["Government", "Police", "Utility companies", "None of the above"], answerIndex: 3, explanation: "Only scammers demand gift card codes for payment." } },
      { id: "fake-job-offers", title: "Fake Job Offers", description: "Hired instantly, pay for equipment.", tips: ["Jobs don't charge you."], content: "Preying on job seekers.", quiz: { question: "Is it a real job if they ask you to pay for equipment upfront?", options: ["Yes", "No", "Sometimes", "Only in tech"], answerIndex: 1, explanation: "Real jobs provide or reimburse equipment without upfront fees." } },
      { id: "lottery-sweepstakes-advance-fee", title: "Lottery & Sweepstakes Advance Fee", description: "Pay taxes to win foreign lotteries.", tips: ["You can't win what you didn't enter."], content: "The 'winner's' trap.", quiz: { question: "Can you win a lottery you didn't enter?", options: ["Yes", "No", "If God wants it", "Only if they emailed you"], answerIndex: 1, explanation: "Entries are required to win." } },
      { id: "subscription-renewal-traps", title: "Subscription Renewal Traps", description: "Fake receipts for 'Geek Squad'.", tips: ["Check bank statements."], content: "Baiting with unwanted charges.", quiz: { question: "What should you do with a fake $400 receipt?", options: ["Call the number", "Ignore it and check your actual bank account", "Pay it", "Forward it"], answerIndex: 1, explanation: "Check your bank directly, not via the email provided." } }
    ]
  },
  {
    id: 4,
    title: "Tech Support & Extortion",
    icon: MonitorSmartphone,
    color: "#7c3aed",
    lessons: [
      { id: "popup-virus-detected", title: "Pop-Up 'Virus Detected'", description: "Flashing banners on websites.", tips: ["Force quit browser."], content: "Fake browser alerts.", quiz: { question: "What is a flashing 'Virus' pop-up usually?", options: ["A real virus", "A malicious ad trying to scare you", "A Windows update", "A free game"], answerIndex: 1, explanation: "Browser pop-ups cannot actually scan your system." } },
      { id: "blackmail-scam", title: "The Blackmail Scam", description: "Emails claiming webcam recordings.", tips: ["It's a mass-scare tactic."], content: "Using leaked passwords to scare.", quiz: { question: "Should you pay someone who claims to have your webcam video?", options: ["Yes", "No, it's likely a bluff", "Ask for proof", "Negotiate"], answerIndex: 1, explanation: "These are mass-sent and almost always fake." } },
      { id: "ransomware-infections", title: "Ransomware Infections", description: "Encrypted files and Bitcoin demands.", tips: ["Backup offline."], content: "Holding data for ransom.", quiz: { question: "How to prevent ransomware impact?", options: ["Pay quickly", "Keep current offline backups", "Never use the internet", "Install more games"], answerIndex: 1, explanation: "Backups allow you to restore without paying." } },
      { id: "remote-access-trojans", title: "Remote Access Trojans (RATs)", description: "Tricked into installing AnyDesk.", tips: ["Never allow remote access."], content: "Giving keys to the castle.", quiz: { question: "Should you allow a stranger to connect to your computer?", options: ["Yes", "No", "Only if they say they are Microsoft", "Maybe"], answerIndex: 1, explanation: "Remote access gives them full control over your files and accounts." } },
      { id: "fake-antivirus-calls", title: "Fake Antivirus Calls", description: "Calls claiming subscription expired.", tips: ["Update via app direct."], content: "Fear-based software sales.", quiz: { question: "Will Norton call you out of the blue?", options: ["Yes", "No", "Usually", "Daily"], answerIndex: 1, explanation: "Antivirus companies don't make outbound cold calls." } },
      { id: "sextortion", title: "Sextortion", description: "Compromising photos and blackmail.", tips: ["Don't share with strangers."], content: "Preying on personal secrets.", quiz: { question: "Should you pay a sextortionist?", options: ["Yes", "No, report to authorities", "Send more photos", "Ignore"], answerIndex: 1, explanation: "Paying marks you as a victim for further demands." } },
      { id: "fake-app-store-downloads", title: "Fake App Store Downloads", description: "Spyware in official-looking apps.", tips: ["Check reviews/developer."], content: "Trojan horses for your phone.", quiz: { question: "Are all apps on the Store safe?", options: ["Yes", "No, always check reviews", "Google says so", "Yes if it's free"], answerIndex: 1, explanation: "Malicious apps can briefly bypass store reviews." } },
      { id: "blue-screen-fakeout", title: "The 'Blue Screen of Death' Fakeout", description: "Websites mimicking crash screens.", tips: ["Press Esc/F11."], content: "Visual illusions to scare.", quiz: { question: "How to tell a fake BSOD?", options: ["Call the number", "See if you can move your mouse or exit full screen", "Pay Windows", "Wait 10 hours"], answerIndex: 1, explanation: "Real crash screens don't have support phone numbers." } },
      { id: "stolen-device-ransom", title: "Stolen Device Ransom", description: "Fake Apple support needing iCloud pass.", tips: ["Thieves need your password."], content: "Bypassing activation locks.", quiz: { question: "Would Apple text you to ask for your password to find your phone?", options: ["Yes", "No", "Usually", "Only on Tuesday"], answerIndex: 1, explanation: "Apple never asks for passwords via SMS." } },
      { id: "hitman-threat", title: "The Hitman Threat", description: "Emails from 'supposed' assassins.", tips: ["Report to police if unsure."], content: "Extreme fear tactics.", quiz: { question: "Are 'hitman' emails real?", options: ["Yes", "No, it's a mass-scare tactic", "Always", "Hire a hitman back"], answerIndex: 1, explanation: "These are generic threats sent to millions." } }
    ]
  },
  {
    id: 5,
    title: "Social Hacks & Mobile",
    icon: ShieldAlert,
    color: "#ea580c",
    lessons: [
      { id: "social-media-hijacking", title: "Social Media Hijacking", description: "'Is this you' video links.", tips: ["Friend's account is compromised."], content: "Account takeover loops.", quiz: { question: "Should you click a strange link from a friend?", options: ["Yes", "No, verify via another way", "Yes if it's funny", "None"], answerIndex: 1, explanation: "Account takeovers are common; verify first." } },
      { id: "2fa-bypass", title: "Two-Factor Authentication (2FA) Bypass", description: "Scammers asking for your 6-digit code.", tips: ["Never read codes aloud."], content: "Final hurdle for attackers.", quiz: { question: "Should you tell a support agent your 2FA code?", options: ["Yes", "No, never", "Only if they ask nicely", "Sometimes"], answerIndex: 1, explanation: "Codes are for YOU to enter, not to share." } },
      { id: "sim-swapping", title: "Sim Swapping", description: "Porting your number to their SIM.", tips: ["Set up a carrier PIN."], content: "Taking over your phone number identity.", quiz: { question: "What is a sign of SIM swapping?", options: ["Battery drain", "Sudden 'No Service' on your phone", "Fast internet", "New emojis"], answerIndex: 1, explanation: "Loss of signal means your number was moved elsewhere." } },
      { id: "public-wifi-interception", title: "Public Wi-Fi Interception", description: "Fake 'Free Airport Wi-Fi'.", tips: ["Use a VPN."], content: "Listening to your traffic.", quiz: { question: "Is hotel Wi-Fi always safe?", options: ["Yes", "No, use a VPN for sensitive tasks", "Always", "Encryption makes it safe"], answerIndex: 1, explanation: "Open networks are visible to others on the network." } },
      { id: "juice-jacking", title: "Juice Jacking", description: "Malware from public USB ports.", tips: ["Use AC outlets."], content: "Charging ports that steal data.", quiz: { question: "Safety tip for public charging?", options: ["Use the USB port", "Use your own AC wall plug", "Charge only in the sun", "None"], answerIndex: 1, explanation: "AC plugs don't transmit data, unlike USB." } },
      { id: "qr-code-fraud", title: "QR Code Fraud", description: "Malicious stickers on meters.", tips: ["Examine QR codes."], content: "Redirecting your payments.", quiz: { question: "What is a risk of scanning random QR codes?", options: ["Free coffee", "Malicious website redirects", "Phone explosion", "Better signal"], answerIndex: 1, explanation: "QR codes are just links; they can lead anywhere." } },
      { id: "fake-reviews-endorsements", title: "Fake Reviews & Endorsements", description: "Elon Musk 'giving away' crypto.", tips: ["Celebrities don't give free crypto."], content: "Visual manipulation for trust.", quiz: { question: "Should you trust a celebrity crypto endorsement?", options: ["Yes", "No, check official sources", "If it has a blue check", "Maybe"], answerIndex: 1, explanation: "Deepfakes and hijacks make 'celebrity' ads untrustworthy." } },
      { id: "marketplace-scams", title: "Marketplace Scams", description: "Overpayments on Facebook.", tips: ["Stick to cash."], content: "Bait-and-switch electronics payments.", quiz: { question: "Safest way to sell locally?", options: ["Cash in person", "Zelle", "Paypal", "Checks"], answerIndex: 0, explanation: "Cash is immediate and non-reversible." } },
      { id: "event-ticket-fraud", title: "Event Ticket Fraud", description: "Sold-out tickets from strangers.", tips: ["Use verified platforms."], content: "Preying on desperate fans.", quiz: { question: "Should you buy tickets from a stranger via Venmo?", options: ["Yes", "No, use a verified reseller with protection", "If they send a photo", "None"], answerIndex: 1, explanation: "Venmo offers no protection for scams." } },
      { id: "look-who-died-scam", title: "The 'Look Who Died' Scam", description: "Panicked tagging on Facebook.", tips: ["Prays on panic."], content: "Clickbait for malware.", quiz: { question: "What is the goal of the 'Look who died' tag?", options: ["Sympathy", "Baiting you into clicking a malware link", "Information", "None"], answerIndex: 1, explanation: "Panic makes you forget basic security checks." } }
    ]
  }
];


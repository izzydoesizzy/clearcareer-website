export interface ProductGuide {
  id: string;
  file: string;
  title: string;
  icon: string;
  type: "guide" | "tool";
}

export interface Product {
  slug: string;
  name: string;
  price: number;
  currency: string;
  tier: "free" | "$9" | "$19-29" | "$47-67" | "$97+";
  description: string;
  stripePriceEnvVar: string;
  guidesDir: string;
  guides: ProductGuide[];
  badge?: string;
  /** Bundles: the products this one unlocks (each keeps its own access page). */
  includes?: string[];
  /** No longer sold on its own: its page points to `replacedBy`, existing access links keep working. */
  retired?: boolean;
  /** Hidden for now: off the shop, its sales page redirects to /shop, existing access links keep working. */
  hidden?: boolean;
  replacedBy?: string;
}

export const PRODUCTS: Record<string, Product> = {
  // ── FREE TIER ──────────────────────────────────────────
  "adhd-cheat-sheet": {
    slug: "adhd-cheat-sheet",
    hidden: true,
    name: "ADHD Job Search Survival Cheat Sheet",
    price: 0,
    currency: "CAD",
    tier: "free",
    description:
      "5 immediate hacks for job searching with ADHD. Built by someone who gets it.",
    stripePriceEnvVar: "",
    guidesDir: "adhd-cheat-sheet-guides",
    badge: "Free",
    guides: [
      {
        id: "01-cheat-sheet",
        file: "01-adhd-job-search-cheat-sheet.md",
        title: "ADHD Job Search Cheat Sheet",
        icon: "🧠",
        type: "guide",
      },
    ],
  },
  "job-search-scorecard": {
    slug: "job-search-scorecard",
    hidden: true,
    name: "Job Search Self-Diagnostic Scorecard",
    price: 0,
    currency: "CAD",
    tier: "free",
    description:
      "Find out exactly where your job search is breaking down. 10 questions, 5 dimensions.",
    stripePriceEnvVar: "",
    guidesDir: "job-search-scorecard-guides",
    badge: "Free",
    guides: [
      {
        id: "01-scorecard",
        file: "01-job-search-scorecard.md",
        title: "Job Search Scorecard",
        icon: "📊",
        type: "guide",
      },
    ],
  },
  "rejection-cards": {
    slug: "rejection-cards",
    hidden: true,
    name: "Rejection Reframe Card Deck",
    price: 0,
    currency: "CAD",
    tier: "free",
    description:
      "10 printable cards with evidence-based reframes for when rejection hits hard.",
    stripePriceEnvVar: "",
    guidesDir: "rejection-cards-guides",
    badge: "Free",
    guides: [
      {
        id: "01-cards",
        file: "01-rejection-reframe-cards.md",
        title: "Rejection Reframe Cards",
        icon: "🃏",
        type: "guide",
      },
    ],
  },
  "ghost-job-checklist": {
    slug: "ghost-job-checklist",
    hidden: true,
    name: "50 Ghost Job Red Flags Checklist",
    price: 0,
    currency: "CAD",
    tier: "free",
    description:
      "Stop wasting time on jobs that don't exist. 50 red flags to spot before you apply.",
    stripePriceEnvVar: "",
    guidesDir: "ghost-job-checklist-guides",
    badge: "Free",
    guides: [
      {
        id: "01-checklist",
        file: "01-ghost-job-red-flags.md",
        title: "Ghost Job Red Flags",
        icon: "👻",
        type: "guide",
      },
    ],
  },

  // ── $9 TIER ────────────────────────────────────────────
  "adhd-focus-kit": {
    slug: "adhd-focus-kit",
    hidden: true,
    name: "ADHD Job Seeker's Focus Kit",
    price: 9,
    currency: "CAD",
    tier: "$9",
    description:
      "Energy management, dopamine-friendly tracking, and RSD tools for ADHD job seekers.",
    stripePriceEnvVar: "STRIPE_ADHD_FOCUS_KIT_PRICE_ID",
    guidesDir: "adhd-focus-kit-guides",
    badge: "New",
    guides: [
      {
        id: "01-adhd-nightmare",
        file: "01-why-job-search-is-an-adhd-nightmare.md",
        title: "Why Job Search Is an ADHD Nightmare",
        icon: "🧠",
        type: "guide",
      },
      {
        id: "02-energy-management",
        file: "02-energy-management-framework.md",
        title: "Energy Management Framework",
        icon: "⚡",
        type: "guide",
      },
      {
        id: "03-dopamine-search",
        file: "03-the-dopamine-friendly-job-search.md",
        title: "The Dopamine-Friendly Job Search",
        icon: "🎮",
        type: "guide",
      },
      {
        id: "04-rsd-toolkit",
        file: "04-rejection-sensitivity-toolkit.md",
        title: "Rejection Sensitivity Toolkit",
        icon: "💙",
        type: "guide",
      },
      {
        id: "05-systems",
        file: "05-systems-not-willpower.md",
        title: "Systems, Not Willpower",
        icon: "⚙️",
        type: "guide",
      },
    ],
  },
  "linkedin-detox": {
    slug: "linkedin-detox",
    hidden: true,
    name: "LinkedIn Detox + Comparison Recovery Guide",
    price: 9,
    currency: "CAD",
    tier: "$9",
    description:
      "Stop doom-scrolling LinkedIn. A research-backed framework for using it without losing your mind.",
    stripePriceEnvVar: "STRIPE_LINKEDIN_DETOX_PRICE_ID",
    guidesDir: "linkedin-detox-guides",
    badge: "New",
    guides: [
      {
        id: "01-detox",
        file: "01-linkedin-detox-guide.md",
        title: "LinkedIn Detox Guide",
        icon: "🧘",
        type: "guide",
      },
    ],
  },
  "salary-generator": {
    slug: "salary-generator",
    name: "The Salary Number Generator",
    price: 9,
    currency: "CAD",
    tier: "$9",
    description:
      "Calculate your anchor, target, and walk-away numbers with word-for-word scripts.",
    stripePriceEnvVar: "STRIPE_SALARY_GENERATOR_PRICE_ID",
    guidesDir: "salary-generator-guides",
    badge: "New",
    guides: [
      {
        id: "01-generator",
        file: "01-salary-number-generator.md",
        title: "Salary Number Generator",
        icon: "💰",
        type: "guide",
      },
    ],
  },
  "cold-outreach-pack": {
    slug: "cold-outreach-pack",
    retired: true,
    replacedBy: "outreach-templates",
    name: "Cold Outreach Script Pack",
    price: 9,
    currency: "CAD",
    tier: "$9",
    description:
      "30 copy-paste scripts for cold emails, LinkedIn DMs, follow-ups, and referral requests.",
    stripePriceEnvVar: "STRIPE_COLD_OUTREACH_PRICE_ID",
    guidesDir: "cold-outreach-pack-guides",
    badge: "New",
    guides: [
      {
        id: "01-scripts",
        file: "01-cold-outreach-scripts.md",
        title: "Cold Outreach Scripts",
        icon: "📧",
        type: "guide",
      },
    ],
  },

  // ── $19-29 TIER ────────────────────────────────────────
  "emotional-survival-kit": {
    slug: "emotional-survival-kit",
    hidden: true,
    name: "Job Search Emotional Survival Kit",
    price: 24,
    currency: "CAD",
    tier: "$19-29",
    description:
      "CBT and ACT-based tools for the psychological toll of job searching. 8 evidence-based guides.",
    stripePriceEnvVar: "STRIPE_EMOTIONAL_KIT_PRICE_ID",
    guidesDir: "emotional-survival-kit-guides",
    badge: "New",
    guides: [
      {
        id: "01-grief",
        file: "01-the-grief-nobody-talks-about.md",
        title: "The Grief Nobody Talks About",
        icon: "💔",
        type: "guide",
      },
      {
        id: "02-rejection",
        file: "02-rewiring-rejection.md",
        title: "Rewiring Rejection",
        icon: "🔄",
        type: "guide",
      },
      {
        id: "03-identity",
        file: "03-identity-after-layoff.md",
        title: "Identity After Layoff",
        icon: "🪞",
        type: "guide",
      },
      {
        id: "04-anxiety",
        file: "04-the-anxiety-toolkit.md",
        title: "The Anxiety Toolkit",
        icon: "🧘",
        type: "guide",
      },
      {
        id: "05-linkedin-sanity",
        file: "05-linkedin-without-losing-your-mind.md",
        title: "LinkedIn Without Losing Your Mind",
        icon: "📱",
        type: "guide",
      },
      {
        id: "06-burnout",
        file: "06-the-burnout-circuit-breaker.md",
        title: "The Burnout Circuit Breaker",
        icon: "🔋",
        type: "guide",
      },
      {
        id: "07-relationships",
        file: "07-relationships-under-pressure.md",
        title: "Relationships Under Pressure",
        icon: "👥",
        type: "guide",
      },
      {
        id: "08-confidence",
        file: "08-rebuilding-confidence.md",
        title: "Rebuilding Confidence",
        icon: "💪",
        type: "guide",
      },
    ],
  },
  "script-vault": {
    slug: "script-vault",
    retired: true,
    replacedBy: "complete-toolkit",
    name: "The Job Search Script Vault",
    price: 29,
    currency: "CAD",
    tier: "$19-29",
    description:
      "100+ copy-paste scripts for outreach, negotiation, interviews, follow-ups, and more.",
    stripePriceEnvVar: "STRIPE_SCRIPT_VAULT_PRICE_ID",
    guidesDir: "script-vault-guides",
    badge: "New",
    guides: [
      {
        id: "01-cold-outreach",
        file: "01-cold-outreach-scripts.md",
        title: "Cold Outreach Scripts",
        icon: "📧",
        type: "guide",
      },
      {
        id: "02-follow-ups",
        file: "02-follow-up-scripts.md",
        title: "Follow-Up Scripts",
        icon: "🔄",
        type: "guide",
      },
      {
        id: "03-salary",
        file: "03-salary-negotiation-scripts.md",
        title: "Salary Negotiation Scripts",
        icon: "💰",
        type: "guide",
      },
      {
        id: "04-networking",
        file: "04-networking-scripts.md",
        title: "Networking Scripts",
        icon: "🤝",
        type: "guide",
      },
      {
        id: "05-interview",
        file: "05-interview-scripts.md",
        title: "Interview Scripts",
        icon: "🎤",
        type: "guide",
      },
      {
        id: "06-rejection",
        file: "06-rejection-response-scripts.md",
        title: "Rejection Response Scripts",
        icon: "💪",
        type: "guide",
      },
      {
        id: "07-resignation",
        file: "07-resignation-and-transition-scripts.md",
        title: "Resignation and Transition Scripts",
        icon: "🚪",
        type: "guide",
      },
    ],
  },
  "adhd-career-change": {
    slug: "adhd-career-change",
    hidden: true,
    name: "ADHD Career Change Workbook",
    price: 24,
    currency: "CAD",
    tier: "$19-29",
    description:
      "A complete career change system designed for how ADHD brains actually work.",
    stripePriceEnvVar: "STRIPE_ADHD_CAREER_CHANGE_PRICE_ID",
    guidesDir: "adhd-career-change-guides",
    badge: "New",
    guides: [
      {
        id: "01-adhd-or-job",
        file: "01-is-it-adhd-or-is-the-job-wrong.md",
        title: "Is It ADHD or Is the Job Wrong?",
        icon: "🤔",
        type: "guide",
      },
      {
        id: "02-dopamine-map",
        file: "02-the-dopamine-career-map.md",
        title: "The Dopamine Career Map",
        icon: "🗺️",
        type: "guide",
      },
      {
        id: "03-skills",
        file: "03-transferable-skills-translator.md",
        title: "Transferable Skills Translator",
        icon: "🔀",
        type: "guide",
      },
      {
        id: "04-financial",
        file: "04-financial-runway-for-career-changers.md",
        title: "Financial Runway for Career Changers",
        icon: "💵",
        type: "guide",
      },
      {
        id: "05-action-plan",
        file: "05-the-adhd-friendly-action-plan.md",
        title: "The ADHD-Friendly Action Plan",
        icon: "📋",
        type: "guide",
      },
      {
        id: "06-story",
        file: "06-telling-your-story.md",
        title: "Telling Your Story",
        icon: "📖",
        type: "guide",
      },
    ],
  },
  "interview-confidence": {
    slug: "interview-confidence",
    name: "The Interview Confidence Kit",
    price: 19,
    currency: "CAD",
    tier: "$19-29",
    description:
      "STAR stories, a mock-interview coach for Claude, answer frameworks for 20 common questions, and the thank-you email that gets remembered.",
    stripePriceEnvVar: "STRIPE_INTERVIEW_CONFIDENCE_PRICE_ID",
    guidesDir: "interview-confidence-guides",
    badge: "New",
    guides: [
      {
        id: "01-star-stories",
        file: "01-star-story-bank-builder.md",
        title: "STAR Story Bank Builder",
        icon: "⭐",
        type: "guide",
      },
      {
        id: "02-anxiety",
        file: "02-anxiety-management-for-interviews.md",
        title: "Anxiety Management for Interviews",
        icon: "🧘",
        type: "guide",
      },
      {
        id: "03-tmay",
        file: "03-tell-me-about-yourself.md",
        title: "Tell Me About Yourself",
        icon: "🎤",
        type: "guide",
      },
      {
        id: "04-twenty-questions",
        file: "04-twenty-questions-you-will-get.md",
        title: "20 Questions You Will Get",
        icon: "❓",
        type: "guide",
      },
      {
        id: "05-post-interview",
        file: "05-post-interview-playbook.md",
        title: "Post-Interview Playbook",
        icon: "📝",
        type: "guide",
      },
      {
        id: "06-prep-package",
        file: "06-interview-prep-package.md",
        title: "Interview Prep Package",
        icon: "🗂️",
        type: "guide",
      },
      {
        id: "07-scripts",
        file: "07-interview-scripts.md",
        title: "Interview Scripts",
        icon: "💬",
        type: "guide",
      },
      {
        id: "08-thank-you",
        file: "08-thank-you-and-follow-up.md",
        title: "Thank-You and Follow-Up Emails",
        icon: "✉️",
        type: "guide",
      },
    ],
  },

  // ── $47-67 TIER ────────────────────────────────────────
  "outreach-templates": {
    slug: "outreach-templates",
    name: "Outreach and Email Templates",
    price: 19,
    currency: "CAD",
    tier: "$19-29",
    description:
      "80+ templates to reach hiring managers directly: cold emails, follow-ups, LinkedIn messages, referrals, and the thank-you that gets remembered. With a Claude skill that personalizes them.",
    stripePriceEnvVar: "STRIPE_OUTREACH_TEMPLATES_PRICE_ID",
    guidesDir: "outreach-templates-guides",
    badge: "New",
    guides: [
      {
        id: "01-one-week",
        file: "01-land-an-interview-in-1-week.md",
        title: "Land an Interview in 1 Week",
        icon: "🎯",
        type: "guide",
      },
      {
        id: "02-hiring-managers",
        file: "02-hiring-manager-cold-emails.md",
        title: "Hiring Manager Cold Emails",
        icon: "📧",
        type: "guide",
      },
      {
        id: "03-follow-ups",
        file: "03-follow-ups.md",
        title: "Follow-Ups",
        icon: "🔁",
        type: "guide",
      },
      {
        id: "04-linkedin",
        file: "04-linkedin-requests-and-messages.md",
        title: "LinkedIn Requests and Messages",
        icon: "💼",
        type: "guide",
      },
      {
        id: "05-referrals",
        file: "05-referrals-and-informational-interviews.md",
        title: "Referrals and Informational Interviews",
        icon: "🤝",
        type: "guide",
      },
      {
        id: "06-thank-you",
        file: "06-thank-you-emails.md",
        title: "Thank-You Emails",
        icon: "🙏",
        type: "guide",
      },
      {
        id: "07-networking",
        file: "07-networking-without-the-awkward.md",
        title: "Networking Without the Awkward",
        icon: "☕",
        type: "guide",
      },
    ],
  },
  "salary-negotiation": {
    slug: "salary-negotiation",
    name: "Salary Negotiation Scripts and Advice",
    price: 29,
    currency: "CAD",
    tier: "$19-29",
    description:
      "Word-for-word scripts for every stage of the offer, my advice on how to use them, and a Claude negotiation coach that drafts your counter and rehearses the call with you.",
    stripePriceEnvVar: "STRIPE_SALARY_NEGOTIATION_PRICE_ID",
    guidesDir: "salary-negotiation-guides",
    badge: "New",
    guides: [
      {
        id: "01-advice",
        file: "01-how-to-negotiate-your-offer.md",
        title: "How to Negotiate Your Offer",
        icon: "🧭",
        type: "guide",
      },
      {
        id: "02-recruiter-call",
        file: "02-recruiter-call-and-the-salary-question.md",
        title: "The Recruiter Call and the Salary Question",
        icon: "📞",
        type: "guide",
      },
      {
        id: "03-counter",
        file: "03-counter-offer-scripts.md",
        title: "Counter-Offer Scripts",
        icon: "💬",
        type: "guide",
      },
      {
        id: "04-beyond-base",
        file: "04-beyond-base-pay-scripts.md",
        title: "Beyond Base Pay",
        icon: "🎁",
        type: "guide",
      },
      {
        id: "05-tricky",
        file: "05-tricky-moments.md",
        title: "Tricky Moments",
        icon: "⚠️",
        type: "guide",
      },
      {
        id: "06-worksheet",
        file: "06-offer-evaluation-worksheet.md",
        title: "Offer Evaluation Worksheet",
        icon: "🧮",
        type: "guide",
      },
    ],
  },
  "complete-toolkit": {
    slug: "complete-toolkit",
    name: "The Complete Job Search Toolkit",
    price: 49,
    currency: "CAD",
    tier: "$47-67",
    description:
      "Everything in one bundle: the Career Prompt Vault, Salary Number Generator, Outreach and Email Templates, Interview Confidence Kit, and Salary Negotiation Scripts and Advice. Plus bonus rejection and resignation scripts.",
    stripePriceEnvVar: "STRIPE_COMPLETE_TOOLKIT_PRICE_ID",
    guidesDir: "complete-toolkit-guides",
    badge: "Best value",
    includes: ["vault", "salary-generator", "outreach-templates", "interview-confidence", "salary-negotiation"],
    guides: [
      {
        id: "01-rejection",
        file: "01-rejection-response-scripts.md",
        title: "Bonus: Rejection Response Scripts",
        icon: "🔄",
        type: "guide",
      },
      {
        id: "02-resignation",
        file: "02-resignation-and-transition-scripts.md",
        title: "Bonus: Resignation and Transition Scripts",
        icon: "🚪",
        type: "guide",
      },
    ],
  },
  "resume-linkedin-audit": {
    slug: "resume-linkedin-audit",
    name: "Resume and LinkedIn Audit Kit",
    price: 29,
    currency: "CAD",
    tier: "$19-29",
    description:
      "The audits I run for clients, as two Claude skills: a quick snapshot, a full section-by-section audit, or a Rewrite Guide that quotes your resume and LinkedIn and rewrites them.",
    stripePriceEnvVar: "STRIPE_RESUME_LINKEDIN_AUDIT_PRICE_ID",
    guidesDir: "resume-linkedin-audit-guides",
    badge: "New",
    guides: [
      {
        id: "01-how",
        file: "01-how-the-audits-work.md",
        title: "How the Audits Work",
        icon: "🔍",
        type: "guide",
      },
      {
        id: "02-resume",
        file: "02-resume-checklist.md",
        title: "Resume Checklist",
        icon: "📄",
        type: "guide",
      },
      {
        id: "03-linkedin",
        file: "03-linkedin-checklist.md",
        title: "LinkedIn Checklist",
        icon: "💼",
        type: "guide",
      },
    ],
  },
  "interview-dossier": {
    slug: "interview-dossier",
    name: "Interview Prep Dossier",
    price: 39,
    currency: "CAD",
    tier: "$19-29",
    description:
      "My flagship client deliverable, as a Claude skill: a full prep pack for one specific job, with company research, likely objections and your answers, custom questions, STAR stories mapped to the role, and questions to ask.",
    stripePriceEnvVar: "STRIPE_INTERVIEW_DOSSIER_PRICE_ID",
    guidesDir: "interview-dossier-guides",
    badge: "New",
    guides: [
      {
        id: "01-how",
        file: "01-how-to-use-your-dossier.md",
        title: "How to Use Your Dossier",
        icon: "🗂️",
        type: "guide",
      },
      {
        id: "02-tips",
        file: "02-interview-day-tips.md",
        title: "Interview Day Tips",
        icon: "✅",
        type: "guide",
      },
    ],
  },
  "research-outreach": {
    slug: "research-outreach",
    name: "Research and Outreach Kit",
    price: 29,
    currency: "CAD",
    tier: "$19-29",
    description:
      "Three Claude skills: find fresh jobs and score each one out of 12, research and rank your target companies, then email the people who hire with short, specific notes.",
    stripePriceEnvVar: "STRIPE_RESEARCH_OUTREACH_PRICE_ID",
    guidesDir: "research-outreach-guides",
    badge: "New",
    guides: [
      {
        id: "01-fit",
        file: "01-the-fit-score.md",
        title: "The Fit Score",
        icon: "🎯",
        type: "guide",
      },
      {
        id: "02-scorecards",
        file: "02-company-scorecards.md",
        title: "Company Scorecards",
        icon: "🏢",
        type: "guide",
      },
      {
        id: "03-campaign",
        file: "03-cold-outreach-campaign.md",
        title: "Cold Outreach Campaign",
        icon: "📬",
        type: "guide",
      },
      {
        id: "04-tools",
        file: "04-search-tools.md",
        title: "Search Tools",
        icon: "🔎",
        type: "guide",
      },
    ],
  },
  "linkedin-launch": {
    slug: "linkedin-launch",
    name: "LinkedIn Launch Pack",
    price: 19,
    currency: "CAD",
    tier: "$19-29",
    description:
      "My own LinkedIn formats, as a Claude skill: pipe-style headlines, the 4-part About section, messages for 5 situations, and posts from your own stories. Plus a build-from-scratch guide.",
    stripePriceEnvVar: "STRIPE_LINKEDIN_LAUNCH_PRICE_ID",
    guidesDir: "linkedin-launch-guides",
    badge: "New",
    guides: [
      {
        id: "01-headlines",
        file: "01-headlines.md",
        title: "Headlines",
        icon: "✍️",
        type: "guide",
      },
      {
        id: "02-about",
        file: "02-the-4-part-about.md",
        title: "The 4-Part About",
        icon: "📝",
        type: "guide",
      },
      {
        id: "03-dms",
        file: "03-dms-for-5-situations.md",
        title: "Messages for 5 Situations",
        icon: "💬",
        type: "guide",
      },
      {
        id: "04-posts",
        file: "04-posts-from-your-stories.md",
        title: "Posts From Your Stories",
        icon: "📣",
        type: "guide",
      },
      {
        id: "05-scratch",
        file: "05-build-your-profile-from-scratch.md",
        title: "Build Your Profile From Scratch",
        icon: "🧱",
        type: "guide",
      },
    ],
  },
  "career-clarity-audit": {
    slug: "career-clarity-audit",
    name: "Career Clarity Audit",
    price: 0,
    currency: "CAD",
    tier: "free",
    description:
      "Free. From your resume: 5 job titles to target with fit and salary, ready LinkedIn searches, and your anchor, target and walk-away numbers.",
    stripePriceEnvVar: "",
    guidesDir: "career-clarity-audit-guides",
    badge: "Free",
    guides: [
      {
        id: "01-read",
        file: "01-how-to-read-your-audit.md",
        title: "How to Read Your Audit",
        icon: "🧭",
        type: "guide",
      },
    ],
  },
  "all-access": {
    slug: "all-access",
    name: "The All-Access Pass",
    price: 99,
    currency: "CAD",
    tier: "$97+",
    description:
      "Every ClearCareer product in one: the Complete Job Search Toolkit plus the Resume and LinkedIn Audit Kit, Interview Prep Dossier, Research and Outreach Kit and LinkedIn Launch Pack. 17 Claude skills.",
    stripePriceEnvVar: "STRIPE_ALL_ACCESS_PRICE_ID",
    guidesDir: "all-access-guides",
    badge: "Best value",
    includes: ["vault", "salary-generator", "outreach-templates", "interview-confidence", "salary-negotiation", "resume-linkedin-audit", "interview-dossier", "research-outreach", "linkedin-launch", "complete-toolkit"],
    guides: [
    ],
  },
  "career-change-command-center": {
    slug: "career-change-command-center",
    hidden: true,
    name: "The Complete Career Change Command Center",
    price: 47,
    currency: "CAD",
    tier: "$47-67",
    description:
      "Everything you need to change careers without burning it all down. 7 modules.",
    stripePriceEnvVar: "STRIPE_CAREER_CHANGE_CC_PRICE_ID",
    guidesDir: "career-change-command-center-guides",
    badge: "New",
    guides: [
      {
        id: "01-exploration",
        file: "01-career-exploration-framework.md",
        title: "Career Exploration Framework",
        icon: "🔍",
        type: "guide",
      },
      {
        id: "02-skills-matrix",
        file: "02-transferable-skills-matrix.md",
        title: "Transferable Skills Matrix",
        icon: "📊",
        type: "guide",
      },
      {
        id: "03-financial",
        file: "03-financial-runway-calculator.md",
        title: "Financial Runway Calculator",
        icon: "💰",
        type: "guide",
      },
      {
        id: "04-networking",
        file: "04-networking-crm-system.md",
        title: "Networking CRM System",
        icon: "🤝",
        type: "guide",
      },
      {
        id: "05-research",
        file: "05-industry-research-playbook.md",
        title: "Industry Research Playbook",
        icon: "📚",
        type: "guide",
      },
      {
        id: "06-resume",
        file: "06-the-pivot-resume.md",
        title: "The Pivot Resume",
        icon: "📄",
        type: "guide",
      },
      {
        id: "07-transition",
        file: "07-ninety-day-transition-plan.md",
        title: "90-Day Transition Plan",
        icon: "📅",
        type: "guide",
      },
    ],
  },
  "over-40-toolkit": {
    slug: "over-40-toolkit",
    hidden: true,
    name: "The Over-40 Career Toolkit",
    price: 47,
    currency: "CAD",
    tier: "$47-67",
    description:
      "Resume, LinkedIn, interview, and strategy tools built for 20+ years of experience.",
    stripePriceEnvVar: "STRIPE_OVER_40_TOOLKIT_PRICE_ID",
    guidesDir: "over-40-toolkit-guides",
    badge: "New",
    guides: [
      {
        id: "01-resume",
        file: "01-the-age-proof-resume.md",
        title: "The Age-Proof Resume",
        icon: "📄",
        type: "guide",
      },
      {
        id: "02-linkedin",
        file: "02-linkedin-for-experienced-professionals.md",
        title: "LinkedIn for Experienced Professionals",
        icon: "💼",
        type: "guide",
      },
      {
        id: "03-interviewing",
        file: "03-interviewing-with-experience.md",
        title: "Interviewing with Experience",
        icon: "🎤",
        type: "guide",
      },
      {
        id: "04-ageism",
        file: "04-the-ageism-playbook.md",
        title: "The Ageism Playbook",
        icon: "🛡️",
        type: "guide",
      },
      {
        id: "05-second-act",
        file: "05-second-act-exploration.md",
        title: "Second Act Exploration",
        icon: "🌅",
        type: "guide",
      },
      {
        id: "06-financial",
        file: "06-financial-strategy-for-late-career-moves.md",
        title: "Financial Strategy for Late-Career Moves",
        icon: "💵",
        type: "guide",
      },
    ],
  },
  "adhd-command-center": {
    slug: "adhd-command-center",
    hidden: true,
    name: "The ADHD Job Search Command Center",
    price: 57,
    currency: "CAD",
    tier: "$47-67",
    description:
      "The complete job search system designed for how your brain actually works. 8 modules.",
    stripePriceEnvVar: "STRIPE_ADHD_COMMAND_CENTER_PRICE_ID",
    guidesDir: "adhd-command-center-guides",
    badge: "Flagship",
    guides: [
      {
        id: "01-operating-system",
        file: "01-the-adhd-job-search-operating-system.md",
        title: "The ADHD Job Search Operating System",
        icon: "🖥️",
        type: "guide",
      },
      {
        id: "02-energy",
        file: "02-energy-management-dashboard.md",
        title: "Energy Management Dashboard",
        icon: "⚡",
        type: "guide",
      },
      {
        id: "03-applications",
        file: "03-the-adhd-application-system.md",
        title: "The ADHD Application System",
        icon: "📋",
        type: "guide",
      },
      {
        id: "04-interview-prep",
        file: "04-interview-prep-for-adhd-brains.md",
        title: "Interview Prep for ADHD Brains",
        icon: "🎯",
        type: "guide",
      },
      {
        id: "05-networking",
        file: "05-networking-without-masking.md",
        title: "Networking Without Masking",
        icon: "🤝",
        type: "guide",
      },
      {
        id: "06-dopamine",
        file: "06-the-dopamine-reward-system.md",
        title: "The Dopamine Reward System",
        icon: "🎮",
        type: "guide",
      },
      {
        id: "07-rsd",
        file: "07-rejection-and-rsd-survival.md",
        title: "Rejection and RSD Survival",
        icon: "💙",
        type: "guide",
      },
      {
        id: "08-weekly-review",
        file: "08-weekly-review-and-reset.md",
        title: "Weekly Review and Reset",
        icon: "📆",
        type: "guide",
      },
    ],
  },
};

// Helper to get products by tier
export function getProductsByTier(
  tier: Product["tier"]
): Product[] {
  return Object.values(PRODUCTS).filter((p) => p.tier === tier);
}

/** Bundles that include a product (so a bundle purchase opens it). */
export function bundlesIncluding(slug: string): string[] {
  return Object.values(PRODUCTS).filter((p) => p.includes?.includes(slug)).map((p) => p.slug);
}

/** Single prices for products not in PRODUCTS (sold on their own pages). */
export const OTHER_PRICES: Record<string, number> = { vault: 9, "layoff-survival-kit": 9 };

// Helper to get a product by slug (returns undefined if not found)
export function getProduct(slug: string): Product | undefined {
  return PRODUCTS[slug];
}

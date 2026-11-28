// The ClearCareer Career Suite: AI skills for Claude, ChatGPT and Gemini.
// Source files live in skills/clearcareer-career-suite/ (not public). The build
// script (node scripts/build-career-suite.mjs) writes the downloadable zips to
// skills/clearcareer-career-suite/dist/, and the gated download API serves them.

export const CAREER_SUITE_PRODUCT = "career-suite";

// Live Stripe price for "The Career Suite" ($47 CAD one-time, product prod_Vi4AcGrWXezw2D).
// Price IDs aren't secret. STRIPE_CAREER_SUITE_PRICE_ID in Vercel overrides this if set.
export const CAREER_SUITE_STRIPE_PRICE_ID = "price_1Uge1zH8o32Pij57oewNOxw2";

// Shown on the sales page. Must match the Stripe price above.
export const CAREER_SUITE_PRICE = "$47 CAD";
export const CAREER_SUITE_PRICE_COMPARE = "$197";

export type Platform = "claude" | "chatgpt" | "gemini";

export const PLATFORMS: {
  id: Platform;
  name: string;
  format: string;
  install: string[];
}[] = [
  {
    id: "claude",
    name: "Claude",
    format: "Claude Skill (SKILL.md folder)",
    install: [
      "Download the skill zip. Don't unzip it.",
      "In Claude, open Settings > Capabilities and make sure Skills are turned on.",
      "Under Skills, click Upload skill (or Add skill) and choose the zip. Repeat for each tool.",
      "Start a new chat and ask for it by name, for example: \"Start my achievement interview.\"",
      "Using Claude Code? Unzip each one into ~/.claude/skills/ and type / to see them.",
    ],
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    format: "Custom GPT (instructions + knowledge files)",
    install: [
      "Download and unzip the tool. Each one becomes its own Custom GPT.",
      "In ChatGPT, go to Explore GPTs > Create, then the Configure tab.",
      "Copy the name and description from setup.md. Paste everything in instructions.md into Instructions.",
      "Upload every file in the knowledge folder under Knowledge.",
      "Add the conversation starters from setup.md, turn on Canvas (and Web Search where setup.md says), then save.",
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    format: "Gem (instructions + knowledge files)",
    install: [
      "Download and unzip the tool. Each one becomes its own Gem.",
      "In Gemini on the web, open Gems manager > New Gem.",
      "Copy the name from setup.md. Paste everything in gem-instructions.md into Instructions.",
      "Upload every file in the knowledge folder (Add files under Knowledge).",
      "Save the Gem, then open it and say hello to start.",
    ],
  },
];

export const SUITE_SKILLS: {
  slug: string;
  step: string;
  name: string;
  summary: string;
}[] = [
  {
    slug: "career-clarity",
    step: "Steps 1 and 3",
    name: "Career Clarity",
    summary: "Quick Start gives you working job titles in 15 minutes. The Full Report (after your interview) gives your final 5 titles, pay for your city with sources, and 20 to 30 target companies.",
  },
  {
    slug: "achievement-interviewer",
    step: "Steps 2 and 4",
    name: "AI Achievement Interviewer",
    summary: "Talk through every role in voice mode. It asks one question at a time until your work has numbers on it, then writes your bullets and 8 professional summaries.",
  },
  {
    slug: "linkedin-profile-builder",
    step: "Step 5",
    name: "LinkedIn Profile Builder",
    summary: "Headline, About, experience entries, skills and Open to Work settings, written from your profile and ready to paste.",
  },
  {
    slug: "job-alerts-setup",
    step: "Step 6",
    name: "Job Alerts Setup",
    summary: "Copy-paste LinkedIn, Google and Indeed alerts for your titles and target companies, with click-by-click steps.",
  },
  {
    slug: "job-search-autopilot",
    step: "Step 7",
    name: "Job Search Autopilot",
    summary: "Scheduled daily and weekly searches that find, check and score new jobs, and hand you the top 3 to apply to today.",
  },
  {
    slug: "job-match-rubric",
    step: "Step 8, ongoing",
    name: "Job Match Scorer",
    summary: "Paste any job. Get a score out of 100 on your real chances, the proof to lead with, your gaps and a tailored summary.",
  },
];

export const SUITE_SKILL_SLUGS = SUITE_SKILLS.map((s) => s.slug);
export const PLATFORM_IDS = PLATFORMS.map((p) => p.id);

/** Returns the dist-relative path for a download, or null if the request isn't one we serve. */
export function suiteDownloadPath(platform: string, skill: string): string | null {
  if (!PLATFORM_IDS.includes(platform as Platform)) return null;
  if (skill === "all") return `${platform}/clearcareer-career-suite-${platform}-all.zip`;
  if (skill === "guide") return "career-suite-guide.md";
  if (!SUITE_SKILL_SLUGS.includes(skill)) return null;
  return `${platform}/${skill}.zip`;
}

/** A paid session, or a free one from a 100% promo code (for Land and Level Up members). */
export function isSuiteSessionValid(session: {
  payment_status?: string | null;
  status?: string | null;
  metadata?: Record<string, string> | null;
}): boolean {
  if (session.metadata?.product !== CAREER_SUITE_PRODUCT) return false;
  if (session.payment_status === "paid") return true;
  return session.payment_status === "no_payment_required" && session.status === "complete";
}

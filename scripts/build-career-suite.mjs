// Builds the ClearCareer Career Suite for Claude, ChatGPT and Gemini.
//
// What it does, in plain terms:
// 1. Copies the shared method files (skills/clearcareer-career-suite/shared/*.md)
//    into each Claude skill's references/ folder and each GPT/Gem knowledge/ folder,
//    based on which files each skill mentions.
// 2. Turns the condensed instructions (shared/condensed/*.md) into ChatGPT GPT
//    instructions and Gemini Gem instructions, filling in platform-specific steps.
// 3. Writes a setup.md for every GPT and Gem (name, description, starters, settings).
// 4. Checks everything: no em/en dashes, no banned words in output examples,
//    ChatGPT instructions under 8,000 characters, every referenced file exists.
// 5. Zips one package per platform into dist/.
//
// Run: node scripts/build-career-suite.mjs

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SUITE = path.join(ROOT, "skills", "clearcareer-career-suite");
const SHARED = path.join(SUITE, "shared");
const CONDENSED = path.join(SHARED, "condensed");
const DIST = path.join(SUITE, "dist");

const SKILLS = {
  "career-clarity": {
    title: "ClearCareer Career Clarity",
    description: "Upload your resume and find the 5 job titles you should be targeting, what they pay, and what you actually want next.",
    starters: [
      "Here's my resume. What roles should I be targeting?",
      "I'm thinking about a career change. Help me get clear.",
      "What am I qualified for, and what does it pay?",
      "Build my Career Clarity Report",
    ],
    browsing: true,
  },
  "achievement-interviewer": {
    title: "ClearCareer AI Achievement Interviewer",
    description: "Upload your resume, then talk it through in voice mode. It asks one question at a time until every role has numbers on it, then writes your bullets and 8 professional summaries.",
    starters: [
      "Here's my resume. Start my achievement interview.",
      "Start my achievement interview. Use my Voice Interview Brief.",
      "Rebuild my profile",
      "Write my bullets and professional summaries",
    ],
    browsing: false,
  },
  "job-match-rubric": {
    title: "ClearCareer Job Match Scorer",
    description: "Paste a job posting and get a 100-point score on your real chances, the proof to lead with, your gaps, and a tailored summary.",
    starters: [
      "Score this job posting against my profile",
      "Rank these 5 jobs for me",
      "Am I a good fit for this role?",
      "Tailor my application for this job",
    ],
    browsing: true,
  },
  "job-search-autopilot": {
    title: "ClearCareer Job Search Autopilot",
    description: "Turns your Master Career Profile into daily scheduled job searches that find, verify and score new roles you have the best shot at.",
    starters: [
      "Set up my daily job search",
      "Build my target company list",
      "Write my scheduled job scout prompt",
      "Update my job search with new target titles",
    ],
    browsing: true,
  },
  "job-alerts-setup": {
    title: "ClearCareer Job Alerts Setup",
    description: "Builds copy-paste LinkedIn, Google and Indeed job alerts from your target titles and walks you through saving each one.",
    starters: [
      "Set up my LinkedIn job alerts",
      "Set up Google Alerts for my target companies",
      "Build my job alert pack",
      "My alerts are sending junk. Fix them.",
    ],
    browsing: true,
  },
};

const PLATFORM = {
  chatgpt: {
    DOC: "a Canvas document",
    VOICE_STEPS:
      "on the ChatGPT app, open this same chat and tap the voice icon (sound wave) at the right of the message box. If voice isn't offered inside this GPT on their plan or device, tell them to use the microphone button to dictate each answer instead; it works just as well.",
    SCHEDULE_STEPS:
      "ChatGPT scheduled tasks don't run inside GPTs or voice chats. Tell the user to open a new normal ChatGPT chat (not this GPT), paste the Daily Job Scout prompt, and put this line on top: \"Run this every weekday at [time] [time zone].\" ChatGPT confirms and creates the task. They manage it from Scheduled (or \"See scheduled tasks\" in the chat menu), and should turn on notifications in the ChatGPT app. Repeat for each weekly prompt with its own schedule line. Most plans cap active tasks, so 4 is plenty.",
    instructionsFile: "instructions.md",
    limit: 8000,
  },
  gemini: {
    DOC: "a Canvas document (or a Google Doc)",
    VOICE_STEPS:
      "in the Gemini app, tap the Live icon (sound wave) to start Gemini Live. If Live isn't offered inside this Gem, tell them to use the microphone button to dictate each answer instead; it works just as well.",
    SCHEDULE_STEPS:
      "Gemini scheduled actions are created from a normal Gemini chat (they may not run from inside a Gem). Tell the user to open a new Gemini chat, paste the Daily Job Scout prompt, and put this line on top: \"Do this every weekday at [time].\" Gemini confirms and turns on the scheduled action. They manage it under Settings and help > Scheduled actions on the web, or the profile menu in the app. Up to 10 can be active. Some plans prepare results a few hours early, so schedule a little ahead.",
    instructionsFile: "gem-instructions.md",
    limit: Infinity,
  },
};

const BANNED = [
  "comprehensive", "facilitate", "innovative", "impactful", "nuanced", "resonated",
  "substantive", "compelling", "leverage", "synergy", "results-driven", "detail-oriented",
];

const errors = [];
const read = (p) => fs.readFileSync(p, "utf8");
const write = (p, s) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, s);
};
const rmrf = (p) => fs.rmSync(p, { recursive: true, force: true });

// Which shared files does a text mention? (e.g. "references/question-bank.md" or "question-bank.md")
const sharedFiles = fs.readdirSync(SHARED).filter((f) => f.endsWith(".md"));
function mentionedShared(text) {
  return sharedFiles.filter((f) => text.includes(f));
}

// ---------- 1. Claude skills ----------
for (const skill of Object.keys(SKILLS)) {
  const dir = path.join(SUITE, "claude", skill);
  const skillMd = path.join(dir, "SKILL.md");
  if (!fs.existsSync(skillMd)) {
    errors.push(`Missing ${skillMd}`);
    continue;
  }
  const text = read(skillMd);
  if (!/^---\nname: [a-z0-9-]+\ndescription: .+\n---/m.test(text)) {
    errors.push(`${skill}: SKILL.md frontmatter needs name and description`);
  }
  const refs = [...text.matchAll(/references\/([a-z0-9-]+\.md)/g)].map((m) => m[1]);
  rmrf(path.join(dir, "references"));
  for (const ref of new Set(refs)) {
    const src = path.join(SHARED, ref);
    if (!fs.existsSync(src)) {
      errors.push(`${skill}: references/${ref} has no shared/${ref}`);
      continue;
    }
    write(path.join(dir, "references", ref), read(src));
  }
}

// ---------- 2 + 3. ChatGPT and Gemini ----------
for (const [platform, cfg] of Object.entries(PLATFORM)) {
  for (const [skill, meta] of Object.entries(SKILLS)) {
    const dir = path.join(SUITE, platform, skill);
    rmrf(dir);
    const condensedPath = path.join(CONDENSED, `${skill}.md`);
    if (!fs.existsSync(condensedPath)) {
      errors.push(`Missing ${condensedPath}`);
      continue;
    }
    let body = read(condensedPath);
    for (const [key, value] of Object.entries(cfg)) {
      if (typeof value === "string") body = body.replaceAll(`{{${key}}}`, value);
    }
    const leftover = body.match(/\{\{[A-Z_]+\}\}/);
    if (leftover) errors.push(`${platform}/${skill}: unfilled placeholder ${leftover[0]}`);
    if (body.length > cfg.limit) {
      errors.push(`${platform}/${skill}: instructions are ${body.length} chars (limit ${cfg.limit})`);
    }
    write(path.join(dir, cfg.instructionsFile), body);

    const knowledge = mentionedShared(body);
    for (const f of knowledge) write(path.join(dir, "knowledge", f), read(path.join(SHARED, f)));

    const product = platform === "chatgpt" ? "GPT" : "Gem";
    const setup = [
      `# Setup: ${meta.title} (${platform === "chatgpt" ? "ChatGPT Custom GPT" : "Gemini Gem"})`,
      "",
      platform === "chatgpt"
        ? "1. In ChatGPT, open **Explore GPTs > Create** (or go to chatgpt.com/gpts/editor) and choose the **Configure** tab."
        : "1. In Gemini on the web, open **Gems manager > New Gem** (sometimes under Explore Gems).",
      `2. **Name:** ${meta.title}`,
      `3. **Description:** ${meta.description}`,
      `4. **Instructions:** paste everything in \`${cfg.instructionsFile}\`.`,
      `5. **Knowledge:** upload every file in the \`knowledge/\` folder (${knowledge.join(", ")}).`,
      platform === "chatgpt"
        ? `6. **Conversation starters:**\n${meta.starters.map((s) => `   - ${s}`).join("\n")}`
        : `6. **Suggested first messages to share with members:**\n${meta.starters.map((s) => `   - ${s}`).join("\n")}`,
      platform === "chatgpt"
        ? `7. **Capabilities:** turn on Canvas${meta.browsing ? ", Web Search" : ""}. Code Interpreter is optional (helps read PDF resumes and check math).`
        : `7. Save the Gem. Gemini uses Google Search automatically when needed${meta.browsing ? " (this one needs it for live research)" : ""}. Use Canvas for the documents.`,
      `8. Test it with a sample resume, then share the ${product} link with members.`,
      "",
      "Members can paste their Master Career Profile (or its JSON export) into any ClearCareer tool so they never repeat themselves.",
      "",
    ].join("\n");
    write(path.join(dir, "setup.md"), setup);
  }
}

// ---------- 4. Lint ----------
function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return d.name === "dist" ? [] : walk(p);
    return p.endsWith(".md") ? [p] : [];
  });
}
for (const file of walk(SUITE)) {
  const rel = path.relative(SUITE, file);
  const lines = read(file).split("\n");
  lines.forEach((line, i) => {
    if (/[–—]/.test(line)) errors.push(`${rel}:${i + 1} has an em or en dash`);
    // Banned words may appear only where we tell the model not to use them.
    if (/writing-rules\.md$/.test(file)) return;
    if (/\b(ban|banned|never|no |not |don't|avoid)/i.test(line)) return;
    for (const w of BANNED) {
      if (new RegExp(`\\b${w}\\b`, "i").test(line)) errors.push(`${rel}:${i + 1} uses banned word "${w}"`);
    }
  });
}

if (errors.length) {
  console.error(`Build failed with ${errors.length} problem(s):`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}

// ---------- 5. Zip ----------
rmrf(DIST);
fs.mkdirSync(DIST, { recursive: true });
const readme = path.join(SUITE, "README.md");
for (const platform of ["claude", "chatgpt", "gemini"]) {
  const out = path.join(DIST, `clearcareer-career-suite-${platform}.zip`);
  execFileSync("zip", ["-rqX", out, "."], { cwd: path.join(SUITE, platform) });
  if (fs.existsSync(readme)) execFileSync("zip", ["-qjX", out, readme]);
}
console.log("Built career suite:");
for (const f of fs.readdirSync(DIST)) {
  console.log(`  dist/${f} (${Math.round(fs.statSync(path.join(DIST, f)).size / 1024)} KB)`);
}

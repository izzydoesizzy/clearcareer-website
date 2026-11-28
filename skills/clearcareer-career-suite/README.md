# ClearCareer Career Suite

Five AI tools that take someone from "here's my resume" to "here are the 3 jobs I should apply to today", with every achievement quantified along the way. Built for ClearCareer members. Works in Claude, ChatGPT and Gemini.

## The five tools, in order

| # | Tool | What it does | Time |
|---|---|---|---|
| 1 | **Career Clarity** (`career-clarity`) | Upload your resume, answer a short intake. Get 5 target titles with fit scores, what they pay, your negotiation numbers, a reality check and resume feedback. | 15 to 20 min |
| 2 | **AI Achievement Interviewer** (`achievement-interviewer`) | Quick text scan, then a voice-mode interview that drills into every role until it has numbers on it. Keeps a living Master Career Profile. Writes your bullets, 8 professional summaries, headlines and skills section. | 2 to 3 voice sittings of 20 to 45 min |
| 3 | **Job Match Scorer** (`job-match-rubric`) | Paste any job posting. Get a 100-point score on your real chances, the proof to lead with, gaps, and a tailored summary. | 2 min per job |
| 4 | **Job Search Autopilot** (`job-search-autopilot`) | Turns your profile into scheduled daily and weekly job searches that find, verify and score new roles. | 15 min setup |
| 5 | **Job Alerts Setup** (`job-alerts-setup`) | Copy-paste LinkedIn, Google and Indeed alerts built from your titles, with click-by-click steps. | 20 min setup |

Everything connects through the **Master Career Profile**: one living document with every role, achievement, number and the reasoning behind it, plus a JSON block at the bottom that any of the tools can read. Copy it into any tool so you never repeat yourself.

## How numbers are handled

The interviewer never lets "I don't know" end a question. It walks down an estimation ladder (exact, rough, order of magnitude, range, derive it, pick the conservative lower bound) and uses simple impact math (people x frequency x time saved x weeks). The agreed number goes on your resume as a plain, confident figure. The reasoning behind it is saved in your profile's Interview Defense Sheet so you can explain it if anyone asks.

## Install

### Claude
- **Claude Code or the Claude desktop app with skills:** unzip `clearcareer-career-suite-claude.zip` and copy the five folders into `~/.claude/skills/` (or your project's `.claude/skills/`). Each folder holds a `SKILL.md` and a `references/` folder. Type `/achievement-interviewer` or just ask, for example "interview me about my resume".
- **Claude.ai:** upload each skill folder (zipped individually) under Settings > Capabilities > Skills, if skills are available on your plan. Or create a Project, paste the SKILL.md into the project instructions, and add the `references/` files as project knowledge.

### ChatGPT
Unzip `clearcareer-career-suite-chatgpt.zip`. Each folder is one Custom GPT. Follow its `setup.md`: paste `instructions.md`, upload the `knowledge/` files, add the conversation starters, turn on Canvas and Web Search.

### Gemini
Unzip `clearcareer-career-suite-gemini.zip`. Each folder is one Gem. Follow its `setup.md`: paste `gem-instructions.md` and upload the `knowledge/` files.

## Editing (for ClearCareer)

- The method lives in `shared/` (one copy of every playbook, rubric and template) and `shared/condensed/` (the short instruction versions for GPTs and Gems).
- The Claude skills are in `claude/<skill>/SKILL.md`.
- After any edit, run `node scripts/build-career-suite.mjs` from the website repo root. It copies the shared files into every platform folder, fills in the platform-specific steps, checks for em dashes, banned words and the ChatGPT 8,000-character limit, and rebuilds the zips in `dist/`.
- Don't edit `claude/*/references/`, `chatgpt/` or `gemini/` by hand: the build overwrites them.

## Sources this was built from

The interview method comes from the ClearCareer Achievement Interviewer app (quantification engine, interviewer prompt, scan questions, completeness scoring). The clarity report comes from the Clarity Audit and the Career Exploration Framework. Writing rules come from the ClearCareer resume prompt library, the resume rubric and the brand guide. The match rubric builds on the ATS optimizer, Break Down Job Descriptions, the job-postings fit score and the Daily Scout prompts.

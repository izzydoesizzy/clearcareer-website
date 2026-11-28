# ClearCareer Career Suite

Six AI tools that take someone from "here's my resume" to "here are the 3 jobs I should apply to today", with every achievement quantified along the way. Built for ClearCareer members. Works in Claude, ChatGPT and Gemini.

## The six tools, in order

The full step-by-step order (and where to start for different situations) is in `shared/career-suite-guide.md`, which ships inside every download.

| Step | Tool | What it does |
|---|---|---|
| 1 | **Career Clarity: Quick Start** (`career-clarity`) | Resume plus 5 questions. Working titles, rough pay, resume feedback. |
| 2 | **AI Achievement Interviewer** (`achievement-interviewer`) | Quick text scan, then a voice interview until every role has numbers. Master Career Profile, bullets, 8 summaries. |
| 3 | **Career Clarity: Full Report** (`career-clarity`) | With the quantified profile: final 5 titles, deep-research pay for their city, 20 to 30 target companies. |
| 4 | **Summary Refresh** (`achievement-interviewer`) | Summaries and bullet order tuned to the final titles. |
| 5 | **LinkedIn Profile Builder** (`linkedin-profile-builder`) | Headline, About, experience, skills, Open to Work, ready to paste. |
| 6 | **Job Alerts Setup** (`job-alerts-setup`) | LinkedIn, Google and Indeed alerts with click-by-click steps. |
| 7 | **Job Search Autopilot** (`job-search-autopilot`) | Scheduled daily and weekly searches scored with the 100-point rubric. |
| 8 | **Job Match Scorer** (`job-match-rubric`, ongoing) | Any posting scored out of 100, with proof, gaps and a tailored summary. |

Clarity runs twice on purpose: a quick pass gives the interview something to aim at, and the full pass uses the quantified evidence for sharper titles, pay and companies.

Everything connects through the **Master Career Profile**: one living document with every role, achievement, number and the reasoning behind it, plus a JSON block at the bottom that any of the tools can read. Copy it into any tool so you never repeat yourself.

## How numbers are handled

The interviewer never lets "I don't know" end a question. It walks down an estimation ladder (exact, rough, order of magnitude, range, derive it, pick the conservative lower bound) and uses simple impact math (people x frequency x time saved x weeks). The agreed number goes on your resume as a plain, confident figure. The reasoning behind it is saved in your profile's Interview Defense Sheet so you can explain it if anyone asks.

## Downloads and install

Buyers download from the Stripe-gated page `/tools/career-suite/access` (sales page: `/tools/career-suite`). Every tool comes in three formats:

| Platform | File | Install |
|---|---|---|
| Claude | `dist/claude/<tool>.zip`: one skill folder with `SKILL.md` and `references/` | Upload the zip as a skill in Claude settings, or unzip into `~/.claude/skills/` for Claude Code |
| ChatGPT | `dist/chatgpt/<tool>.zip`: `instructions.md`, `knowledge/`, `setup.md` | Create a Custom GPT per tool, following `setup.md` |
| Gemini | `dist/gemini/<tool>.zip`: `gem-instructions.md`, `knowledge/`, `setup.md` | Create a Gem per tool, following `setup.md` |

Each platform also has an all-in-one zip: `dist/<platform>/clearcareer-career-suite-<platform>-all.zip`.

## Website setup (one time)

1. In Stripe, create a product "The Career Suite" with a one-time price (the sales page shows the price set in `src/data/career-suite.ts`, so keep them matching).
2. Add `STRIPE_CAREER_SUITE_PRICE_ID` to the Vercel environment variables.
3. For Land and Level Up members, create a 100% off promotion code in Stripe and share it in the community. Free checkouts get the same access page and email.
4. The existing Stripe webhook (`/api/vault/webhook`) sends the delivery email. No new webhook needed.

## Editing (for ClearCareer)

- The method lives in `shared/` (one copy of every playbook, rubric and template) and `shared/condensed/` (the short instruction versions for GPTs and Gems).
- The Claude skills are in `claude/<skill>/SKILL.md`.
- After any edit, run `node scripts/build-career-suite.mjs` from the website repo root. It copies the shared files into every platform folder, fills in the platform-specific steps, checks for em dashes, banned words and the ChatGPT 8,000-character limit, and rebuilds the zips in `dist/`. Commit the rebuilt `dist/`: the website serves those exact files.
- Don't edit `claude/*/references/`, `chatgpt/` or `gemini/` by hand: the build overwrites them.

## Sources this was built from

The interview method comes from the ClearCareer Achievement Interviewer app (quantification engine, interviewer prompt, scan questions, completeness scoring). The clarity report comes from the Clarity Audit and the Career Exploration Framework. Writing rules come from the ClearCareer resume prompt library, the resume rubric and the brand guide. The match rubric builds on the ATS optimizer, Break Down Job Descriptions, the job-postings fit score and the Daily Scout prompts.

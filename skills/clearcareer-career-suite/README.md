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

## How it's sold and delivered

The Career Suite is part of the site's product system (`src/data/product-config.ts`, slug `career-suite`):

- **Sold on its own** at `/products/career-suite` for $47 CAD (live Stripe price `price_1Uge1zH8o32Pij57oewNOxw2`, set as `stripePriceId`; `STRIPE_CAREER_SUITE_PRICE_ID` in Vercel overrides it).
- **Free for Land and Level Up members** through the `llu-toolkit` product, which includes it.
- Buyers and members open it in the access hub at `/products/career-suite/access/<token>`. `src/lib/product-files.ts` reads the files straight from this folder at build time and zips them on request:
  - `claude/<tool>/` becomes one Claude skill zip per tool
  - `chatgpt/` and `gemini/` become one zip each (a Custom GPT or Gem per tool, with `setup.md`)
  - `shared/career-suite-guide.md` becomes the product's Start Here
- Delivery emails go through Brevo (`src/lib/purchase-emails.ts`). $0 checkouts from a 100% promotion code count as purchases.
- Test code: `SUITETEST100` (100% off, 5 uses, this product only). Deactivate it in Stripe once testing is done.

## Editing (for ClearCareer)

- The method lives in `shared/` (one copy of every playbook, rubric and template) and `shared/condensed/` (the short instruction versions for GPTs and Gems).
- The Claude skills are in `claude/<skill>/SKILL.md`.
- After any edit, run `node scripts/build-career-suite.mjs` from the website repo root. It copies the shared files into every platform folder, fills in the platform-specific steps, checks for em dashes, banned words and the ChatGPT 8,000-character limit, and builds local zips in `dist/` (ignored by git; the website zips the files itself). Commit the rebuilt platform folders.
- Don't edit `claude/*/references/`, `chatgpt/` or `gemini/` by hand: the build overwrites them.

## Sources this was built from

The interview method comes from the ClearCareer Achievement Interviewer app (quantification engine, interviewer prompt, scan questions, completeness scoring). The clarity report comes from the Clarity Audit and the Career Exploration Framework. Writing rules come from the ClearCareer resume prompt library, the resume rubric and the brand guide. The match rubric builds on the ATS optimizer, Break Down Job Descriptions, the job-postings fit score and the Daily Scout prompts.

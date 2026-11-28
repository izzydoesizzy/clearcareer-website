# ClearCareer digital product catalogue

Everything you've built across the website, `clearcareer-client-manager` and `clearcareer-ops`, sorted into
what can be sold, how ready it is, and what it needs first. Prices are CAD.

**Legend**
- **Ready**: finished and buyer-facing. Needs only a voice and formatting pass.
- **Rework**: the method is solid, but it's written for you as the coach, still has ChatGPT leftovers, or is a draft.
- **Build**: the idea and source material exist, but there's no product yet.
- **Client data**: has real names or private details. Scrub it or don't sell it.

---

## 1. First release (being built now)

| Product | Price | Status | Main sources |
|---|---|---|---|
| **Career Prompt Vault** (6 Claude skills + 50 copy-paste prompts) | $9 | Rework: the 50 prompts are good, but say "Best with ChatGPT 3.5" and still have coach-only notes | website `public/downloads/nova/prompts/*`; client-manager `content/products/nova/*`, `content/prompts/master-prompts.json` |
| **Achievement Interviewer** (inside the Vault's resume skill) | included | Build, from a finished voice-agent script | client-manager `content/prompts/retell-intake-agent.md`, `packages/core/src/ai/achievement-generator.ts` |
| **Salary Number Generator** (guide + skill) | $9 | Ready (the guide); Build (the skill) | website `src/data/salary-generator-guides/`; client-manager `content/lead-magnets/prompt-pack-salary-research.md` |
| **Outreach and Email Templates** (60+ templates + skill + "Land an Interview in 1 Week") | $19 | Ready to merge (a few em dashes) | Script Vault guides 01, 02, 04; `cold-outreach-pack`; ops `courses/Complete SOP…md` (emails, about L2282–2435); ops `marketing/email_copy/land-an-interview-mini-course.md`; client-manager `content/resources/networking/18-ways-to-add-value.md`, `conference-icebreakers.md` |
| **Interview Confidence Kit** (5 guides + prep package + skill) | $19 | Ready (guides); Rework (the SOP interview package is coach-voiced) | website `src/data/interview-confidence-guides/`; Script Vault 05; ops SOP about L3836–4212; client-manager `content/lead-magnets/guide-tell-me-about-yourself.md` |
| **Salary Negotiation Scripts and Advice** (20+ scripts + advice guide + skill) | $29 | Ready to merge (three overlapping script sets) | Script Vault 03; client-manager `content/products/layoff-survival-kit/guides/06-salary-negotiation-scripts.md`; the Nova negotiation prompts |
| **Complete Job Search Toolkit** (bundle of all five, plus the rejection and resignation scripts) | $49 (worth $85) | Bundle | Script Vault 06 and 07 |

**Retire as standalone products (folded into the above):** Script Vault ($29, its checkout never worked) and the Cold Outreach Script Pack ($9, it duplicates Script Vault 01).

**Hidden for now (Nov 28, 2026):** all 11 older shop products below (the 4 free downloads and the 7 paid ones). Their pages redirect to /shop and they're off the shop; past buyers' links still work. How to bring one back: `src/pages/products/_hidden/README.md`.

**Layoff Survival Kit:** stays on sale, now **$9** (was $67). The checkout charges $9 directly, so the old $67 Stripe price is no longer used.

---

## 2. Second pass: existing products that need a refresh

| Product | Price now | What it needs | Source |
|---|---|---|---|
| Layoff Survival Kit (on sale) | $9 (was $67) | Already polished. Add a "Layoff Coach" skill (severance questions, runway, first-72-hours plan). Very Canadian, so say that on the page. | website `src/data/layoff-kit-guides/`; client-manager `content/products/layoff-survival-kit/` |
| Job Search Emotional Survival Kit | $24 | Ready. Check the disclaimers and crisis lines. | `emotional-survival-kit` (8 guides, about 13,000 words) |
| ADHD line (4 products) | $9 to $57 | Merge into 2: a $9 cheat sheet and focus kit, and a $47 ADHD Command Center that includes career change. Add a non-medical disclaimer to every guide. | `adhd-cheat-sheet`, `adhd-focus-kit`, `adhd-command-center`, `adhd-career-change` |
| Career Change Command Center | $47 | Ready. Heavy on tables, so a worksheet edition (Google Sheets) would add value. Shares a runway guide with three other products. | `career-change-command-center` (7 guides) |
| Over-40 Career Toolkit | $47 | Ready. Partly Canadian. | `over-40-toolkit` (6 guides) |
| LinkedIn Detox | $9 | Ready. | `linkedin-detox` |

The 11 shop products can't be bought today: their buy buttons point at a checkout box that isn't on the page. Fixing that is part of the first release.

---

## 3. Second pass: new products to build

### Claude skills (these build on your internal coach skills, rewritten so a job seeker can run them alone)
| Product idea | Suggested price | Status | Source (client-manager unless noted) |
|---|---|---|---|
| LinkedIn Profile Audit (3 tiers: quick score, full audit, replacement copy) | $19 | Rework | `.claude/skills/linkedin/linkedin-audit*`, `packages/core/src/services/linkedin-audit-service.ts`, `content/rubrics/linkedin-rubric.json` |
| Resume Self-Review (score against your rubric, then fixes) | $19 | Rework | `content/rubrics/resume-rubric.json`, `packages/core/src/services/resume-feedback-service.ts` |
| Career Clarity Audit (target titles plus salary anchor, target and walk-away) | $19 | Rework | `.claude/skills/market-research/clarity-audit`, `packages/core/src/services/audit-service.ts` |
| Company Deep Dive (research a target company before outreach or an interview) | $9 | Rework (needs web search) | `.claude/skills/deep-research/company-deep-dive`, `company-scorecards-deep` |
| Interview Dossier (a 15 to 20 page prep pack for one interview) | $29 | Rework (some of it is hardcoded for one role type) | `.claude/skills/reports/interview-prep-pdf`, `packages/core/src/services/interview-prep-service.ts` |
| Weekly Job Search Review | $9 or a bundle bonus | Rework | `.claude/skills/coaching/weekly-progress-review` |
| Job Titles Explorer (alternative titles, with real postings) | $9 | Rework | `.claude/skills/reports/job-titles-report`, `job-postings-report` |

### Courses, challenges and ebooks
| Product idea | Suggested price | Status | Source (ops unless noted) |
|---|---|---|---|
| 8-Day Career Kickstart Challenge (email course) | Free lead magnet or $7 | Ready. Remove the Slack references and tracking links. | `marketing/email_copy/email-course-8day-challenge.md` |
| Quest for Career Clarity (3-day challenge) | Free lead magnet | Ready. **Client data:** success stories name Marsha, Jorge, Haddie, Courtenay and Blake, so check consent. | `marketing/email_copy/questforcareerclarity.md` |
| Make It Count (ebook: turn skills into numbers) | $9 to $19 | Rework. The 4 worksheets are named but not built, and the download link is broken. | `resources/documents/makeitcount_ebook.md` |
| LinkedIn Ignition (video scripts for each profile section) | Course module | Draft. Hype-heavy, and some lessons are unfinished. | `courses/job_search_ignition_system_2024/linkedin-ignition-system.md` |
| Job Search Ignition self-study course (4 modules, 10 parts, with checklists) | $97 to $197 | Outline ready, so it could become a workbook | `courses/job_search_ignition_system_2024/job_search_ignition_system-course-structure-2024.md` |

### Trackers and templates
| Product idea | Suggested price | Status | Source |
|---|---|---|---|
| Job Search Tracker (Google Sheets: outreach, applications, interview prep, offers, weekly goals) | $9 or a bundle bonus | Build | ops SOP 5-tab spec (about L3630–3709); ops `courses/job_search_ignition_system_2024/tasks.json` (about 87 tasks) |
| Get Your Employer to Pay (professional development approval request) | Free or a bonus | Ready | client-manager `content/resources/professional-development-approval-request.md` |

### Lists and guides (good lead magnets, or bundle bonuses)
| Asset | Status | Source (client-manager) |
|---|---|---|
| 2026 Canada Salary Guide (50 roles) | Ready, data from April 2026 | `content/resources/lead-magnets/2026-salary-guide-canada.md` |
| 40 Hidden Job Titles Paying $100K+ | Ready | `content/resources/lead-magnets/hidden-job-titles-100k.md` |
| 194+ Canadian Remote Companies | Ready | `content/resources/lead-magnets/canadian-remote-companies.md` |
| LinkedIn Boolean Search Cheat Sheet (30 strings) | Ready | `content/resources/lead-magnets/linkedin-boolean-cheat-sheet.md` |
| LinkedIn Stealth Update Guide | Ready | `content/resources/linkedin-stealth-update-guide.md` |
| Resume Bullet Points guide (XYZ formula, 20 before/after) | Ready | `content/lead-magnets/guide-resume-bullet-points.md` |
| Professional Summary guide | Ready | `content/lead-magnets/guide-professional-summary.md` |
| Free AI job search prompt pack (15 prompts) | Ready. Its call to action points to the old $2,497 program, so update it. | `content/lead-magnets/prompt-pack-ai-job-search.md` |
| Tools for Job Seekers directory (51 tools) | Ready | `content/resources/tools/Tools for Job Seekers Database…csv` |

**These free downloads don't send right now.** The 4 free shop products (ADHD cheat sheet, scorecard, rejection cards, ghost job checklist) tell people to check their email, but the subscribe endpoint doesn't know them, so nothing goes out.

---

## 4. Needs a decision before selling
- **Military-to-Civilian Career Transition Guide** (client-manager `Military-to-Civilian-Career-Transition-Guide.docx`). It's co-branded "ClearCareer × Soldiers in Tech", so confirm you have the rights to sell it alone.
- **A coach-facing product line** (a different audience, so a different brand page):
  - "Monetize Your Magic" (ops `business_assets/01`–`07`)
  - Coaches' Custom-GPT Prompt Library, 20 GPTs (ops `resources/business__ai_prompts.md`)
  - 29 client-lifecycle email templates and contract templates (client-manager `content/templates/`)
  - The client-manager system itself (your capabilities doc prices a build at $10K to $25K)
- **38 "AI builder" tutorials** (ops `resources/workshops/*.md`). These are general AI skills, so they'd suit an "AI for career changers" add-on, but they're drafts.

---

## 5. Do not sell
- **Real client work:**
  - client toolkits: client-manager `docs/examples/`, `sources/carousels/ClearCareer — Client Manager.pdf`
  - `content/clients/`
  - client-named scripts in `scripts/`
  - ops `clients/`
- **Prospect emails** that include salary and other details: ops `marketing/email_copy/personal_emails.md`. Client-manager `content/sales/pdf/outplacement-*` names real prospects.
- **Community exports** with member names: ops `circlehtml.html`, `skoolhtml.html`.
- **Other creators' material:**
  - carousels in client-manager `sources/carousels/`
  - the link table of other creators' posts in the 2024 course notes
  - the third-party `ui-ux-pro-max` skill
- **Testimonial screenshots:** they're for sales pages only, with names and faces blurred as we already do.
- **Internal operations:** business strategy, cost exports, journals, and sales, ads and onboarding skills.

## 6. Things to fix across all products
1. **Overlap:**
   - three salary script sets (being merged in the first release)
   - four financial-runway guides (layoff, career change, ADHD career change, over-40): pick one master and link to it
   - four ADHD products (merge to two)
2. **Disclaimers:**
   - the ADHD, career change, Interview Confidence, Rejection Cards and Salary Generator guides have none
   - "Results vary" and "not legal or financial advice" where they apply
3. **US buyers:** most guides assume Canada. Add a short "In the US" box where the rules differ (severance, taxes, benefits).
4. **Calls to action:** older lead magnets still point to the $2,497 program. Point them to Land and Level Up.
5. **A missing file:** the client portal's "rapidfire" achievement questions (`packages/core/src/data/interview-questions.ts`) aren't in the repo, because every `data/` folder is gitignored. Copy them from your computer if you want them in a product.

---

## 7. Deep dive: the client-manager system (Nov 28, 2026)

The tools you built to deliver coaching, beyond the content folder. Paths are in `clearcareer-client-manager`.
Most of this is production code that already makes branded PDFs for clients, so it's closer to a product
than the prompt library was. Prices are suggestions.

### Audits (upload a resume or LinkedIn screenshots, get a scored report)
| Tool | What clients got | Where | Product idea |
|---|---|---|---|
| **Resume Review, 3 tiers** | Concise verdict, a 6-section diagnosis, or a full "Rewrite Guide" that quotes their resume and rewrites it | `packages/core/src/services/resume-feedback-service.ts`, `content/rubrics/resume-rubric.json`, skill `reports/resume-feedback` | Free snapshot / $19 audit / $39 rewrite guide (Claude skill or web tool) |
| **LinkedIn Audit, 3 tiers** (from screenshots) | Same ladder: verdict table, 5-section diagnosis, Rewrite Guide with 3 headlines, a full About and new bullets | `linkedin-audit-service.ts`, `content/rubrics/linkedin-rubric.json`, skills `linkedin/linkedin-audit*` | Free snapshot / $19 / $39 |
| **Career Clarity Audit** | 5 job titles to target (with fit %, salary, LinkedIn search links) plus anchor, target and walk-away numbers | `audit-service.ts`, skill `market-research/clarity-audit` | Free lead magnet (web tool), feeds everything else |

### Interviews
| Tool | What clients got | Where | Product idea |
|---|---|---|---|
| **Interview Prep Dossier** (your flagship) | 15 to 20 pages for one job: company intel and red flags, the people interviewing them, objection cards with talking points, a researched "tell me about yourself", 10 custom questions with answers, STAR-to-job matrix, salary positioning, questions to ask, tips | `interview-prep-service.ts` (company-specific), skill `reports/interview-prep-pdf` | $39 to $49 per interview, upsell from the Interview Kit |

### Search and strategy
| Tool | What clients got | Where | Product idea |
|---|---|---|---|
| **Live Job Postings Report** | Postings from the last 7 days, links checked, each scored /12 on a 6-part fit rubric (Apply / Consider / Skip) | `job-postings-report-service.ts`, skills `reports/job-postings-report`, `deep-research/job-market-scan` | $9 per scan or $19/month; the fit rubric alone is a free scorecard |
| **Target Company Scorecards** | 10 to 20 companies researched and scored | skill `market-research/company-scorecards-deep`, `target-companies-pdf-service.ts` | $29 |
| **Company Dossier** | Deep research on one company | skill `deep-research/company-deep-dive` | $19 |
| **Hidden Job Titles report** | 5 to 12 titles, one per page, with salary and LinkedIn searches | `job-titles-report-service.ts` | Fold into the Clarity Audit |
| **Search tools pack** | Boolean strings, 15 to 20 Google Alerts, a tracker, a daily action plan, an events list | `prompt-builder.ts` (#10 to #12), `placement-prompt-builder.ts` (#13, #15) | $9 pack or toolkit bonus |
| **Industry Pivot Report** | Industry analysis for career changers | skill `deep-research/industry-analysis` | $29 |

### Outreach
| Tool | What clients got | Where | Product idea |
|---|---|---|---|
| **Cold Outreach Campaign** | One real contact per target company, email pattern, a "notable work" hook, a short email each (8 opener patterns, banned phrases), one-click drafts, tracker | `outreach-campaign-service.ts`, skill `outreach/cold-outreach-campaign` | $29 builder; the email rules strengthen Outreach Templates now |

### Resume and LinkedIn writing (your strongest formats)
| Tool | Where | Product idea |
|---|---|---|
| **Achievement Mining**: the Experience Deep-Dive question bank with drill-downs, the achievement extractor and the fact-checker | portal `packages/web/src/components/portal/*`, `achievement-generator.ts`, `fact-check-service.ts`. **The question bank file is missing from git** (`packages/core/src/data/interview-questions.ts`, ignored by the `data/` rule): copy it from your computer | Workbook or web tool; the fact-checker becomes a step in every skill |
| **LinkedIn Launch Pack**: 10 pipe-style headlines, your 4-part About with emoji highlights, DM templates for 5 scenarios, 4 posts from their own stories, ready-made search links | `pipeline-service.ts` (about lines 376 to 695) | $19 pack, or an upgrade to the Vault's LinkedIn skill |
| **10 professional summaries** (with your few-shot examples) | `pipeline-service.ts` 308 to 374 | Upgrade to the Vault's resume skill |
| **First LinkedIn profile build guide** (new grads, veterans) | `client-guide-service.ts` 503 to 715 | $19 |

### Career transition and visuals
| Tool | Where | Product idea |
|---|---|---|
| Military-to-Civilian Transition Guide | `transition-guide-service.ts`, the .docx | $39 or a partner product; confirm rights with Soldiers in Tech. Clone the format for teachers, nurses and other career changers |
| LinkedIn banner generator (11 layouts) | `scripts/generate-linkedin-banner.ts` | Template pack or add-on |
| AI headshot prompts (15 styles) | `scripts/generate-headshots.ts`, `scripts/assets/headshot-favorites/FAVORITES.md` | Prompt pack. The reference images are from real client runs: keep private |

### Done for you, automated
- **Zero-touch placement funnel:** a form → an AI voice intake call ("Alex") → 15 deliverables → a "your toolkit is ready" email (`retell/*`, `placement-runner.ts`, `pipeline-service.ts`). A low-ticket automated offer, for example $97 to $297.
- **The Job Search Toolkit report**: the password-protected web report with copy buttons that clients received (`report-viewer.tsx`, `client-report-service.ts`).

### For other coaches (a separate audience)
Client portal with contract, payment and intake; the toolkit report viewer; 29 lifecycle emails; the Google Form intake automation; contract templates; the Fathom transcript pipeline; the "career to consultancy" launch kit and Voice Print. A white-label tool for coaches and outplacement firms.

### Fix before productizing
1. Copy the missing Experience Deep-Dive question bank into the repo.
2. The "generic" interview prep (role-type version) is hard-coded with one real client's details: make it generic first.
3. Named testimonials are built into the audit PDFs: confirm consent.
4. Pick one generator per asset (four systems make overlapping versions).
5. Prices and social-proof numbers disagree across files.

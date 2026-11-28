# Career Clarity Framework

Source material for the career-clarity skill. It combines the ClearCareer Clarity Audit (target titles and salary research) with the Career Exploration Framework (values, skills and options).

## A. Intake questions (ask in small groups of 2 to 3, never all at once)

Group 1: Where you are
1. What's your current or most recent title, and how long have you been doing this kind of work?
2. Are you employed, between roles, or about to be?
3. When do you need or want to land something?

Group 2: What you want more and less of
4. What parts of your work give you energy? What parts drain you?
5. If your next job had to be different from your last one in one big way, what would it be?
6. Any titles or roles you're curious about but haven't tried?

Group 3: Values (show the list, ask for their top 5 must-haves)
7. Pick the 5 that matter most right now.

Group 4: Skills
8. Name 5 skills you want to keep using, 5 you'd happily drop, and up to 5 you want to build.

Group 5: Logistics
9. Where are you located, and what works: remote, hybrid, onsite? Open to relocating?
10. Work authorization: any sponsorship needs?
11. Pay: your walk-away floor, and the number that would feel like a win.
12. Company size and stage: startup, mid-size, enterprise, public sector, any?
13. Industries you'd love, and industries you'd rule out.
14. Any dealbreakers (travel, commute, on-call, specific companies, management or not)?

If the client wants to go fast, ask only 1, 9, 11 and 13 and infer the rest from the resume. Say what you inferred so they can correct it.

## B. The values list (30)

Autonomy, Balance, Belonging, Challenge, Collaboration, Community impact, Competition, Creativity, Expertise, Financial security, Flexibility, Fun, Growth, Helping others, Independence, Influence, Innovation, Leadership, Learning, Mission, Prestige, Recognition, Remote work, Security and stability, Status, Structure, Teamwork, Variety, Wealth, Work-life balance

Sort into: Must-have (top 5), Nice to have, Not important. Then: "How many of your top 5 does your current or last job give you? ___ / 5". That number says how far the next move needs to go.

## C. Target titles (the Clarity Audit method)

Produce exactly 5 titles, each with 70%+ skills overlap with the resume:
- 2 **Direct** equivalents (what they already do, maybe named differently)
- 1 **Adjacent** (80%+ the same skills, different angle)
- 1 **Emerging or trending** (newer title for the same capabilities)
- 1 **Stretch** (next level up, or a bigger version of the role)

Rules:
- Real, searchable titles that return results on LinkedIn and Indeed. No company-internal titles.
- Viable path, not a career reinvention.
- Meaningful job volume (avoid titles with very few openings).
- Pay at or above the client's target where possible. Flag step-downs in level or pay.
- Respect titles the client named. Include them if they fit, and say honestly if they don't.

For each title:
- Fit % (skills overlap)
- Demand: High / Med / Low
- Type: Direct / Adjacent / Emerging / Stretch
- Salary range in local currency
- One sentence of resume evidence ("Your 4 years running onboarding for 120 accounts maps directly to...")
- Skills overlap table: Skill required | You have it? (Yes / Partial / Gap) | Evidence
- One simple LinkedIn search string, under 100 characters, no nested parentheses

## D. Salary snapshot (deep research, location-specific, never invented)

Pay numbers are only useful if they're for the client's actual market. A Marketing Manager in Toronto, Austin and London are three different numbers.

### 1. Lock the location first
Confirm before any research:
- City or metro area, province or state, and country (from the resume, then ask to confirm)
- Currency to report in
- Work arrangement: onsite, hybrid or remote. If remote, research both their local metro and the national remote range for their country, and note whether employers in that market adjust pay by location.
- Any cities they'd relocate to (research each one separately)
- Seniority level and years of experience, so the right band gets picked

### 2. Turn on deep research (recommended)
Before the salary step, tell the client in plain words:

> "For the most accurate pay numbers, switch on deep research. It digs through many more sources than a normal search and takes a few minutes. Here's how:"

- **Claude:** in this chat, turn on **Research** (in the tools or search menu below the message box), then send the Salary Deep Dive prompt below.
- **ChatGPT:** choose **Deep research** from the tools menu (the + or tools button by the message box). If it isn't offered inside the ClearCareer GPT, open a normal ChatGPT chat, turn on Deep research there, paste the Salary Deep Dive prompt, then paste the results back here.
- **Gemini:** pick **Deep Research** from the tools menu or mode picker. If it isn't offered inside the Gem, run it in a normal Gemini chat and paste the results back.

If deep research isn't on their plan, carry on with regular web search (at least 5 searches) and say the numbers came from a lighter search.

Menu names change. If the client can't find it, tell them to look for "Research", "Deep research" or a research icon near the message box.

### 3. The Salary Deep Dive prompt (fill in every bracket, give it in a code block)

```
Research current salary data for these roles in [City, Province/State, Country], reported in [currency]:
1. [Primary title] ([seniority], [X] years of experience)
2. [Title 2]  3. [Title 3]  4. [Title 4]  5. [Title 5]
Work arrangement: [onsite / hybrid / remote]. [If remote: also give the national remote range for [country] and say whether employers adjust pay by location.]
[If relocating: repeat for [City 2], [City 3].]

Use at least 6 different sources, including:
- Government wage data for this location ([US: BLS OEWS / Canada: Job Bank or Statistics Canada / UK: ONS ASHE / or the national statistics agency])
- Salary sites (Glassdoor, Payscale, Indeed Salaries, LinkedIn Salary, Levels.fyi for tech, Salary.com, Robert Half or Michael Page salary guides)
- Pay ranges posted in at least 5 live job postings for these titles in this location (many places now require posted ranges)

For every number give: source name, direct link, the location it covers, the date or year of the data, sample size if shown, and whether it's base salary or total pay. Keep base, bonus, commission and equity separate. Never blend them into one "salary".
Flag data older than 18 months, data for the wrong location, and sources that disagree by more than 20%.
Never estimate a figure without a source. If data for this exact location is thin, say so and use the nearest metro or the province/state, labeled clearly.

Output:
A. For the primary title: 25th, 50th, 75th and 90th percentile base salary, and typical bonus or variable pay.
B. For each other title: a base range and median, with sources.
C. A source table: Source | Location covered | Date | Base range | Median | Base or total | Link
D. A table of live postings: Company | Title | Posted range | Link
E. Notes on what pushes pay up or down for this role in this market (industry, company size, certifications, remote vs onsite).
```

### 4. What goes in the report

**Primary title, [City]:**

| Percentile | Base salary ([currency]) |
|---|---|
| 25th | |
| 50th (median) | |
| 75th | |
| 90th | |

Typical bonus or variable pay: ___

**Source comparison** (at least 4 rows, every row linked):

| Source | Location covered | Date | Base range | Median | Link |
|---|---|---|---|---|---|

**What employers are posting right now** (3 to 5 live postings with pay ranges):

| Company | Title | Posted range | Link |
|---|---|---|---|

**All 5 target titles:** add the sourced range to each title's row in the Job Titles table, with a link.

**Your negotiation numbers**, each with a one-sentence reason tied to the data and the client's experience:
- **Anchor** (opening ask): usually near the 75th percentile for a strong match
- **Target:** what a great outcome looks like for their level
- **Walk-away:** their floor, checked against the 25th percentile

Rules:
- Every figure has a source link next to it. No link, no number.
- Say which location every figure covers. If a figure is national or for a nearby metro, label it that way.
- Keep base, bonus and equity separate.
- If the client's pay floor or target is far from the market, say so kindly and plainly.
- Keep the salary section tight: tables first, under 300 words of commentary.
- If no web search or research is available at all, say so and give them the Salary Deep Dive prompt to run elsewhere. Never fill the tables with guesses.

## E. Reality check (score each target title and any option the client raised)

| Option | Values fit (1 to 5) | Skills match (1 to 5) | Practical viability (1 to 5) | Total /15 |
|---|---|---|---|---|

Viability = could they realistically land it within 6 to 18 months? Anything 12+ is a strong option. Under 9 needs a test first.

## F. What's holding your resume back (6 areas)

Give each a verdict: Needs Attention / Mixed Signals / Good Foundation / Strong, with one sentence of why.

1. **First impressions and visual clarity:** clean layout, scannable, right length (1 page under 10 years, up to 2 above)
2. **Story and positioning:** a clear target, a summary that says who they are and what they deliver
3. **Achievements vs. responsibilities:** numbers, strong verbs, results, not duty lists
4. **Keywords and ATS:** target-role keywords present, standard headings, parseable
5. **Career narrative and trajectory:** growth is visible, gaps and moves make sense
6. **Language and presence:** no filler ("responsible for", "helped"), no clichés ("results-driven"), confident tone

Don't rewrite the resume here. Point to the fix and send them to the achievement interview, which is where the rewrite happens.

## G. Test before you commit (for career changers or anyone unsure)

For any option scored under 12: an informational interview with someone in the role, a small freelance or volunteer project, a short course, or an industry event. The key question: "Do I enjoy doing this work, or do I just enjoy the idea of doing this work?"

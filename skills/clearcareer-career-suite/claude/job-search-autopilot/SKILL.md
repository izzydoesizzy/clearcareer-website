---
name: job-search-autopilot
description: ClearCareer Job Search Autopilot. Use when the user wants AI to search for jobs for them every day, set up a recurring or scheduled job search, get a daily list of roles they'd be a strong fit for, check target companies for openings, or automate their job hunt in Claude, ChatGPT or Gemini. Builds a search spec from the Master Career Profile, writes self-contained scheduled-task prompts that find, verify and score new postings with the 100-point rubric, and walks the user through scheduling them.
---

# Job Search Autopilot

You set up recurring searches that surface only the roles the client has the best real chance of getting an interview for. Every run finds fresh postings, checks they're live, scores them with the ClearCareer rubric and hands back the top 3 to apply to today.

## Reference files
- `references/match-rubric.md`: the scoring rubric each run uses.
- `references/job-search-strings.md`: title clusters, LinkedIn, Google X-ray and target company strings.
- `references/scheduling-guide.md`: the recommended schedule and how to schedule tasks in Claude, ChatGPT and Gemini.
- `references/master-career-profile-template.md`: the profile JSON the prompts embed.
- `references/daily-scout-template.md`: the scheduled-task prompt templates.

## Step 1: Load the profile
Ask for the Master Career Profile or its JSON export. If they don't have one, ask for the resume and the essentials: target titles, location and arrangement, pay floor and target, industries in and out, dealbreakers, work authorization. Recommend running the `achievement-interviewer` first: better numbers mean better matching.

## Step 2: Build the Search Spec (show it to the client and confirm)
1. **Title clusters:** 2 to 4 clusters (Direct, Adjacent, Stretch) from target and alternative titles.
2. **Search strings** per cluster: one LinkedIn string, Google X-ray strings for Greenhouse, Lever, Ashby and Workday, one Indeed string. Keep each to 2 to 4 titles.
3. **Filters:** locations, remote or hybrid, seniority, pay floor, exclusions, dealbreakers.
4. **Target company list:** ask if they have one. If not, build 20 to 30 companies that fit their industry, size, location and values (name, why it fits, careers page link). Use web search and never invent companies or links.
5. **Proof library:** the top 8 to 10 quantified achievements and the 2 best summaries from the profile. If the profile has fewer than 5 quantified achievements, use the strongest resume bullets, tell the client matching will be weaker, and recommend finishing the achievement interview.

## Step 3: Write the scheduled-task prompts
Fill in the Daily Job Scout template completely, then the three weekly prompts. Each prompt must stand completely on its own, because a scheduled run has no memory of this chat.

Put each finished prompt in its own code block so it's easy to copy.

Use the templates in `references/daily-scout-template.md`: the Daily Job Scout (full prompt with search, verification, the rubric and report format), the Weekly Target Company Sweep, the Weekly Market Expansion Scout, and the Friday Scorecard Check-in.

## Step 4: Schedule them
Ask for their platform and time zone. Then follow `scheduling-guide.md`:
- **Claude:** if a scheduling tool is available in this conversation, offer to create the tasks directly (confirm times first). Otherwise give the Scheduled > New task steps.
- **ChatGPT:** open a new normal chat (scheduled tasks don't run inside GPTs or voice), paste the prompt with "Run this every weekday at [time] [time zone]" on top.
- **Gemini:** paste into a normal Gemini chat with "Do this every weekday at [time]" on top. Manage under Settings and help > Scheduled actions.

Recommend: Daily Scout weekdays 7:45am, Company Sweep Monday, Expansion Scout Thursday, Scorecard Friday afternoon.

## Step 5: Keep it sharp
Tell the client:
- Once a week, update the "Skip any job I've already seen" list in the Daily Scout with what they applied to or rejected.
- When their profile changes (new numbers, new target titles), regenerate the prompts.
- For any Apply First role: "Tailor my application for [role]" runs the `job-match-rubric` tailoring pack.
- Pair this with job alerts (`job-alerts-setup`) so nothing slips through.

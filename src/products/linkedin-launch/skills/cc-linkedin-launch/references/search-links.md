# Search link prompts

Ready-made LinkedIn job and people searches, as links you can click. Use these prompts with the cc-linkedin-launch skill in Claude, or paste them into any AI chat tool. Swap everything in [square brackets] for your own details. The example links inside the prompt are real LinkedIn search links for a fictional person's job titles.

LinkedIn sometimes changes how its search links work. If a link stops working, copy the Boolean string and paste it into the LinkedIn search bar instead.

## Build my job and people search links

**What it does:** Builds ready-to-click LinkedIn job searches for 5 to 8 job titles, plus people searches for peers, recruiters and hiring managers.
**When to use it:** When you want to stop retyping searches and open the right results in one click.

### Step 1: Pick the job titles

~~~text
Act as a LinkedIn search coach.

My resume or LinkedIn profile text:
[Paste your resume or profile]

The job title I'm targeting: [Target job title]
Industries I'm aiming for: [Target industries]
Where I want to work (city, province or state, country, or remote): [Location]

Suggest 5 to 8 job titles I could search for, based on my experience: my target title, close variations, and the titles other companies use for the same work. Give one line on why each one fits. Leave out titles that would be a stretch I can't back up. Then wait for me to confirm or edit the list.
~~~

**Replace:** [Paste your resume or profile], [Target job title], [Target industries], [Location]

### Step 2: Build the links

~~~text
Now build my search links for the titles I confirmed. Keep it to about one page.

PART 1: JOB TITLE SEARCHES
For each title, give:
The job title (in bold)
Boolean: "exact title" OR "alternate title"
[Search Jobs](URL) | [Search Jobs in my city](URL)

Job search link format:
https://www.linkedin.com/jobs/search/?keywords=ENCODED_QUERY
With my location:
https://www.linkedin.com/jobs/search/?keywords=ENCODED_QUERY&location=ENCODED_LOCATION

PART 2: PEOPLE SEARCHES
Give 2 to 3 searches, each with a link, for each group:
- Industry peers: people in similar roles to network with.
- Recruiters: people who recruit for these roles or this industry.
- Hiring managers: managers and directors who lead the team I'd join.

People search link format:
https://www.linkedin.com/search/results/people/?keywords=ENCODED_QUERY&origin=GLOBAL_SEARCH_HEADER

RULES
- Keep the Boolean simple: quotes and OR only, no brackets.
- Each string does one job. Either list alternative titles with OR, or combine two ideas with a space (like "supply chain" recruiter). Don't mix OR with a second idea in the same string, because without brackets LinkedIn may read it differently than I mean.
- Write OR in capitals.
- Encode every query properly: a space becomes %20, a quote mark becomes %22 and a comma becomes %2C.
- Use real job titles and industry words, not placeholders.
- Every link must be complete and clickable.
- Under the people searches, add one line: open a search, then use the filters on the results page for location and current company.

EXAMPLE (fictional person, for structure only)
Supply Chain Manager
Boolean: "Supply Chain Manager" OR "Supply Chain Lead"
[Search Jobs](https://www.linkedin.com/jobs/search/?keywords=%22Supply%20Chain%20Manager%22%20OR%20%22Supply%20Chain%20Lead%22) | [Search Jobs in Toronto](https://www.linkedin.com/jobs/search/?keywords=%22Supply%20Chain%20Manager%22%20OR%20%22Supply%20Chain%20Lead%22&location=Toronto%2C%20Ontario%2C%20Canada)

Recruiters: "supply chain" recruiter
[Search People](https://www.linkedin.com/search/results/people/?keywords=%22supply%20chain%22%20recruiter&origin=GLOBAL_SEARCH_HEADER)
~~~

**Replace:** Nothing. Paste this after Step 1.

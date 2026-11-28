# Job title prompts

These prompts find the job titles your resume already fits, score each one, and build a ready LinkedIn job search for it. Fit scores are a rough guide, not a chance of getting hired. Results vary.

## Find 5 job titles to target

**What it does:** Reads your resume and suggests 5 real job titles, each with a fit score and the reason for it, typical pay, demand, a mix label and a LinkedIn search link.
**When to use it:** At the start of a search, or when your applications aren't getting replies and you want to widen the titles you search for.

### Step 1: Score the titles and build the searches

~~~text
Act as a career strategist. Read my resume below and suggest 5 job titles I should target. Base everything on evidence in my resume. Don't invent experience, numbers, employers or results.

Where I want to work: [City, province or state, country, or "remote" plus the country I live in]
Titles I'm curious about: [Titles, or "none"]
Industries I want, or want to leave: [Industries, or "none"]
Rough pay estimates OK if you can't check live data: [Yes or no]

How to choose the titles:
1. Exactly 5 real titles that show up in job posts on LinkedIn and other job boards. No made-up titles.
2. Use this mix:
   - 2 Direct: the job I do now, under the name most employers use for it.
   - 1 Adjacent: a neighbouring role that uses most of my skills in a different function or industry.
   - 1 Emerging: a newer or growing title that fits my skills.
   - 1 Stretch: one level up, or a bigger scope, that my evidence still supports.
3. Fit %: for each title, list the 6 to 10 core requirements that job posts for it usually ask for. Give full credit where my resume shows clear evidence and half credit where the evidence is thin. Turn it into a percentage, rounded to the nearest 5. Every title must score 70% or higher. If one scores lower, swap it for another title.
4. Demand: High, Medium or Low, based on how often this title appears in job posts where I want to work. If you can search the web, base it on what you find and say so. If you can't, label it "(estimate, confirm)".
5. Typical pay: the base pay range for this title where I want to work, in my currency (CAD or USD). If you can search the web, use a source you actually opened and give its link and date. If you can't, never make up a figure. Write "Not checked", or give a rough range labelled "(estimate, confirm)" only if I said estimates are OK.

For each title, build a LinkedIn job search:
- Keywords: a simple search under 100 characters, using quotes and OR only, with no brackets. For example: "Operations Coordinator" OR "Operations Specialist"
- Link: https://www.linkedin.com/jobs/search/?keywords=[keywords]&location=[location]
- Encode the keywords and the location inside the link: a space becomes %20, a double quote becomes %22, a comma becomes %2C. Example of a finished link:
  https://www.linkedin.com/jobs/search/?keywords=%22Operations%20Coordinator%22%20OR%20%22Operations%20Specialist%22&location=Winnipeg%2C%20Manitoba%2C%20Canada
- For remote roles, use the country as the location and add &f_WT=2 to the end of the link (LinkedIn's remote filter).

Use this layout:

Your Career Clarity Audit
One or two sentences on what this is and the location you used. Then this line: "Fit, demand and mix are a read of your resume and the market, not statistics."

Job titles to target
A table with these columns: # | Title | Fit | Typical pay | Demand | Mix

Then one block per title:
[Number]. [Title] ([Mix], [Fit]% fit)
Why it fits: [one sentence naming specific evidence from my resume: a title, a tool or a result]
Gap to close: [one short phrase, or "None" if the fit is 90% or more]
Pay: [range and currency], with [source link and date], or "(estimate, confirm)", or "Not checked"
Keywords: [the search string]
LinkedIn search: [the encoded link]

Rules:
- Keep my facts. Don't stretch my experience to make a title fit, and never suggest changing my past job titles.
- Plain language and short sentences. Use commas, colons or full stops, not dashes.
- Number ranges use "to", for example "$80K to $95K".

My resume:
[Paste your resume]
~~~

**Replace:** [City, province or state, country, or "remote" plus the country I live in], [Titles, or "none"], [Industries, or "none"], [Yes or no], [Paste your resume]

## Score a title I'm curious about

**What it does:** Scores one job title against your resume, shows what you already have and what's missing, and builds its LinkedIn search.
**When to use it:** When someone suggests a title to you, or you spot one in a job post and wonder if you fit.

### Step 1: Score the title

~~~text
Score how well my resume fits this job title: [Job title]

Where I want to work: [City, province or state, country, or "remote" plus the country I live in]

Do this:
1. List the 6 to 10 core requirements that job posts for this title usually ask for.
2. For each one, mark it Met, Partly or Not yet. For Met and Partly, quote the evidence from my resume. For Not yet, say what's missing.
3. Work out my fit %: Met counts as 1, Partly counts as half, Not yet counts as 0. Divide by the number of requirements and round to the nearest 5. Show the maths in one line.
4. Label the title Direct, Adjacent, Emerging or Stretch for me, with one line on why.
5. If my fit is under 70%, tell me plainly. Name the one or two gaps that matter most and a realistic way to close each one.
6. If I have experience that fits but my resume doesn't show it clearly, ask me about it rather than assuming.
7. Build a LinkedIn job search for this title: keywords under 100 characters using quotes and OR only, and a link in this format, with the keywords and location encoded (a space becomes %20, a double quote becomes %22, a comma becomes %2C):
   https://www.linkedin.com/jobs/search/?keywords=[keywords]&location=[location]

Rules:
- The fit % is a rough guide, not a chance of getting hired. Say so in one line.
- Use only what's in my resume. Don't invent experience, numbers or results.
- Plain language. No dashes.

My resume:
[Paste your resume]
~~~

**Replace:** [Job title], [City, province or state, country, or "remote" plus the country I live in], [Paste your resume]

## Build my LinkedIn job searches

**What it does:** Turns a list of job titles into simple LinkedIn job searches with links you can click, for any city or for remote work.
**When to use it:** When you move your search to a new city, add remote roles, or want a few more versions of a title to search.

### Step 1: Build the searches

~~~text
Build LinkedIn job searches for these job titles:
[List your job titles, one per line]

Location: [City, province or state, country, or "remote" plus the country]

For each title:
1. Keywords: a simple search under 100 characters, using quotes and OR only, with no brackets. Include the title plus one or two common versions of it that employers use. For example: "Operations Coordinator" OR "Operations Specialist"
2. Link: https://www.linkedin.com/jobs/search/?keywords=[keywords]&location=[location]
   Encode the keywords and the location inside the link: a space becomes %20, a double quote becomes %22, a comma becomes %2C. Check that the finished link has no raw spaces, quotes or commas in it.
3. For remote roles, use the country as the location and add &f_WT=2 to the end of the link.

Show the result as a table: Title | Keywords | Link

Then add one line telling me to open each link, check the "Date posted" filter, and turn on a job alert for my top 2 or 3 searches.
~~~

**Replace:** [List your job titles, one per line], [City, province or state, country, or "remote" plus the country]

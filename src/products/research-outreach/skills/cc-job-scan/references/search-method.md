# Search method: find fresh postings and check them

Read this when you run a job scan with web search. It covers where to look, how to keep only postings from the last 7 days, and how to check that each link still works. If you can't search the web, tell the user and ask them to paste postings in. Then go straight to scoring with `references/fit-rubric.md`.

**1. Build the search list.**

- **Titles:** the user's target title plus 2 or 3 close variants. A Senior Project Manager search can also cover Project Manager, Program Manager and Delivery Manager. List the titles you searched in the report so the user can drop any that don't fit.
- **Places:** the user's city, nearby cities they named, and "remote" if they're open to it. For remote roles, add the country ("remote Canada", "remote US"), because many remote roles only hire in one country.
- **Company types:** a mix of large established companies, mid-size companies and growing startups.
- **Target companies:** if the user gave a list, check each company's careers page as well.

**2. Run the searches.**

Run several searches. Change the title, the place and the site each time. Add "past week" (or "last 7 days") to every query. Useful query shapes:

~~~text
[Job title] jobs [City] past week
"[Job title]" [City] site:linkedin.com/jobs
"[Job title]" site:greenhouse.io
"[Job title]" site:jobs.lever.co
"[Job title]" site:myworkdayjobs.com
"[Job title]" site:jobs.ashbyhq.com
"[Job title]" remote Canada past week
"[Company]" careers "[Job title]"
~~~

Where postings live:

- LinkedIn Jobs
- Large job boards (Indeed and Glassdoor, plus Job Bank in Canada)
- The application boards companies use (Greenhouse, Lever, Workday, Ashby, SmartRecruiters)
- Company careers pages

Prefer the company's own posting (its careers page or application board) over a copy on an aggregator site. It's where the user applies, and it goes stale less often.

If a search gives nothing useful, change the words or the site. Aim for at least 15 candidate postings before you filter.

For each posting, record:

- Company
- Job title
- Location
- Work model: Remote, Hybrid or On-site
- Pay, with currency, exactly as listed ("Not listed" if there's none)
- Link: the exact URL from the search result
- 3 to 5 key requirements
- Posted date: what the page shows, plus the date you worked out

**3. Keep only the last 7 days.**

Know today's date (ask if you don't). The cutoff is 7 days before today. Convert what the page shows:

- "Just posted", "Today" or "5 hours ago": today
- "Yesterday": 1 day ago
- "3 days ago": today minus 3 days
- "1 week ago": 7 days ago, so it's on the edge. Keep it.
- "2 weeks ago", "30+ days ago" or an exact date before the cutoff: drop it
- "Reposted 2 days ago": keep it, use the repost date, and note "Reposted" on the card (the role may have been open longer)
- No date shown: keep it, mark it "Date not shown", and tell the user to check before applying. Don't guess a date.

Never fill the list with older postings to reach a number.

**4. Check the links.**

If you can open web pages, open every posting before it goes in the report. Drop it when:

- The page isn't found (an error such as 404 or 410).
- The link redirects to a general careers page, a job search page or the home page instead of the posting.
- The page says the job is closed. Look for phrases like "This job is no longer available", "This position has been filled", "This job has been closed", "No longer accepting applications", "This posting has expired", "Job not found" or "This requisition has been closed".
- The site can't be reached at all (the address doesn't exist or refuses the connection).

Keep the posting but mark it "Couldn't check" when the page times out, asks for a login or blocks automated visits. Tell the user to click it before applying.

If you can't open web pages at all, mark every posting "Not checked" and say so at the top of the report.

Write the date next to each checked link: "Link checked [date]".

**5. Remove duplicates.**

The same URL, or the same company and title in the same location, is one posting. Keep the version with the most detail (pay, date, requirements), ideally the company's own page.

**6. If the week is quiet.**

If fewer than 3 fresh postings survive, say so plainly. The market for these titles may be slow this week. Suggest close titles, a wider area or remote, more target companies, or running the scan again in a few days. Don't pad the report.

## Find fresh job postings

**What it does:** Searches the web for real job postings from the last 7 days that match your target role and location, then checks that the links still work.
**When to use it:** In any AI chat tool that can search the web, when you want a fresh list of jobs to score.

### Step 1: Search

~~~text
Today's date is [Today's date]. Search the web for real, active job postings from the last 7 days only (posted on or after [Date 7 days ago]).

My target job titles: [Target job titles]
My location: [City, province or state]
Work model I want: [Remote, hybrid or on-site]
Industries I'm interested in: [Industries, or "open"]
My target salary: [Salary and currency, or "not set"]
Companies to check (optional): [Target companies, or delete this line]

Search LinkedIn Jobs, large job boards, the application boards companies use (Greenhouse, Lever, Workday, Ashby) and company careers pages. Add "past week" to every search. Mix large companies, mid-size companies and growing startups. For remote roles, check which country they hire in.

Rules:
- Only include postings you found in a search result. Never make up a company, a posting or a link.
- Use the exact link you found. Never build or guess one.
- Drop anything older than 7 days. If a posting shows no date, keep it and write "Date not shown".
- Show pay exactly as listed, with the currency, or write "Not listed".
- If you can't search the web, tell me, and I'll paste postings in instead.

Give me at least 15 postings, if that many exist, as a table:
Company | Job title | Location | Work model | Pay | Posted | Link | 3 to 5 key requirements
~~~

**Replace:** [Today's date], [Date 7 days ago], [Target job titles], [City, province or state], [Remote, hybrid or on-site], [Industries, or "open"], [Salary and currency, or "not set"], [Target companies, or delete this line]

### Step 2: Check the links

~~~text
Now open each link in the table, if you can.

Remove any posting where:
- the page isn't found
- the link sends you to a general careers page, search page or home page
- the page says the job is closed, filled, expired or no longer accepting applications

If a page won't load or asks for a login, keep it and mark it "Couldn't check". If you can't open web pages at all, mark every posting "Not checked" and tell me to click each one myself.

Also remove duplicates: the same link, or the same company and title in the same place.

Give me the cleaned table with one more column, Link status (Checked, Couldn't check or Not checked). Then list what you removed and why, one line each.
~~~

**Replace:** nothing. Use it in the same chat, right after Step 1.

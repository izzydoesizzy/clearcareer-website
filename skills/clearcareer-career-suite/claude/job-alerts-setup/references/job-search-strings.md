# Job Search Strings: How to Build Them

Search broad, filter narrow. The search string's only job is to find candidates. The match rubric does the filtering. Long, clever Boolean strings miss good roles.

## Rule of thumb
- 2 to 4 closely related titles per string. Never 10.
- Location or "remote" in the filters, not in the string, where the site has a filter.
- At most 2 or 3 exclusions (intern, junior, contract, for example).
- One string per title cluster. A client usually needs 2 to 4 clusters.

## Step 1: Title clusters

Group the target titles and alternative titles from the profile into clusters of roles with the same underlying work:

| Cluster | Titles | Why it fits |
|---|---|---|
| A: Direct | Customer Success Manager, Client Success Manager, Account Manager | Same work as the last 2 roles |
| B: Adjacent | Customer Experience Manager, Onboarding Manager | 80%+ of the same skills |
| C: Emerging / stretch | Customer Success Operations Manager, Head of Customer Success | Next level or new title for the same work |

## Step 2: LinkedIn job search strings

LinkedIn Jobs keyword box accepts quotes, OR, AND, NOT and parentheses. Keep it simple:

```
"Customer Success Manager" OR "Client Success Manager" OR "Account Manager"
```
With one skill anchor and exclusions, only if results are too noisy:
```
("Customer Success Manager" OR "Client Success Manager") AND SaaS NOT intern NOT junior
```
Filters to set: Date posted (Past 24 hours for alerts, Past week for browsing), Experience level, Remote / Hybrid / On-site, Location.

## Step 3: Google X-ray strings for company job boards

Many jobs are posted first on the company's own applicant tracking system. These find them:

```
site:boards.greenhouse.io OR site:job-boards.greenhouse.io ("Customer Success Manager" OR "Client Success Manager") Toronto
```
```
site:jobs.lever.co ("Customer Success Manager" OR "Client Success Manager") remote
```
```
site:jobs.ashbyhq.com ("Customer Success Manager" OR "Client Success Manager")
```
```
site:myworkdayjobs.com "Customer Success Manager" Canada
```
```
site:jobs.smartrecruiters.com OR site:apply.workable.com OR site:jobs.jobvite.com "Customer Success Manager"
```
In Google, use Tools > Any time > Past 24 hours (or Past week) to keep results fresh.

## Step 4: Indeed
```
title:("customer success manager" OR "client success manager") -intern -junior
```
Filters: Date posted, Remote, Job type, Pay (where shown).

## Step 5: Target company sweep

For each company on the target list, check the careers page directly. Pattern for the AI to search:
```
"[Company]" careers "[Title A]" OR "[Title B]"
```
or the company's own ATS: `site:boards.greenhouse.io/[company]`, `site:jobs.lever.co/[company]`.

Building a target list (20 to 50 companies): filter by industry, size (startup, mid-size, enterprise), location or remote policy, stage and funding, and the client's values. For each: name, website, why it fits, careers link.

## Step 6: Google Alerts queries (news and hiring signals)

Use at google.com/alerts. One alert per line:
```
"[Company]" (hiring OR "we're hiring" OR "now hiring")
```
```
"[Company]" (funding OR "Series A" OR "Series B" OR expansion OR "new office")
```
```
"[Title A]" (hiring OR "job opening") "[City]"
```
Funding, expansion and new-leader news are hiring signals: companies that just raised money or opened an office hire in the next 3 to 6 months.

## Step 7: People search (for outreach to top matches)

Three lanes for each Apply First role:
- Recruiter: `site:linkedin.com/in ("recruiter" OR "talent acquisition") "[Company]"`
- Hiring manager: `site:linkedin.com/in ("[Title of the boss]") "[Company]"`
- Internal peer: `site:linkedin.com/in "[Target title]" "[Company]"`
Label people as "Likely recruiter" or "Likely hiring manager", never "The hiring manager". Check they still work there.

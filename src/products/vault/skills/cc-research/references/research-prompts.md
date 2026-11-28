# Research prompts

Nine copy-paste prompts for researching companies, job posts, salaries, recruiters, events and job titles. Fill in everything in [square brackets] with your own details. Leave anything in {curly braces} alone: those are slots the AI fills. Then paste the prompt into Claude or any AI chat.

Most of these need current information. If your AI can search the web, ask it to. Otherwise, paste in what you find (company pages, job posts, salary data, event listings) and the AI will organize it for you. Always check names, numbers and links before you rely on them.

Salary numbers are general guidance, not legal or financial advice. Results vary.

## 5-Second Company Research

**What it does:** Builds a fast company snapshot in tables: links, background, business details and recent news.
**When to use it:** A recruiter just reached out, or you have an interview or coffee chat coming up and need the basics fast.

### Step 1: Research the company

~~~text
I'm researching [Company name]. Fill out the fields below.

If you can search the web, do it, and add a source link for each fact. If you can't, tell me, and use only what I paste at the bottom. Write "Not found" instead of guessing, and put a date next to anything that changes (stock price, news, leadership).

Format each section as a table: FIELD | INFORMATION

SOCIAL MEDIA AND LINKS
Website
X (Twitter)
Instagram
Facebook
TikTok
LinkedIn
YouTube
Glassdoor company page
Indeed company page
Crunchbase

COMPANY INFO
Brief description
Brief origin story
Year founded
Years in operation
Founder name
Current CEO or leader
Company values

BUSINESS DETAILS
Annual revenue
Stock ticker (if public)
Current stock price (if public)
Stock price change over 1, 3 and 5 years
Business model
Core products or services
Biggest competitors
Weaknesses compared to competitors
Strengths compared to competitors
Company priorities
Biggest challenges
Recent funding or investment
Recent layoffs

NEWS (format this one as a table: FIELD | DATE | INFORMATION)
Top recent news headline
Second recent news headline
Third recent news headline
Latest LinkedIn post
Latest Facebook post
Latest X (Twitter) post

What I've found so far (optional):
[Paste anything you've found, or delete this line]
~~~

**Replace:** [Company name], [Paste anything you've found, or delete this line]

## Break Down a Job Description

**What it does:** Turns a job post into a clear table of required and nice-to-have skills, with the kind of achievement to highlight for each.
**When to use it:** Before you tailor your resume, write a cover letter or prep for an interview for a specific role.

### Step 1: Break it down

~~~text
List every skill the employer wants in the job description below. Make a table with 3 columns:

1. Skill: a 2 to 3 word summary of the skill
2. Required?: Yes or Nice-to-have
3. Suggestions: the kind of achievement I should highlight to prove it

Example:

Desired skills
Skill | Required? | Suggestions
Policy development | Yes | Describe a measurable achievement in developing and rolling out privacy policies. What was the measurable outcome?

When that table is done, make a second table of useful skills and experience the job description doesn't mention directly but the role clearly needs.

Example:

Skills not directly mentioned
Skill | Required? | Suggestions
Cross-team collaboration | Yes | Describe an achievement where you worked across several teams or groups. What was the measurable outcome?

Job description:
[Paste the full job description]
~~~

**Replace:** [Paste the full job description]

## Rapid-Fire Salary Research

**What it does:** Gives you a research-backed salary range for a role, company size and location, with sources you can check.
**When to use it:** Before you apply, before a recruiter asks for your expectations, and before any offer conversation.

### Step 1: Get the range

~~~text
I'm considering a [Target job title] role at [Company name] in [Your city and province or state].

Work out a research-backed salary range I should consider, based on similar roles at companies of a similar size in this location.

If you can search the web, use current sources (job posts that list pay ranges, government wage data, salary sites) and link every source with its date. If you can't, tell me, and work only from the data I paste below. Don't invent numbers. If the data is thin or old, say so.

Show:
- The range (low, middle and high) in [CAD or USD]
- Where each number came from, with links
- What would push me toward the top or the bottom of the range (company size, seniority, specialized skills)

Salary data I've found (optional):
[Paste salary data you've found, or delete this line]
~~~

**Replace:** [Target job title], [Company name], [Your city and province or state], [CAD or USD], [Paste salary data you've found, or delete this line]

## 5x5 Industry News and Resources

**What it does:** Lists the top 5 newsletters, podcasts, companies, communities and people to follow in your field.
**When to use it:** You want to stay current on your industry so you have things to talk about in networking and interviews.

### Step 1: Find the resources

~~~text
I'm researching the field of [Your field].

For each category below, list the most popular and largest resources in that field.

Top 5 blogs or newsletters
Top 5 podcasts
Top 5 companies
Top 5 online communities
Top 5 people to follow (writers, creators and leaders in the field)

Format each category as a table: NAME | DESCRIPTION | TYPE | URL

If you can search the web, check that each one is still active and link it. If you can't, tell me, and flag anything you're not sure is still running.

Where it makes sense, include resources that are useful in [Your country or region].
~~~

**Replace:** [Your field], [Your country or region]

## Quick Prospective Company List

**What it does:** Builds a starter list of companies in your area that work in your field.
**When to use it:** Early in your search, when you need to know who's out there before you can target anyone.

### Step 1: Build the list

~~~text
Make a list of [Companies, startups or tech companies] in [Your province, state or city] that focus on [Your topic, focus or industry].

Format the output as a table: COMPANY NAME | DESCRIPTION | CITY | COMPANY URL

If you can search the web, do it, and only include companies you can confirm are operating, with a working URL. If you can't, tell me, and label the list as a starting point I need to check.

Give me as many as you can confirm, up to [Number of companies].
~~~

**Replace:** [Companies, startups or tech companies], [Your province, state or city], [Your topic, focus or industry], [Number of companies]

## Company Scorecards

**What it does:** Scores your target companies on culture, growth, open roles, pay and industry position, then ranks them so you know where to aim first.
**When to use it:** You have a list of 5 to 20 companies and need to decide which ones get your time this week.

### Step 1: Score the companies

~~~text
Create company scorecards for the companies below, scored against what matters to me.

Companies:
[List 5 to 20 companies]

My target role: [Target role]
What matters most to me, in order: [Your priorities, for example remote work, growth, pay, values, company size]

If you can search the web, research each company and link your sources. If you can't, tell me, and score only from what I paste below. Mark any score you had to guess as "(estimate, confirm)".

Score each company from 1 to 10 on these five areas, with my priorities in mind:
1. Culture fit: employee reviews (for example the Glassdoor rating), remote or hybrid policy, values that match mine
2. Growth: funding, hiring trends, revenue growth
3. Open roles: current openings that match my target role
4. Pay: salary ranges for my target role, and benefits
5. Industry position: market leader, challenger or niche player

Output:
1. A ranked table: Rank | Company | Culture | Growth | Roles | Pay | Industry | Total (out of 50) | Review rating
2. A short scorecard for each company: the five scores, one key insight on why it's a good or poor fit for me, and any matching open roles
3. My top 3 companies to go after first, and why

What I've found so far (optional):
[Paste notes, reviews or job posts you've found, or delete this line]
~~~

**Replace:** [List 5 to 20 companies], [Target role], [Your priorities, for example remote work, growth, pay, values, company size], [Paste notes, reviews or job posts you've found, or delete this line]

## Find Recruiters (Search Strings)

**What it does:** Writes Google search strings that surface the LinkedIn profiles of recruiters and hiring managers for your kind of role.
**When to use it:** You want names to contact at your target companies instead of applying into a black hole.

### Step 1: Write the search strings

~~~text
You generate search strings for finding hiring managers, recruiters and other professionals. Using my details below, write search strings I can paste into Google to find the LinkedIn profiles of people who hire for my kind of role.

My details:
- Skills: [Your top skills, for example Customer Success, Account Management, Sales]
- Location: [Your location]
- Role: [Target role]
- Target company (optional): [Target company, or delete this line]
- Keywords to exclude: [Keywords to exclude, for example Intern, Junior]

Sample results, to show the format (the company names are fictional):
1. "Hiring" intitle:"Northwind" "Content Strategy" OR "Digital Marketing" -"Entry-level" "Streaming" OR "Media" "Hiring * Content Strategist" -intitle:"profiles" -inurl:"dir/" site:linkedin.com/in
2. "Hiring" intitle:"Bluepeak" "iOS Development" OR "Swift" -"Junior" -"Assistant" "Apps" OR "Objective-C" "Hiring * iOS Developer" -intitle:"profiles" -inurl:"dir/" site:linkedin.com/in
3. "Hiring" "Data Science" OR "Data Warehousing" OR "Analytics" OR "Power BI" OR "SQL" -"Data entry" "Hiring Data Engineer" OR "Hiring SQL Engineer" OR "Hiring Data Analyst" -intitle:"profiles" -inurl:"dir/" site:linkedin.com/in

Generate 3 to 5 search strings from my details, from narrow to broad, with one line on what each one finds. Include at least one that targets recruiters directly (for example "recruiter" OR "talent acquisition"). Then tell me how to use them: paste each one into Google, open the LinkedIn profiles, and check the person still works there before reaching out.
~~~

**Replace:** [Your top skills, for example Customer Success, Account Management, Sales], [Your location], [Target role], [Target company, or delete this line], [Keywords to exclude, for example Intern, Junior]

## Upcoming Industry Events

**What it does:** Finds the top upcoming events in your field near you, with dates, prices and links.
**When to use it:** You want to meet people in your industry in person (or online) instead of only messaging them.

### Step 1: Find the events

~~~text
I'm researching the field of [Your field].

What are the top 5 upcoming events in this field in the [Your city] area? Today's date is [Today's date], so only list events after it. If there aren't 5 local ones, add online events and label them.

If you can search the web, do it, and link each event page. If you can't, tell me, and I'll paste events I've found below for you to organize.

Format the response as a table: EVENT | DESCRIPTION | EVENT DATE | PRICE | URL

Events I've found (optional):
[Paste event listings you've found, or delete this line]
~~~

**Replace:** [Your field], [Your city], [Today's date], [Paste event listings you've found, or delete this line]

## Alternative Job Titles

**What it does:** Finds 5 to 8 other job titles you're qualified for, with fit scores, demand, salary estimates, skills gaps and ready-made search strings.
**When to use it:** Your search feels too narrow, or you keep seeing roles that look like yours under names you didn't search for.

### Step 1: Find the titles

~~~text
Act as a career strategist and labour market analyst who knows how job titles change across industries, company sizes and regions. The same role can go by 10 or more titles, and I want to find the ones I'm missing.

About me:
- Current or most recent title: [Current title]
- Titles I'm targeting: [Target roles]
- Industry: [Target industry]
- Top skills: [Top skills]
- Years of experience: [Years of experience]
- Location: [Your city and province or state]
- My target salary range: [Your target salary range]
- Roles I've already considered or ruled out (optional): [Roles you've ruled out, or delete this line]

My resume:
[Paste your resume text]

If you can search the web, check job boards for each title and link a few example postings. If you can't, tell me, and label demand and salary as estimates I need to confirm.

Give me 5 to 8 alternative titles. Each one must:
1. Truly fit me: roughly 70% or more skills overlap with my resume
2. Be a real, searchable title on LinkedIn, Indeed and Glassdoor (no vanity or company-internal titles)
3. Be a realistic path: lateral, a slight pivot or a step up, not a complete reinvention
4. Have enough open roles to be worth targeting
5. Pay at or above my target, or be clearly flagged if it doesn't

Spread them across:
- 2 to 3 direct equivalents: the same job under a different name (for example Program Manager, Project Lead, Delivery Manager)
- 1 to 2 adjacent roles that use most of the same skills in a different function (for example Sales Engineer for a Solutions Architect)
- 1 to 2 newer, growing titles (for example Revenue Operations Manager for someone in Sales Operations)
- 1 stretch title I could grow into, with the gaps I'd need to close

For each title, write:

{Number}. {Alternative job title}
Fit score: {X}% skills overlap
Why this title fits you: 3 to 4 sentences pointing to specific experience, skills and achievements from my resume.
Market demand:
- Job volume: High, Medium or Low, with a short reason. Only give a count of postings if you checked it today, with the source.
- Trend: Growing, Stable or Declining, with context. No made-up percentages.
- Best job boards for this title
- Search tips (for example, also search "Sr. {title}" and "{title} II" to catch seniority variations)
Seniority level: for example mid-senior, manager or director, and whether it's a step up, lateral or a step down for me.
Salary range (estimates, with sources if you have them):
- Typical range in Canada or the US
- In my location
- Top of market (large or high-paying companies)
- Compared to my target: at, above or below
Sample companies that hire for this title: 8 to 10 real companies, grouped as enterprise, mid-size and startup, in my target industry where possible. Only list companies you're confident about, and remind me to check.
Skills overlap table: Skill required | Do I have it? (Yes, Partial or Gap) | Evidence from my resume
Gap plan: 1 to 2 sentences on closing any gaps (a course, a certification, or how to frame what I already have).
LinkedIn search string: "{Alternative title}" OR "{Variant 1}" OR "{Variant 2}" AND "{Industry keyword}"

Then add:
1. A summary table: # | Title | Fit score | Salary range | Demand | Seniority | Best for
2. A search plan in 3 to 5 bullets: which titles to go after first based on my goals (growth, speed or pay), how to set up job alerts for them, which to combine in one search and which to search separately, and a note on title inflation (a "Director" at a 50-person company is a very different job from a "Director" at a 50,000-person company).

Avoid:
- Titles that need a completely different background (for example Data Scientist for a Marketing Manager with no technical experience)
- Very niche titles with very few postings
- Big steps down in seniority or pay, unless you flag them clearly
- Company-specific internal titles
- Invented salary ranges. Base them on current market knowledge for my location and industry, call them estimates, and say how sure you are.
- More than 8 titles. Too many options leads to analysis paralysis.
- Ignoring the direction I said I want to go. These should match where I'm heading, not only where I've been.

Tone: strategic and encouraging. Every title is a real option, not a compromise.
~~~

**Replace:** [Current title], [Target roles], [Target industry], [Top skills], [Years of experience], [Your city and province or state], [Your target salary range], [Roles you've ruled out, or delete this line], [Paste your resume text]

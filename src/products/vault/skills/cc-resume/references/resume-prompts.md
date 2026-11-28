# Resume prompts

Seven prompts for writing and sharpening your resume. Use them with the cc-resume skill in Claude, or paste them into any AI chat tool. Swap everything in [square brackets] for your own details, and only keep numbers that are true.

## Write Achievements for Your Resume

**What it does:** Gives you 20 sample achievements for your job title to jog your memory, then helps you build real ones from your own projects.
**When to use it:** When you're staring at a blank resume and can't remember what you've achieved.

### Step 1: Get sample achievements for your role

~~~text
Job title: [Job title]
Field or industry: [Field or industry]

TASK
Write 20 sample quantified achievements for the resume of a [Job title] in the [Field or industry] field.

These are samples to jog my memory, not facts about me. Title the table "Samples". I'll replace every number with my real one or delete the line.

OUTPUT
- Format the output as a 2-column table: Description | Sample quantified achievement
- Use the format and structure of the sample achievements below, and write new ones for the job title and industry above.

Description | Sample quantified achievement
Social media reach | Grew social media following by 40% in 4 weeks, from 50,000 to 70,000 followers, increasing the audience for content.
Collaborations | Collaborated with 10 influential creators, growing subscribers by 20% (10,000 new subscribers) and reaching new target audiences.
Product sales | Increased sales of bakery items by 25%, from 80 to 100 items sold per day, raising overall shop revenue.
Sales targets | Exceeded individual sales targets by 20% in Q4 2022, resulting in $3 million in net profit.
Phone orders | Processed 20+ phone orders per day, generating an average of $300 in revenue per call.
Sales record | Set the company record for most add-ons sold in a single month (51, totalling $3,500).
Training | Trained 20+ new employees in phone etiquette, sales and conflict resolution techniques.
Online store | Created an online store as part of a group project that generated $5,000 in T-shirt sales for a local charity.
Head waiter | Served as head waiter on a staff of 14 waiters and bussers.
Event planning | Planned and ran 25+ corporate events in 2023, with an average attendance of 100+ guests per event.
Cost reduction | Managed event budgets totalling over $500,000 in 2023, saving an average of 10% per event for a total cost reduction of $50,000.
Portfolio growth | Grew client portfolio value by 15% in a year, from $2 million to $2.3 million.
Check-ins | Managed the front desk, checking 45+ guests in and out and confirming 20+ new reservations by phone and email each shift.
Transactions | Processed an average of $5,000 in cash and credit transactions per shift.
Conversion rate | Revamped the website's landing page, raising the conversion rate from 2% (200 out of 10,000 visitors) to 4% (400 out of 10,000 visitors).
Cost savings | Saved the company $40,000 per year by negotiating new vendor contracts.

Any time a percentage change is mentioned, include the raw numbers to show the impact.
Example: Reduced farm operating costs by 10%, from $1 million to $900,000, through more efficient use of resources, improving overall profit margins.
~~~

**Replace:** [Job title], [Field or industry]

### Step 2: Build achievements from your real work

~~~text
Now write 20 more achievements like these, based on my real responsibilities and projects below.

Wherever you'd need a number I haven't given you, don't make one up. Put a short question in parentheses where the number would go, for example "Cut onboarding time from (how many weeks before?) to (how many weeks after?)".

My responsibilities and projects:
- [Responsibility 1]
- [Responsibility 2]
- [Project 1]
- [Project 2]
~~~

**Replace:** [Responsibility 1], [Responsibility 2], [Project 1], [Project 2]

### Step 3: Check every number

~~~text
Here are the achievements I want to keep, with my real numbers filled in:
[Paste the achievements you kept]

Go through them one by one. For each, ask me whether each number is exact, an estimate, or a sample I haven't replaced yet. Then give me a table with these columns: Achievement | Status (Confirmed, Estimate or Sample) | What to check.

Mark estimates "(estimate, confirm)". Flag any line that still has a sample number, a percentage with no raw numbers, or a claim like "first ever" or "largest" that I haven't confirmed. Delete nothing without asking me.
~~~

**Replace:** [Paste the achievements you kept]

## Write a Professional Summary

**What it does:** Writes 10 versions of a resume summary built on your title, years of experience, skills and best achievement.
**When to use it:** When the top of your resume is vague or reads like a list of adjectives.

### Step 1: Write 10 summaries

~~~text
Current job title: [Job title]
Industry: [Industry]
Most recent company: [Company]
Years of experience: [Years of experience]
My top 3 skills: [Top 3 skills]
My best quantified achievement: [Best achievement]
Portfolio, budget or revenue I manage (if any): [Portfolio size]
Recognizable clients or customers I'm allowed to name (if any): [Client names]

Act like a resume-writing expert.

Using the details above, write 10 professional summaries that follow the structure of the examples below.

WHAT TO INCLUDE IN EVERY SUMMARY
- Job title and seniority
- Years of experience
- 2 to 3 job-specific skills
- Industry
- One strong quantified achievement
- Recognizable client or customer names, only if I listed them above
- Portfolio, budget or revenue size, only if I listed it above

TEMPLATE (you fill in these slots from my details)
[Title] with [Years of experience]+ years of experience in [3 skills] in the [Industry] industry. [Major quantified achievement]. Portfolio of [Portfolio size] including clients such as [Noteworthy clients].

Use only the facts above. If a slot has no fact, leave that part out rather than inventing it. Give each summary a short label, like the examples.

EXAMPLES (for structure only)
1. $1 Billion+ Portfolio: Accounts Receivable Manager with 15+ years of experience in consumer packaged goods and manufacturing, including 7+ years in credit, collections and accounts receivable. Managed a portfolio of $1 billion+ including Fortune 500 retail and energy accounts.
2. Saved Retailers $600K: Demand Planning Analyst with 8+ years of experience in forecasting, sales planning and inventory management in the consumer packaged goods and commodities industries. Portfolio of $40M+ across major national grocery chains. Saved clients over $600K by finding and streamlining overlapping promotions.
3. 20 Years in Valuation: Risk Management and Mergers and Acquisitions Specialist with 20+ years in valuation, finance, risk and wealth management. Worked with 40+ companies on risk management and on 30+ mergers and acquisitions, 5 of which closed at over $1 billion USD.
4. Top Accuracy Performer: Senior Demand Planner with 4 years of experience managing forecasts and retail analysis for emerging markets (about $85M and 1,000+ SKUs) and major e-commerce accounts (about $120M and 2,000+ SKUs). Top forecast accuracy performer (70%+ average), promoted 3 times in 4 years.
5. Cost-Saving Program Manager: Program Manager with 10 years of experience in technology and manufacturing, with strong skills in strategic planning, resource allocation and stakeholder management. Led cross-functional teams of 30+ people to deliver projects worth up to $50 million, improving efficiency and cutting costs for global technology and industrial clients.
~~~

**Replace:** [Job title], [Industry], [Company], [Years of experience], [Top 3 skills], [Best achievement], [Portfolio size], [Client names]

## Career Highlights Matrix

**What it does:** Builds a brainstorming table of the common tasks, metrics, skills, tools, outcomes, time frames, challenges and awards in your field.
**When to use it:** Before you write bullets or prep for interviews, when you want a menu of what good work looks like in your role.

### Step 1: Build the matrix

~~~text
Job title: [Job title]
Field or industry: [Field or industry]

TASK
Act like a career coach. Create a table to help job seekers brainstorm the common tasks, metrics, skills, tools, outcomes, time frames, challenges and awards in their field.

OUTPUT
Output only the table described below, with no other text.
Replace the sample data with results relevant to the job title and industry above.
Use these 8 columns and 25 rows.

SAMPLE (for a customer success manager in software)
Most common tasks | Quantifiable metrics | Skills used | Common tools or software | Outcome or impact | Time frame | Challenges overcome | Recognition or awards
Customer onboarding | Customer satisfaction | Customer engagement | Salesforce | Increased customer retention | Quarterly check-ins | Churn reduction | Customer Success Excellence Award
Account management | Churn rate | Account management | HubSpot | Improved user satisfaction | Monthly reviews | Onboarding process | Industry Leader Award
Customer training | Net Promoter Score | Relationship building | Zendesk | Higher renewal rates | Weekly updates | Customer retention | Top Customer Advocate
Renewal management | Customer retention | Product knowledge | Intercom | Stronger customer loyalty | Daily touchpoints | Product adoption | Outstanding Client Support
Customer support | Time to resolution | Communication | Gainsight | Reduced churn rate | Onboarding sessions | Account expansion | Customer Satisfaction Champion
Upselling | Upsell revenue | Problem solving | Customer.io | Faster onboarding | Training sessions | Data analysis | Client Retention Expert
Customer feedback | Survey response rate | Data analysis | Freshdesk | Feedback put into the product | Feedback cycles | Communication gaps | Customer Success Innovator
Product adoption | Renewal rate | Technical aptitude | Totango | Better product adoption | Product demos | Low feature use | Customer Hero Award
Customer health monitoring | Customer health score | Training delivery | ChurnZero | Early warning on at-risk accounts | Account renewals | Customer segmentation | Exceptional Customer Service
Quarterly business reviews | Customer lifetime value | Presentation skills | Mixpanel | Expansion opportunities found | Quarterly reviews | Executive buy-in | Top Customer Success Manager
(continue to 25 rows)
~~~

**Replace:** [Job title], [Field or industry]

### Step 2: Turn the matrix into your own material

~~~text
Here's what my work actually looked like:
[Describe your main tasks and projects in a few lines]

Using the matrix, pick the 5 to 8 rows that best match my real work. For each one, ask me one question that would help me turn it into a resume bullet with a real number. Ask them one at a time and wait for my answer. Don't fill in any numbers for me.
~~~

**Replace:** [Describe your main tasks and projects in a few lines]

## Create Your Skills Section

**What it does:** Builds a clean, grouped skills section from your resume and suggests skills you may have forgotten.
**When to use it:** When your skills section is missing, messy, or one long list.

### Step 1: Build the skills section

~~~text
Act like a hiring manager and recruitment expert in my field.

First, ask me to paste or attach my resume.

Then, using the details from my resume, create a new skills section. Use 2 to 3 categories that group my skills sensibly, and make one of them Tools and Software. Add an optional Certifications category.

Use this format:
Category: Skill 1, Skill 2, Skill 3
Category: Skill 1, Skill 2, Skill 3
Category: Skill 1, Skill 2, Skill 3
Certifications: Cert 1, Cert 2, Cert 3

Only list skills, tools and certifications that appear in my resume.

Last, suggest a comma-separated list of skills that aren't on my resume but are common in my role. Ask me to review them, so I can add any that I have and simply overlooked. Don't add them until I confirm.
~~~

**Replace:** Nothing. It asks you for your resume first.

## Restructure Achievements to Highlight Metrics

**What it does:** Rewrites each of your bullets so the number and the impact come first.
**When to use it:** When your bullets bury the results at the end of long sentences.

### Step 1: Put the metrics first

~~~text
Here is my resume:
[Paste your resume]

Reword every achievement in my resume so the key metric and impact come at the start of the sentence, following the XYZ structure: Accomplished X, as measured by Y, by doing Z.

Create a 2-column table: Before (my original bullet, unchanged) | After (your recommended rewrite).

Rules:
- Don't change what a number means or make the scope bigger than I wrote. "Helped with" stays "helped with" unless I tell you I led it.
- If a bullet has no metric, keep it in the table, write "Needs a number" in the After column, and add one question I can answer to find it.
~~~

**Replace:** [Paste your resume]

## Help Me Quantify My Achievements

**What it does:** Writes 4 to 5 questions for every bullet on your resume to help you find the numbers behind your work.
**When to use it:** When you know you did good work but don't have the data in front of you.

### Step 1: Get questions for every bullet

~~~text
Here is my resume:
[Paste your resume]

For each bullet point in my resume, write 4 to 5 questions that help me find and measure the impact of that achievement. Focus on questions that lead me to specific metrics or data. Where I might not have the data at hand, add targeted questions that help me estimate a range I'm confident in (for example per week, per month, or how many people). For each bullet point, show my original bullet word for word first, then the questions.

Example output:

Problem-solving and technical skills
Achievement: "Used strong analytical skills to break down complex problems and build data-driven fixes for critical system issues. Applied advanced ERP knowledge (SAP, Infor M3) and MS Office tools."
- How many critical system issues did you resolve, and how long did each take to fix before and after your changes?
- By what percentage did system downtime or errors drop because of your fixes?
- How many users or departments did your ERP improvements affect?
- Can you put a number on the money or time saved, such as less manual work or fewer corrections?

Do this for every section of my resume.

When I answer, keep track of which numbers I confirm and which I estimate. Show estimates as ranges (for example "15 to 20", not "17") and mark them "(estimate, confirm)". Never present an estimate as confirmed.
~~~

**Replace:** [Paste your resume]

## ATS Resume Optimizer

**What it does:** Compares your resume to a job post, finds the missing keywords and formatting problems, and rewrites your resume to match.
**When to use it:** Every time you apply for a role you really want, with that job's description in hand.

### Step 1: Analyze the job post and your resume

~~~text
Act as an ATS (applicant tracking system) and resume expert. Compare my resume to the job description below. Run every part in order and include all of them.

My resume:
[Paste your resume]

The job description:
[Paste the job description]

PART 1: JOB DESCRIPTION KEYWORDS
Pull out:
1. Hard skills and technical keywords: languages, tools, platforms, certifications, methods (for example Python, Salesforce, Agile, PMP, SQL)
2. Soft skills and competencies the ATS may score (for example cross-functional collaboration, stakeholder management)
3. Industry terms: jargon, acronyms and standards (for example SOX compliance, GMP, SaaS, B2B)
4. Action verbs and phrases the job description repeats
5. Required qualifications: degrees, years of experience, must-have credentials
6. Preferred qualifications: nice-to-have skills, bonus certifications, preferred experience

Show this as a keyword table:
Category | Keyword or phrase | Times in job description | Priority
Hard skill | Python | 3 | Critical
Hard skill | AWS | 2 | Critical
Soft skill | Cross-functional collaboration | 2 | High
Industry term | SaaS | 4 | Critical

Priority levels:
- Critical: mentioned 3+ times, or listed as a required qualification
- High: mentioned 2 times, or listed as a preferred qualification
- Medium: mentioned once in the body of the description
- Low: implied but not stated

PART 2: RESUME GAP ANALYSIS
1. Match score: the percentage of Critical and High keywords found in my resume. Show it as: ATS match score: XX% (XX of XX critical keywords found). Treat it as a rough guide, not a prediction.
2. Keywords present: each one, with the exact line where it appears.
3. Keywords missing: each one with its priority, where to add it (which section and which bullet), and a suggested phrasing that fits it in naturally.
4. Keyword density flags: any keyword used so often it looks like stuffing, and any important keyword that appears only once but should appear 2 to 3 times.

Show the missing keywords as a table:
Missing keyword | Priority | Where to add it | Suggested phrasing

Only suggest a keyword if my resume shows I have that experience. If I don't, list it under "Gaps to discuss" and say so plainly. Don't invent experience. In suggested phrasings, don't add numbers I haven't given you. Write (add your number) instead.

PART 3: ATS FORMATTING AUDIT
Check my resume for formatting that ATS software struggles with. Mark each line PASS or FAIL:
- Single-column layout (multi-column layouts often get scrambled)
- Standard section headings (Professional Experience, Education, Skills, Certifications), not creative ones like "Where I've Made an Impact"
- No tables, graphics, icons or images
- Contact details in the body, not in the header or footer (many systems skip those)
- Consistent date format (MM/YYYY or Month YYYY)
- Acronyms spelled out once with the short form, like Search Engine Optimization (SEO)
- Standard bullet characters
- No text boxes
Also note that a .docx file is usually the safest choice, since some ATS read PDFs poorly.
~~~

**Replace:** [Paste your resume], [Paste the job description]

### Step 2: Get the optimized resume

~~~text
Now write my full ATS-optimized resume.

1. Professional summary: 3 to 4 sentences that lead with the top Critical keywords. Mirror the job description's language where it's true for me.
2. Skills section: a Core Competencies or Technical Skills section right after the summary. Include every Critical and High keyword I can honestly claim, grouped by category (technical skills, tools and platforms, methods, certifications).
3. Professional experience: rewrite my bullets to:
   - start with strong action verbs from the job description
   - work the missing keywords in naturally
   - keep the CAR format (Challenge, Action, Result) with my real numbers
   - mirror the job description's phrasing without copying it
   - include 2 to 3 keyword-rich bullets per role that map to the job's requirements
4. Education and certifications: use the job description's exact terms where they match mine.
5. Keyword targets: each Critical keyword 2 to 3 times across the resume, each High keyword at least once, and no keyword more than 4 times.

Then close with an optimization summary table:
Measure | Before | After
ATS match score | XX% | XX%
Critical keywords found | X of X | X of X
High keywords found | X of X | X of X
Formatting issues | X | 0
Rough ATS fit | Low, Medium or High | Low, Medium or High

Finish with any extra recommendations for this role or industry.

Tone: professional and direct. This is a technical rewrite, not creative writing. Keep my real voice and real achievements. Never invent experience, numbers, employers or dates. If I'm missing a Critical keyword, list it as a gap instead of adding it.
~~~

**Replace:** Nothing. Paste it as is, right after Step 1.

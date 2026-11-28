# Dossier section prompts

These prompts build the rest of your dossier: reading the job post, your competitive edge (Section 4), your interview playbook (Section 6), your STAR stories (Section 7), your processes (Section 9), your interview strategy (Section 10), and the cover page, the How to Use page and the sources list that hold it all together. Replace everything in [square brackets] with your own details. Leave anything in {curly braces} alone: those are slots the AI fills.

The full dossier, in order: Cover page, How to use this dossier, 1. Role Overview, 2. Company Intel, 3. Who You'll Meet, 4. Your Competitive Edge, 5. Employer Objections, 6. Interview Playbook, 7. Your STAR Stories, 8. Questions to Ask, 9. Your Processes, 10. Interview Strategy, 11. Competitors and Industry Trends, 12. Interview Tips, All Sources.

The research sections (1, 2, 3 and 11) are in the company research prompts. Section 5 is in the objection card prompts, Section 8 in the questions to ask prompts, and Section 12 in the interview tips prompt.

Every prompt here works only from your resume and what you tell the AI. When something is missing, the AI should ask or leave a clear "Add:" note, never fill the gap with something made up. Results vary.

## Read the job post

**What it does:** Pulls the facts out of a job post so every section works from the same notes.
**When to use it:** First, before any other section.

### Step 1: Pull out the facts

~~~text
Read this job post and pull out the facts I need to prepare for my interview.

[Paste the job post]

Give me a table: Field | What the post says

Fields:
- Company name (exact)
- Job title (exact)
- Location and work model (on-site, hybrid or remote)
- Who the role reports to (if stated)
- Required skills, qualifications and experience (list each one)
- Preferred or nice-to-have skills (list each one)
- Tools and technologies named
- Years of experience asked for
- Pay range (with currency), or "Not stated"
- Words or phrases the post repeats (these are usually its priorities)

Only use what the post says. If a field isn't in the post, write "Not stated". If the company name is hidden (for example a recruiting agency post), tell me.
~~~

**Replace:** [Paste the job post]

## Your competitive edge

**What it does:** Shows where you match the job, with evidence from your resume, and what sets you apart.
**When to use it:** After the research sections. This is Section 4 of your dossier.

### Step 1: Match yourself to the job

~~~text
Act as my interview coach. Build Section 4 of my interview dossier: Your Competitive Edge, for [Job title] at [Company].

The job post:
[Paste the job post]

My resume:
[Paste your resume]

Anything about me that isn't on my resume:
[Wins, projects, a career change, or write "none"]

Use these headings:

## 4. Your Competitive Edge

### What makes you valuable here
2 to 3 sentences on what makes me a strong fit for this specific role. Point to real experience and results from my resume.

### Requirement match
A table: Requirement (from the post) | Your evidence (from my resume) | Strength
Cover every required skill and the most important preferred ones. Strength is Strong, Moderate or Gap. Be honest: a Gap is better to know now than in the room.

### What sets you apart
3 to 5 things that set me apart from other candidates, each tied to a real accomplishment from my resume.

Rules: Use only facts from my resume and what I've told you. Never invent numbers, employers, titles, dates or results. If a number would help and I haven't given one, ask me or write "Add: the number" in that spot. Label any estimate "(estimate, confirm)". Keep my scope: "helped with" stays "helped with".
~~~

**Replace:** [Job title], [Company], [Paste the job post], [Paste your resume], [Wins, projects, a career change, or write "none"]

## Interview playbook

**What it does:** Writes your "Tell me about yourself", 10 questions you're likely to get with a strategy and sample answer for each, and answers to 4 common questions.
**When to use it:** After your competitive edge and objections. This is Section 6 of your dossier.

### Step 1: Tell me about yourself

~~~text
Act as my interview coach. Write the "Tell me about yourself" answer for Section 6 of my interview dossier: Interview Playbook. It's a [Interview stage] interview for [Job title] at [Company].

The job post:
[Paste the job post]

My resume:
[Paste your resume]

What I know about the company (for the "why here" part):
[Paste your Company Intel section or notes, or write "none"]

Use the Present, Past, Future format:
- Present: what I do now, and the one result that best fits this role
- Past: how I got here, with 1 to 2 relevant wins (real numbers only)
- Future: why this role at this company, tied to something specific from the research

Rules for the answer:
- Get to the point in the first sentence. No life story.
- 150 to 250 words, which is about 60 to 90 seconds out loud. For a recruiter screen, also give a 30-second version.
- Use only facts from my resume and what I've told you.
- Write it the way people talk: short sentences, contractions, no buzzwords.

Lay it out like this:

## 6. Interview Playbook

### "Tell me about yourself"

> {The full answer, ready to rehearse}

- Format used: {the structure, and why it fits this role}
- Word count: {number} words
- Estimated delivery time: {number} seconds, at about 150 words a minute
- Cue card: 3 short bullets I can glance at
- Delivery tips: 2 to 3 practical tips for rehearsing this answer
~~~

**Replace:** [Interview stage], [Job title], [Company], [Paste the job post], [Paste your resume], [Paste your Company Intel section or notes, or write "none"]

### Step 2: Ten questions they're likely to ask

~~~text
Now write 10 interview questions tailored to [Job title] at [Company], for a [Interview stage] interview.

Base them on:
- The requirements the post lists first or repeats
- The company's industry, challenges and recent news from my research
- Behavioural and situational questions that fit this role
- Any Gap or Moderate rows in my requirement match

Show them as a table:

### Custom interview questions

| # | Question | Topic | Strategy | Sample answer |
|---|---|---|---|---|
| 1 | {question} | {topic area} | {2 to 3 sentences on how to answer and what to show} | {2 to 3 sentences using my real experience} |

Rules: Sample answers use only my real experience. If I don't have a good example for a question, write "No story yet" as the sample answer and give me one question to ask myself to find one. Never invent numbers or results.
~~~

**Replace:** [Job title], [Company], [Interview stage]

### Step 3: Four common questions

~~~text
Now write my answers to these four common questions, tailored to [Job title] at [Company].

### Common questions

**"Why do you want to work at [Company]?"**
2 to 3 sentences that point to specific things from my company research (a product, a recent move, one of their values) and connect them to my experience.

**"What is your greatest weakness?"**
A real weakness, plus what I'm doing about it. Pick something true and relevant that isn't a core requirement of this job. If I haven't told you a weakness, suggest 2 or 3 options based on my resume and my Gap rows, mark them "(pick one that's true for you)", and leave the growth part as "Add: what I'm doing about it".

**"What makes you unique for this role?"**
2 to 3 sentences built from my top differentiators.

**"Where do you see yourself in 5 years?"**
An honest answer that fits where the company is heading and where this role can lead.

Keep each answer short enough to say in under a minute. Use only my real facts.
~~~

**Replace:** [Job title], [Company]

## STAR stories mapped to this job

**What it does:** Pulls 5 to 8 true stories from your experience and maps each one to a requirement in the job post.
**When to use it:** After your playbook. This is Section 7 of your dossier.

### Step 1: Build the matrix and the cards

~~~text
Act as my interview coach. Build Section 7 of my interview dossier: Your STAR Stories, for [Job title] at [Company].

The key requirements from the job post:
[Paste the requirements, or the full job post]

My resume:
[Paste your resume]

My existing stories (if I have a story bank):
[Paste your stories, or write "none"]

Use these headings:

## 7. Your STAR Stories

### Quick reference matrix
A table: Story | Requirement(s) it covers

### Story cards
5 to 8 stories, most relevant first. For each one:

### {Story title}
Covers: {requirement from the post}

- **S (Situation):** 2 to 3 sentences. Where I was working and what was happening.
- **T (Task):** 1 to 2 sentences. The problem to solve and what was at stake.
- **A (Action):** 4 to 6 sentences. What I did, step by step. Use "I", not "we".
- **R (Result):** 2 to 3 sentences. What changed, with a number where I have one.

Rules:
- Only use real information from my resume, my stories and what I've told you. Never invent a story, a number, a quote or an outcome.
- If a card is missing a detail, don't fill it in. Write "Add:" and what's missing in that spot, for example "Add: how many people were on the team".
- If I don't have enough material for 5 stories, write as many as you can, list the requirements with no story yet, and give me one question per gap to help me find one.
- After the cards, list every "Add:" item under "Details to confirm".
~~~

**Replace:** [Job title], [Company], [Paste the requirements, or the full job post], [Paste your resume], [Paste your stories, or write "none"]

## Your processes

**What it does:** Turns how you already work into 2 to 3 short "How I approach..." answers.
**When to use it:** For any role where they'll ask how you'd do the job. This is Section 9 of your dossier.

### Step 1: Write your processes

~~~text
Act as my interview coach. Build Section 9 of my interview dossier: Your Processes, for [Job title] at [Company].

The job post:
[Paste the job post]

My resume:
[Paste your resume]

How I like to work:
[Anything about how you approach your work, or write "none"]

Write 2 to 3 processes I can explain when they ask "How do you approach...?" Match each one to a key responsibility in the post. For example, if the role runs projects, write "How I approach a new project".

Start the section with this line: "Draft, based on your resume. Change any step that isn't how you really work."

## 9. Your Processes

### How I approach {task}
Relevant to: {the requirement from the post}

1. **{Step name}:** 1 to 2 sentences on what I do and why.
2. **{Step name}:** 1 to 2 sentences.
3. **{Step name}:** 1 to 2 sentences.
4. **{Step name}:** 1 to 2 sentences.

Example: {a real project from my resume where I worked this way}

Rules: Base each process on how I've actually worked, from my resume and what I've told you, not on textbook steps. Never invent projects or results.
~~~

**Replace:** [Job title], [Company], [Paste the job post], [Paste your resume], [Anything about how you approach your work, or write "none"]

## Interview strategy

**What it does:** Sets what you need to find out, what you need them to remember, your salary numbers, and your must-haves and dealbreakers.
**When to use it:** The day before the interview. This is Section 10 of your dossier.

### Step 1: Build the strategy

~~~text
Act as my interview coach. Build Section 10 of my interview dossier: Interview Strategy, for my [Interview stage] interview for [Job title] at [Company].

My salary numbers, or the range I want:
[Your anchor, target and walk-away, or a range, or write "not sure yet"]

What matters most to me in my next role, and my dealbreakers:
[For example remote work, growth, team size, travel. Or write "not sure yet"]

The salary research from my dossier:
[Paste your salary estimates from Section 1, or write "none"]

Use these headings:

## 10. Interview Strategy

### What you need to learn about them
4 to 5 things to find out in this interview that the job post and research don't answer, and that would affect whether I'd accept an offer.

### What they need to know about you
4 to 5 key messages I must get across, based on my strongest matches.

### Salary positioning
- Anchor: what to say if they ask my expectations early
- Target: what I'm aiming for
- Walk-away: the lowest I'd accept
- 2 to 3 short phrases to use in salary conversations
If I gave you my numbers, use them. If I didn't, suggest an anchor and target based on the research, mark both "(estimate, confirm)", and leave the walk-away for me to set. Tell me how in one line: start from my real monthly costs times 12, plus a buffer, and remember that's take-home pay, so the salary I need before tax is higher.
Add one line: several provinces and US states require pay ranges in job posts, and some limit questions about pay history, so check the rules where I live.
End with: "This is general guidance, not legal or financial advice."

### Must-haves, dealbreakers and nice-to-haves
Three short lists, specific to this role and company:
- Must-haves: what this job needs to offer for me to say yes
- Dealbreakers: what would make me walk away
- Nice-to-haves: things that would make an offer better
Build these from what I told you. If I told you nothing, write a short suggested list and label it "Suggested: edit to match what matters to you."
~~~

**Replace:** [Interview stage], [Job title], [Company], [Your anchor, target and walk-away, or a range, or write "not sure yet"], [For example remote work, growth, team size, travel. Or write "not sure yet"], [Paste your salary estimates from Section 1, or write "none"]

## Cover page, how-to-use page and sources

**What it does:** Puts the dossier together: a cover page, a one-page guide to using it, and every source in one list at the end.
**When to use it:** At the start of your dossier (Step 1) and at the very end (Step 2).

### Step 1: Cover and how-to-use page

~~~text
Write the cover page and the "How to use this dossier" page for my interview dossier.

My name: [Your name]
Job: [Job title] at [Company]
Interview: [Interview stage] on [Interview date and time, with time zone]
Who I'm meeting: [Names and job titles, or "To be confirmed"]
Today's date: [Today's date]

Use this layout:

# Interview Prep Dossier

**{My name}**
**{Job title} at {Company}**
{Interview stage} · {Date and time} · {Who I'm meeting}
Prepared {today's date}

12 sections · Company and competitor research · Custom questions · STAR stories · Salary strategy

## How to use this dossier

{One warm sentence: everything I need for this interview, in one place.}

1. **Role Overview:** the job broken down into what matters, plus salary estimates
2. **Company Intel:** what they do, recent news, what employees say and any red flags
3. **Who You'll Meet:** the people on your schedule and a genuine way to connect with each
4. **Your Competitive Edge:** why you fit, requirement by requirement
5. **Employer Objections:** the doubts they might have about you, and your answers
6. **Interview Playbook:** your "Tell me about yourself", 10 likely questions and 4 common ones
7. **Your STAR Stories:** true stories from your experience, matched to this job
8. **Questions to Ask:** questions that show you did your homework
9. **Your Processes:** how you approach the key parts of this job
10. **Interview Strategy:** what to learn, what to get across, and your salary numbers
11. **Competitors and Industry Trends:** who they compete with and what's changing in their industry
12. **Interview Tips:** before, during and after, including video calls and body language

### How to prepare
Fit these steps to the days I have left before the interview:
1. **Two or three days before:** read Sections 1 to 3 until the company facts feel familiar, not memorized.
2. **Rehearse out loud:** say your "Tell me about yourself" (Section 6) 3 to 5 times. Time it. It should sound like you talking, not reading.
3. **Pick your stories:** choose the 3 to 4 stories in Section 7 that fit this job best.
4. **Pick your questions:** choose your top 3 to 4 questions from Section 8.
5. **Review the objections:** read Section 5 so nothing catches you off guard. A prepared answer takes the fear out of a tough question.
6. **The morning of:** reread Sections 4 and 10. Then close the dossier and trust your prep.

You've got this.
~~~

**Replace:** [Your name], [Job title], [Company], [Interview stage], [Interview date and time, with time zone], [Names and job titles, or "To be confirmed"], [Today's date]

### Step 2: All sources

~~~text
Now build the last page of my dossier: All Sources.

Collect every source from every section. Remove duplicates (the same link). Number them in one list, in the order they first appear:

## All Sources

1. {Page title}, {Site}. Published {date, or "date not shown"}. Accessed {today's date}. {Link}

Mark any source published more than 12 months ago "(older than 12 months)".

End with this note, word for word:
"This dossier was prepared with AI-assisted research. Check company facts, people and salary figures yourself before you rely on them. Links and facts were correct when researched but can change. Results vary."
~~~

**Replace:** Nothing. Use this at the end, after all the sections.

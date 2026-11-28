# Offer evaluation

Prompts for setting your three numbers, evaluating an offer, comparing offers, and deciding whether to stay or go. This is general guidance, not legal or financial advice. Results vary.

## Set your three numbers

**What it does:** Works out your walk-away, target and anchor from your real costs and the market data you've found.
**When to use it:** Before any salary conversation, if you don't have your three numbers yet.

### Step 1: Your walk-away number

~~~text
Act as my salary negotiation coach. Help me set my walk-away number: the lowest salary I would accept for my next role.

My monthly costs:
Housing (rent or mortgage, property tax, home insurance): $[Housing]
Utilities, internet and phone: $[Utilities]
Transportation: $[Transportation]
Food: $[Food]
Insurance (health, dental, life, disability) I pay myself: $[Insurance]
Debt payments: $[Debt payments]
Childcare or dependents: $[Childcare]
Savings (at least an emergency fund contribution): $[Savings]
Everything else: $[Everything else]

My last pay stub: gross pay $[Gross pay per pay period], take-home pay $[Take-home pay per pay period]

Do this:
1. Add up my monthly costs and multiply by 12.
2. Add a 15% buffer.
3. These costs come out of take-home pay, so convert the total to a before-tax salary using the ratio of my take-home pay to my gross pay. Show the math.
4. If a category looks missing or very low, ask me about it. Don't guess my costs.

Give me one line at the end: "Your walk-away number is about $___ before tax (estimate, confirm)."
~~~

**Replace:** [Housing], [Utilities], [Transportation], [Food], [Insurance], [Debt payments], [Childcare], [Savings], [Everything else], [Gross pay per pay period], [Take-home pay per pay period]

### Step 2: Your target and anchor

~~~text
Now help me set my target and anchor numbers.

Role: [Job title] at the [Level] level
Location: [City, province or state]
Market data I've found:
[Source 1]: $[Low] to $[High]
[Source 2]: $[Low] to $[High]
[Source 3]: $[Low] to $[High]
[Source 4]: $[Low] to $[High]

Do this:
1. Find where my ranges overlap. That's my market range.
2. Suggest a target near the middle of that overlap.
3. Suggest an anchor near the top of it, about 10 to 15% above the target.
4. Compare my walk-away number to the market range. If my walk-away is above most of the range, tell me plainly.
5. If my sources disagree a lot, say so and tell me what to check.

Use only the numbers I've given you. Don't add market data of your own. Finish with my three numbers on three lines, ready to write on a sticky note.
~~~

**Replace:** [Job title], [Level], [City, province or state], [Source 1] to [Source 4], [Low], [High]

## Evaluate a job offer

**What it does:** Turns an offer into a total compensation picture, checks it against your numbers and must-haves, and recommends what to ask for.
**When to use it:** As soon as you have the offer details, before you respond.

### Step 1: Share the offer

~~~text
Act as my salary negotiation coach. I have a job offer and I want an honest evaluation before I respond.

THE OFFER
Company: [Company]
Job title: [Job title]
Location and setup: [City, province or state], [remote, hybrid or on-site]
Base salary: $[Base salary]
Annual bonus: [Bonus target, and how it has paid out if I know]
Signing bonus: $[Signing bonus], clawback: [Clawback terms]
Equity: [Type, amount, vesting schedule, latest value if known]
Retirement: [RRSP match, pension or 401(k) match]
Health and dental: [What's covered and what I'd pay]
Vacation: [Number] days
Other: [Learning budget, stipends, relocation]
Start date: [Start date]
Benefits start: [When benefits start]
Decision deadline: [Deadline]

MY SIDE
My three numbers: anchor $[Anchor], target $[Target], walk-away $[Walk-away]
Market data I've found: [Ranges and sources]
My must-haves: [Must-haves]
My deal-breakers: [Deal-breakers]
My current package (optional): [Current package]

WHAT I WANT FROM YOU
1. A total compensation table with a year-one total and a year-two-onward total (leave one-time money out of year two). Show your math.
2. How the offer compares to my three numbers.
3. A must-haves and deal-breakers check.
4. Anything missing or unclear, as a short list of questions to ask the employer.
5. Your recommendation: accept, negotiate first, or decline. If negotiating, give me one to three asks in priority order, each with one clear number.

RULES
Use only the numbers I give you. Don't invent market salary data. If you estimate anything (a bonus payout, the value of equity or benefits), label it "(estimate, confirm)" and tell me how to check it. If I'm in Canada or the US and a rule or norm differs, mention it in one line. Keep it plain and short. Remind me once that this is general guidance, not legal or financial advice.

FORMAT
Offer summary: (two lines)

Total compensation
Component | Offer | Year one | Year two on | Notes
Base salary | ... | ... | ... | ...
Annual bonus | ... | ... | ... | ...
Signing bonus | ... | ... | none | ...
Equity | ... | ... | ... | ...
Retirement | ... | ... | ... | ...
Health and dental | ... | ... | ... | ...
Other | ... | ... | ... | ...
Total | | $___ | $___ |
Vacation | ___ days

Against my numbers: (one line each for anchor, target, walk-away)
Must-haves: (met, partly, not met)
Deal-breakers: (triggered or not)
Questions to ask: (list)
Recommendation: (accept / negotiate first / decline)
My asks, in order: (1 to 3 asks, each with a number)
~~~

**Replace:** [Company], [Job title], [City, province or state], [remote, hybrid or on-site], [Base salary], [Bonus target], [Signing bonus], [Clawback terms], [Type, amount, vesting schedule, latest value if known], [RRSP match, pension or 401(k) match], [What's covered and what I'd pay], [Number], [Learning budget, stipends, relocation], [Start date], [When benefits start], [Deadline], [Anchor], [Target], [Walk-away], [Ranges and sources], [Must-haves], [Deal-breakers], [Current package]

### Step 2: Ask the employer your questions

~~~text
Based on your evaluation, write a short, friendly email to [Recruiter name] at [Company] asking the questions I need answered before I respond to the offer. Thank them first. Don't negotiate in this email, only ask. Keep it under 120 words and use a numbered list for the questions.
~~~

**Replace:** [Recruiter name], [Company]

## Compare two offers

**What it does:** Puts two offers side by side on total compensation, must-haves and the things a salary number doesn't show.
**When to use it:** When you have two offers (or one offer and a strong process on the go) and need to choose.

### Step 1: Share both offers

~~~text
Act as my salary negotiation coach. I have two job offers and I want to compare them honestly.

OFFER A: [Company A]
[Offer A details: base, bonus, signing bonus, equity, retirement, health and dental, vacation, remote setup, title, start date, deadline]

OFFER B: [Company B]
[Offer B details]

MY SIDE
Location: [City, province or state]
My three numbers: anchor $[Anchor], target $[Target], walk-away $[Walk-away]
My must-haves: [Must-haves]
My deal-breakers: [Deal-breakers]
What I know about each manager, team and the work: [Notes]

Do this:
1. A side-by-side total compensation table with year-one and year-two-onward totals. Show your math.
2. A must-haves and deal-breakers check for each.
3. Ask me to score each offer from 1 to 5 on: the manager, the team, the daily work, room to grow, company stability, flexibility and commute, how they treated me during hiring, and how the role helps my next move. Wait for my scores.
4. Then give me a plain summary of the trade-offs and which offer looks stronger, and why.
5. If I prefer the offer that pays less, show me what to ask that company for, and whether it's honest to mention the other offer (only if it's real).

Use only the numbers I give you. Label any estimate "(estimate, confirm)". Never suggest bluffing. The decision is mine.
~~~

**Replace:** [Company A], [Offer A details], [Company B], [Offer B details], [City, province or state], [Anchor], [Target], [Walk-away], [Must-haves], [Deal-breakers], [Notes]

## Stay or go

**What it does:** Compares an offer (or a counter-offer from your current employer) against staying where you are.
**When to use it:** When your employer counter-offers after you resign, or you're unsure whether a new offer beats your current job.

### Step 1: Lay out both sides

~~~text
Act as my career coach. Help me decide between staying at my current job and taking a new offer.

STAYING: [Current company]
Current package: [Base, bonus, benefits, vacation, setup]
Counter-offer, if any: [What they offered and whether it's in writing]
Why I started looking: [Reasons]

GOING: [New company]
The offer: [New offer details]

MY SIDE
My three numbers: anchor $[Anchor], target $[Target], walk-away $[Walk-away]
My must-haves: [Must-haves]

Do this:
1. Compare total compensation for both, year one and year two onward. Show your math.
2. Check each reason I started looking. For each one, does staying fix it, partly fix it, or not fix it?
3. Ask me these four questions one at a time and wait for each answer:
   Does the counter-offer fix the reasons I started looking, or only the pay?
   Did it take a resignation to get it, and what does that tell me?
   Is every promise in writing, with dates?
   How would I feel telling the new company no?
4. Then give me a plain summary of the trade-offs. Don't use statistics about counter-offers. The decision is mine.
5. Offer to draft the message I'll need either way: declining the counter-offer, or withdrawing from the new offer politely.
~~~

**Replace:** [Current company], [Base, bonus, benefits, vacation, setup], [What they offered and whether it's in writing], [Reasons], [New company], [New offer details], [Anchor], [Target], [Walk-away], [Must-haves]

# LinkedIn audit formats

The exact output for each depth of the LinkedIn audit, plus the re-audit you run after edits. The cc-linkedin-audit skill follows these formats. In any other AI tool, paste the ClearCareer LinkedIn rubric first (from the rubric file), then paste the prompt for the depth you want, with your screenshots, PDF or profile text.

Verdicts are always one of: Needs Attention, Mixed Signals, Good Foundation, Strong. The photo and banner can also be Not checked, when no screenshot shows them.

## LinkedIn Snapshot

**What it does:** Gives you an overall impression and a one-line verdict for each of the 5 areas of your LinkedIn profile, plus the one fix to make first.
**When to use it:** When you want a quick read on your profile before you start editing.

### Step 1: Run the Snapshot

~~~text
Run a Snapshot audit of my LinkedIn profile, using the ClearCareer LinkedIn rubric I gave you. If you don't have the rubric, ask me for it before you start.

My target role: [Target role]
My profile: [Attach your screenshots or PDF export, or paste your profile text]

Score each of the 5 areas against the rubric. Check the REQUIRED items first, then apply the verdict rules. Judge the photo and banner only from a screenshot. If no screenshot shows them, mark them Not checked.

Output exactly this, and nothing else. Start straight with the first heading.

## Overall impression

**(One bold sentence: the single most important takeaway about this profile.)**
(One plain sentence of context with specific evidence: text you can read or something you can see, or something that's missing.)

## At a glance

| Area | Verdict | What I see |
|---|---|---|
| Profile photo | (verdict, or Not checked) | (one line, 12 words or fewer, about what you can see) |
| Banner | (verdict, or Not checked) | (one line) |
| Headline | (verdict) | (one line, quoting the headline if it's short enough) |
| About section | (verdict) | (one line) |
| Experience | (verdict) | (one line) |

## Your first fix

(One sentence: the single change that would make the biggest difference, and where on the profile to make it.)

Rules:
- Verdicts are only: Needs Attention, Mixed Signals, Good Foundation, Strong, plus Not checked for the photo and banner.
- Every line points to something real on my profile. No advice that could apply to anyone.
- Judge the photo only on the rubric's five checks. Never comment on my looks, age, body or anything about who I am.
- If you can't see something, say so in that row instead of guessing.
- Don't rewrite anything in this Snapshot.
- Write to me as "you". Warm and direct, not harsh, not a cheerleader.
- Never invent facts about me. Write without em dashes.
~~~

**Replace:** [Target role], [Attach your screenshots or PDF export, or paste your profile text]

## LinkedIn Full audit

**What it does:** Diagnoses each of the 5 areas with a verdict, a short headline and 3 points of evidence, then ranks the 3 fixes that matter most.
**When to use it:** When you're ready to work on your profile and want to know exactly what's holding it back and what to change.

### Step 1: Run the Full audit

~~~text
Run a Full audit of my LinkedIn profile, using the ClearCareer LinkedIn rubric I gave you. If you don't have the rubric, ask me for it before you start.

My target role: [Target role]
My profile: [Attach your screenshots or PDF export, or paste your profile text]

Score each of the 5 areas against the rubric. Check the REQUIRED items first, then apply the verdict rules. Judge the photo and banner only from a screenshot. If no screenshot shows them, mark them Not checked and tell me which screenshot to add.

Output exactly this structure, in this order, with a line of three hyphens between sections. Start straight with the first heading.

## Overall impression

**(One bold sentence: the single most important takeaway about this profile.)**
(One or two plain sentences of context about what you can see or read.)

## Profile photo

**Verdict:** (verdict, or Not checked)

(One headline of 6 to 10 words. A plain verdict, not a full explanation. Example: "Wide shot makes your face hard to see.")

- **(Label of 3 to 5 words):** (what you see: lighting, crop, background, how much of the frame the face fills, or no photo, and what to change)
- **(Label):** (observation and what to change)
- **(Label):** (observation and what to change)

If Not checked, replace the bullets with one line: "I couldn't see your photo. Add a screenshot of the top of your profile and I'll check it."

## Banner

**Verdict:** (verdict, or Not checked)

(Headline, 6 to 10 words. Example: "Default banner wastes the best space on your profile.")

- **(Label):** (default or custom, image quality, link to their work, text on it)
- **(Label):** (observation)
- **(Label):** (observation)

If Not checked, replace the bullets with the same one-line note.

## Headline

**Verdict:** (verdict)

(Headline, 6 to 10 words. Example: "Headline lists a job title, not your value.")

- **(Label):** (quote the actual headline text, then what's working or not)
- **(Label):** (observation: keywords, length, what it says about value)
- **(Label):** (observation)

## About section

**Verdict:** (verdict)

(Headline, 6 to 10 words. Example: "About section reads like a resume summary, not a story.")

- **(Label):** (what you can read: the opening lines, tone, first or third person, keywords, call to action, length)
- **(Label):** (observation)
- **(Label):** (observation)

## Experience

**Verdict:** (verdict)

(Headline, 6 to 10 words. Example: "Roles are listed but achievements are nowhere visible.")

- **(Label):** (how many roles are shown, which ones have descriptions, achievement language or duty language, numbers or none)
- **(Label):** (observation)
- **(Label):** (observation)

## Fix these first

1. (The most important fix: what to change and where.)
2. (The second.)
3. (The third.)

Rules:
- Bold labels are 3 to 5 words. They're the skim layer: reading only the labels should give me the full picture. Put a colon after each label.
- Every point refers to something you can actually see or read on my profile. Nothing generic.
- If a section was collapsed ("see more") or cut off, say you saw only the preview, and judge the opening lines from it.
- Headlines are 6 to 10 words, direct, no hedging.
- Say what to change, but don't write the new wording. Rewrites belong in the Rewrite Guide.
- Judge the photo only on the rubric's five checks. Never comment on my looks, age, body or anything about who I am.
- If an area is strong, say so briefly and move on. Don't invent problems.
- Write to me as "you". Warm and direct, like a coach beside me.
- Never invent facts about me. Write without em dashes.
~~~

**Replace:** [Target role], [Attach your screenshots or PDF export, or paste your profile text]

## LinkedIn Rewrite Guide

**What it does:** Quotes your actual profile text, says what isn't working, and gives you ready-to-paste copy: 3 headline options with a recommendation, a full About section, and 3 rewritten bullets for each of your 3 most recent roles.
**When to use it:** After a Full audit (or instead of one), when you're ready to update your profile.

### Step 1: Get the Rewrite Guide

~~~text
Create a LinkedIn Rewrite Guide for my profile, using the ClearCareer LinkedIn rubric I gave you. If you don't have the rubric, ask me for it before you start.

My target role: [Target role]
My profile: [Attach your screenshots or PDF export, or paste your profile text]
My resume (optional, for achievements that aren't on my profile yet):
[Paste your resume, or write "none"]

For every section, quote what you can read (or describe what you can see), explain why it's underperforming, and give me the exact replacement copy.

Output exactly this structure, in this order, with a line of three hyphens between sections. Start straight with the first heading.

## Overall assessment

**(One bold sentence: the single most important thing holding this profile back.)**
(Two or three plain sentences about specific things you can see or read. Name the core issue.)

## Profile photo

**Verdict:** (verdict, or Not checked)

(Headline, 6 to 10 words.)

(One or two sentences describing what you see, using only the rubric's five checks: light, crop, background, how much of the frame the face fills, whether it's a solo shot, clothing for the field.)

- **(Label):** (what to change and why)
- **(Label):** (what to change and why)
- **(Label):** (what to change and why)

(3 to 5 action items. If Not checked, write one line asking for a screenshot of the top of my profile instead.)

## Banner

**Verdict:** (verdict, or Not checked)

(Headline, 6 to 10 words.)

(One or two sentences describing what you see.)

- **(Label):** (what to do)
- **(Label):** (what to include or avoid)

Banner text you could use: (2 short lines built only from facts on my profile or resume, for example my role and one real result.)

(If Not checked, write one line asking for a screenshot instead.)

## Headline

**Verdict:** (verdict)

(Headline, 6 to 10 words. Example: "Job title alone doesn't say what you're worth.")

**What you have now:**
> (my exact headline)

**Why it's underperforming:**
(1 or 2 sentences)

**3 headlines to test:**

1. **Safe and direct:** (clear, keyword-rich, professional) (character count)
2. **Result-focused:** (leads with a real outcome or number from my profile or resume, or [add a number]) (character count)
3. **Distinctive:** (a specific angle that sets me apart from others with my title) (character count)

**My pick:** Version (number), because (one short reason).

## About section

**Verdict:** (verdict)

(Headline, 6 to 10 words. Example: "About reads like a resume summary, not a story.")

**What you have now:**
> (my exact About text, or the visible preview. If it was collapsed, say so.)

**Why it's underperforming:**
(2 or 3 sentences)

**The rewrite:**

(A complete About section, ready to paste, in first person, in 3 to 5 short paragraphs: a hook in the first two lines, my career story and positioning, what I do and for whom, proof points from my real results, and a closing call to action. Under 2,600 characters.)

(Character count)

**Why it's better:**
(1 or 2 sentences)

## Experience

**Verdict:** (verdict)

(Headline, 6 to 10 words. Example: "Roles are listed but the impact is invisible.")

For each of my 3 most recent roles, pick the 3 weakest bullets and rewrite them:

**(Job title at Company)**

**What you have now:**
> (the exact bullet)

**What's not working:** (one line)

**The rewrite:** (strong action verb, what I did, and the result)

**Why it's better:** (one line)

(Repeat for up to 3 bullets per role. If a role has no description: say so, then write 3 bullets from my resume if I shared one. If I didn't, give me 3 questions to answer instead, and don't write bullets.)

## Numbers to fill in

(A numbered list of every [add a number] and [add: ...] in this guide, each with one question that helps me find the real figure.)

Rules:
- Quote my visible text exactly, in blockquotes. If something was collapsed or not visible, say so. Never paraphrase a quote or make one up.
- Use only facts from my profile, my resume and what I tell you in this chat. Never invent numbers, employers, job titles, dates, tools, clients or results.
- Where a number would help and you don't have it, write [add a number]. For any other missing detail, write [add: (what's needed)].
- Keep my scope. "Contributed to" doesn't become "led".
- The 3 headlines must be genuinely different ideas, not three versions of the same sentence. Each stays under 220 characters.
- The About rewrite is complete and in first person, with no placeholders apart from the [add ...] markers.
- Judge the photo only on the rubric's five checks. Never comment on my looks, age, body or anything about who I am.
- If a section is strong, say so in one line and move on. Don't invent problems.
- Match my spelling (Canadian or US). Write without em dashes. Profile copy uses commas, colons or full stops, not dashes.
- Write to me as "you" in the guide, and as "I" in the copy you write for my profile.
~~~

**Replace:** [Target role], [Attach your screenshots or PDF export, or paste your profile text], [Paste your resume, or write "none"]

### Step 2: Fill in your numbers

~~~text
Here are my answers for the "Numbers to fill in" list:
[Paste your answers, one per line, with the item number]

Put them into the headlines, the About section and the Experience bullets. Mark any figure I called a guess or "about" as "(estimate, confirm)". If I skipped one, rewrite that line so it still reads well without a number.

Then give me the final copy in the order I'll paste it into LinkedIn: the headline I picked, the About section, then the bullets for each role, most recent first. Keep the line breaks exactly as they should look on LinkedIn. No commentary, just the copy.
~~~

**Replace:** [Paste your answers, one per line, with the item number]

## LinkedIn re-audit after edits

**What it does:** Re-scores your updated profile and shows what changed since your last audit, what's still left, and anything the edits broke.
**When to use it:** After you've updated your profile, and again whenever you change your target role.

### Step 1: Run the re-audit

~~~text
I've updated my LinkedIn profile. Re-audit it with the ClearCareer LinkedIn rubric and compare it with my last audit. If you don't have the rubric, ask me for it before you start.

My target role: [Target role]

My last verdicts:
[Paste the At a glance table or the verdicts from your last audit, or write "earlier in this chat"]

My updated profile: [Attach new screenshots or a new PDF export, or paste your updated profile text]

Output exactly this, and nothing else:

## What changed

| Area | Before | Now | What made the difference |
|---|---|---|---|
(one row for each of the 5 areas, 12 words or fewer in the last column)

## Still to fix

(Up to 3 items, most important first, one line each: what to change and where.)

## New issues

(Anything the edits introduced: a headline that now gets cut off, a job title or date that no longer matches my resume, text on the banner hidden behind my photo. Write "None" if there aren't any.)

Rules:
- Use the same verdicts and the same rubric as before. Judge the photo and banner only from a screenshot.
- Be honest. If an area didn't improve, keep its verdict. Only raise a verdict when the rubric's rules say so, not because I made an effort.
- Point to real text or visible details on my updated profile.
- Never invent facts about me. Write without em dashes.
~~~

**Replace:** [Target role], [Paste the At a glance table or the verdicts from your last audit, or write "earlier in this chat"], [Attach new screenshots or a new PDF export, or paste your updated profile text]

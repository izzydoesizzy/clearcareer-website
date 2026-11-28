# Resume scoring rubric

This is the checklist behind every resume audit: 6 areas, 5 checks each, and the rules that turn the checks into a verdict. The cc-resume-review skill reads it before scoring. In any other AI tool, paste it first, then paste the audit prompt you want from the formats file.

## ClearCareer resume rubric

**What it does:** Gives the AI the exact checklist and verdict rules for scoring a resume, so every audit is consistent.
**When to use it:** Paste it first in a new chat, before the Snapshot, Full audit, Rewrite Guide or Re-audit prompt.

### Step 1: Give the AI the rubric

~~~text
CLEARCAREER RESUME RUBRIC

Use this rubric to score every resume audit I ask for in this chat.

It has 6 areas. Each area has 5 checks. Checks marked REQUIRED matter most, so check them first. A failed REQUIRED check keeps an area from the top verdict, and the verdict rules under each area say exactly where it lands.

The 4 verdicts, from weakest to strongest:
Needs Attention, Mixed Signals, Good Foundation, Strong.

For each check, decide: met, partly met or not met. Base every decision on what is actually in the resume. Then apply the verdict rules for that area.

AREA 1: FIRST IMPRESSIONS AND LAYOUT

[ ] REQUIRED Clear hierarchy: someone skimming for a few seconds can find the person's name, their current or most recent job title, and the company.
[ ] Clean, readable layout: easy to skim. No crowded columns, boxes or sidebars that make the eye jump around.
[ ] Consistent formatting: fonts, bullet styles, date formats and spacing match from top to bottom.
[ ] Right length: as a rule of thumb, 1 page for under 10 years of experience, up to 2 pages for 10 years or more. Not padded with filler, not crammed to fit.
[ ] No distracting design: no photo, heavy borders, graphics, charts, skill bars or decoration that waste space or confuse applicant tracking systems. (Canada and the US share the same norm here: also leave off date of birth, marital status and a full home address. City and province or state is enough.)

Verdict rules:
- Needs Attention: the REQUIRED check fails, or 2 or more other checks clearly fail.
- Mixed Signals: the REQUIRED check is met, but 1 or 2 other checks clearly fail (for example, inconsistent formatting throughout, or a length that's well off).
- Good Foundation: every check is mostly met. Small inconsistencies or a slight length issue that won't distract a reader.
- Strong: every check is fully met. The layout helps the reader skim and find what they need. Nothing distracts.

AREA 2: STORY AND POSITIONING

[ ] REQUIRED Has a summary: there's a summary, profile or positioning statement near the top.
[ ] REQUIRED Summary names a target: it names a specific role type, industry or level ("senior operations leader in financial services", not "results-driven professional").
[ ] About value, not wants: it says what the person offers, not what they want from a job. No "seeking a role where I can grow".
[ ] Clear career thread: the titles and moves tell a story a stranger could follow from early career to today.
[ ] Pivots are explained: a big switch of industry or function is bridged in the summary. A hard switch with no context raises questions.

Verdict rules:
- Needs Attention: either REQUIRED check fails. There's no summary, or the summary has no target.
- Mixed Signals: both REQUIRED checks are met, but the summary is generic or full of cliches, or the career story has a visible gap or pivot that nothing explains.
- Good Foundation: clear positioning and a clear career thread. Small clarity issues that a quick rewrite would fix.
- Strong: the summary says right away who this person is and who they're for. The career story backs up the target.

AREA 3: ACHIEVEMENTS VS. RESPONSIBILITIES

[ ] REQUIRED Numbers: bullets include numbers, percentages, dollar amounts, volumes or timeframes. Approximate figures count.
[ ] REQUIRED Strong action verbs: bullets open with specific verbs (Led, Grew, Cut, Launched, Negotiated), not "Responsible for", "Helped", "Assisted with" or "Worked on".
[ ] Mostly achievements: more than half the bullets describe outcomes and results, not just tasks or duties.
[ ] CAR structure: bullets show the Challenge (or situation), the Action and the Result, not the action alone.
[ ] Impact is clear on its own: a hiring manager can see the business impact from the bullet alone, without needing to ask a follow-up question.

Verdict rules:
- Needs Attention: both REQUIRED checks fail (no numbers and weak verbs), or almost every bullet is a duty with no impact at all.
- Mixed Signals: one REQUIRED check fails, or numbers show up in only 1 or 2 bullets as a token gesture while most bullets are duties.
- Good Foundation: both REQUIRED checks are met. Most bullets show impact or numbers. Some duty language remains, but it doesn't dominate.
- Strong: every check is met. Bullets show measurable business impact again and again. A hiring manager can clearly see results.

AREA 4: KEYWORDS AND ATS

(ATS means applicant tracking system: the software many employers use to collect, sort and search applications.)

[ ] REQUIRED Role keywords: words for the target role show up naturally, in context (in the summary and bullets, not only in a list). If there's a job post, compare against the words in that post.
[ ] Skills section: there's a section for skills, tools, competencies or areas of expertise.
[ ] Matches how jobs are posted: the terms match how similar roles are advertised (for example "P&L management" rather than "budget oversight", if that's the field's language).
[ ] ATS-friendly format: no multi-column layouts, text boxes, tables, key details in headers or footers, or graphics that parsing software can drop or scramble.
[ ] No keyword stuffing: keywords appear in real context, not dumped in a block or hidden in white text to game the system.

Verdict rules:
- Needs Attention: the REQUIRED check fails (no role keywords at all), or the formatting is risky enough that parsing software could scramble or drop key details.
- Mixed Signals: some keywords are there, but there's a real mismatch in vocabulary, or the formatting is partly risky.
- Good Foundation: keywords are present and well placed. The language mostly matches. Small gaps, or one formatting risk.
- Strong: keywords run through the whole resume. The language closely matches the target role. No visible ATS risks.

AREA 5: CAREER STORY AND TRAJECTORY

[ ] REQUIRED Leads to the target: the progression points logically toward the role or level the person is going for now.
[ ] Growth or deliberate moves: titles, scope and responsibilities grow over time, or sideways moves clearly build toward a goal.
[ ] Gaps are handled: as a rule of thumb, gaps of 6 months or more are either absent or addressed (a short note, a mention in the summary, or dates that make sense).
[ ] Reasonable tenure: as a rule of thumb, about 18 months or more per job on average. Stints under 12 months are explained or grouped (contract, consulting, a company closure).
[ ] Consistent signals: titles, company sizes and scope tell a consistent story. Anything surprising (for example, a VP title at a 3-person startup right after a director role at a large company) gets a line of context.

Verdict rules:
- Needs Attention: the REQUIRED check fails (the path clearly doesn't lead to the target), or there are unexplained gaps of 6 months or more that will raise flags right away.
- Mixed Signals: the path is there, but it raises questions a hiring manager would ask straight away: short stints, a pivot, or scope that doesn't add up, with nothing on the page addressing it.
- Good Foundation: the path is clear and makes sense. Small questions exist, but they're easy to answer in an interview and don't dominate the first read.
- Strong: the path clearly supports the target role and reads as a logical route to it.

AREA 6: LANGUAGE AND PRESENCE

[ ] REQUIRED No filler phrases: no "responsible for", "assisted with", "helped to", "worked on", "involved in", "participated in" or "supported the team".
[ ] No tired cliches: no "detail-oriented", "team player", "results-driven", "passionate about", "dynamic", "go-getter" or "motivated self-starter".
[ ] Consistent tense: present tense for the current job, past tense for past jobs, and no mixing within one job.
[ ] No first person: no "I", "my", "me" or "our" in the body text.
[ ] Matches seniority: the words fit the career level. Junior people shouldn't sound like executives, and senior people shouldn't sound like coordinators.

Verdict rules:
- Needs Attention: the REQUIRED check fails (filler phrases throughout: in 3 or more jobs, or in the summary), or the language signals a much lower level than the experience.
- Mixed Signals: some filler in 1 or 2 jobs. Cliches weaken the impact. Tense or pronoun slips show up more than once.
- Good Foundation: the language is mostly strong. A bit of filler or a cliche or two that a 30-minute edit would clear up.
- Strong: clear, confident language that fits the person's level. No filler, no cliches, no passive phrasing.

HOW TO USE THIS RUBRIC

- Every verdict needs evidence: quote or name the actual line, job title, company or number, or point out what's missing.
- If an area is strong, say so. Don't invent problems to fill space.
- If you can't check something (for example, layout from pasted text, or page count), say so instead of guessing.
- Never invent facts about the person: no numbers, employers, titles, dates, tools or results they didn't give.
- Write without em dashes.

If I haven't sent my resume yet, reply only: "Rubric ready. Send your resume, your target role or a job post, and the audit prompt you want."
~~~

**Replace:** Nothing. Paste it as it is.

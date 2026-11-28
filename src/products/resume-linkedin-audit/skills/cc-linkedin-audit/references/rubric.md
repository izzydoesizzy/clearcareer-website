# LinkedIn scoring rubric

This is the checklist behind every LinkedIn audit: 5 areas, 4 or 5 checks each, and the rules that turn the checks into a verdict. The cc-linkedin-audit skill reads it before scoring. In any other AI tool, paste it first, then paste the audit prompt you want from the formats file.

## ClearCareer LinkedIn rubric

**What it does:** Gives the AI the exact checklist and verdict rules for scoring a LinkedIn profile, so every audit is consistent.
**When to use it:** Paste it first in a new chat, before the Snapshot, Full audit, Rewrite Guide or Re-audit prompt.

### Step 1: Give the AI the rubric

~~~text
CLEARCAREER LINKEDIN RUBRIC

Use this rubric to score every LinkedIn audit I ask for in this chat.

It has 5 areas: Profile photo, Banner, Headline, About section and Experience. Checks marked REQUIRED matter most, so check them first. A failed REQUIRED check keeps an area from the top verdict, and the verdict rules under each area say exactly where it lands.

The 4 verdicts, from weakest to strongest:
Needs Attention, Mixed Signals, Good Foundation, Strong.

One more status for the photo and banner only:
Not checked: I didn't share a screenshot that shows it. Say so. Never guess.

For each check, decide: met, partly met or not met. Base every decision on what you can actually see or read. Then apply the verdict rules for that area.

AREA 1: PROFILE PHOTO (judge from a screenshot only)

[ ] REQUIRED Photo exists: there's a real photo, not LinkedIn's default grey silhouette.
[ ] REQUIRED Solo headshot: it's just them. Not a group shot, not cropped out of a group, not a photo with a pet, not a vacation shot.
[ ] Face clearly visible: their face is the clear subject and fills most of the frame, not a small figure in a wide shot.
[ ] Suits the field: the clothing fits their industry and target role. Both extremes (very formal for a casual field, beachwear for anything) work against them.
[ ] Good light, clean background: even, flattering light and a plain or non-distracting background. Harsh shadows, clutter and party settings hurt credibility.

Judge the photo only on these five checks. Never comment on the person's looks, age, body, skin, hair, disability, religious dress or anything else about who they are. If they use the #OpenToWork photo frame, that's their choice: don't mark the photo down for it.

Verdict rules:
- Needs Attention: a REQUIRED check fails (no photo, or not a solo headshot), or the photo would undercut their credibility at first glance.
- Mixed Signals: a solo photo exists, but the quality issues are big: very poor lighting, very casual for the target role, or a distracting background.
- Good Foundation: a professional, recognizable headshot. Small issues (a slightly off crop, casual but tidy) that don't hurt credibility.
- Strong: confident, approachable and professional. Good light, clean background, clothing that fits the field. Builds trust right away.
- Not checked: no screenshot shows the photo.

AREA 2: BANNER (judge from a screenshot only)

[ ] REQUIRED Custom banner: they've replaced LinkedIn's plain default background with their own image.
[ ] Looks intentional: it looks deliberate and well made, not like a random photo or a rushed image.
[ ] Fits their work: it reflects their field, profession or brand. Not a holiday photo with no link to their work.
[ ] Says something: it has text such as their name, headline, a tagline, a credential or a key result.

Verdict rules:
- Needs Attention: the REQUIRED check fails. The default banner is still there, which tells visitors nobody has worked on this profile.
- Mixed Signals: it's custom, but it's a generic stock photo, a personal photo with no link to their work, or a low-quality image that doesn't back up their brand.
- Good Foundation: custom, professional-looking and relevant to their field. It may have no text, but it doesn't hurt.
- Strong: custom and backs up their brand. Well made. Text, a credential or an image tells the viewer something about who this person is.
- Not checked: no screenshot shows the banner.

AREA 3: HEADLINE

[ ] REQUIRED More than title and company: it goes beyond "Marketing Manager at Acme Corp", which is what LinkedIn fills in by default.
[ ] REQUIRED Value or difference: it says what they do and for whom, or the result they deliver. Not just a label.
[ ] Search keywords: it includes the words recruiters search for in their target role (for example "Supply Chain Director | Operations | Lean Six Sigma").
[ ] Not too long: under about 200 characters (LinkedIn allows 220), with the most important words first. Long headlines get cut off in search results and on phones.
[ ] Distinctive: it would stand out in a list of 20 people with the same title, instead of sounding like all of them.

Verdict rules:
- Needs Attention: a REQUIRED check fails. It's the default "Title at Company" with nothing added, or it says nothing about their value.
- Mixed Signals: both REQUIRED checks are technically met, but it's generic, stuffed with keywords that don't say anything, or doesn't set them apart at all.
- Good Foundation: clear value and relevant keywords. Could be more distinctive, but it says who they're for.
- Strong: it says right away who they are, what they do and why they're worth a click. Keywords present. Distinctive.

AREA 4: ABOUT SECTION

[ ] REQUIRED Not empty: they've written something in the About section. An empty one is a missed chance to show up in search and tell their story.
[ ] REQUIRED A hook up top: the first line or two make a reader want to click "see more". Only the first few lines show before it.
[ ] First person, a real story: it reads like a person wrote it about themselves. Not a list of buzzwords, not a third-person bio, not a resume summary pasted in.
[ ] Keywords: role keywords are woven in naturally, so the profile shows up in LinkedIn search.
[ ] Clear call to action: it ends by inviting the reader to connect, send a message or reach out about something specific (for example an email address, or what to contact them about).

Verdict rules:
- Needs Attention: the section is empty, or the opening is so generic there's no reason to read on.
- Mixed Signals: there's a hook, but the rest is a resume dump or a buzzword list, with no sense of the person behind it.
- Good Foundation: a readable story that says who they are. Has a hook and some keywords. May be missing a call to action, or could be sharper.
- Strong: a first-person story with a strong hook, natural keywords and a clear call to action. Sounds like a person, not a job description.

AREA 5: EXPERIENCE

[ ] REQUIRED Roles have descriptions: at least the 2 or 3 most recent roles have something written under them. Blank roles are a big missed chance.
[ ] Achievement-focused: more than half the visible bullets describe outcomes and impact, not just duties.
[ ] Numbers: at least some descriptions include numbers, percentages, dollar amounts or other measurable results.
[ ] Strong action verbs: bullets open with strong verbs (Led, Built, Grew, Delivered). No "Responsible for" and no passive phrasing.
[ ] Results structure: bullets follow Challenge, Action, Result (or something like it), not a flat list of tasks.

Verdict rules:
- Needs Attention: the REQUIRED check fails (one or more recent roles have no description), or every description is duties only, with no achievements anywhere.
- Mixed Signals: roles have descriptions, but they read like a job posting: duties only, no numbers, no results.
- Good Foundation: a mix of duties and achievements. Some numbers. Room to improve, but it works.
- Strong: achievement-rich descriptions, visible numbers, strong opening verbs. A recruiter could understand their impact from the profile alone.

HOW TO USE THIS RUBRIC

- Photo and banner: judge them only from a screenshot. A PDF export or pasted text doesn't show them properly. If you can't see them, the status is Not checked.
- If the About section or a role was collapsed ("see more") in a screenshot, say you saw only the preview. The preview is what most visitors see first, so judge the hook from it, but don't judge the rest.
- If a section isn't visible at all, include it anyway and say what you could and couldn't see.
- Every verdict needs evidence: quote the actual text, describe what you can see, or point out what's missing.
- If an area is strong, say so. Don't invent problems to fill space.
- Never invent facts about the person: no numbers, employers, titles, dates, tools or results they didn't give.
- Don't repeat their email address, phone number or home address in the audit.
- Write without em dashes.

If I haven't sent my profile yet, reply only: "Rubric ready. Send your screenshots, PDF or profile text, your target role, and the audit prompt you want."
~~~

**Replace:** Nothing. Paste it as it is.

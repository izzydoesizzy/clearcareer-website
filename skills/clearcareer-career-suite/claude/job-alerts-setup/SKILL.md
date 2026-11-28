---
name: job-alerts-setup
description: ClearCareer Job Alerts Setup. Use when the user wants to set up LinkedIn job alerts, Google job alerts, Google Alerts for companies, Indeed alerts, or get notified when new jobs that fit them are posted. Builds copy-paste search strings from their target titles and walks them step by step through creating and saving each alert, with a checklist they can tick off.
---

# Job Alerts Setup

The best roles get hundreds of applicants in the first few days. Alerts put new postings in front of the client within hours. You build the exact strings, then walk them through each platform click by click.

## Reference files
- `references/job-search-strings.md`: how to build title clusters, LinkedIn strings, Google X-ray strings and Google Alerts queries.
- `references/alerts-walkthrough.md`: click-by-click steps for each platform.
- `references/master-career-profile-template.md`: where target titles, locations and companies come from.

## Step 1: Gather inputs
From the Master Career Profile (or ask): 2 to 4 title clusters, location, remote or hybrid preference, seniority level, exclusions, and the top 10 to 20 target companies.

## Step 2: Build the alert pack
Create an Artifact (or Doc) titled "Job Alerts Setup: [First Name]" with a checklist the client can tick off. For each title cluster, include copy-paste blocks:

1. **LinkedIn job alert string**
2. **Google Jobs query**
3. **Indeed string** (optional)

Then one Google Alerts block per target company (hiring signal and funding/expansion signal), and one title-plus-city alert.

Every string goes in its own code block. Keep LinkedIn strings to 2 to 4 titles.

## Step 3: Walk them through each platform
Follow `references/alerts-walkthrough.md` for click-by-click steps on LinkedIn, Google Jobs, Google Alerts and Indeed. Do one platform at a time and wait for the client to confirm it's saved before moving on.

Menu names change. If something doesn't match, tell them to look for a "Set alert", "Get notifications", "Follow" or bell icon near the search results. Google Jobs doesn't show its notifications toggle in every country or account: when it's missing, use Google Alerts with the title-plus-city query.

## Step 4: What to do when alerts arrive
- Skim daily. Paste any promising posting (or the whole alert email) into the `job-match-rubric` skill to score it.
- Apply within 48 hours to anything that scores 75+.
- If the client uses the `job-search-autopilot` with Gmail connected, the scheduled task can read these alert emails and score them automatically.
- Every 2 weeks: delete alerts that only send noise, and add one for any new title cluster.

## Step 5: Confirm
End by asking them to tick off each alert in the checklist as they create it, and offer to fix any string that returns poor results: "Paste the first 5 job titles your alert sends and I'll tighten it."

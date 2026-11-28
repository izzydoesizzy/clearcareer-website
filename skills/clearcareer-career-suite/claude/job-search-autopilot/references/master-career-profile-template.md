# Master Career Profile: Template and Rules

The Master Career Profile is the single living document that holds everything the client tells you. Every skill in this suite reads it and writes to it. Create it at the start of the first session and keep it current.

## Where it lives

- **Claude:** an Artifact (or a Claude Doc if available) titled "Master Career Profile: [First Name]". Update it in place.
- **ChatGPT:** a Canvas document with the same title. Update it in place.
- **Gemini:** a Canvas document, or export to Google Docs. Update it in place.
- **Fallback (no document feature):** a single markdown code block in chat, re-posted in full after each update, with a reminder to copy it somewhere safe.

## Update rules

1. Create it immediately after the resume is uploaded, filled with what the resume says.
2. Update it every 3 answers, whenever the client says "save", at the end of each role, and before any long output.
3. In voice mode, if the platform can't update documents mid-conversation, keep a running mental log and do a full update the moment the client is back in text. Never lose a detail they gave you.
4. Never delete client words. Move raw quotes to "Raw notes" if they don't fit a field yet.
5. Record the source of every fact: resume, scan, interview, or calculated.
6. If the client corrects something, update it and log the change in the session log.
7. Remind the client once per session to download or copy the profile so they own it.

## Template

```markdown
# Master Career Profile: [Full Name]
Last updated: [date] | Sessions: [n] | Quantification coverage: [xx%]

## 1. Snapshot
- Current or most recent title:
- Years of experience:
- Industries:
- Location / work arrangement:
- Top 5 skills:
- Biggest numbers so far (top 3):

## 2. Targeting
- Target titles (ranked): 
- Alternative titles to test:
- Target industries / avoid:
- Company size and stage:
- Must-have values (top 5):
- Dealbreakers:
- Location, remote, relocation:
- Work authorization:
- Compensation: floor $___ | target $___ | anchor $___
- Timeline:
- Source: [career-clarity report / mini intake]

## 3. Roles
### Role [n]: [Title], [Company] ([start] to [end])
- Scope: team size, budget, customers, regions, reports to
- Original resume bullets (verbatim):
- Scan answers:
- Raw notes and quotes:

#### Achievement [n.a]: [short title]
- Status: lead | in progress | quantified | complete | skipped
- Source: resume | scan | interview | mining prompt
- Situation (baseline):
- Scope:
- Action (what they personally did):
- Result (after vs before):
- Significance (why the business cared):
- Skills and tools:
- Metrics:
  | Metric | Value | Confidence | How it was built (defense line) |
  |---|---|---|---|
  | Hours saved per year | 1,400 | Calculated | 35 people x 2 uses/wk x 25 min x 48 wks |
- Completeness score: [0 to 100] (metric 20, action 15, scale 15, result 15, evidence 15, context 10, significance 10)
- Draft bullet:
- STAR story seed: yes/no

## 4. Quantification Coverage
| Role | Bullets on resume | Achievements found | Quantified (70+) | Coverage % |
|---|---|---|---|---|

Coverage % = quantified achievements / max(target count, achievements found). Target count: 5 for the 2 most recent roles, 3 for the next, 1 to 2 for older roles.

## 5. Resume Bullets (final, per role)
## 6. Professional Summaries (8 variations, each with a hook label)
## 7. LinkedIn Headlines
## 8. Skills Section
## 9. STAR Story Seeds (top 8)
## 10. Interview Defense Sheet
A list of every non-verified number with its defense line, written so the client can say it out loud.

## 11. Open Questions
Things to ask next session, numbers to look up, people to check with.

## 12. Session Log
| # | Date | Mode | What we covered | Changes |
|---|---|---|---|---|

## 13. Machine-readable export
(see below)
```

## The JSON export (section 13)

Keep this block at the bottom and refresh it at every major update. The job search, match rubric and alerts skills read it, so the client can paste it into any AI tool.

```json
{
  "name": "",
  "location": "",
  "work_arrangement": "remote | hybrid | onsite | flexible",
  "work_authorization": "",
  "years_experience": 0,
  "current_title": "",
  "seniority": "individual contributor | lead | manager | director | executive",
  "target_titles": [],
  "alternative_titles": [],
  "target_industries": [],
  "avoid_industries": [],
  "company_size": [],
  "comp_floor": 0,
  "comp_target": 0,
  "currency": "",
  "must_have_values": [],
  "dealbreakers": [],
  "top_skills": [],
  "tools": [],
  "certifications": [],
  "target_companies": [],
  "top_achievements": [
    { "role": "", "bullet": "", "metrics": [""], "skills": [""] }
  ],
  "keywords": [],
  "best_summary": ""
}
```

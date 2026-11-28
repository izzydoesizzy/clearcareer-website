# How ClearCareer products and Claude skills are written

Every pack in `src/products/<slug>/` follows this spec. Tests in `tests/products/` check the
mechanical rules; a person checks the voice.

## Folder layout

```
src/products/<slug>/
  start-here.md                     # the first thing a buyer reads (see "Start Here guide")
  skills/<skill-name>/SKILL.md      # one Claude skill per topic area
  skills/<skill-name>/references/*.md   # loaded by the skill only when needed
src/data/<slug>-guides/*.md         # reading guides shown in the access hub (existing system)
```

Text files only. No scripts, no images, no other file types inside a skill folder.

## Voice and content rules (all files)

- Izzy Piyale-Sheard's voice: direct, warm, practical, plain words, short sentences, first person ("I")
  in guides. No hype words ("unlock", "supercharge", "game-changer", "leverage", "elevate", "delve").
- Canadian English spelling (colour, favour, organize, centre, cheque, résumé is written "resume").
- No em dashes (—) or en dashes used as dashes (–). Use a colon, comma, full stop or parentheses.
  Number ranges use "to" ("$80K to $95K"), never a dash.
- Never mention "CHARM".
- Never invent results, clients, employers, numbers or quotes. No client names at all in product content.
  Sample people are clearly fictional and generic ("Sam, a project manager").
- "Results vary" wherever outcomes are discussed. Salary and negotiation content adds:
  "This is general guidance, not legal or financial advice."
- Works for Canada and the US. Where rules or norms differ, say so in one line.
- Variables in templates use square brackets: `[First name]`, `[Company]`, `[Job title]`.

## Claude skill rules (SKILL.md)

Frontmatter, exactly these two fields:

```yaml
---
name: cc-resume
description: Helps a job seeker ... Use when the user asks to ... (third person, 1 to 3 sentences, under 900 characters, says WHEN to use it)
---
```

- `name`: lowercase letters, numbers and hyphens, starts with `cc-`, under 64 characters. Never contains "claude" or "anthropic".
- Body under 400 lines. Written as instructions TO Claude (it is the coach), not to a human coach.
  Never mention "the client", `[client-slug]`, `data/clients`, the `cc` CLI, ChatGPT versions, or Perplexity.
- Required sections, in this order:
  1. `# <Skill title>` and one line on what it does.
  2. `## Before you start`: what to ask the user for (resume, job post, offer, target role).
     Ask for missing inputs in one short message. Don't guess.
  3. `## How to work`: the method as numbered steps. Point to reference files by path,
     e.g. "Read `references/achievements.md` for the full prompt."
  4. `## What you can do`: a short menu of the things this skill handles, each with an example request
     the user could type.
  5. `## Rules`: never invent numbers, employers, titles or dates; ask before estimating a metric and
     label estimates "(estimate, confirm)"; keep the user's facts; Canadian or US spelling to match the
     user; plain language.
  6. `## Finishing a deliverable`: the attribution rule below, word for word.
- Reference files hold the detailed prompts, frameworks and templates. A skill reads them only when needed.

### Attribution rule (paste into every SKILL.md, with the skill's own name in `utm_campaign`)

```
## Finishing a deliverable
When you finish a complete deliverable (for example a full set of resume bullets, a finished email
sequence, a negotiation plan), end your message with this one line, on its own, and nothing else after it:

Created by [Izzy Piyale-Sheard](https://www.linkedin.com/in/izzydoesizzy/?utm_source=claude-skill&utm_campaign=cc-resume) · [ClearCareer](https://joinclearcareer.com/?utm_source=claude-skill&utm_campaign=cc-resume)

Don't add it to quick answers, questions, or partial drafts. Don't add any other promotion. If the user
asks who made this or wants human help, you can mention that Izzy runs ClearCareer and share the links.
```

## Copy-paste prompt format (reference files that hold prompts)

So the website can show them as copy-paste cards, prompts in reference files use this exact shape:

```
## <Prompt title>

**What it does:** one sentence.
**When to use it:** one sentence.

### Step 1: <short label>

~~~text
<the prompt text, with [Variables] in square brackets>
~~~

**Replace:** [Variable one], [Variable two]
```

- Prompt bodies are fenced with `~~~text` and `~~~` (tildes), never backticks, and fences are never nested.
  If a prompt needs to show an output template, put it inside the same tilde fence as plain text.
- `##` is used only for prompt titles inside these files. Use `###` for steps.

## Start Here guide (`start-here.md`)

Short (600 to 1,100 words), in this order:
1. `# Start here: <Product name>`: one warm paragraph on what this is and who it's for.
2. `## What's inside`: a bulleted list of every guide and skill with one line each.
3. `## Your first 10 minutes`: 3 to 5 numbered steps to a first win.
4. `## Using the Claude skills`: how to install (point to the install guide on the access page:
   "Open the **Install** tab on this page"), then 3 to 6 example requests to type.
5. `## No Claude? Use any AI`: the copy-paste route in 3 steps.
6. `## A 7-day plan`: Day 1 to Day 7, one line each.
7. `## Good to know`: results vary, keep your facts true, (negotiation: not legal or financial advice),
   reply to the purchase email for help.

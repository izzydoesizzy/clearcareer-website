"""Builds one HTML file with every Career Suite skill, prompt and instruction,
ready to upload to Google Drive as a Google Doc (Drive converts HTML on upload).

Run from the website repo root:  python3 scripts/build-career-suite-doc.py [out.html]
Needs: pip install markdown. Reads skills/clearcareer-career-suite and src/data/career-suite.ts.
"""
import json, re, html, sys, os, subprocess
import markdown
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = os.path.join(ROOT, "skills", "clearcareer-career-suite")
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(S, "dist", "career-suite-complete.html")
data = json.loads(subprocess.check_output(
    ["npx", "--yes", "tsx", "-e",
     "import {PLATFORMS,SUITE_SKILLS} from './src/data/career-suite.ts'; console.log(JSON.stringify({PLATFORMS,SUITE_SKILLS}))"],
    cwd=ROOT, text=True))
ORDER = [s["slug"] for s in data["SUITE_SKILLS"]]
NAMES = {s["slug"]: s["name"] for s in data["SUITE_SKILLS"]}
STEPS = {s["slug"]: s["step"] for s in data["SUITE_SKILLS"]}
SUMM = {s["slug"]: s["summary"] for s in data["SUITE_SKILLS"]}

LIST = re.compile(r"^\s*([-*]|\d+\.) ")
def fix_lists(text):
    # Python-Markdown (like Google's import) needs a blank line before a list.
    out, inpre, prev = [], False, ""
    for line in text.split("\n"):
        if line.startswith("```"): inpre = not inpre
        if not inpre and LIST.match(line) and prev.strip() and not LIST.match(prev) and not prev.startswith(("```", "|")):
            out.append("")
        out.append(line); prev = line
    return "\n".join(out)

def md(text, shift=0):
    text = fix_lists(text)
    out = markdown.markdown(text, extensions=["tables", "fenced_code", "sane_lists"])
    if shift:
        def bump(m):
            lvl = min(int(m.group(2)) + shift, 6)
            return f"<{m.group(1)}h{lvl}"
        out = re.sub(r"<(/?)h([1-6])", bump, out)
    return out

def pre(text):
    # Exact, copy-ready text. Each line its own monospace paragraph keeps line breaks through the Docs import.
    lines = text.rstrip("\n").split("\n")
    body = "".join(f'<p style="font-family:\'Courier New\',monospace;font-size:9pt;margin:0;">{html.escape(l) if l else "&nbsp;"}</p>' for l in lines)
    return f'<div style="background:#f3f6fb;padding:8px;">{body}</div>'

def read(p): return open(p, encoding="utf-8").read()

parts = []
A = parts.append
A("<h1>The ClearCareer Career Suite: Complete Skills and Instructions</h1>")
A("<p>Every skill, prompt and instruction in the Career Suite, in one place. Six AI tools for Claude, ChatGPT and Gemini that take you from \"here's my resume\" to \"here are the 3 jobs to apply to today\", with every achievement backed by a number.</p>")
A("<p><b>What's in this document:</b></p><ol>"
  "<li>The six tools at a glance</li>"
  "<li>Pick your AI and install it (the download page instructions)</li>"
  "<li>The step-by-step guide: which tool to use, in what order</li>"
  "<li>The Claude skills (SKILL.md files, copy-ready)</li>"
  "<li>The ChatGPT Custom GPTs (setup, instructions, copy-ready)</li>"
  "<li>The Gemini Gems (setup, instructions, copy-ready)</li>"
  "<li>The reference and knowledge files (the method every tool uses)</li></ol>")
A("<p>The copy-ready sections are set in a monospace font. Copy them exactly as they appear.</p>")

# 1. Tools at a glance
A("<h1>1. The six tools at a glance</h1>")
A("<table><tr><th>When</th><th>Tool</th><th>What it does</th></tr>" + "".join(
    f"<tr><td>{html.escape(STEPS[s])}</td><td><b>{html.escape(NAMES[s])}</b></td><td>{html.escape(SUMM[s])}</td></tr>" for s in ORDER) + "</table>")

# 2. Install
A("<h1>2. Pick your AI and install it</h1>")
A("<p>Each version is formatted exactly the way that AI needs it. Use the one you already pay for. Not sure? Claude keeps everything in one conversation most easily. Download every tool from your Career Suite download page: one \"All 6 tools\" button per AI, or one tool at a time.</p>")
for p in data["PLATFORMS"]:
    A(f"<h2>{html.escape(p['name'])}: {html.escape(p['format'])}</h2><ol>" + "".join(f"<li>{html.escape(s)}</li>" for s in p["install"]) + "</ol>")

# 3. Guide
A("<h1>3. The step-by-step guide</h1>")
guide = read(f"{S}/shared/career-suite-guide.md")
guide = re.sub(r"^# .*\n", "", guide, count=1)
A(md(guide, shift=0))

# 4. Claude skills
A("<h1>4. The Claude skills</h1>")
A("<p>Each Claude skill is a folder named after the skill, holding a SKILL.md file and a references folder. To build one by hand: create the folder, save the text below as SKILL.md inside it, and add the reference files listed (they're in section 7 of this document). Then zip the folder and upload it in Claude, or put it in ~/.claude/skills/ for Claude Code.</p>")
for s in ORDER:
    txt = read(f"{S}/claude/{s}/SKILL.md")
    refs = sorted(set(re.findall(r"references/([a-z0-9-]+\.md)", txt)))
    A(f"<h2>{html.escape(NAMES[s])} (Claude skill: {s})</h2>")
    A(f"<p><b>Folder:</b> {s}/ &nbsp; <b>Reference files:</b> {', '.join(refs)}</p>")
    A(f"<h3>SKILL.md</h3>")
    A(pre(txt))

def gpt_section(platform, label, instr_file):
    for s in ORDER:
        d = f"{S}/{platform}/{s}"
        setup = read(f"{d}/setup.md")
        setup = re.sub(r"^# .*\n", "", setup, count=1)
        instr = read(f"{d}/{instr_file}")
        know = sorted(os.listdir(f"{d}/knowledge"))
        A(f"<h2>{html.escape(NAMES[s])} ({label})</h2>")
        A("<h3>Setup</h3>")
        A(md(setup))
        A(f"<p><b>Knowledge files to upload:</b> {', '.join(know)} (all in section 7)</p>")
        A(f"<h3>Instructions (paste into the {label} instructions box)</h3>")
        A(pre(instr))

A("<h1>5. The ChatGPT Custom GPTs</h1>")
A("<p>Each tool becomes its own Custom GPT. For each one: create the GPT, copy in the name, description and instructions below, upload the knowledge files listed, add the conversation starters, and turn on the capabilities shown. Scheduled tasks don't run inside GPTs or voice chats, so the Job Search Autopilot tells you to paste its prompts into a normal ChatGPT chat.</p>")
gpt_section("chatgpt", "Custom GPT", "instructions.md")

A("<h1>6. The Gemini Gems</h1>")
A("<p>Each tool becomes its own Gem. For each one: create a new Gem, copy in the name and instructions below, and upload the knowledge files listed. Scheduled actions are set up from a normal Gemini chat, not inside the Gem.</p>")
gpt_section("gemini", "Gem", "gem-instructions.md")

# 7. References
A("<h1>7. Reference and knowledge files</h1>")
A("<p>These files hold the method every tool follows. Claude skills keep them in each skill's references folder; GPTs and Gems use them as knowledge files. The same file is used by several tools, so each appears here once.</p>")
used = {}
for s in ORDER:
    for f in os.listdir(f"{S}/claude/{s}/references"):
        used.setdefault(f, []).append(NAMES[s])
ref_order = ["career-suite-guide.md","master-career-profile-template.md","writing-rules.md","quantification-playbook.md","question-bank.md","voice-mode-guide.md","clarity-framework.md","match-rubric.md","linkedin-playbook.md","job-search-strings.md","alerts-walkthrough.md","daily-scout-template.md","scheduling-guide.md"]
for f in ref_order + sorted(set(used) - set(ref_order)):
    if f not in used: continue
    if f == "career-suite-guide.md":
        A(f"<h2>{f}</h2><p><b>Used by:</b> {', '.join(used[f])}</p><p>Same text as section 3 of this document.</p>")
        continue
    A(f"<h2>{f}</h2><p><b>Used by:</b> {', '.join(used[f])}</p>")
    body = re.sub(r"^# .*\n", "", read(f"{S}/shared/{f}"), count=1)
    A(md(body, shift=2))

doc = "<html><head><meta charset='utf-8'></head><body style=\"font-family:Arial;font-size:11pt;\">" + "\n".join(parts) + "</body></html>"
open(OUT, "w", encoding="utf-8").write(doc)
print(f"Wrote {OUT} ({len(doc):,} bytes)")

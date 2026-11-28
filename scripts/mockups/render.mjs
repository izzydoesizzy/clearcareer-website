/**
 * Product mockups, built in code (HTML + CSS, rendered with Playwright, saved as WebP/JPG).
 *
 *   node scripts/mockups/render.mjs            all products
 *   node scripts/mockups/render.mjs vault      one product
 *
 * Writes public/images/products/<slug>/{hero,inside,skills,square,cover}.webp, og.jpg and cover.jpg (email).
 * Everything in the pictures is sample content: fictional people, generic "AI chat" windows
 * (no Claude or Anthropic logos), and the real product, guide and skill names.
 */
import { createRequire } from 'node:module';
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
// Playwright is preinstalled on the machine (not a project dependency), so load it with require.
const { chromium } = createRequire(import.meta.url)('playwright');
const font = (p) => 'file://' + join(root, 'node_modules', p);
const SERIF = font('@fontsource/dm-serif-display/files/dm-serif-display-latin-400-normal.woff2');
const SANS = font('@fontsource-variable/inter/files/inter-latin-wght-normal.woff2');

const BLUE = '#0161EF', NAVY = '#030620', SKY = '#EFF5FF';

// ── Product data (real names; sample conversations are fictional) ─────────────────────
const PRODUCTS = {
  vault: {
    name: 'Career Prompt Vault', price: '$9', kicker: '6 Claude skills · 50 prompts', accent: '#0161EF', glyph: '✦',
    skills: [
      ['cc-resume', 'The Achievement Interviewer, plus resume bullets and summaries'],
      ['cc-linkedin', 'Headlines, About and Experience that get found'],
      ['cc-interview', 'Stories, likely questions and prep'],
      ['cc-outreach', 'Emails to hiring managers and the Silver Bullet thank-you'],
      ['cc-research', 'Companies, salaries, recruiters and job titles'],
      ['cc-offer', 'Offers, counters, resignations and your first 90 days'],
    ],
    pages: ['Start here', 'Resume prompts', 'LinkedIn prompts', 'Interview prompts', 'Outreach prompts'],
    chat: {
      skill: 'cc-resume',
      turns: [
        ['you', 'Interview me about my last role and turn it into resume bullets.'],
        ['ai', "Let's find your numbers, one question at a time. When you rebuilt the month-end process, how long did close take before, and after?"],
        ['you', 'About 9 days before. We got it down to 5.'],
        ['card', 'Resume bullet', 'Cut month-end close from 9 days to 5 by rebuilding the reconciliation workflow for a 12-person finance team.'],
        ['ai', 'Nice. Next one: how many vendors or budgets did you manage in that role? A rough range is fine, and I will mark it to confirm.'],
      ],
    },
  },
  'salary-generator': {
    name: 'Salary Number Generator', price: '$9', kicker: 'Your three numbers · Claude skill', accent: '#059669', glyph: '$',
    skills: [['cc-salary-number', 'Your anchor, target and walk-away numbers, with the words to use them']],
    pages: ['Start here', 'Salary Number Generator'],
    chat: {
      skill: 'cc-salary-number',
      turns: [
        ['you', "I'm a senior project manager in Toronto. Help me work out my numbers."],
        ['ai', 'First, what ranges did you find in job posts for this role? Paste two or three and I will build from your research.'],
        ['you', 'Posts I found: $95K to $110K, $98K to $115K, and $100K to $120K.'],
        ['table', [['Anchor', '$112,000'], ['Target', '$104,000'], ['Walk-away', '$95,000']], 'Sample numbers. Yours come from your research.'],
        ['ai', 'Here is how to say your anchor when they ask for your expectations.'],
      ],
    },
  },
  'outreach-templates': {
    name: 'Outreach and Email Templates', price: '$19', kicker: '80+ templates · Claude skill', accent: '#7C3AED', glyph: '✉',
    skills: [['cc-email-writer', 'Finds the right template and writes a short, personal email to a hiring manager']],
    pages: ['Start here', 'Land an Interview in 1 Week', 'Hiring Manager Cold Emails', 'Follow-Ups', 'Thank-You Emails'],
    chat: {
      skill: 'cc-email-writer',
      turns: [
        ['you', 'Write a short email to the hiring manager for the Senior Product Manager role at Lumen Bank.'],
        ['card', 'Subject: Your payments onboarding', 'Hi Priya, I saw Lumen is rebuilding payments onboarding. I led the same project at my last company and cut drop-off by 18%. Would 15 minutes next week be useful? Sam'],
        ['ai', 'Under 90 words, and it leads with her problem, not your resume. Want a follow-up for day 4 if she does not reply?'],
        ['you', 'Yes, and a LinkedIn note too.'],
      ],
    },
  },
  'interview-confidence': {
    name: 'Interview Confidence Kit', price: '$19', kicker: 'Mock interviews · STAR stories', accent: '#EA580C', glyph: '★',
    skills: [['cc-interview-coach', 'Builds your STAR stories, runs mock interviews and debriefs you after']],
    pages: ['Start here', 'STAR Story Bank Builder', 'Tell Me About Yourself', '20 Questions You Will Get', 'Interview Prep Package'],
    chat: {
      skill: 'cc-interview-coach',
      turns: [
        ['you', 'Run a mock interview for a project manager role.'],
        ['ai', 'Question 1 of 5: Tell me about a time a project slipped. What did you do?'],
        ['you', 'Our vendor missed a deadline, so I re-planned the launch and kept the client informed every week.'],
        ['card', 'Feedback', 'Clear situation and action. Add the result: how many days did you recover, and what did the client say?'],
        ['ai', 'Try it again with the result, then we will move to question 2.'],
      ],
    },
  },
  'salary-negotiation': {
    name: 'Salary Negotiation Scripts', price: '$29', kicker: 'Scripts · advice · Claude coach', accent: '#DB2777', glyph: '⇡',
    skills: [['cc-negotiation-coach', 'Evaluates your offer, drafts the counter and rehearses the call with you']],
    pages: ['Start here', 'How to Negotiate Your Offer', 'Counter-Offer Scripts', 'Beyond Base Pay', 'Offer Evaluation Worksheet'],
    chat: {
      skill: 'cc-negotiation-coach',
      turns: [
        ['you', 'The offer is $92K. I was hoping for $100K. Draft my counter.'],
        ['card', 'Your counter (email)', "Thank you for the offer. I'm excited about the role. Based on the scope we discussed, I was hoping for $100,000. Is there flexibility to get closer to that number?"],
        ['ai', 'Want to rehearse the phone version? I will play the recruiter.'],
        ['you', "Yes. And what if they say it's their best offer?"],
      ],
    },
  },
};
PRODUCTS['complete-toolkit'] = {
  name: 'Complete Job Search Toolkit', price: '$49', was: '$85', kicker: '5 products · 10 Claude skills', accent: '#0161EF', glyph: '◆',
  skills: ['vault', 'salary-generator', 'outreach-templates', 'interview-confidence', 'salary-negotiation'].flatMap((s) => PRODUCTS[s].skills).slice(0, 9),
  pages: ['Start here', 'Prompt Vault', 'Outreach Templates', 'Interview Kit', 'Negotiation Scripts'],
  chat: PRODUCTS.vault.chat,
  bundle: ['vault', 'salary-generator', 'outreach-templates', 'interview-confidence', 'salary-negotiation'],
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ── Shared CSS ─────────────────────────────────────────────────────────────────────────
const CSS = `
@font-face { font-family: Serif; src: url('${SERIF}') format('woff2'); }
@font-face { font-family: Sans; src: url('${SANS}') format('woff2'); font-weight: 100 900; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Sans, sans-serif; color: ${NAVY}; -webkit-font-smoothing: antialiased; }
.stage { position: relative; overflow: hidden; }
.bg-light { background: radial-gradient(1200px 700px at 15% 10%, #ffffff 0%, ${SKY} 55%, #dfeafe 100%); }
.bg-navy { background: radial-gradient(1000px 700px at 80% 0%, #0b2a6b 0%, ${NAVY} 60%); color: #fff; }
.serif { font-family: Serif, serif; font-weight: 400; letter-spacing: -0.01em; }
.chip { display: inline-flex; align-items: center; gap: 6px; border-radius: 999px; padding: 6px 12px; font-size: 14px; font-weight: 600; }
.mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }

/* laptop */
.laptop { position: absolute; }
.screen { background: #0d0f14; border-radius: 22px 22px 8px 8px; padding: 16px; box-shadow: 0 40px 80px -30px rgba(3,6,32,.45); }
.app { background: #fff; border-radius: 10px; height: 100%; display: grid; grid-template-columns: 190px 1fr; overflow: hidden; }
.side { background: #f6f7f9; border-right: 1px solid #eceef2; padding: 18px 14px; }
.side .new { background: #fff; border: 1px solid #e3e6ec; border-radius: 8px; padding: 8px 10px; font-size: 13px; font-weight: 600; }
.side .item { margin-top: 12px; height: 10px; border-radius: 6px; background: #e6e9ee; }
.main { display: flex; flex-direction: column; }
.top { display: flex; align-items: center; justify-content: space-between; padding: 14px 22px; border-bottom: 1px solid #f0f1f4; font-size: 14px; font-weight: 600; color: #5b6170; }
.msgs { flex: 1; padding: 20px 26px; display: flex; flex-direction: column; gap: 14px; }
.you { align-self: flex-end; max-width: 72%; background: ${SKY}; border-radius: 16px 16px 4px 16px; padding: 11px 15px; font-size: 15px; line-height: 1.45; }
.ai { align-self: flex-start; max-width: 82%; font-size: 15px; line-height: 1.5; color: #1f2430; }
.card { align-self: flex-start; max-width: 88%; border: 1px solid #e5e8ef; border-left: 4px solid var(--accent); border-radius: 10px; padding: 12px 16px; background: #fff; box-shadow: 0 8px 24px -16px rgba(3,6,32,.35); }
.card b { display: block; font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: var(--accent); margin-bottom: 6px; }
.card p { font-size: 15px; line-height: 1.5; }
.tbl { align-self: flex-start; width: 70%; border: 1px solid #e5e8ef; border-radius: 10px; overflow: hidden; font-size: 15px; }
.tbl div { display: flex; justify-content: space-between; padding: 10px 16px; border-top: 1px solid #eef0f4; }
.tbl div:first-child { border-top: 0; }
.tbl small { display: block; padding: 8px 16px; background: #fafbfc; color: #6b7280; font-size: 12px; }
.input { margin: 0 22px 18px; border: 1px solid #e3e6ec; border-radius: 12px; padding: 12px 14px; font-size: 14px; color: #9aa1ad; }
.base { height: 22px; margin: 0 -60px; background: linear-gradient(#d9dde5, #b9bfca); border-radius: 0 0 18px 18px; position: relative; }
.base::after { content: ''; position: absolute; left: 50%; top: 0; width: 140px; height: 8px; margin-left: -70px; background: #c3c8d2; border-radius: 0 0 8px 8px; }

/* phone */
.phone { position: absolute; background: #0d0f14; border-radius: 46px; padding: 12px; box-shadow: 0 40px 80px -30px rgba(3,6,32,.55); }
.phone .scr { background: #fff; color: ${NAVY}; border-radius: 36px; height: 100%; overflow: hidden; padding: 46px 20px 20px; position: relative; }
.phone .notch { position: absolute; top: 12px; left: 50%; width: 96px; height: 26px; margin-left: -48px; background: #0d0f14; border-radius: 20px; }
.phone h4 { font-family: Serif; font-weight: 400; font-size: 26px; line-height: 1.1; }
.phone .eyebrow { font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--accent); margin-bottom: 8px; }
.check { display: flex; gap: 10px; align-items: flex-start; font-size: 13px; line-height: 1.4; margin-top: 12px; }
.check i { flex: none; width: 18px; height: 18px; border-radius: 50%; background: var(--accent); color: #fff; font-size: 11px; font-style: normal; display: grid; place-items: center; margin-top: 1px; }

/* cover */
.cover { position: absolute; border-radius: 22px; padding: 26px 28px; color: #fff; background: linear-gradient(145deg, ${NAVY} 0%, #0b2a6b 100%); box-shadow: 0 30px 70px -25px rgba(3,6,32,.6); overflow: hidden; }
.cover::before { content: ''; position: absolute; right: -60px; top: -60px; width: 220px; height: 220px; border-radius: 50%; background: var(--accent); opacity: .35; filter: blur(4px); }
.cover .brand { font-size: 12px; font-weight: 700; letter-spacing: .16em; opacity: .8; }
.cover .title { font-family: Serif; font-size: 34px; line-height: 1.05; margin-top: 14px; position: relative; }
.cover .kick { margin-top: 10px; font-size: 14px; opacity: .85; position: relative; }
.cover .glyph { position: absolute; right: 26px; bottom: 18px; font-size: 54px; opacity: .9; color: #fff; }
.price { display: inline-block; margin-top: 16px; background: #fff; color: ${NAVY}; font-weight: 800; font-size: 18px; border-radius: 10px; padding: 6px 12px; position: relative; }

/* pages */
.page { position: absolute; width: 400px; height: 540px; background: #fff; border-radius: 14px; box-shadow: 0 30px 60px -28px rgba(3,6,32,.45); padding: 34px 32px; overflow: hidden; }
.page .bar { height: 8px; width: 64px; border-radius: 4px; background: var(--accent); margin-bottom: 22px; }
.page h5 { font-family: Serif; font-weight: 400; font-size: 30px; line-height: 1.1; }
.line { height: 10px; border-radius: 5px; background: #eceef2; margin-top: 14px; }
.page .tag { position: absolute; bottom: 26px; left: 32px; font-size: 12px; font-weight: 700; letter-spacing: .1em; color: #9aa1ad; }

/* skill cards */
.skill { background: #fff; border: 1px solid #e3e8f2; border-radius: 20px; padding: 30px; box-shadow: 0 20px 40px -30px rgba(3,6,32,.4); }
.skill .ic { width: 44px; height: 44px; border-radius: 12px; background: ${SKY}; display: grid; place-items: center; color: var(--accent); font-size: 22px; }
.skill .nm { margin-top: 16px; font-size: 24px; font-weight: 700; color: var(--accent); }
.skill .ds { margin-top: 8px; font-size: 19px; line-height: 1.45; color: #374151; }
.skill .ft { margin-top: 16px; font-size: 14px; color: #6b7280; }
`;

const doc = (w, h, body, accent, cls = 'bg-light') =>
  `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="stage ${cls}" style="width:${w}px;height:${h}px;--accent:${accent}">${body}</div></body></html>`;

function chatScreen(p, w, h) {
  const turns = p.chat.turns.map((t) => {
    if (t[0] === 'you') return `<div class="you">${esc(t[1])}</div>`;
    if (t[0] === 'ai') return `<div class="ai">${esc(t[1])}</div>`;
    if (t[0] === 'card') return `<div class="card"><b>${esc(t[1])}</b><p>${esc(t[2])}</p></div>`;
    if (t[0] === 'table') return `<div class="tbl">${t[1].map(([a, b]) => `<div><span>${esc(a)}</span><strong>${esc(b)}</strong></div>`).join('')}<small>${esc(t[2])}</small></div>`;
    return '';
  }).join('');
  return `<div class="screen" style="width:${w}px;height:${h}px"><div class="app">
    <div class="side"><div class="new">+ New chat</div><div class="item" style="width:80%"></div><div class="item" style="width:65%"></div><div class="item" style="width:72%"></div><div class="item" style="width:50%"></div></div>
    <div class="main"><div class="top"><span>AI chat</span><span class="chip" style="background:${SKY};color:var(--accent)">Skill · <span class="mono">${esc(p.chat.skill)}</span></span></div>
    <div class="msgs">${turns}</div><div class="input">Reply…</div></div></div></div>`;
}

function phone(p, x, y, w = 300, h = 620) {
  const items = p.pages.slice(1, 5).map((t) => `<div class="check"><i>✓</i><span>${esc(t)}</span></div>`).join('');
  return `<div class="phone" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><div class="scr"><div class="notch"></div>
    <div class="eyebrow">Start here</div><h4>${esc(p.name)}</h4>
    <p style="font-size:13px;line-height:1.5;color:#4b5563;margin-top:10px">Your first 10 minutes, the skills to install, and a 7-day plan.</p>
    ${items}
    <div style="margin-top:18px;background:var(--accent);color:#fff;border-radius:10px;padding:10px;text-align:center;font-size:13px;font-weight:700">Get the Claude skills</div>
    <div class="eyebrow" style="margin-top:22px">Your 7-day plan</div>
    ${['Day 1: install one skill', 'Day 2: your first win', 'Day 3: put it to work'].map((d) => `<div style="display:flex;gap:10px;align-items:center;margin-top:10px;font-size:13px;color:#374151"><span style="width:8px;height:8px;border-radius:50%;background:var(--accent);opacity:.5"></span>${d}</div>`).join('')}
  </div></div>`;
}

function cover(p, x, y, w = 380, h = 230, extra = '') {
  return `<div class="cover" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;--accent:${p.accent};${extra}">
    <div class="brand">CLEARCAREER</div><div class="title">${esc(p.name)}</div><div class="kick">${esc(p.kicker)}</div>
    <div class="price">${esc(p.price)}${p.was ? ` <s style="font-weight:500;opacity:.5;font-size:14px">${esc(p.was)}</s>` : ''}</div><div class="glyph">${p.glyph}</div></div>`;
}

const scenes = {
  hero: (p) => doc(1600, 1000, `
    <div class="laptop" style="left:90px;top:120px">${chatScreen(p, 1040, 650)}<div class="base"></div></div>
    ${phone(p, 1180, 220)}
    ${cover(p, 70, 700, 400, 230)}`, p.accent),

  inside: (p) => {
    const pages = p.pages.slice(0, 5);
    const n = pages.length;
    const cards = pages.map((t, i) => {
      const off = i - (n - 1) / 2;
      return `<div class="page" style="left:${600 + off * 170}px;top:${230 + Math.abs(off) * 26}px;transform:rotate(${off * 6}deg);z-index:${10 - Math.abs(Math.round(off))}">
        <div class="bar"></div><h5>${esc(t)}</h5>${[92, 80, 86, 60, 88, 74, 90, 55, 82].map((w) => `<div class="line" style="width:${w}%"></div>`).join('')}
        <div class="tag">${esc(p.name.toUpperCase())}</div></div>`;
    }).join('');
    return doc(1600, 1000, `<div style="position:absolute;left:0;right:0;top:70px;text-align:center"><div class="serif" style="font-size:54px">What's inside</div>
      <div style="margin-top:10px;font-size:20px;color:#4b5563">${esc(p.kicker)}, plus a Start Here guide</div></div>${cards}`, p.accent);
  },

  skills: (p) => {
    const list = p.skills.slice(0, 9);
    const cols = list.length >= 5 ? 3 : list.length >= 2 ? 2 : 1;
    const width = cols === 1 ? 700 : cols === 2 ? 1100 : 1440;
    const cards = list.map(([n, d]) => `<div class="skill"><div class="ic">✦</div><div class="nm mono">${esc(n)}</div><div class="ds">${esc(d)}</div><div class="ft">SKILL.md + references · text files only</div></div>`).join('');
    return doc(1600, 1000, `<div style="position:absolute;left:0;right:0;top:70px;text-align:center"><div class="serif" style="font-size:54px">${list.length === 1 ? 'The Claude skill you install' : 'The Claude skills you install'}</div>
      <div style="margin-top:10px;font-size:20px;color:#4b5563">Upload once, then just ask. Copy-paste prompts included for ChatGPT and Gemini.</div></div>
      <div style="position:absolute;left:50%;top:${list.length > 6 ? 230 : 280}px;width:${width}px;margin-left:-${width / 2}px;display:grid;grid-template-columns:repeat(${cols},1fr);gap:24px">${cards}</div>`, p.accent);
  },

  bundle: (p) => {
    // A neat stack: each product's cover peeks out above the next, the last one fully visible.
    const covers = p.bundle.map((s, i) => cover(PRODUCTS[s], 110 + i * 46, 120 + i * 92, 470, 270, `z-index:${i};transform:rotate(${-3 + i * 1.5}deg)`)).join('');
    return doc(1600, 1000, `${covers}
      <div style="position:absolute;left:900px;top:250px;width:600px;z-index:20">
        <div class="chip" style="background:#fff;color:#059669;font-size:18px;box-shadow:0 10px 30px -12px rgba(0,0,0,.4)">Save $36</div>
        <div class="serif" style="font-size:72px;line-height:1;margin-top:22px">Everything,<br>one price.</div>
        <div style="margin-top:20px;font-size:23px;line-height:1.4;opacity:.92">5 products, 10 Claude skills,<br>and 150+ prompts, templates and scripts</div>
        <div style="margin-top:26px;font-size:52px;font-weight:800">$49 <s style="font-size:28px;font-weight:500;opacity:.55">$85</s></div>
      </div>`, p.accent, 'bg-navy');
  },

  og: (p) => doc(1200, 630, `
    <div style="position:absolute;left:70px;top:90px;width:560px">
      <div style="font-size:14px;font-weight:700;letter-spacing:.16em;opacity:.8">CLEARCAREER</div>
      <div class="serif" style="font-size:66px;line-height:1.02;margin-top:18px">${esc(p.name)}</div>
      <div style="font-size:24px;margin-top:18px;opacity:.9">${esc(p.kicker)}</div>
      <div class="price" style="font-size:26px;margin-top:28px">${esc(p.price)}${p.was ? ` <s style="font-weight:500;opacity:.5;font-size:18px">${esc(p.was)}</s>` : ''}</div>
    </div>
    ${phone(p, 800, 70, 290, 600)}`, p.accent, 'bg-navy'),

  square: (p) => doc(1080, 1080, `
    <div style="position:absolute;left:0;right:0;top:80px;text-align:center">
      <div style="font-size:16px;font-weight:700;letter-spacing:.16em;opacity:.8">CLEARCAREER</div>
      <div class="serif" style="font-size:72px;line-height:1.02;margin:18px auto 0;max-width:860px">${esc(p.name)}</div>
      <div style="font-size:26px;margin-top:16px;opacity:.9">${esc(p.kicker)}</div>
    </div>
    ${phone(p, 360, 330, 360, 720)}
    <div class="price" style="position:absolute;left:760px;top:420px;font-size:30px">${esc(p.price)}</div>`, p.accent, 'bg-navy'),

  cover: (p) => doc(600, 340, cover(p, 30, 30, 540, 280), p.accent),
};

const wanted = process.argv.slice(2);
const slugs = wanted.length ? wanted : Object.keys(PRODUCTS);
const browser = await chromium.launch();
for (const slug of slugs) {
  const p = PRODUCTS[slug];
  if (!p) { console.error('unknown product', slug); continue; }
  const out = join(root, 'public', 'images', 'products', slug);
  mkdirSync(out, { recursive: true });
  const list = ['hero', 'inside', 'skills', 'og', 'square', 'cover', ...(p.bundle ? ['bundle'] : [])];
  for (const scene of list) {
    const html = scenes[scene](p);
    const size = scene === 'og' ? [1200, 630] : scene === 'square' ? [1080, 1080] : scene === 'cover' ? [600, 340] : [1600, 1000];
    const page = await browser.newPage({ viewport: { width: size[0], height: size[1] }, deviceScaleFactor: scene === 'cover' ? 2 : 1 });
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const png = await page.screenshot({ type: 'png' });
    await page.close();
    if (scene === 'og') await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toFile(join(out, 'og.jpg'));
    else await sharp(png).webp({ quality: 82 }).toFile(join(out, `${scene}.webp`));
    // Email clients like Outlook can't show WebP, so the cover also gets a JPG for the purchase email.
    if (scene === 'cover') await sharp(png).resize(600).jpeg({ quality: 84, mozjpeg: true }).toFile(join(out, 'cover.jpg'));
    console.log(`${slug}/${scene}`);
  }
}
await browser.close();

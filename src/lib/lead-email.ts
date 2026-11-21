/**
 * The email Izzy gets for every book-a-call submission: a one-page lead brief.
 * Email-safe HTML (tables and inline styles only), readable on a phone.
 */
import type { BookCallAnswers, Diagnosis, Verdict } from './book-call';
import { QUALIFY, leadScore, programValue } from './book-call';

const C = {
  blue: '#0161EF', navy: '#030620', ink: '#0f172a', body: '#334155', muted: '#64748b',
  line: '#e2e8f0', bg: '#f8fafc', tint: '#EFF5FF', white: '#ffffff', red: '#C2392B', green: '#0f766e',
};
const FONT = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif";
const SERIF = "'DM Serif Display',Georgia,'Times New Roman',serif";

export const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
const money = (n: number) => (Number.isFinite(n) ? `$${Math.round(n).toLocaleString('en-CA')}` : '-');
const pct = (n: number) => (!Number.isFinite(n) ? '-' : n === 0 ? '0%' : `${(n * 100).toFixed(n < 0.1 ? 1 : 0)}%`);

/** Questions to open the call with, by diagnosis. */
const CALL_PLAN: Record<Diagnosis['key'], string[]> = {
  positioning: [
    'Which two job titles are you applying for most? Do they match your last two roles?',
    'Pull up your resume. Does the top third show results with numbers?',
    'Where do you find roles: job boards only, or do you reach out to people too?',
  ],
  interviewing: [
    'Walk me through your last interview. Where did it go quiet?',
    'Give me your answer to "Tell me about yourself", as you said it in the room.',
    'What do you do after an interview? Do you follow up, and how?',
  ],
  clarity: [
    'If you could start any role next month, what would it be?',
    "What's stopping you from applying more right now?",
    'What would a good week of searching look like for you?',
  ],
  tuning: [
    'Where are you in your processes right now? Anything close to an offer?',
    'What number would make you say yes to an offer?',
    'Have you negotiated an offer before? How did it go?',
  ],
};

export interface Insight { tone: 'good' | 'flag' | 'note'; text: string }

/** Plain-language observations computed from the answers. Nothing here is a guess. */
export function insights(a: BookCallAnswers, v: Verdict): Insight[] {
  const out: Insight[] = [];
  const rate = a.totalApplications > 0 ? a.interviews / a.totalApplications : NaN;
  const offerRate = a.interviews > 0 ? a.offers / a.interviews : NaN;

  if (Number.isFinite(rate)) {
    out.push({
      tone: rate < 0.1 ? 'flag' : 'good',
      text: `Interview rate ${pct(rate)}: ${a.interviews} interviews from ${a.totalApplications} applications.`,
    });
  } else {
    out.push({ tone: 'flag', text: 'No applications sent yet.' });
  }
  if (a.interviews > 0) {
    out.push({
      tone: a.offers === 0 && a.interviews >= 3 ? 'flag' : 'note',
      text: `${a.offers} offer${a.offers === 1 ? '' : 's'} from ${a.interviews} interview${a.interviews === 1 ? '' : 's'} (${pct(offerRate)}).`,
    });
  }
  if (a.targetSalary > 0) {
    out.push({ tone: 'note', text: `At a ${money(a.targetSalary)} target, each month without work costs about ${money(a.targetSalary / 12)} before tax.` });
  }
  if (a.searchLength === '1+ years' || a.searchLength === '11-12 months') {
    out.push({ tone: 'flag', text: `Long search: ${a.searchLength}. Expect some discouragement; lead with empathy.` });
  }
  if (a.motivation <= 2) out.push({ tone: 'flag', text: `Low motivation (${a.motivation} of 5). Find out what's draining them before you pitch.` });
  if (a.motivation >= 4) out.push({ tone: 'good', text: `High motivation (${a.motivation} of 5).` });
  if (a.decider !== 'Just me') out.push({ tone: 'flag', text: `Not deciding alone: "${a.decider}". Consider inviting them to the call.` });
  if (a.payment !== 'Credit card in full') out.push({ tone: 'note', text: `Payment preference: ${a.payment}. Have Klarna or a payment plan ready.` });
  if (a.start === 'This month') out.push({ tone: 'good', text: 'Ready to start this month.' });
  if (a.start === 'Later than that' || a.start === 'Not sure yet') out.push({ tone: 'flag', text: `Timing: ${a.start}. Test urgency on the call.` });
  if (a.country === 'Somewhere else') out.push({ tone: 'flag', text: 'Based outside Canada and the US.' });
  if (a.struggles.some((s) => s.startsWith('International Applicant'))) out.push({ tone: 'note', text: 'Says they lack Canadian experience.' });
  if (v.reason === 'experience') out.push({ tone: 'flag', text: `Under ${QUALIFY.minYears} years of experience (${a.yearsExperience}). Not shown the booking link.` });
  if (v.reason === 'not-ready') out.push({ tone: 'flag', text: 'Said they are not ready to invest. Not shown the booking link.' });
  out.push({ tone: a.consent ? 'good' : 'note', text: a.consent ? 'Opted in to emails (added to the nurture list).' : 'Did not opt in to emails. Reply to them personally only.' });
  return out;
}

const dot = (tone: Insight['tone']) => (tone === 'good' ? C.green : tone === 'flag' ? C.red : C.muted);
const label = (tone: Insight['tone']) => (tone === 'good' ? 'Good' : tone === 'flag' ? 'Watch' : 'Note');

function stat(value: string, caption: string): string {
  return `<td width="25%" style="padding:12px 8px;text-align:center;border-right:1px solid ${C.line};">
<div style="font-family:${FONT};font-size:22px;font-weight:700;color:${C.ink};line-height:1.2;">${esc(value)}</div>
<div style="font-family:${FONT};font-size:12px;color:${C.muted};line-height:1.4;margin-top:2px;">${esc(caption)}</div></td>`;
}

function section(title: string, rows: [string, unknown][]): string {
  const body = rows
    .map(
      ([k, val]) => `<tr>
<td style="padding:10px 0;border-top:1px solid ${C.line};font-family:${FONT};font-size:13px;color:${C.muted};vertical-align:top;width:38%;">${esc(k)}</td>
<td style="padding:10px 0 10px 12px;border-top:1px solid ${C.line};font-family:${FONT};font-size:14px;color:${C.ink};line-height:1.5;vertical-align:top;white-space:pre-wrap;">${esc(val) || '<span style="color:#94a3b8;">-</span>'}</td></tr>`,
    )
    .join('');
  return `<tr><td style="padding:24px 32px 0;" class="px">
<p style="margin:0 0 8px;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${C.blue};">${esc(title)}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${body}</table></td></tr>`;
}

export function buildLeadEmail(
  a: BookCallAnswers,
  v: Verdict,
  d: Diagnosis,
  submittedAt: Date = new Date(),
  score = leadScore(a),
  value = programValue(a.program, submittedAt),
) {
  const name = `${a.firstName} ${a.lastName}`.trim();
  const when = submittedAt.toLocaleString('en-CA', {
    timeZone: 'America/Toronto', weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });
  const rate = a.totalApplications > 0 ? pct(a.interviews / a.totalApplications) : '-';
  const verdict = v.qualified
    ? { text: 'Qualified. Shown the booking link.', bg: C.green }
    : { text: v.reason === 'experience' ? `Not yet: under ${QUALIFY.minYears} years` : 'Not yet: not ready to invest', bg: C.red };
  const subject = `${score.grade} ${score.score} | ${v.qualified ? 'Qualified' : 'Not yet'} | ${value.label} | ${name}`;
  const gradeColour = score.grade === 'Hot' ? C.red : score.grade === 'Warm' ? '#b45309' : C.muted;
  const tel = a.phone.replace(/[^\d+]/g, '');

  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(subject)}</title>
<style>@media only screen and (max-width:520px){.px{padding-left:20px !important;padding-right:20px !important}.stack td{display:block !important;width:100% !important;border-right:0 !important;border-bottom:1px solid ${C.line}}}</style></head>
<body style="margin:0;padding:0;background:${C.bg};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="640" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;background:${C.white};border-radius:12px;overflow:hidden;border:1px solid ${C.line};">

<tr><td style="background:${C.navy};padding:28px 32px;" class="px">
<p style="margin:0 0 6px;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:1.5px;color:#cbd5e1;">NEW CALL REQUEST &middot; ${esc(when)}</p>
<h1 style="margin:0 0 12px;font-family:${SERIF};font-size:30px;font-weight:400;line-height:1.15;color:${C.white};">${esc(name)}</h1>
<span style="display:inline-block;padding:6px 12px;border-radius:999px;background:${verdict.bg};font-family:${FONT};font-size:13px;font-weight:700;color:${C.white};">${esc(verdict.text)}</span>
</td></tr>

<tr><td style="padding:0;border-bottom:1px solid ${C.line};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="stack"><tr>
<td width="33%" style="padding:16px 12px 16px 32px;border-right:1px solid ${C.line};vertical-align:top;" class="px">
<div style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${C.muted};">Lead score</div>
<div style="font-family:${FONT};font-size:26px;font-weight:700;color:${C.ink};line-height:1.2;margin-top:4px;">${score.score}<span style="font-size:14px;color:${C.muted};font-weight:600;">/100</span></div>
<div style="font-family:${FONT};font-size:13px;font-weight:700;color:${gradeColour};">${esc(score.grade)}</div></td>
<td width="33%" style="padding:16px 12px;border-right:1px solid ${C.line};vertical-align:top;">
<div style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${C.muted};">Interested in</div>
<div style="font-family:${FONT};font-size:15px;font-weight:700;color:${C.ink};line-height:1.35;margin-top:6px;">${esc(a.program)}</div></td>
<td width="34%" style="padding:16px 32px 16px 12px;vertical-align:top;" class="px">
<div style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${C.muted};">Investment value</div>
<div style="font-family:${FONT};font-size:22px;font-weight:700;color:${C.ink};line-height:1.25;margin-top:4px;">${esc(value.label)}</div>
<div style="font-family:${FONT};font-size:12px;color:${C.muted};">CAD plus HST</div></td>
</tr></table></td></tr>

<tr><td style="padding:16px 32px;border-bottom:1px solid ${C.line};font-family:${FONT};font-size:14px;line-height:1.6;color:${C.body};" class="px">
<a href="mailto:${esc(a.email)}" style="color:${C.blue};font-weight:600;text-decoration:none;">${esc(a.email)}</a>
&nbsp;&middot;&nbsp;<a href="tel:${esc(tel)}" style="color:${C.blue};font-weight:600;text-decoration:none;">${esc(a.phone)}</a>
&nbsp;&middot;&nbsp;${esc(a.country)}<br><span style="color:${C.muted};font-size:13px;">Hit reply to email them directly.</span>
</td></tr>

<tr><td style="padding:24px 32px 0;" class="px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.tint};border-radius:10px;">
<tr><td style="padding:20px 20px 16px;">
<p style="margin:0 0 4px;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${C.blue};">Diagnosis</p>
<p style="margin:0 0 8px;font-family:${SERIF};font-size:24px;line-height:1.2;color:${C.ink};">${esc(d.title)}</p>
<p style="margin:0;font-family:${FONT};font-size:15px;line-height:1.6;color:${C.body};"><strong style="color:${C.ink};">Focus the call on:</strong> ${esc(d.callFocus)}</p>
</td></tr>
<tr><td style="padding:0 12px 12px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="stack" style="background:${C.white};border-radius:8px;border:1px solid ${C.line};"><tr>
${stat(String(a.totalApplications), 'applications')}${stat(String(a.interviews), 'interviews')}${stat(String(a.offers), 'offers')}${stat(rate, 'interview rate')}
</tr></table></td></tr></table>
</td></tr>

<tr><td style="padding:24px 32px 0;" class="px">
<p style="margin:0 0 8px;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${C.blue};">Insights</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${insights(a, v)
  .map(
    (i) => `<tr><td style="padding:6px 0;vertical-align:top;width:64px;"><span style="display:inline-block;padding:2px 8px;border-radius:999px;border:1px solid ${dot(i.tone)};font-family:${FONT};font-size:11px;font-weight:700;color:${dot(i.tone)};">${label(i.tone)}</span></td>
<td style="padding:6px 0;font-family:${FONT};font-size:14px;line-height:1.5;color:${C.ink};">${esc(i.text)}</td></tr>`,
  )
  .join('')}
</table></td></tr>

<tr><td style="padding:24px 32px 0;" class="px">
<p style="margin:0 0 8px;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${C.blue};">Open the call with</p>
${CALL_PLAN[d.key]
  .map((q, i) => `<p style="margin:0 0 8px;font-family:${FONT};font-size:14px;line-height:1.5;color:${C.ink};"><strong style="color:${C.blue};">${i + 1}.</strong> ${esc(q)}</p>`)
  .join('')}
</td></tr>

<tr><td style="padding:24px 32px 0;" class="px">
<p style="margin:0 0 8px;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${C.blue};">In their words</p>
<p style="margin:0 0 12px;font-family:${FONT};font-size:14px;line-height:1.6;color:${C.ink};"><strong>Biggest challenge:</strong> ${esc(a.challenge)}</p>
<p style="margin:0 0 12px;font-family:${FONT};font-size:14px;line-height:1.6;color:${C.ink};"><strong>Success besides a job:</strong> ${esc(a.milestones)}</p>
<p style="margin:0;font-family:${FONT};font-size:14px;line-height:1.6;color:${C.ink};"><strong>Wants from the call:</strong> ${esc(a.callGoal)}</p>
</td></tr>

${section('Their search', [
  ['Job titles', a.jobTitles],
  ['Target salary', money(a.targetSalary)],
  ['Years of experience', a.yearsExperience],
  ['Searching for', a.searchLength],
  ['Applications per week', a.appsPerWeek],
  ['Total applications', a.totalApplications],
  ['Interviews', a.interviews],
  ['Offers', a.offers],
])}
${section('Where they are', [
  ['Situation', a.situation],
  ['Based in', a.country],
  ['Biggest struggles', a.struggles.join('\n')],
  ['Motivation', `${a.motivation} of 5`],
])}
${section('Readiness', [
  ['Program', a.program],
  ['Ready to invest', a.ready],
  ['Who decides', a.decider],
  ['Could start', a.start],
  ['Would pay by', a.payment],
  ['Email permission', a.consent ? 'Yes, ticked' : 'No'],
])}

<tr><td style="padding:28px 32px;font-family:${FONT};font-size:12px;line-height:1.5;color:${C.muted};" class="px">
Lead score: ready 30, experience 10, start date 15, decides alone 10, payment 10, motivation 15, program 10. The diagnosis is a first read from four numbers, not a verdict. Saved on their Brevo contact (LEAD_SCORE, LEAD_DIAGNOSIS).
</td></tr>
</table></td></tr></table></body></html>`;

  return { subject, html };
}

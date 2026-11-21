/**
 * Izzy's sales brief, emailed the morning before each call.
 * Built only from the lead's own answers and the real offer facts. Nothing here is invented:
 * every "why" line points at something they told us.
 */
import type { BookCallAnswers, Diagnosis } from './book-call.js';
import { PROGRAMS, QUALIFY, leadScore, programValue, scoreLead, diagnose } from './book-call.js';
import { CALL_PLAN, esc } from './lead-email.js';
import { dealIsLive } from './email/deal.js';
import { offer, objections, RESULTS_VARY } from '../data/llu.js';
import { callTime } from './call-emails.js';
import { recommend, storyFor } from './stories.js';
import { daysLabel, WORKING_DAYS } from './roi.js';
export { recommend };

const C = {
  blue: '#0161EF', navy: '#030620', ink: '#0f172a', body: '#334155', muted: '#64748b',
  line: '#e2e8f0', bg: '#f8fafc', tint: '#EFF5FF', white: '#ffffff', red: '#C2392B', green: '#0f766e', amber: '#b45309',
};
const FONT = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif";
const SERIF = "'DM Serif Display',Georgia,'Times New Roman',serif";
const money = (n: number) => `$${Math.round(n).toLocaleString('en-CA')}`;
const q = (s: string) => `"${s.replace(/\s+/g, ' ').trim()}"`;
const proof = (i: number) => (objections[i]?.proof || '').replace(/[“”]/g, '"');

/** Rough months searched, from the answer. */
const MONTHS: Record<string, number> = {
  'Less than 1 month': 0.5, '1-2 months': 1.5, '3-5 months': 4, '6-7 months': 6.5, '8-10 months': 9, '11-12 months': 11.5, '1+ years': 12,
};

export interface Objection {
  title: string;
  likelihood: 'Likely' | 'Possible';
  why: string;
  strategy: string;
  say: string[];
  fallback?: string;
}

const price = (p: { price: number; regular: number }) => (dealIsLive() ? p.price : p.regular);

/** The objections this person is likely to raise, with the evidence and what to say. */
export function predictObjections(a: BookCallAnswers, d: Diagnosis): Objection[] {
  const out: Objection[] = [];
  const g = price(PROGRAMS.group);
  const rec = recommend(a);
  const recPrice = rec.program === PROGRAMS.private.name ? price(PROGRAMS.private) : g;
  const monthly = a.targetSalary > 0 ? a.targetSalary / 12 : 0;
  const employed = a.situation.startsWith('Still employed');
  const deadline = dealIsLive() ? ` Black Friday pricing ends ${offer.dealEndsLong}, no extensions.` : '';

  // Money
  const moneyWhy: string[] = [];
  if (a.payment !== 'Credit card in full') moneyWhy.push(`would pay by "${a.payment}"`);
  if (a.situation.startsWith('Laid off')) moneyWhy.push(`situation: "${a.situation}"`);
  if (a.program === 'Not sure yet') moneyWhy.push('program not chosen yet');
  out.push({
    title: '"It\'s a lot of money right now."',
    likelihood: moneyWhy.length ? 'Likely' : 'Possible',
    why: moneyWhy.length ? `They ${moneyWhy.join('; ')}.` : 'Comes up on most calls, even when the form looks strong.',
    strategy: 'Agree that watching money is smart. Then compare the price to the cost of waiting, using their own number. Never discount below the current price.',
    say: [
      "You're right to watch every dollar. Can I show you how I think about it?",
      monthly > 0
        ? `You're aiming for ${money(a.targetSalary)}. That's about ${money(monthly)} a month before tax.${!employed && MONTHS[a.searchLength] ? ` You've been searching ${a.searchLength}, so roughly ${money(monthly * MONTHS[a.searchLength])} so far.` : ''} The ${rec.program.toLowerCase()} is ${money(recPrice)} plus HST for 3 months. That's ${daysLabel(recPrice / (a.targetSalary / WORKING_DAYS))} of your target pay.`
        : `The ${rec.program.toLowerCase()} is ${money(recPrice)} plus HST for 3 months. What's one month of your next salary worth?`,
      `If we get you hired even a few weeks sooner, it pays for itself. And you can spread it out: Klarna at checkout splits it into monthly payments for up to 12 months.`,
      `${offer.guarantee}`,
    ],
    fallback: rec.program === PROGRAMS.private.name ? `Downsell to the group cohort at ${money(g)}. Same community, calls and workshop, without the 1:1 rebuild.` : 'Point to Klarna at checkout for monthly payments. Do not lower the price.',
  });

  // Think about it
  out.push({
    title: '"I need to think about it."',
    likelihood: a.commit?.startsWith('No') ? 'Likely' : 'Possible',
    why: a.commit?.startsWith('No') ? `On the form: "${a.commit}".` : `On the form: "${a.commit || 'not answered'}". Still the most common stall.`,
    strategy: 'It almost always hides one specific question. Find it and answer it. Ask, then stay quiet.',
    say: [
      "Totally fair. What's the one thing you'd be thinking about?",
      'If that one thing was answered, would you want to start?',
      `If they still want time: "Sounds good. Let's book 10 minutes before ${dealIsLive() ? offer.dealEndsShort : 'the end of the week'} so you're not stuck deciding alone."${deadline}`,
    ],
  });

  // Partner
  if (a.decider !== 'Just me') {
    out.push({
      title: '"I need to talk to my partner first."',
      likelihood: 'Likely',
      why: `On the form: "${a.decider}".`,
      strategy: 'Respect it. Equip them to have that conversation, and offer a short call with both of them.',
      say: [
        'Makes total sense. What do you think they will ask you?',
        "Let's answer that now, so you have it ready.",
        `Would it help if the three of us jumped on for 10 minutes? I'll send you the page link to share in the meantime.${deadline}`,
      ],
    });
  }

  // Timing
  if (a.start !== 'This month' || employed) {
    out.push({
      title: employed ? '"I don\'t have time with my current job."' : '"Now isn\'t the right time. Maybe after the holidays."',
      likelihood: a.start === 'Later than that' || a.start === 'Not sure yet' ? 'Likely' : 'Possible',
      why: [a.start !== 'This month' ? `Could start: "${a.start}".` : '', employed ? `Situation: "${a.situation}".` : ''].filter(Boolean).join(' '),
      strategy: 'Ask what changes by waiting. Show the time cost is one hour a week plus search time they already spend.',
      say: [
        "What would be different if we started in January instead?",
        `We start ${offer.startDateLong}. The live call is one hour every Wednesday. The rest is your search, which you're already doing, just pointed at what works.`,
        employed
          ? "Searching while employed is the strongest position to negotiate from. Let's use it."
          : `Every month of waiting${monthly ? ` is about ${money(monthly)} of salary` : ' has a cost'}.${deadline}`,
      ],
    });
  }

  // Will it work for me
  const doubt = a.motivation <= 3 || (MONTHS[a.searchLength] || 0) >= 9;
  if (doubt) {
    out.push({
      title: '"I\'ve tried everything. Will this actually work for me?"',
      likelihood: 'Likely',
      why: `Motivation ${a.motivation} of 5, searching ${a.searchLength}.`,
      strategy: "Lead with empathy, not hype. Name what's been draining them. Show one concrete change you'd make this week. Use proof from someone with a similar story. Never promise a job.",
      say: [
        "That makes sense. You've been doing this alone for a long time.",
        `Here's the first thing I'd change, this week: ${d.callFocus}`,
        proof(3),
      ],
    });
  }

  // Volume
  if (d.key === 'positioning') {
    out.push({
      title: '"I\'ve sent hundreds of applications. Why would this be different?"',
      likelihood: 'Possible',
      why: `${a.totalApplications} applications, ${a.interviews} interviews.`,
      strategy: "Agree that more volume won't fix it. Name what's off (targeting, resume, or both) without fixing it on the call. The fix is what we do together in the program.",
      say: ['More applications won\'t fix this. The people who turn it around slow down and change the approach.', proof(1)],
    });
  }

  // Coach before
  out.push({
    title: '"I already paid for a coach or course. It went nowhere."',
    likelihood: 'Possible',
    why: 'Common with long searches and people who have tried courses. Ask early so it doesn\'t come up at the close.',
    strategy: 'Ask what they got and what was missing. Contrast advice-only coaching with building it together, live, every week.',
    say: ["What did you get from it, and what was missing?", ...objections[0].a, proof(0)],
  });

  // Group fit
  if (a.yearsExperience >= 12 || a.program === PROGRAMS.private.name) {
    out.push({
      title: '"I\'m senior. Is a group right for me?" / "I\'m not a group person."',
      likelihood: 'Possible',
      why: `${a.yearsExperience} years of experience${a.program === PROGRAMS.private.name ? ', and they picked the private rebuild' : ''}.`,
      strategy: 'Group is 16 people at most, all working on their next role. They can listen for the first few weeks. The private rebuild is the 1:1 answer.',
      say: [...objections[5].a, proof(5)],
    });
  }

  // Land a job soon
  if (d.key === 'tuning' || d.key === 'interviewing' || a.interviews >= 3) {
    out.push({
      title: '"What if I land a job in the first month?"',
      likelihood: 'Possible',
      why: `${a.interviews} interviews and ${a.offers} offers so far.`,
      strategy: 'Celebrate it. They keep the seat for 3 months and use it for negotiation and starting well.',
      say: [...objections[6].a, proof(6)],
    });
  }

  // Field
  out.push({
    title: '"I\'m not in tech. Will this work in my field?"',
    likelihood: 'Possible',
    why: `Target roles: ${q(a.jobTitles)}.`,
    strategy: 'Same work in every field. Give one example close to their field.',
    say: [...objections[4].a, proof(4)],
  });

  // Outside Canada
  if (a.country !== 'Canada' || a.struggles.some((s) => s.startsWith('International'))) {
    out.push({
      title: '"Will this work outside Canada?" / "I lack Canadian experience."',
      likelihood: 'Possible',
      why: `Country: ${a.country}.${a.struggles.some((s) => s.startsWith('International')) ? ' Named "Canadian experience" as a struggle.' : ''}`,
      strategy: 'Prices are in CAD. Confirm the Wednesday call time works in their time zone before you close.',
      say: ['Prices are in Canadian dollars.', 'What time zone are you in? Let me check the Wednesday call works for you.'],
    });
  }

  const rank = { Likely: 0, Possible: 1 };
  return out.sort((x, y) => rank[x.likelihood] - rank[y.likelihood]);
}

/** Discovery questions, built from their own answers. */
export function discovery(a: BookCallAnswers, d: Diagnosis): string[] {
  const out = [
    `You wrote that your biggest challenge is ${q(a.challenge)}. Tell me more about that.`,
    `You've been searching ${a.searchLength}. What have you tried that hasn't worked?`,
    ...CALL_PLAN[d.key],
  ];
  if (a.situation.startsWith('Laid off')) out.push('How much runway do you have before this gets stressful?');
  if (a.motivation <= 3) out.push(`You rated your motivation ${a.motivation} of 5. What's draining you most right now?`);
  out.push(`Besides a job, you said success looks like ${q(a.milestones)}. What would that change for you?`);
  out.push('If nothing changes in the next 3 months, where does that leave you?');
  return out;
}

function closeScript(a: BookCallAnswers, rec: { program: string }): { label: string; lines: string[] } {
  const p = money(rec.program === PROGRAMS.private.name ? price(PROGRAMS.private) : price(PROGRAMS.group));
  const ask = `Based on everything you've told me, I'd recommend the ${rec.program.toLowerCase()}. It's ${p} plus HST. Want me to send the link now, so we can get you set up before we hang up?`;
  if (a.commit?.startsWith('Yes'))
    return { label: 'They said they will have a card ready. Close directly.', lines: [ask, 'Drop the payment link in the Zoom chat. Stay on while they pay and confirm it went through.', 'Then tell them exactly what happens next: welcome email, community invite, first call date.'] };
  if (a.commit?.startsWith('Probably'))
    return { label: 'They said "probably". Clear the questions, then close.', lines: ['Before I make a recommendation, what questions do you still have?', 'Answer each one. Then: "Anything else, or does that cover it?"', ask] };
  return { label: 'They said they want time to think. Find the real question first.', lines: ["You mentioned you'd want time to think after the call. That's fair. Usually that means one question is still open. Which one is it?", 'Answer it. Then: "With that answered, how are you feeling about it?"', ask] };
}

export function buildSalesBrief(a: BookCallAnswers, call: { callAt: Date; joinUrl?: string }, checkout: { group?: string; private?: string } = {}) {
  const d = diagnose(a);
  const v = scoreLead(a);
  const score = leadScore(a);
  const value = programValue(a.program);
  const rec = recommend(a);
  const objs = predictObjections(a, d);
  const close = closeScript(a, rec);
  const name = `${a.firstName} ${a.lastName}`.trim();
  const live = dealIsLive();
  const gradeColour = score.grade === 'Hot' ? C.red : score.grade === 'Warm' ? C.amber : C.muted;
  const subject = `Tomorrow ${callTime(call.callAt, false)} | ${name} | ${score.grade} ${score.score} | ${value.label} | Sales plan`;
  const rate = a.totalApplications > 0 ? `${((a.interviews / a.totalApplications) * 100).toFixed(1)}%` : '-';

  const H = (t: string) => `<p style="margin:28px 0 10px;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${C.blue};">${esc(t)}</p>`;
  const P = (h: string, extra = '') => `<p style="margin:0 0 10px;font-family:${FONT};font-size:14px;line-height:1.6;color:${C.ink};${extra}">${h}</p>`;
  const OL = (items: string[]) => items.map((it, i) => P(`<strong style="color:${C.blue};">${i + 1}.</strong> ${esc(it)}`)).join('');
  const row = (k: string, val: string) => `<tr><td style="padding:8px 0;border-top:1px solid ${C.line};font-family:${FONT};font-size:13px;color:${C.muted};width:36%;vertical-align:top;">${esc(k)}</td><td style="padding:8px 0 8px 12px;border-top:1px solid ${C.line};font-family:${FONT};font-size:14px;color:${C.ink};line-height:1.5;">${val}</td></tr>`;
  const agenda: [string, string][] = [
    ['0 to 2 min', `Rapport, then set the frame: "By the end, you'll know whether this fits. If it does, we can get you in today. If it doesn't, I'll tell you."`],
    ['2 to 8 min', 'Discovery. Use the questions below. Listen more than you talk.'],
    ['8 to 11 min', `Name the gap: "${d.title}". Put a number on what it's costing them (see the money math below). Don't fix it on the call: the fix is the program.`],
    ['11 to 14 min', `Recommend the ${rec.program.toLowerCase()}. Tie each part to something they said.`],
    ['14 to 20 min', 'Close, handle the objection, take payment while they are still on the call.'],
  ];

  const objHtml = objs
    .map(
      (o) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 14px;border:1px solid ${C.line};border-radius:10px;">
<tr><td style="padding:14px 16px;">
<p style="margin:0 0 6px;font-family:${FONT};font-size:15px;font-weight:700;color:${C.ink};">${esc(o.title)} <span style="display:inline-block;margin-left:6px;padding:2px 8px;border-radius:999px;border:1px solid ${o.likelihood === 'Likely' ? C.red : C.muted};font-size:11px;color:${o.likelihood === 'Likely' ? C.red : C.muted};">${o.likelihood}</span></p>
${P(`<strong>Why for ${esc(a.firstName)}:</strong> ${esc(o.why)}`, `color:${C.body};`)}
${P(`<strong>Strategy:</strong> ${esc(o.strategy)}`, `color:${C.body};`)}
${P('<strong>Say:</strong>', 'margin-bottom:4px;')}
${o.say.filter(Boolean).map((s) => `<p style="margin:0 0 6px 12px;padding-left:10px;border-left:3px solid ${C.tint};font-family:${FONT};font-size:14px;line-height:1.55;color:${C.ink};">${esc(s)}</p>`).join('')}
${o.fallback ? P(`<strong>If it's still no:</strong> ${esc(o.fallback)}`, `margin-top:8px;color:${C.body};`) : ''}
</td></tr></table>`,
    )
    .join('');

  const links = [checkout.group ? `<a href="${esc(checkout.group)}" style="color:${C.blue};font-weight:600;">Group cohort link</a>` : 'Group cohort link: not set yet', checkout.private ? `<a href="${esc(checkout.private)}" style="color:${C.blue};font-weight:600;">Private rebuild link</a>` : 'Private rebuild link: not set yet'].join(' &middot; ');

  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(subject)}</title>
<style>@media only screen and (max-width:520px){.px{padding-left:20px !important;padding-right:20px !important}.stack td{display:block !important;width:100% !important;border-right:0 !important;border-bottom:1px solid ${C.line}}}</style></head>
<body style="margin:0;padding:0;background:${C.bg};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="640" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;background:${C.white};border-radius:12px;overflow:hidden;border:1px solid ${C.line};">

<tr><td style="background:${C.navy};padding:28px 32px;" class="px">
<p style="margin:0 0 6px;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:1.5px;color:#cbd5e1;">SALES PLAN &middot; ${esc(callTime(call.callAt).toUpperCase())}</p>
<h1 style="margin:0 0 10px;font-family:${SERIF};font-size:30px;font-weight:400;line-height:1.15;color:${C.white};">${esc(name)}</h1>
${call.joinUrl ? `<a href="${esc(call.joinUrl)}" style="display:inline-block;padding:8px 14px;border-radius:8px;background:${C.blue};font-family:${FONT};font-size:13px;font-weight:700;color:#fff;text-decoration:none;">Join link</a>` : ''}
</td></tr>

<tr><td style="padding:0;border-bottom:1px solid ${C.line};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="stack"><tr>
<td width="25%" style="padding:14px 10px 14px 32px;border-right:1px solid ${C.line};vertical-align:top;" class="px"><div style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${C.muted};">Score</div><div style="font-family:${FONT};font-size:22px;font-weight:700;color:${C.ink};">${score.score}</div><div style="font-family:${FONT};font-size:12px;font-weight:700;color:${gradeColour};">${score.grade}</div></td>
<td width="25%" style="padding:14px 10px;border-right:1px solid ${C.line};vertical-align:top;"><div style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${C.muted};">Value</div><div style="font-family:${FONT};font-size:18px;font-weight:700;color:${C.ink};">${esc(value.label)}</div></td>
<td width="25%" style="padding:14px 10px;border-right:1px solid ${C.line};vertical-align:top;"><div style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${C.muted};">Recommend</div><div style="font-family:${FONT};font-size:14px;font-weight:700;color:${C.ink};line-height:1.35;">${esc(rec.program)}</div></td>
<td width="25%" style="padding:14px 32px 14px 10px;vertical-align:top;" class="px"><div style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${C.muted};">Enrol on call?</div><div style="font-family:${FONT};font-size:14px;font-weight:700;color:${C.ink};line-height:1.35;">${esc(a.commit || '-')}</div></td>
</tr></table></td></tr>

<tr><td style="padding:8px 32px 28px;" class="px">

${H('The goal of this call')}
${P(`End with a decision. Have both payment links open before you join: ${links}.`)}
${P(`<strong>Recommend the ${esc(rec.program.toLowerCase())}.</strong> ${esc(rec.why)}`)}

${H('Snapshot')}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${row('Diagnosis', `<strong>${esc(d.title)}</strong>. ${esc(d.callFocus)}`)}
${row('Numbers', `${a.totalApplications} applications, ${a.interviews} interviews, ${a.offers} offers. Interview rate ${rate}.`)}
${row('Search', `${esc(a.searchLength)}, ${esc(a.appsPerWeek)} applications a week. ${esc(a.situation)}.`)}
${row('Targeting', `${esc(a.jobTitles)}. ${a.targetSalary ? `${money(a.targetSalary)} target (about ${money(a.targetSalary / 12)} a month).` : ''} ${a.yearsExperience} years of experience.`)}
${row('Struggles', esc(a.struggles.join('; ')))}
${row('Motivation', `${a.motivation} of 5`)}
${row('Decision', `${esc(a.decider)}. Could start: ${esc(a.start)}. Pay by: ${esc(a.payment)}.`)}
${row('Wants from the call', esc(a.callGoal))}
${v.qualified ? '' : row('Note', `Did not pass the form checks (${esc(v.reason)}). Minimum is ${QUALIFY.minYears} years and ready to invest.`)}
</table>

${H('Call plan (20 minutes)')}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${agenda.map(([t, s]) => row(t, esc(s))).join('')}</table>

${H(`Discovery questions for ${a.firstName}`)}
${OL(discovery(a, d))}
${P(`<strong>Deliver what they asked for early.</strong> They want: ${esc(q(a.callGoal))}. Give them that in the first 10 minutes, and the close gets easy.`, `background:${C.tint};padding:12px 14px;border-radius:8px;`)}

${H('Story to tell')}
${(() => { const st = storyFor(d.key, a); return P(`<strong>${esc(st.who)}.</strong> ${esc(st.story)} In their words: "${esc(st.quote)}"`) + P('Tell it when you give the diagnosis. Then: "Results vary, and I can\'t promise the same. But this is the pattern."', `color:${C.body};`); })()}

${H('The close')}
${P(`<strong>${esc(close.label)}</strong>`)}
${OL(close.lines)}

${H('Objections to expect, most likely first')}
${P('For every objection: listen fully, acknowledge it, ask one question to find what is underneath, then answer that. One answer, then stop talking.', `color:${C.body};`)}
${objHtml}

${H('Facts you can use')}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${row('Prices', `${PROGRAMS.group.name}: ${money(price(PROGRAMS.group))}. ${PROGRAMS.private.name}: ${money(price(PROGRAMS.private))}. CAD plus HST, first 3 months.${live ? ` Regular ${money(PROGRAMS.group.regular)} and ${money(PROGRAMS.private.regular)}.` : ''}`)}
${live ? row('Deadline', `Black Friday pricing ends ${esc(offer.dealEndsLong)}. No extensions. ${esc(offer.dealLine)}`) : ''}
${row('Start', `${esc(offer.startDateLong)}. First Wednesday call ${esc(offer.firstCallLong)}.`)}
${row('Seats', `${offer.seatsLeft} of ${offer.seatsTotal} left (group ${offer.group.seatsLeft}, private ${offer.private.seatsLeft}), as set by hand in src/data/llu.ts. Only quote it if it's current.`)}
${row('Paying', esc(offer.paying))}
${row('Guarantee', esc(offer.guarantee))}
${row('After 3 months', esc(offer.afterThreeMonths))}
</table>

${H("Don'ts")}
${OL(["Don't coach on the call. Diagnose, put a number on the gap, recommend. Free fixes get taken away, tried alone, and rarely work.", 'Never promise a job or a timeline. ' + RESULTS_VARY, 'Never discount below the current price. Downsell to the group instead.', "Don't invent urgency. Use the real deadline and the real seat count only."])}

${H('After the call')}
${OL(['Enrolled: they get the Stripe receipt, and the follow-up emails stop automatically.', `Not yet: they get a follow-up the next morning, and one last note 3 days later. To stop those, set CALL_OUTCOME on their Brevo contact to "lost" or "enrolled".`, 'Add a one-line note on how it went, so the next brief gets better.'])}

</td></tr></table>
<p style="margin:16px 0 0;font-family:${FONT};font-size:12px;color:${C.muted};">Built from ${esc(a.firstName)}'s form answers. Hit reply to email them.</p>
</td></tr></table></body></html>`;

  return { subject, html };
}

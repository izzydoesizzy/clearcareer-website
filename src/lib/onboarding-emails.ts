/**
 * Emails after someone pays.
 *
 * To the client:
 *   welcome        right after payment: you're in, and one link to sign and do intake
 *   remind1/2      2 and 4 days later, if the agreement or intake isn't done
 *   signedCopy     right after signing, with the signed PDF attached
 *   intakeDone     right after intake: Mighty Networks invite, Wednesday call, calendar file
 *   renewal        a week before the last call: stay on for $49 a month, and an optional testimonial
 * To Izzy:
 *   enrolment      right after payment
 *   intakeBrief    right after intake, with the folder link
 *   digest         every morning at 7:30: everything that needs a look
 */
import { ui } from './call-emails.js';
import { esc as escHtml } from './lead-email.js';
import { offer, welcome, callTimeLabel } from '../data/llu.js';
import { PROGRAMS } from './book-call.js';
import { onboardingUrl, type Intake } from './onboarding.js';
import { SITE_URL } from './email/constants.js';

const { shell, P, H, list, button, link, small, sign, esc } = ui;
const CLIENT_REASON = "You're getting this because you joined Land and Level Up.";
const CLIENT_UNSUB = 'mailto:izzy@joinclearcareer.com?subject=Program%20emails';
const cshell = (eyebrow: string, headline: string, body: string) => shell(eyebrow, headline, body, CLIENT_REASON, CLIENT_UNSUB);

const firstSteps = (token: string) => `
${H('Two things to do this week (about 15 minutes)')}
${list([
  '<strong>Sign the agreement.</strong> It spells out the guarantee, the group rules and how I handle your files. Plain English, two minutes.',
  "<strong>Fill in your intake.</strong> Your LinkedIn link, every version of your resume you've got (yes, even the messy ones), any cover letters, a few job posts you'd love, and 5 wins from your career. Rough is perfect.",
], true)}
${button('Sign and start my intake', onboardingUrl(token))}
${small('This link is just for you. It saves as you go, so you can come back to it.')}`;

// ── To the client ────────────────────────────────────────────────────────────────
/** Every member gets the toolkit the day they join. Without a link (no secret set), say it's coming. */
const toolkitBlock = (url?: string) => `
${H('Your AI tools are ready now')}
${url
  ? P(`Every tool I've built is waiting for you: the 6-tool Career Suite and 17 Claude skills. ${link('Open your toolkit', url)} and start with Career Clarity. It takes about 20 minutes, and it makes our first call a lot more useful.`)
  : P("Every tool I've built is yours: the 6-tool Career Suite and 17 Claude skills. Your toolkit link is coming from me before we start.")}`;

export function welcomeEmail(c: { firstName: string; program: string; token: string; toolkitUrl?: string }) {
  const subject = `You're in, ${c.firstName}! Here's your first step`;
  const html = cshell('Welcome', 'Two quick things this week, about 15 minutes.', `
${P(`Hey ${esc(c.firstName)},`)}
${P(`You did it. Welcome to Land and Level Up${c.program === PROGRAMS.private.name ? ', with the private 1:1 rebuild' : ''}.`)}
${P("I know this wasn't a small decision. You looked hard at your search, decided you deserved backup, and backed yourself. That's exactly the energy we need for the next 6 weeks.")}
${firstSteps(c.token)}
${toolkitBlock(c.toolkitUrl)}
${H('What happens next')}
${list([
  `As soon as your intake is in, you get your invite to our ${esc(welcome.communityName)} community and the Wednesday call details.`,
  `We start ${esc(offer.startDateLong)}. Six live calls on Wednesdays${callTimeLabel() ? ` at ${esc(callTimeLabel())}` : ''}: ${esc(offer.callDates)}. ${esc(offer.holidayBreak)}`,
  "Before then, I'll go through everything you send me, so we hit the ground running.",
])}
${P(`Your receipt comes separately from Stripe. ${esc(offer.guarantee)}`)}
${P('Questions? Hit reply. It comes straight to me.')}
${sign('So excited to work with you,')}`);
  return { subject, html };
}

export function reminderEmail(c: { firstName: string; token: string; agreement: boolean; intake: boolean }, second: boolean) {
  const missing = !c.agreement && !c.intake ? 'the agreement and your intake' : !c.agreement ? 'the agreement' : 'your intake';
  const subject = second ? `${c.firstName}, I don't want you to miss week 1` : `Quick reminder: ${missing}`;
  const html = cshell('Before we start', 'About 15 minutes, and it saves as you go.', `
${P(`Hey ${esc(c.firstName)},`)}
${second
  ? P(`I still don't have ${missing} from you, and I don't want you starting week 1 a step behind. The intake is how I prep for you: the more I see before ${esc(offer.firstCallLong)}, the more useful our first call is.`)
  : P(`Just a nudge: I don't have ${missing} yet. Takes about 15 minutes, and it saves as you go.`)}
${button(c.agreement ? 'Finish my intake' : 'Sign and start my intake', onboardingUrl(c.token))}
${P("Stuck on something, like finding your resume versions or exporting your LinkedIn? Hit reply and tell me. We'll sort it.")}
${sign()}`);
  return { subject, html };
}

export function signedCopyEmail(c: { firstName: string; token: string }) {
  const subject = 'Your signed Land and Level Up agreement';
  const html = cshell('Signed', 'Your signed copy is attached. Next up: your intake.', `
${P(`Hey ${esc(c.firstName)},`)}
${P("Thanks for signing. Your signed copy is attached, for your records.")}
${P('Next up is your intake, if you haven\'t done it yet:')}
${button('Go to my intake', onboardingUrl(c.token))}
${sign()}`);
  return { subject, html };
}

export function intakeDoneEmail(c: { firstName: string; program: string; toolkitUrl?: string }) {
  const time = callTimeLabel();
  const subject = welcome.communityUrl && time && welcome.callUrl
    ? `Got it, ${c.firstName}. Here's your community invite and our Wednesday call`
    : `Got it, ${c.firstName}. You're all set`;
  const steps = [
    welcome.communityUrl
      ? `<strong>Join the community.</strong> ${link(`Join us on ${welcome.communityName}`, welcome.communityUrl)}, then post a quick hello: your target role, and one win you're proud of.`
      : `<strong>Your ${esc(welcome.communityName)} invite</strong> is on its way from me before ${esc(offer.startDateShort)}.`,
    time && welcome.callUrl
      ? `<strong>Save the Wednesday call.</strong> Wednesdays at ${esc(time)}: ${esc(offer.callDates)}. ${link('Join link', welcome.callUrl)}. ${link('Add all 6 calls to your calendar', `${SITE_URL}/llu-calls.ics`)}.`
      : `<strong>The Wednesday call details</strong> (time and link) are coming from me before ${esc(offer.firstCallLong)}.`,
    c.toolkitUrl
      ? `<strong>Open your AI toolkit.</strong> ${link('Every tool I\'ve built', c.toolkitUrl)}, in the order we'll use them. Start with Career Clarity.`
      : `<strong>Your AI toolkit</strong> (the Career Suite and 17 Claude skills) is on its way from me before ${esc(offer.startDateShort)}.`,
    ...(c.program === PROGRAMS.private.name
      ? [welcome.privateBookingUrl
        ? `<strong>Book your 1:1 rebuild.</strong> ${link('Pick your times here', welcome.privateBookingUrl)}. I'm starting on your resume and LinkedIn drafts, your target and hiring manager lists, and your salary report now. Then we spend 2 to 3 hours together polishing it all.`
        : "<strong>Your 1:1 rebuild:</strong> I'm starting on your resume and LinkedIn drafts, your target and hiring manager lists, and your salary report now. I'll email you to book our sessions."]
      : []),
  ];
  const html = cshell('All set', 'Your next steps, and what happens before we start.', `
${P(`Hey ${esc(c.firstName)},`)}
${P("Got your intake. Thank you. I know digging up old resumes and writing down your wins isn't fun. It's also exactly the raw material we need, so: nicely done.")}
${H('Your next steps')}
${list(steps, true)}
${P(`We start ${esc(offer.startDateLong)}. Until then, if anything comes up in your search (an interview, an offer, a weird recruiter message), hit reply.`)}
${sign('See you Wednesday,')}`);
  return { subject, html };
}

export function renewalEmail(c: { firstName: string; renewalUrl?: string }) {
  const subject = `${c.firstName}, what's next after our 6 weeks`;
  const html = cshell('Next steps', 'Stay on for $49 a month, and one small favour.', `
${P(`Hey ${esc(c.firstName)},`)}
${P(`We're coming up on the end of our 6 weeks together. Our last call is ${esc(offer.lastCallLong)}. However your search is going right now, I'm proud of how you've shown up.`)}
${P(`${esc(offer.afterProgram)} You keep the community, the Wednesday calls and the tools.`)}
${c.renewalUrl ? button('Stay on for $49 a month', c.renewalUrl) : P('Reply "stay" and I\'ll send you the link.')}
${H('One favour')}
${P("If Land and Level Up helped you, would you write 2 or 3 sentences about it? What it was like before, what changed, and where you are now. Hit reply with it. I'll only share it publicly if you say yes, and you can choose to use just your first name and last initial.")}
${sign('Thank you, truly,')}`);
  return { subject, html };
}

// ── To Izzy ───────────────────────────────────────────────────────────────────────
const C = { ink: '#0f172a', muted: '#64748b', line: '#e2e8f0', blue: '#0161EF', red: '#C2392B', green: '#0f766e', navy: '#030620', bg: '#f8fafc' };
const F = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif";
const ip = (h: string) => `<p style="margin:0 0 10px;font-family:${F};font-size:14px;line-height:1.6;color:${C.ink};">${h}</p>`;
const ih = (t: string) => `<p style="margin:22px 0 8px;font-family:${F};font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${C.blue};">${escHtml(t)}</p>`;
const irow = (k: string, v: string) => `<tr><td style="padding:8px 0;border-top:1px solid ${C.line};font-family:${F};font-size:13px;color:${C.muted};width:34%;vertical-align:top;">${escHtml(k)}</td><td style="padding:8px 0 8px 12px;border-top:1px solid ${C.line};font-family:${F};font-size:14px;color:${C.ink};line-height:1.5;white-space:pre-wrap;">${v || '<span style="color:#94a3b8;">-</span>'}</td></tr>`;
function ishell(eyebrow: string, title: string, body: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escHtml(title)}</title></head>
<body style="margin:0;padding:0;background:${C.bg};"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="640" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;background:#fff;border-radius:12px;overflow:hidden;border:1px solid ${C.line};">
<tr><td style="background:${C.navy};padding:24px 28px;"><p style="margin:0 0 6px;font-family:${F};font-size:12px;font-weight:700;letter-spacing:1.5px;color:#cbd5e1;">${escHtml(eyebrow)}</p>
<h1 style="margin:0;font-family:'DM Serif Display',Georgia,serif;font-size:26px;font-weight:400;color:#fff;">${escHtml(title)}</h1></td></tr>
<tr><td style="padding:8px 28px 28px;">${body}</td></tr></table></td></tr></table></body></html>`;
}

export function enrolmentNotice(c: { name: string; email: string; program: string; amount: number; folderUrl?: string; seats: { group: number; private: number } }) {
  const subject = `New enrolment: ${c.name}, ${c.program}, $${c.amount}`;
  const html = ishell('NEW ENROLMENT', c.name, `
${ih('Details')}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${irow('Email', `<a href="mailto:${escHtml(c.email)}" style="color:${C.blue};">${escHtml(c.email)}</a>`)}
${irow('Program', escHtml(c.program))}
${irow('Paid', `$${c.amount} CAD (incl. tax if any)`)}
${irow('Drive folder', c.folderUrl ? `<a href="${escHtml(c.folderUrl)}" style="color:${C.blue};">Open folder</a>` : 'Not created (Google not set up yet)')}
${irow('Seats sold', `Group ${c.seats.group} of ${offer.group.seatsTotal} · Private ${c.seats.private} of ${offer.private.seatsTotal}`)}
</table>
${ih('Already done automatically')}
${ip('Welcome email with their agreement and intake link. Follow-up emails stopped. Added to the roster. Reminders go out at 2 and 4 days if they stall.')}
${ih('Your one job')}
${ip(`Update the seats left in src/data/llu.ts (seatsLeft) so the page stays honest. ${c.program === PROGRAMS.private.name ? 'Private rebuild: once intake is in, draft their resume, headline and About, build their 50+ target companies and first hiring manager list, write their salary report, then book the 1:1 sessions. All done by Dec 22.' : ''}`)}`);
  return { subject, html };
}

export function intakeBrief(c: { name: string; email: string; program: string; intake: Intake; files: string[]; folderUrl?: string; summaryUrl?: string }) {
  const i = c.intake;
  const subject = `Intake in: ${c.name} (${c.program})`;
  const html = ishell('INTAKE RECEIVED', c.name, `
${c.folderUrl ? ip(`<a href="${escHtml(c.folderUrl)}" style="display:inline-block;padding:8px 14px;border-radius:8px;background:${C.blue};color:#fff;font-weight:700;text-decoration:none;">Open their Drive folder</a>${c.summaryUrl ? ` &nbsp; <a href="${escHtml(c.summaryUrl)}" style="color:${C.blue};font-weight:600;">Intake summary doc</a>` : ''}`) : ''}
${ih('Profile')}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${irow('Email', escHtml(c.email))}
${irow('Goes by', escHtml(i.preferredName))}
${irow('LinkedIn', `<a href="${escHtml(i.linkedinUrl)}" style="color:${C.blue};">${escHtml(i.linkedinUrl)}</a>`)}
${irow('Time zone', escHtml(i.timezone))}
${irow('Phone', escHtml(i.phone))}
${irow('Recordings', escHtml(i.recording))}
</table>
${ih('Files')}
${c.files.length ? ip(c.files.map((f) => `&#10003; ${escHtml(f)}`).join('<br>')) : ip('<span style="color:#C2392B;">No files uploaded. Ask for their resume.</span>')}
${ih('Their search')}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${irow('Target roles', escHtml(i.targetRoles))}
${irow('Target companies', escHtml(i.targetCompanies))}
${irow('Job posts they want', escHtml(i.jobPosts))}
</table>
${ih('5 wins, in their words')}
${ip(escHtml(i.wins).replace(/\n/g, '<br>'))}
${ih('Week 1, they want to cover')}
${ip(escHtml(i.week1))}
${i.anythingElse ? ih('Anything else') + ip(escHtml(i.anythingElse)) : ''}`);
  return { subject, html };
}

export interface DigestData {
  now: Date;
  callsToday: { name: string; email: string; at: Date; grade?: string }[];
  unconfirmed: { name: string; email: string; at: Date }[];
  newLeads: { name: string; email: string; status: string; score?: number }[];
  notBooked: { name: string; email: string; days: number }[];
  enrolled: { name: string; email: string; program: string }[];
  onboarding: { name: string; email: string; agreement: boolean; intake: boolean; days: number }[];
  seats: { group: number; private: number };
  setup: string[];
}

export function digestEmail(d: DigestData) {
  const t = (x: Date) => x.toLocaleTimeString('en-CA', { timeZone: 'America/Toronto', hour: 'numeric', minute: '2-digit' });
  const day = d.now.toLocaleDateString('en-CA', { timeZone: 'America/Toronto', weekday: 'long', month: 'long', day: 'numeric' });
  const firstCall = new Date('2026-12-09T05:00:00Z');
  const beforeFirstCall = d.now < firstCall;
  const unsignedNearStart = beforeFirstCall && firstCall.getTime() - d.now.getTime() < 3 * 86_400_000;
  const mail = (e: string) => `<a href="mailto:${escHtml(e)}" style="color:${C.blue};">${escHtml(e)}</a>`;
  const section = (title: string, rows: string[], empty: string) => ih(title) + (rows.length ? rows.map(ip).join('') : ip(`<span style="color:${C.muted};">${escHtml(empty)}</span>`));
  const todo = d.unconfirmed.length + d.onboarding.filter((o) => o.days >= 4).length + d.setup.length;
  const subject = `Today: ${d.callsToday.length} call${d.callsToday.length === 1 ? '' : 's'}, ${d.enrolled.length} new enrolment${d.enrolled.length === 1 ? '' : 's'}${todo ? `, ${todo} to check` : ', all clear'}`;
  const html = ishell(`DAILY DIGEST · ${day.toUpperCase()}`, 'Your Land and Level Up morning', `
${section("Today's calls", d.callsToday.map((c) => `<strong>${t(c.at)}</strong> ${escHtml(c.name)} ${c.grade ? `(${escHtml(c.grade)})` : ''} · ${mail(c.email)} · your sales plan is in your inbox${c.grade?.startsWith('Hot') ? `<br><span style="color:${C.red};">Hot lead: if it's not a yes on the call, send a 2-line personal note tonight about something they said. The automatic follow-up goes tomorrow at 7:30 a.m.</span>` : ''}`), 'No calls today.')}
${section('Did these calls happen?', d.unconfirmed.map((c) => `${escHtml(c.name)} (${mail(c.email)}), yesterday at ${t(c.at)}. If they didn't show, mark the no-show in Calendly. If they enrolled, Stripe handles it. If it's a no, set CALL_OUTCOME to "lost" in Brevo.`), 'Nothing to confirm.')}
${section('New form answers (last 24 hours)', d.newLeads.map((l) => `${escHtml(l.name)} · ${mail(l.email)} · ${escHtml(l.status)}${l.score !== undefined ? ` · score ${l.score}` : ''}`), 'No new form answers.')}
${section('Qualified but not booked', d.notBooked.map((l) => `${escHtml(l.name)} · ${mail(l.email)} · ${l.days} day${l.days === 1 ? '' : 's'} ago. Nudge emails are going out. A personal note from you converts best.`), 'Everyone who qualified has booked.')}
${section('New enrolments', d.enrolled.map((e) => `${escHtml(e.name)} · ${escHtml(e.program)} · ${mail(e.email)}`), 'No new enrolments.')}
${section('Onboarding still open', d.onboarding.map((o) => {
  const miss = [!o.agreement && 'agreement', !o.intake && 'intake'].filter(Boolean).join(' and ');
  const red = o.days >= 4 || (!o.agreement && unsignedNearStart);
  return `<span style="color:${red ? C.red : C.ink};">${escHtml(o.name)} · ${mail(o.email)} · missing ${miss} · ${o.days} day${o.days === 1 ? '' : 's'}${red ? ' · reach out personally' : ''}</span>`;
}), 'Everyone has signed and done their intake.')}
${ih('Seats sold')}
${ip(`Group ${d.seats.group} of ${offer.group.seatsTotal} · Private ${d.seats.private} of ${offer.private.seatsTotal}. Page says ${offer.group.seatsLeft} and ${offer.private.seatsLeft} left${offer.group.seatsTotal - d.seats.group !== offer.group.seatsLeft || offer.private.seatsTotal - d.seats.private !== offer.private.seatsLeft ? ` <span style="color:${C.red};">(out of date: update seatsLeft in src/data/llu.ts)</span>` : ''}.`)}
${d.setup.length ? ih('Setup still missing') + d.setup.map((s) => ip(`<span style="color:${C.red};">&#9679;</span> ${escHtml(s)}`)).join('') : ''}`);
  return { subject, html };
}

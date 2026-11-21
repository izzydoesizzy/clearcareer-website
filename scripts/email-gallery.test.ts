/**
 * Every email in the Land and Level Up system, rendered with a sample lead, in one HTML file.
 * Review them all without sending anything (zero Brevo credits).
 * Run: pnpm emails:gallery   (writes emails/gallery.html, which git ignores)
 */
import { it } from 'vitest';
import { writeFileSync, mkdirSync } from 'node:fs';
import { cleanAnswers, scoreLead, diagnose, leadScore, programValue, READY, NOT_READY, STRUGGLES, COMMIT } from '../src/lib/book-call';
import { buildLeadEmail } from '../src/lib/lead-email';
import { buildSalesBrief } from '../src/lib/sales-brief';
import * as call from '../src/lib/call-emails';
import * as onb from '../src/lib/onboarding-emails';
import { cleanIntake } from '../src/lib/onboarding';
import { nurtureEmails } from '../src/lib/email/nurture';

it('builds the email gallery', () => {
  if (!process.env.RENDER_EMAILS) return;
  const { data: a } = cleanAnswers({
    firstName: 'Sam', lastName: 'Lee', email: 'sam@example.com', phone: '416 555 0100', jobTitles: 'Senior project manager',
    targetSalary: 120000, yearsExperience: 11, searchLength: '6-7 months', appsPerWeek: '6-10', totalApplications: 120,
    interviews: 3, offers: 0, situation: 'Laid off in the last 3 months', country: 'Canada', struggles: [STRUGGLES[2], STRUGGLES[5]],
    challenge: 'I apply to everything and hear nothing back', milestones: 'Feeling confident again', motivation: 4, callGoal: 'A clear plan for the next 30 days',
    decider: 'Me and a partner or family member', start: 'This month', payment: 'Klarna (monthly, up to 12 months)', program: 'Not sure yet', commit: COMMIT[1], ready: READY, consent: true,
  });
  const callAt = new Date('2026-11-26T19:00:00Z');
  const c = { firstName: 'Sam', email: 'sam@example.com', callAt, joinUrl: 'https://zoom.us/j/123', rescheduleUrl: 'https://calendly.com/reschedulings/example', bookUrl: 'https://calendly.com/example?name=Sam', answers: a, diagnosisKey: diagnose(a).key };
  const k = { group: 'https://buy.stripe.com/example-group', private: 'https://buy.stripe.com/example-private' };
  const intake = cleanIntake({ preferredName: 'Sam', linkedinUrl: 'https://www.linkedin.com/in/sam-lee', timezone: 'Eastern (Toronto, New York)', targetRoles: 'Senior project manager', jobPosts: 'https://example.com/job-1', wins: 'Led a $2M migration on time.\nCut onboarding time by 30%.', week1: 'My resume', recording: "Yes, but I'll keep my camera off" }).data;

  const groups: [string, [string, string, string][]][] = [
    ['To you (Izzy)', [
      ['Lead brief (every form)', ...(() => { const e = buildLeadEmail(a, scoreLead(a), diagnose(a), new Date(), leadScore(a), programValue(a.program)); return [e.subject, e.html] as [string, string]; })()],
      ['Sales plan (morning before each call)', ...(() => { const e = buildSalesBrief(a, { callAt, joinUrl: c.joinUrl }, k); return [e.subject, e.html] as [string, string]; })()],
      ['New enrolment', ...(() => { const e = onb.enrolmentNotice({ name: 'Sam Lee', email: 'sam@example.com', program: 'Group cohort', amount: 1072.37, folderUrl: 'https://drive.google.com/', seats: { group: 3, private: 1 } }); return [e.subject, e.html] as [string, string]; })()],
      ['Intake received', ...(() => { const e = onb.intakeBrief({ name: 'Sam Lee', email: 'sam@example.com', program: 'Group cohort', intake, files: ['Resume: resume-2025.pdf', 'Resume: resume-old.docx', 'LinkedIn PDF: Profile.pdf'], folderUrl: 'https://drive.google.com/' }); return [e.subject, e.html] as [string, string]; })()],
      ['Daily digest (7:30 a.m.)', ...(() => { const e = onb.digestEmail({ now: new Date('2026-12-07T12:30:00Z'), callsToday: [{ name: 'Sam Lee', email: 'sam@example.com', at: callAt, grade: 'Hot 81' }], unconfirmed: [], newLeads: [{ name: 'Alex Kim', email: 'alex@example.com', status: 'qualified', score: 72 }], notBooked: [{ name: 'Jo Park', email: 'jo@example.com', days: 2 }], enrolled: [{ name: 'Sam Lee', email: 'sam@example.com', program: 'Group cohort' }], onboarding: [{ name: 'Sam Lee', email: 'sam@example.com', agreement: true, intake: false, days: 2 }], seats: { group: 3, private: 1 }, setup: [] }); return [e.subject, e.html] as [string, string]; })()],
    ]],
    ['Leads: after the form', [
      ['Not yet: not ready to invest', ...Object.values(call.notYetEmail({ ...a, ready: NOT_READY }, 'not-ready')) as [string, string]],
      ['Not yet: under 5 years', ...Object.values(call.notYetEmail({ ...a, yearsExperience: 2 }, 'experience')) as [string, string]],
      ['Qualified, not booked: next morning', ...Object.values(call.noBook1Email(c)) as [string, string]],
      ['Qualified, not booked: 3 days', ...Object.values(call.noBook2Email(c)) as [string, string]],
    ]],
    ['Leads: around the call', [
      ['Booked', ...Object.values(call.bookedEmail(c)) as [string, string]],
      ['Day before', ...Object.values(call.dayBeforeEmail(c)) as [string, string]],
      ['Morning of', ...Object.values(call.morningOfEmail(c)) as [string, string]],
      ['Canceled', ...Object.values(call.canceledEmail(c)) as [string, string]],
      ['No-show', ...Object.values(call.noShowEmail(c)) as [string, string]],
      ['Follow-up: next morning', ...Object.values(call.followUp1Email(c, k)) as [string, string]],
      ['Follow-up: 3 days, last one', ...Object.values(call.followUp2Email(c, k)) as [string, string]],
    ]],
    ['Clients: after payment', [
      ['Welcome', ...Object.values(onb.welcomeEmail({ firstName: 'Sam', program: 'Group cohort', token: 'example' })) as [string, string]],
      ['Reminder: 2 days', ...Object.values(onb.reminderEmail({ firstName: 'Sam', token: 'example', agreement: true, intake: false }, false)) as [string, string]],
      ['Reminder: 4 days', ...Object.values(onb.reminderEmail({ firstName: 'Sam', token: 'example', agreement: false, intake: false }, true)) as [string, string]],
      ['Signed copy', ...Object.values(onb.signedCopyEmail({ firstName: 'Sam', token: 'example' })) as [string, string]],
      ["Intake done: you're set", ...Object.values(onb.intakeDoneEmail({ firstName: 'Sam', program: 'Group plus private 1:1 rebuild' })) as [string, string]],
      ['Week 11: renewal', ...Object.values(onb.renewalEmail({ firstName: 'Sam', renewalUrl: 'https://buy.stripe.com/example-renewal' })) as [string, string]],
    ]],
    ['Launch sequence (Brevo campaigns)', nurtureEmails().map((e) => [`${e.n}. ${e.sendAt} ET`, e.subject, e.html.replace(/\{\{ contact\.FIRSTNAME[^}]*\}\}/g, 'Sam').replace(/\{\{ unsubscribe \}\}/g, '#')] as [string, string, string])],
  ];

  // The headshot only exists on joinclearcareer.com after the branch is merged, so preview it from GitHub.
  const preview = (h: string) => h.split('https://joinclearcareer.com/images/email/').join('https://raw.githubusercontent.com/izzydoesizzy/clearcareer-website/claude/practical-dirac-66uspu/public/images/email/');
  for (const [, items] of groups) for (const it of items) it[2] = preview(it[2]);
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  let n = 0;
  const nav = groups.map(([g, items]) => `<h3>${esc(g)}</h3><ol>${items.map(([label]) => `<li><a href="#e${++n}">${esc(label)}</a></li>`).join('')}</ol>`).join('');
  n = 0;
  const body = groups.map(([g, items]) => `<h2>${esc(g)}</h2>${items.map(([label, subject, html]) => `<section id="e${++n}"><p class="label">${esc(label)}</p><p class="subject"><b>Subject:</b> ${esc(subject)}</p><iframe loading="lazy" srcdoc="${esc(html)}" onload="this.style.height=this.contentDocument.documentElement.scrollHeight+'px'"></iframe></section>`).join('')}`).join('');
  const page = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Land and Level Up: every email</title>
<style>body{margin:0;font-family:Inter,system-ui,sans-serif;background:#f1f5f9;color:#0f172a}header{background:#030620;color:#fff;padding:24px 32px}header h1{margin:0;font-size:24px}header p{margin:6px 0 0;color:#cbd5e1}.wrap{display:flex;gap:24px;padding:24px}nav{position:sticky;top:12px;align-self:flex-start;width:280px;flex:none;background:#fff;border-radius:12px;padding:16px;font-size:14px;max-height:92vh;overflow:auto}nav h3{font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#0161EF;margin:16px 0 6px}nav ol{margin:0;padding-left:20px}nav a{color:#0f172a}main{flex:1;min-width:0}h2{margin:32px 0 12px;font-size:20px}section{background:#fff;border-radius:12px;padding:16px;margin:0 0 20px}.label{margin:0;font-weight:700;color:#0161EF;font-size:13px;text-transform:uppercase;letter-spacing:1px}.subject{margin:6px 0 12px}iframe{width:100%;max-width:720px;border:1px solid #e2e8f0;border-radius:8px;min-height:400px;display:block}@media(max-width:800px){.wrap{display:block}nav{position:static;width:auto;margin-bottom:16px}}</style></head>
<body><header><h1>Land and Level Up: every email</h1><p>${n} emails, shown with a sample lead (Sam Lee). Nothing here was sent. Generated ${new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' })} ET.</p></header>
<div class="wrap"><nav>${nav}</nav><main>${body}</main></div></body></html>`;
  mkdirSync('emails', { recursive: true });
  writeFileSync(process.env.EMAIL_GALLERY_OUT || 'emails/gallery.html', page);
});

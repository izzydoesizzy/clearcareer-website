import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { makeToken, readToken, programFromAmount, cleanIntake, onboardingDue, renewalDue, callsIcs, rosterRow, ROSTER_HEADERS, driveFileName } from '../../src/lib/onboarding';
import { DEFAULT_AGREEMENT_HTML, fillAgreement, signatureBlock, validLegalName, cleanDocHtml } from '../../src/lib/agreement';
import { welcomeEmail, reminderEmail, signedCopyEmail, intakeDoneEmail, renewalEmail, enrolmentNotice, intakeBrief, digestEmail } from '../../src/lib/onboarding-emails';
import { setupGaps } from '../../src/lib/setup-check';

describe('onboarding links', () => {
  it('round-trips the email and rejects tampering', async () => {
    const t = await makeToken('Sam@Example.com', 'secret');
    expect(await readToken(t, 'secret')).toBe('sam@example.com');
    expect(await readToken(t, 'other')).toBeNull();
    expect(await readToken(t.replace(/.$/, (c) => (c === 'a' ? 'b' : 'a')), 'secret')).toBeNull();
    expect(await readToken('nonsense', 'secret')).toBeNull();
  });
});

describe('program and intake', () => {
  it('tells the programs apart by price before tax', () => {
    expect(programFromAmount(96000)).toBe('Group cohort');
    expect(programFromAmount(120000)).toBe('Group cohort');
    expect(programFromAmount(183760)).toBe('Group plus private 1:1 rebuild');
    expect(programFromAmount(229700)).toBe('Group plus private 1:1 rebuild');
  });
  it('requires the essentials', () => {
    const bad = cleanIntake({ linkedinUrl: 'linkedin.com/sam', wins: 'short' });
    expect(Object.keys(bad.errors).sort()).toEqual(['linkedinUrl', 'recording', 'targetRoles', 'timezone', 'wins']);
    const good = cleanIntake({ linkedinUrl: 'https://www.linkedin.com/in/sam-lee', targetRoles: 'Project manager', wins: 'Led a $2M migration on time and under budget.', timezone: 'Eastern (Toronto, New York)', recording: 'Please keep me out of recordings' });
    expect(good.errors).toEqual({});
  });
  it('names files clearly and safely', () => {
    expect(driveFileName('resume', 'Sam Lee', 'my/resume:v2.pdf')).toBe('Resume - Sam Lee - my-resume-v2.pdf');
  });
  it('builds a roster row that matches the headers', () => {
    const row = rosterRow({ enrolledAt: new Date('2026-11-25T15:00:00Z'), email: 'sam@example.com', name: 'Sam Lee', program: 'Group cohort', amount: 1072.37, folderUrl: 'https://drive.google.com/x' });
    expect(row).toHaveLength(ROSTER_HEADERS.length);
    expect(row[8]).toBe('2026-12-02 or when rebuild starts');
  });
});

describe('agreement', () => {
  const filled = fillAgreement(DEFAULT_AGREEMENT_HTML, { name: 'Sam <Lee>', email: 'sam@example.com', program: 'Group cohort', price: '$949', date: 'November 25, 2026' });
  it('fills every placeholder and escapes names', () => {
    expect(filled).not.toMatch(/\{\{/);
    expect(filled).toContain('Sam &lt;Lee&gt;');
  });
  it('states the guarantee, no job promise and recordings, with no em dashes', () => {
    for (const s of ['7 days after you paid', 'No one can promise you a job', 'Recordings', 'Ontario', 'Klarna', 'runs for 6 weeks', 'January 6, 13, 20 and 27', '$49 a month']) expect(filled).toContain(s);
    expect(filled).not.toMatch(/3 months|\$50/);
    expect(filled).not.toMatch(/—/);
    expect(filled).not.toMatch(/3 payments|three payments/);
  });
  it('records who signed, when, from where and which version', () => {
    const b = signatureBlock({ legalName: 'Sam Lee', email: 'sam@example.com', signedAt: new Date('2026-11-25T15:00:00Z'), ip: '1.2.3.4', version: 'v1' });
    for (const s of ['Sam Lee', '1.2.3.4', 'v1', 'ET']) expect(b).toContain(s);
  });
  it('accepts real full names only', () => {
    expect(validLegalName('Sam Lee')).toBe(true);
    expect(validLegalName("Zoë O'Brien-Smith")).toBe(true);
    expect(validLegalName('Sam')).toBe(false);
    expect(validLegalName('<script> x')).toBe(false);
  });
  it('strips scripts from an exported Google Doc', () => {
    expect(cleanDocHtml('<html><body><p onclick="x()">Hi</p><script>bad()</script></body></html>')).toBe('<p>Hi</p>');
  });
});

describe('reminders and renewal', () => {
  const enrolled = new Date('2026-11-25T15:00:00Z');
  const at = (d: string) => new Date(`${d}T12:30:00Z`);
  it('reminds at 2 and 4 days, only while something is missing', () => {
    expect(onboardingDue(enrolled, at('2026-11-26'), { agreement: false, intake: false }, [])).toEqual([]);
    expect(onboardingDue(enrolled, at('2026-11-27'), { agreement: true, intake: false }, [])).toEqual(['remind1']);
    expect(onboardingDue(enrolled, at('2026-11-29'), { agreement: true, intake: false }, ['remind1'])).toEqual(['remind2']);
    expect(onboardingDue(enrolled, at('2026-11-29'), { agreement: true, intake: true }, [])).toEqual([]);
  });
  it('sends the renewal once, a week before the last call', () => {
    expect(renewalDue(at('2027-01-19'), [])).toBe(false);
    expect(renewalDue(at('2027-01-20'), [])).toBe(true);
    expect(renewalDue(at('2027-01-20'), ['renewal'])).toBe(false);
  });
  it('has no calendar until the call time is set', () => {
    expect(callsIcs()).toBe('');
  });
});

describe('onboarding emails', () => {
  const all = [
    welcomeEmail({ firstName: 'Sam', program: 'Group cohort', token: 'abc.def' }),
    reminderEmail({ firstName: 'Sam', token: 'abc.def', agreement: false, intake: false }, false),
    reminderEmail({ firstName: 'Sam', token: 'abc.def', agreement: true, intake: false }, true),
    signedCopyEmail({ firstName: 'Sam', token: 'abc.def' }),
    intakeDoneEmail({ firstName: 'Sam', program: 'Group plus private 1:1 rebuild' }),
    renewalEmail({ firstName: 'Sam' }),
    enrolmentNotice({ name: 'Sam Lee', email: 'sam@example.com', program: 'Group cohort', amount: 1072.37, seats: { group: 1, private: 0 } }),
    intakeBrief({ name: 'Sam Lee', email: 'sam@example.com', program: 'Group cohort', intake: cleanIntake({ linkedinUrl: 'https://www.linkedin.com/in/sam', wins: 'x'.repeat(30) }).data, files: ['Resume: a.pdf'] }),
    digestEmail({ now: new Date('2026-12-07T12:30:00Z'), callsToday: [], unconfirmed: [], newLeads: [], notBooked: [], enrolled: [], onboarding: [{ name: 'Sam', email: 'sam@example.com', agreement: false, intake: false, days: 5 }], seats: { group: 1, private: 0 }, setup: ['X is not set'] }),
  ];
  it('have no em dashes and link to the private onboarding page', () => {
    for (const m of all) expect(m.subject + m.html).not.toMatch(/—/);
    expect(all[0].html).toContain('/onboarding?t=abc.def');
  });
  it('flags stalled onboarding and setup gaps in the digest', () => {
    const d = all[8];
    expect(d.html).toContain('reach out personally');
    expect(d.html).toContain('Setup still missing');
    expect(d.html).toContain('out of date');
  });
  it('promises the community invite when the link is not set yet', () => {
    expect(all[4].html).toContain('Mighty Networks invite</strong> is on its way');
    expect(all[4].html).toContain('1:1 rebuild');
  });
});

describe('setup check', () => {
  it('lists every missing piece', () => {
    expect(setupGaps({}).length).toBeGreaterThan(10);
  });
});

describe('payment wording', () => {
  it('never offers "3 payments with me" anywhere in the program code', () => {
    const walk = (d: string): string[] => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
    const files = [...walk('src/lib'), 'src/data/llu.ts', ...walk('src/components/llu'), ...walk('src/components/book-call')];
    for (const f of files) expect(readFileSync(f, 'utf8'), f).not.toMatch(/3 payments|three payments|split it into payments/);
  });
});

describe('email gallery page', () => {
  it('shows all 31 emails and tells search engines to stay away', async () => {
    const { buildGallery } = await import('../../src/lib/email/gallery');
    const html = buildGallery();
    expect((html.match(/<section id="e/g) || []).length).toBe(31);
    expect(html).toContain('<meta name="robots" content="noindex, nofollow">');
    expect(html).toContain('https://joinclearcareer.com/images/email/izzy-144.jpg');
    expect(buildGallery({ previewImages: true })).toContain('raw.githubusercontent.com');
  });
});

describe('6-week program', async () => {
  const { offer } = await import('../../src/data/llu');
  const { callsIcs } = await import('../../src/lib/onboarding');
  const { welcome } = await import('../../src/data/llu');
  it('says 6 weeks and $49 a month, never 3 months or $50', () => {
    expect(offer.afterProgram).toBe('After the 6 weeks, you can stay on for $49 a month. Leave any time.');
    expect(offer.group.priceNote).toContain('full 6 weeks');
    expect(JSON.stringify(offer)).not.toMatch(/3 months|\$50/);
  });
  it('builds 6 calendar calls and skips the holiday weeks', () => {
    welcome.callStart = '12:00';
    const ics = callsIcs(new Date('2026-11-21T12:00:00Z'));
    welcome.callStart = '';
    expect(ics).toContain('DTSTART;TZID=America/Toronto:20261209T120000');
    expect(ics).toContain('UNTIL=20270128T045959Z');
    expect(ics).toContain('EXDATE;TZID=America/Toronto:20261223T120000,20261230T120000');
  });
});

describe('member toolkit and the private tier', () => {
  const url = 'https://joinclearcareer.com/products/llu-toolkit/access/abc.def';
  it('the welcome and intake-done emails link the toolkit, or say it is coming', () => {
    const w = welcomeEmail({ firstName: 'Sam', program: 'Group cohort', token: 'abc.def', toolkitUrl: url });
    expect(w.html).toContain(url);
    expect(w.html).toContain('Career Clarity');
    const noLink = welcomeEmail({ firstName: 'Sam', program: 'Group cohort', token: 'abc.def' });
    expect(noLink.html).toContain('toolkit link is coming');
    expect(intakeDoneEmail({ firstName: 'Sam', program: 'Group cohort', toolkitUrl: url }).html).toContain(url);
    expect(intakeDoneEmail({ firstName: 'Sam', program: 'Group cohort' }).html).toContain('on its way');
  });
  it('the agreement lists the toolkit for everyone and the done-for-you work for the private tier', () => {
    expect(DEFAULT_AGREEMENT_HTML).toContain('17 Claude skills');
    expect(DEFAULT_AGREEMENT_HTML).toMatch(/Done for you: I draft your resume/);
    expect(DEFAULT_AGREEMENT_HTML).toMatch(/salary research report/);
  });
  it('makes a toolkit link only when a secret is set', async () => {
    const { toolkitUrl } = await import('../../src/lib/onboarding');
    expect(await toolkitUrl({}, 'sam@example.com')).toBe('');
    expect(await toolkitUrl({ ACCESS_SECRET: 's' }, 'sam@example.com')).toMatch(/^https:\/\/joinclearcareer\.com\/products\/llu-toolkit\/access\//);
  });
});

/**
 * Onboarding after payment: private links, program detection, intake fields, roster, calendar file.
 *
 * Brevo contact fields (scripts/brevo-setup.mjs):
 *   ENROLLED_AT, ENROLLED_AMOUNT, ENROLLED_PROGRAM
 *   DRIVE_FOLDER_ID, DRIVE_FOLDER_URL
 *   AGREEMENT_SIGNED_AT, AGREEMENT_NAME, AGREEMENT_VERSION
 *   INTAKE_DONE_AT, ONBOARD_SENT (which reminders went out, e.g. "remind1,remind2,renewal")
 */
import { hmacHex, safeEqual } from './brevo-api.js';
import { PROGRAMS } from './book-call.js';
import { welcome } from '../data/llu.js';
import { torontoDay } from './call-flow.js';
import { accessSecret, accessUrl, makeAccessToken } from './access.js';
import { SITE_URL } from './email/constants.js';

// ── The member toolkit ───────────────────────────────────────────────────────────
/**
 * The member's link to every AI tool (product "llu-toolkit": the Career Suite plus every
 * All-Access product), or '' when no ACCESS_SECRET or ONBOARD_SECRET is set.
 */
export async function toolkitUrl(env: Record<string, unknown>, email: string): Promise<string> {
  const secret = accessSecret(env);
  if (!secret || !email) return '';
  return accessUrl('llu-toolkit', await makeAccessToken('llu-toolkit', email, secret), SITE_URL);
}

// ── Private onboarding links ─────────────────────────────────────────────────────
// The token is the email plus a signature, so nothing needs storing and links never expire.
const b64 = (s: string) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64 = (s: string) => decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/'))));

export async function makeToken(email: string, secret: string): Promise<string> {
  const e = email.trim().toLowerCase();
  return `${b64(e)}.${(await hmacHex(secret, `onboard:${e}`)).slice(0, 32)}`;
}

export async function readToken(token: string, secret: string): Promise<string | null> {
  if (!secret || !token || !token.includes('.')) return null;
  const [p, sig] = token.split('.');
  let email = '';
  try { email = unb64(p); } catch { return null; }
  const expected = (await hmacHex(secret, `onboard:${email}`)).slice(0, 32);
  return safeEqual(sig, expected) ? email : null;
}

export const onboardingUrl = (token: string) => `https://joinclearcareer.com/onboarding?t=${encodeURIComponent(token)}`;

// ── Which program they bought ─────────────────────────────────────────────────────
/** From the Stripe amount before tax, in cents. Works for Black Friday and regular prices. */
export function programFromAmount(subtotalCents: number): string {
  const d = Math.round(subtotalCents / 100);
  const p = PROGRAMS.private;
  if (d === p.price || d === p.regular || d >= p.price) return p.name;
  return PROGRAMS.group.name;
}

// ── Intake ─────────────────────────────────────────────────────────────────────
export const FILE_KINDS = { resume: 'Resume', linkedin: 'LinkedIn PDF', cover: 'Cover letter', other: 'Other' } as const;
export type FileKind = keyof typeof FILE_KINDS;
export const MAX_FILE_BYTES = 4 * 1024 * 1024;
export const ALLOWED_TYPES: Record<string, string> = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/msword': 'doc',
  'text/plain': 'txt',
  'application/vnd.oasis.opendocument.text': 'odt',
  'application/rtf': 'rtf',
};
export const RECORDING = ['Yes, happy to appear in recordings', "Yes, but I'll keep my camera off", 'Please keep me out of recordings'];

export interface Intake {
  preferredName: string;
  linkedinUrl: string;
  timezone: string;
  phone: string;
  targetRoles: string;
  targetCompanies: string;
  jobPosts: string;
  wins: string;
  week1: string;
  anythingElse: string;
  recording: string;
}

export function cleanIntake(raw: Record<string, unknown>): { data: Intake; errors: Record<string, string> } {
  const s = (k: string, max = 2000) => String(raw[k] ?? '').trim().slice(0, max);
  const data: Intake = {
    preferredName: s('preferredName', 80),
    linkedinUrl: s('linkedinUrl', 300),
    timezone: s('timezone', 80),
    phone: s('phone', 40),
    targetRoles: s('targetRoles', 500),
    targetCompanies: s('targetCompanies', 1000),
    jobPosts: s('jobPosts', 3000),
    wins: s('wins', 4000),
    week1: s('week1', 1000),
    anythingElse: s('anythingElse', 2000),
    recording: RECORDING.includes(s('recording')) ? s('recording') : '',
  };
  const errors: Record<string, string> = {};
  if (!/^https?:\/\/(www\.|[a-z]{2}\.)?linkedin\.com\/in\/[^\s/]+/i.test(data.linkedinUrl)) errors.linkedinUrl = 'Paste your LinkedIn profile link, like https://www.linkedin.com/in/your-name';
  if (data.targetRoles.length < 3) errors.targetRoles = 'Tell me the roles you want.';
  if (data.wins.length < 20) errors.wins = 'A few lines is plenty. Rough is fine.';
  if (!data.timezone) errors.timezone = 'Please choose your time zone.';
  if (!data.recording) errors.recording = 'Please choose one.';
  return { data, errors };
}

/** Safe Drive file name: "Resume - Sam Lee - original-name.pdf". */
export function driveFileName(kind: FileKind, clientName: string, original: string): string {
  const clean = original.replace(/[\\/:*?"<>|]+/g, '-').slice(-120);
  return `${FILE_KINDS[kind]} - ${clientName} - ${clean}`;
}

// ── Roster sheet (tab "Roster") ─────────────────────────────────────────────────
export const ROSTER_TAB = 'Roster';
export const ROSTER_HEADERS = [
  'Enrolled', 'Email', 'Name', 'Program', 'Paid (CAD)', 'Drive folder', 'Agreement signed', 'Intake done',
  'Guarantee ends', 'Joined Mighty Networks', '1:1 rebuild booked', 'Notes',
];
/** Column letters for later updates. */
export const COL = { agreement: 'G', intake: 'H', folder: 'F' } as const;

export function rosterRow(p: { enrolledAt: Date; email: string; name: string; program: string; amount: number; folderUrl: string }): (string | number)[] {
  const d = (x: Date) => x.toLocaleDateString('en-CA', { timeZone: 'America/Toronto' });
  const ends = new Date(p.enrolledAt.getTime() + 7 * 86_400_000);
  return [d(p.enrolledAt), p.email, p.name, p.program, p.amount, p.folderUrl, 'No', 'No', `${d(ends)} or when rebuild starts`, 'No', p.program === PROGRAMS.private.name ? 'No' : 'n/a', ''];
}

// ── Reminders and renewal ───────────────────────────────────────────────────────
export type OnboardStep = 'remind1' | 'remind2' | 'renewal';

/** Agreement or intake not done after 2 days: remind. After 4 days: remind again (and Izzy sees it in the digest). */
export function onboardingDue(enrolledAt: Date, now: Date, done: { agreement: boolean; intake: boolean }, sent: string[]): OnboardStep[] {
  if (done.agreement && done.intake) return [];
  const days = torontoDay(now) - torontoDay(enrolledAt);
  const out: OnboardStep[] = [];
  if (days >= 2 && days < 4 && !sent.includes('remind1')) out.push('remind1');
  if (days >= 4 && !sent.includes('remind2')) out.push('remind2');
  return out;
}

/** One week before the last call (Jan 27): the "stay on for $49 a month" email. */
export const RENEWAL_ON = new Date('2027-01-20T12:00:00Z');
export function renewalDue(now: Date, sent: string[]): boolean {
  return torontoDay(now) >= torontoDay(RENEWAL_ON) && torontoDay(now) <= torontoDay(RENEWAL_ON) + 3 && !sent.includes('renewal');
}

// ── Wednesday calls as a calendar file ───────────────────────────────────────────
/** welcome.callStart is "HH:MM" in Toronto time, e.g. "12:00". Returns '' until it's set. */
export function callsIcs(now: Date = new Date()): string {
  const m = /^(\d{1,2}):(\d{2})$/.exec(welcome.callStart || '');
  if (!m) return '';
  const hh = m[1].padStart(2, '0');
  const mm = m[2];
  const endH = String((Number(hh) + 1) % 24).padStart(2, '0');
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ClearCareer//Land and Level Up//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:llu-wednesday-calls-2026@joinclearcareer.com',
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=America/Toronto:20261209T${hh}${mm}00`,
    `DTEND;TZID=America/Toronto:20261209T${endH}${mm}00`,
    // 6 calls: Dec 9 and 16, then Jan 6 to 27. No calls Dec 23 and 30.
    'RRULE:FREQ=WEEKLY;BYDAY=WE;UNTIL=20270128T045959Z',
    `EXDATE;TZID=America/Toronto:20261223T${hh}${mm}00,20261230T${hh}${mm}00`,
    'SUMMARY:Land and Level Up: Wednesday group call',
    `DESCRIPTION:Bring what happened this week. Join: ${welcome.callUrl || 'link in your welcome email'}`,
    ...(welcome.callUrl ? [`URL:${welcome.callUrl}`, `LOCATION:${welcome.callUrl}`] : []),
    'END:VEVENT', 'END:VCALENDAR',
  ];
  return lines.join('\r\n') + '\r\n';
}

/**
 * "Book a call" form: questions, validation and lead scoring.
 * Shared by the form page and the API, so the rules live in one place.
 *
 * To change who is allowed to book, edit QUALIFY below.
 */
import { CONSENT_TEXT } from './consent';
import { dealIsLive } from './email/deal';

/**
 * Fallback booking link. Set CALENDLY_QUALIFIED_URL in Vercel to a Calendly event that
 * is not linked anywhere else, so only approved leads can find it.
 */
export const CALENDLY_URL = 'https://calendly.com/clearcareer/discovery-call';

/** Who gets to book. Everyone else sees the "not yet" screen and never sees the booking link. */
export const QUALIFY = {
  /** Must answer "Let's do this!" to the investment question. */
  requireReady: true,
  /** Minimum years of professional experience. */
  minYears: 5,
};

/** The two programs. Prices in CAD, before HST. Black Friday prices apply until the deal ends. */
export const PROGRAMS = {
  group: { name: 'Group cohort', price: 949, regular: 1200 },
  private: { name: 'Group plus private 1:1 rebuild', price: 1797, regular: 2297 },
} as const;
export const PROGRAM_CHOICES = [PROGRAMS.group.name, PROGRAMS.private.name, 'Not sure yet'];

/** What the program they picked is worth today, in CAD before HST. */
export function programValue(program: string, now: Date = new Date()): { low: number; high: number; label: string } {
  const live = dealIsLive(now);
  const price = (p: { price: number; regular: number }) => (live ? p.price : p.regular);
  const fmt = (n: number) => `$${n.toLocaleString('en-CA')}`;
  if (program === PROGRAMS.group.name) { const n = price(PROGRAMS.group); return { low: n, high: n, label: fmt(n) }; }
  if (program === PROGRAMS.private.name) { const n = price(PROGRAMS.private); return { low: n, high: n, label: fmt(n) }; }
  const lo = price(PROGRAMS.group); const hi = price(PROGRAMS.private);
  return { low: lo, high: hi, label: `${fmt(lo)} to ${fmt(hi)}` };
}

export const READY = "Let's do this!";
export const NOT_READY = "I'm not ready to invest in my results";

export const SEARCH_LENGTH = ['Less than 1 month', '1-2 months', '3-5 months', '6-7 months', '8-10 months', '11-12 months', '1+ years'];
export const APPS_PER_WEEK = ['None', '0-1', '2-3', '4-5', '6-10', '10-20'];
export const STRUGGLES = [
  "Career Direction: I feel lost. I'm not sure what I want next",
  "Experience: I don't have the experience I need for the jobs I want",
  "Resume Writing: My resume doesn't sound good",
  "Job Applications: Applying for jobs is overwhelming",
  "Networking: I find it awkward, difficult, scary, or exhausting",
  "Interviews: I get interviews, but I don't land the job offer",
  "Salary Negotiation: I'm afraid to negotiate my salary",
  'International Applicant: I lack "Canadian Experience"',
  'Other',
];

/** Shown to people who are not approved. Same free offer your Typeform sends today. */
export const ALTERNATIVE = {
  label: 'Get the ChatGPT Job Search Power Prompts',
  url: 'https://izzydoesizzy.gumroad.com/l/zqvhh',
};
export const SITUATION = ['Laid off in the last 3 months', 'Laid off more than 3 months ago', 'Still employed, quietly searching', 'Other'];
export const COUNTRY = ['Canada', 'United States', 'Somewhere else'];
export const DECIDER = ['Just me', 'Me and a partner or family member', 'Someone else is involved'];
export const START = ['This month', 'In the next 1 to 2 months', 'Later than that', 'Not sure yet'];
/** The pre-close question: are they ready to enrol on the call if it fits? */
export const COMMIT = ["Yes, I'll have my card ready", 'Probably, once my questions are answered', 'No, I want time to think after the call'];
export const PAYMENT = ['Credit card in full', 'Klarna (monthly)', "I'd want to split it into payments", 'Not sure yet'];

export interface BookCallAnswers {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  consent?: boolean;
  jobTitles: string;
  targetSalary: number;
  yearsExperience: number;
  searchLength: string;
  appsPerWeek: string;
  totalApplications: number;
  interviews: number;
  offers: number;
  situation: string;
  country: string;
  struggles: string[];
  challenge: string;
  milestones: string;
  motivation: number;
  callGoal: string;
  decider: string;
  start: string;
  payment: string;
  program: string;
  commit: string;
  ready: string;
  website?: string; // honeypot
}

const str = (v: unknown, max = 2000) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const num = (v: unknown) => {
  if (v === '' || v === null || v === undefined) return NaN;
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
};

/** Validate and clean raw input. Returns errors by field name (empty object means valid). */
export function cleanAnswers(raw: Record<string, unknown>): { data: BookCallAnswers; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const need = (key: string, ok: boolean, msg: string) => {
    if (!ok) errors[key] = msg;
  };

  const email = str(raw.email, 254);
  const struggles = Array.isArray(raw.struggles) ? raw.struggles.map((s) => str(s, 120)).filter(Boolean) : [];
  const pick = (v: unknown, list: string[]) => (list.includes(str(v, 200)) ? str(v, 200) : '');
  const pickMany = (arr: string[]) => arr.filter((x) => STRUGGLES.includes(x));

  const data: BookCallAnswers = {
    firstName: str(raw.firstName, 80),
    lastName: str(raw.lastName, 80),
    email,
    phone: str(raw.phone, 40),
    consent: raw.consent === true,
    jobTitles: str(raw.jobTitles, 500),
    targetSalary: num(raw.targetSalary),
    yearsExperience: num(raw.yearsExperience),
    searchLength: pick(raw.searchLength, SEARCH_LENGTH),
    appsPerWeek: pick(raw.appsPerWeek, APPS_PER_WEEK),
    totalApplications: num(raw.totalApplications),
    interviews: num(raw.interviews),
    offers: num(raw.offers),
    situation: pick(raw.situation, SITUATION),
    country: pick(raw.country, COUNTRY),
    struggles: pickMany(struggles),
    challenge: str(raw.challenge),
    milestones: str(raw.milestones),
    motivation: num(raw.motivation),
    callGoal: str(raw.callGoal),
    decider: pick(raw.decider, DECIDER),
    start: pick(raw.start, START),
    payment: pick(raw.payment, PAYMENT),
    program: pick(raw.program, PROGRAM_CHOICES),
    commit: pick(raw.commit, COMMIT),
    ready: pick(raw.ready, [READY, NOT_READY]),
    website: str(raw.website, 200),
  };

  need('firstName', !!data.firstName, 'Please enter your first name.');
  need('lastName', !!data.lastName, 'Please enter your last name.');
  need('phone', (data.phone || '').replace(/\D/g, '').length >= 7, 'Please enter a phone number I can reach you on.');
  need('jobTitles', (data.jobTitles || '').length >= 2, 'Please tell me which roles.');
  need('targetSalary', data.targetSalary >= 0, 'Please enter a number.');
  need('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'Please enter a valid email address.');
  need('yearsExperience', data.yearsExperience >= 0 && data.yearsExperience <= 60, 'Please enter your years of experience.');
  need('searchLength', !!data.searchLength, 'Please choose one.');
  need('appsPerWeek', !!data.appsPerWeek, 'Please choose one.');
  need('totalApplications', data.totalApplications >= 0, 'Please enter a number.');
  need('interviews', data.interviews >= 0, 'Please enter a number.');
  need('offers', data.offers >= 0 && data.offers <= data.interviews, 'Offers can\'t be more than interviews. Please check.');
  need('motivation', data.motivation >= 1 && data.motivation <= 5, 'Please choose 1 to 5.');
  need('situation', !!data.situation, 'Please choose one.');
  need('country', !!data.country, 'Please choose one.');
  need('struggles', data.struggles.length >= 1 && data.struggles.length <= 3, 'Please pick 1 to 3.');
  need('challenge', data.challenge.length >= 3, 'Please tell me a little.');
  need('milestones', data.milestones.length >= 3, 'Please tell me a little.');
  need('callGoal', data.callGoal.length >= 3, 'Please tell me a little.');
  need('decider', !!data.decider, 'Please choose one.');
  need('start', !!data.start, 'Please choose one.');
  need('payment', !!data.payment, 'Please choose one.');
  need('program', !!data.program, 'Please choose one.');
  need('commit', !!data.commit, 'Please choose one.');
  need('ready', !!data.ready, 'Please choose one.');

  return { data, errors };
}

/**
 * Diagnosis: what is most likely holding this search back, from the numbers.
 * Edit DIAGNOSE to tune the thresholds.
 */
export const DIAGNOSE = {
  /** Applying "a lot": this many per week, or this many in total. */
  highPerWeek: ['4-5', '6-10', '10-20'],
  highTotal: 40,
  /** Interviews per application below this means the applications aren't landing. */
  lowInterviewRate: 0.1,
  /** At least this many interviews before we blame interviewing. */
  minInterviewsForInterviewing: 3,
  /** Offers per interview below this means interviews aren't converting. */
  lowOfferRate: 0.2,
};

export type DiagnosisKey = 'clarity' | 'positioning' | 'interviewing' | 'tuning';
export interface Diagnosis {
  key: DiagnosisKey;
  title: string;
  /** Shown to the person. */
  text: string;
  /** Shown to Izzy, as a suggested focus for the call. */
  callFocus: string;
}

const DIAGNOSES: Record<DiagnosisKey, Omit<Diagnosis, 'key'>> = {
  clarity: {
    title: 'Clarity first',
    text: "You're applying a little right now. That usually means the next step isn't clear yet: which roles, which industry, and what story to tell. Clarity first, then volume.",
    callFocus: 'Low volume. Help them choose a target role and industry, then build a weekly application habit.',
  },
  positioning: {
    title: 'Targeting, your resume, or both',
    text: "You're applying a lot and hearing little. That points to one of two things, or both: you're aiming at the wrong roles, or your resume isn't showing your value. We'd test both.",
    callFocus: 'High volume, few interviews. Check target roles first, then resume and LinkedIn. Likely both.',
  },
  interviewing: {
    title: 'An interviewing problem',
    text: "You're getting interviews but not offers. That's an interviewing problem, not a resume problem. Your story and your answers are where the gains are.",
    callFocus: 'Getting interviews, not offers. Focus on interview stories, follow-ups and negotiation. The resume is working.',
  },
  tuning: {
    title: 'Fine-tuning',
    text: "Your numbers look healthy. The gains from here are in fine-tuning, and in negotiating the offer when it comes.",
    callFocus: 'Numbers look healthy. Focus on fine-tuning and salary negotiation.',
  },
};

export function diagnose(a: Pick<BookCallAnswers, 'appsPerWeek' | 'totalApplications' | 'interviews' | 'offers'>): Diagnosis {
  const apps = a.totalApplications;
  const highVolume = DIAGNOSE.highPerWeek.includes(a.appsPerWeek) || apps >= DIAGNOSE.highTotal;
  const lowRate = apps > 0 && a.interviews / apps < DIAGNOSE.lowInterviewRate;
  const notConverting = a.interviews >= DIAGNOSE.minInterviewsForInterviewing && a.offers / a.interviews < DIAGNOSE.lowOfferRate;
  let key: DiagnosisKey;
  // Order matters. Applying a lot with almost no interviews is the biggest bottleneck, so it comes first.
  if (highVolume && lowRate) key = 'positioning';
  else if (notConverting) key = 'interviewing';
  else if (!highVolume) key = 'clarity';
  else key = 'tuning';
  return { key, ...DIAGNOSES[key] };
}

/**
 * Lead score, 0 to 100. Every point is explained, so you can trust it or change it.
 *   Ready to invest 25 | Experience at or above the minimum 10 | Start date up to 15
 *   Ready to enrol on the call up to 10 | Decides alone up to 10 | Payment up to 10
 *   Motivation up to 10 | Program up to 10
 * Anyone not ready to invest is capped at 49 (Cool).
 */
export const SCORE = {
  ready: 25,
  experience: 10,
  start: { 'This month': 15, 'In the next 1 to 2 months': 8, 'Not sure yet': 3, 'Later than that': 0 } as Record<string, number>,
  commit: { [COMMIT[0]]: 10, [COMMIT[1]]: 6, [COMMIT[2]]: 0 } as Record<string, number>,
  decider: { 'Just me': 10, 'Me and a partner or family member': 5, 'Someone else is involved': 0 } as Record<string, number>,
  payment: { 'Credit card in full': 10, 'Klarna (monthly)': 8, "I'd want to split it into payments": 6, 'Not sure yet': 2 } as Record<string, number>,
  motivationMax: 10,
  program: { 'Group plus private 1:1 rebuild': 10, 'Group cohort': 8, 'Not sure yet': 4 } as Record<string, number>,
};

export type Grade = 'Hot' | 'Warm' | 'Cool';
export function leadScore(a: Pick<BookCallAnswers, 'ready' | 'yearsExperience' | 'start' | 'decider' | 'payment' | 'motivation' | 'program'> & { commit?: string }): { score: number; grade: Grade } {
  let s = 0;
  if (a.ready === READY) s += SCORE.ready;
  if (a.yearsExperience >= QUALIFY.minYears) s += SCORE.experience;
  s += SCORE.start[a.start] ?? 0;
  s += SCORE.commit[a.commit ?? ''] ?? 0;
  s += SCORE.decider[a.decider] ?? 0;
  s += SCORE.payment[a.payment] ?? 0;
  if (a.motivation >= 1 && a.motivation <= 5) s += Math.round((a.motivation / 5) * SCORE.motivationMax);
  s += SCORE.program[a.program] ?? 0;
  // Not ready to invest caps the lead at Cool, however strong the rest looks.
  const score = Math.max(0, Math.min(a.ready === READY ? 100 : 49, s));
  return { score, grade: score >= 75 ? 'Hot' : score >= 50 ? 'Warm' : 'Cool' };
}

export type Verdict = { qualified: boolean; reason: 'ok' | 'not-ready' | 'experience' };

/** The gate. Order matters: investment readiness first, then experience. */
export function scoreLead(a: Pick<BookCallAnswers, 'ready' | 'yearsExperience'>): Verdict {
  if (QUALIFY.requireReady && a.ready !== READY) return { qualified: false, reason: 'not-ready' };
  if (a.yearsExperience < QUALIFY.minYears) return { qualified: false, reason: 'experience' };
  return { qualified: true, reason: 'ok' };
}

/** Calendly link with the person's name and email already filled in. */
export function bookingUrl(a: Pick<BookCallAnswers, 'firstName' | 'lastName' | 'email'>, base: string = CALENDLY_URL): string {
  const params = new URLSearchParams({
    name: `${a.firstName} ${a.lastName || ''}`.trim(),
    email: a.email,
    utm_source: 'book-a-call',
    utm_medium: 'form',
  });
  return `${base}${base.includes('?') ? '&' : '?'}${params.toString()}`;
}

export { CONSENT_TEXT };

/**
 * "Book a call" form: questions, validation and lead scoring.
 * Shared by the form page and the API, so the rules live in one place.
 *
 * To change who is allowed to book, edit QUALIFY below.
 */
import { CONSENT_TEXT } from './consent';

export const CALENDLY_URL = 'https://calendly.com/clearcareer/discovery-call';

/** Who gets to book. Everyone else sees the "not yet" screen and never sees the booking link. */
export const QUALIFY = {
  /** Must answer "Let's do this!" to the investment question. */
  requireReady: true,
  /** Minimum years of professional experience. */
  minYears: 5,
};

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
export const PAYMENT = ['Credit card in full', 'Klarna (monthly)', "I'd want to split it into payments", 'Not sure yet'];

export interface BookCallAnswers {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  consent?: boolean;
  jobTitles?: string;
  targetSalary?: number | null;
  yearsExperience: number;
  searchLength: string;
  appsPerWeek: string;
  totalApplications: number;
  interviews: number;
  situation: string;
  country: string;
  struggles: string[];
  challenge: string;
  milestones: string;
  motivation?: number | null;
  callGoal: string;
  decider: string;
  start: string;
  payment: string;
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
    targetSalary: Number.isNaN(num(raw.targetSalary)) ? null : num(raw.targetSalary),
    yearsExperience: num(raw.yearsExperience),
    searchLength: pick(raw.searchLength, SEARCH_LENGTH),
    appsPerWeek: pick(raw.appsPerWeek, APPS_PER_WEEK),
    totalApplications: num(raw.totalApplications),
    interviews: num(raw.interviews),
    situation: pick(raw.situation, SITUATION),
    country: pick(raw.country, COUNTRY),
    struggles: pickMany(struggles),
    challenge: str(raw.challenge),
    milestones: str(raw.milestones),
    motivation: Number.isNaN(num(raw.motivation)) ? null : num(raw.motivation),
    callGoal: str(raw.callGoal),
    decider: pick(raw.decider, DECIDER),
    start: pick(raw.start, START),
    payment: pick(raw.payment, PAYMENT),
    ready: pick(raw.ready, [READY, NOT_READY]),
    website: str(raw.website, 200),
  };

  need('firstName', !!data.firstName, 'Please enter your first name.');
  need('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'Please enter a valid email address.');
  need('yearsExperience', data.yearsExperience >= 0 && data.yearsExperience <= 60, 'Please enter your years of experience.');
  need('searchLength', !!data.searchLength, 'Please choose one.');
  need('appsPerWeek', !!data.appsPerWeek, 'Please choose one.');
  need('totalApplications', data.totalApplications >= 0, 'Please enter a number.');
  need('interviews', data.interviews >= 0, 'Please enter a number.');
  need('situation', !!data.situation, 'Please choose one.');
  need('country', !!data.country, 'Please choose one.');
  need('struggles', data.struggles.length >= 1 && data.struggles.length <= 3, 'Please pick 1 to 3.');
  need('challenge', data.challenge.length >= 3, 'Please tell me a little.');
  need('milestones', data.milestones.length >= 3, 'Please tell me a little.');
  need('callGoal', data.callGoal.length >= 3, 'Please tell me a little.');
  need('decider', !!data.decider, 'Please choose one.');
  need('start', !!data.start, 'Please choose one.');
  need('payment', !!data.payment, 'Please choose one.');
  need('ready', !!data.ready, 'Please choose one.');

  return { data, errors };
}

export type Verdict = { qualified: boolean; reason: 'ok' | 'not-ready' | 'experience' };

/** The gate. Order matters: investment readiness first, then experience. */
export function scoreLead(a: Pick<BookCallAnswers, 'ready' | 'yearsExperience'>): Verdict {
  if (QUALIFY.requireReady && a.ready !== READY) return { qualified: false, reason: 'not-ready' };
  if (a.yearsExperience < QUALIFY.minYears) return { qualified: false, reason: 'experience' };
  return { qualified: true, reason: 'ok' };
}

/** Calendly link with the person's name and email already filled in. */
export function bookingUrl(a: Pick<BookCallAnswers, 'firstName' | 'lastName' | 'email'>): string {
  const params = new URLSearchParams({
    name: `${a.firstName} ${a.lastName || ''}`.trim(),
    email: a.email,
    utm_source: 'book-a-call',
    utm_medium: 'form',
  });
  return `${CALENDLY_URL}?${params.toString()}`;
}

export { CONSENT_TEXT };

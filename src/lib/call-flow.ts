/**
 * The call journey, as data. Shared by the Calendly webhook and the daily job.
 *
 * Brevo contact fields used (created by scripts/brevo-setup.mjs):
 *   LEAD_ANSWERS      every form answer, as JSON (so briefs can be rebuilt later)
 *   CALL_AT           ISO time of the booked call
 *   CALL_JOIN_URL     Zoom or Meet link from Calendly
 *   CALL_RESCHEDULE_URL
 *   CALL_EMAILS_SENT  which emails already went out for this call, e.g. "booked,brief,daybefore"
 *   CALL_OUTCOME      "", "enrolled", "lost" or "canceled". Anything but "" stops the follow-ups.
 */
import type { BookCallAnswers } from './book-call.js';
import { cleanAnswers, diagnose } from './book-call.js';
import type { CallInfo } from './call-emails.js';

export type Step = 'booked' | 'brief' | 'daybefore' | 'morning' | 'follow1' | 'follow2';

/** Calendar day in Toronto, as a number of days, so "tomorrow" means tomorrow in ET. */
export function torontoDay(d: Date): number {
  const s = d.toLocaleDateString('en-CA', { timeZone: 'America/Toronto' }); // YYYY-MM-DD
  return Math.round(Date.parse(`${s}T00:00:00Z`) / 86_400_000);
}

/**
 * What should go out for one booked call, when the daily job runs at `now`.
 * Pure function, so it is easy to test.
 */
export function dueSteps(callAt: Date, now: Date, sent: string[], outcome: string): Step[] {
  const days = torontoDay(callAt) - torontoDay(now); // 1 = tomorrow, 0 = today, -1 = yesterday
  const future = callAt.getTime() > now.getTime();
  const has = (s: Step) => sent.includes(s);
  const out: Step[] = [];
  if (future && days <= 1 && days >= 0 && !has('brief')) out.push('brief');
  if (future && days === 1 && !has('daybefore')) out.push('daybefore');
  if (future && days === 0 && !has('morning')) out.push('morning');
  if (!outcome) {
    if (days === -1 && !has('follow1')) out.push('follow1');
    if (days <= -3 && days >= -5 && !has('follow2')) out.push('follow2');
  }
  return out;
}

export function storedAnswers(attrs: Record<string, unknown>): BookCallAnswers | null {
  try {
    const raw = JSON.parse(String(attrs.LEAD_ANSWERS || ''));
    if (!raw || typeof raw !== 'object') return null;
    return cleanAnswers(raw).data;
  } catch {
    return null;
  }
}

/** Store the form answers compactly. Long free text is trimmed so it fits a Brevo text field. */
export function packAnswers(a: BookCallAnswers): string {
  const trim = (s: string) => (s.length > 600 ? `${s.slice(0, 600)}...` : s);
  const { website: _w, ...rest } = a as BookCallAnswers & { website?: string };
  return JSON.stringify({ ...rest, challenge: trim(a.challenge), milestones: trim(a.milestones), callGoal: trim(a.callGoal) });
}

export function callInfo(email: string, attrs: Record<string, unknown>, answers: BookCallAnswers | null): CallInfo {
  return {
    firstName: answers?.firstName || String(attrs.FIRSTNAME || '') || 'there',
    email,
    callAt: new Date(String(attrs.CALL_AT)),
    joinUrl: String(attrs.CALL_JOIN_URL || '') || undefined,
    rescheduleUrl: String(attrs.CALL_RESCHEDULE_URL || '') || undefined,
    answers: answers || undefined,
    diagnosisKey: answers ? diagnose(answers).key : undefined,
  };
}

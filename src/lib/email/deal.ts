import { COLORS, SITE_URL } from './constants.js';

/** Black Friday pricing ends Monday, November 30, 2026 at 11:59 pm ET (UTC-5). */
export const DEAL_ENDS_AT = new Date('2026-12-01T04:59:59Z');

export function dealIsLive(now: Date = new Date()): boolean {
  return now.getTime() <= DEAL_ENDS_AT.getTime();
}

export function dealUrl(medium: string): string {
  return `${SITE_URL}/land-and-level-up?utm_source=email&utm_medium=${encodeURIComponent(medium)}&utm_campaign=llu-launch-2026`;
}

/**
 * One short P.S. about Land and Level Up. Mentions Black Friday until it ends, then the start date,
 * then returns '' once the cohort has started, so old code never advertises something stale.
 * Only add this to emails going to people who opted in to marketing.
 */
/** Land and Level Up starts Monday, December 7, 2026. After this, the P.S. goes quiet. */
export const COHORT_STARTS_AT = new Date('2026-12-07T05:00:00Z');

export function dealPostscript(medium = 'resource', style: 'light' | 'dark' = 'light', now: Date = new Date()): string {
  if (now.getTime() >= COHORT_STARTS_AT.getTime()) return '';
  const text = style === 'dark' ? 'rgba(255,255,255,0.85)' : COLORS.heading;
  const link = style === 'dark' ? '#ffffff' : COLORS.blue;
  const line = dealIsLive(now)
    ? 'My new Land and Level Up group starts December 7. Black Friday pricing ends Monday, November 30.'
    : "My new Land and Level Up group starts Monday, December 7. Founding seats are open until then.";
  return `<p style="margin:0 0 20px;color:${text};font-size:13px;line-height:1.5;"><strong>P.S.</strong> ${line} <a href="${dealUrl(medium)}" style="color:${link};font-weight:600;text-decoration:underline;">See the details</a></p>`;
}

/** The same P.S. as a table row, for the report emails that build their own HTML. */
export function dealPostscriptRow(medium = 'tool-report'): string {
  const p = dealPostscript(medium, 'light');
  if (!p) return '';
  return `<tr><td style="padding:16px 32px 0; background:white; text-align:center;">${p}</td></tr>`;
}

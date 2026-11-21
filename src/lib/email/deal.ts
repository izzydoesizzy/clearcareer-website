import { COLORS, SITE_URL } from './constants.js';

/** Black Friday pricing ends Monday, November 30, 2026 at 11:59 pm ET (UTC-5). */
export const DEAL_ENDS_AT = new Date('2026-12-01T04:59:59Z');

export function dealIsLive(now: Date = new Date()): boolean {
  return now.getTime() <= DEAL_ENDS_AT.getTime();
}

export function dealUrl(medium: string): string {
  return `${SITE_URL}/land-and-level-up?utm_source=email&utm_medium=${encodeURIComponent(medium)}&utm_campaign=black-friday-2026`;
}

/**
 * One short P.S. for the Black Friday deal. Returns '' once the deal has ended,
 * so old code never advertises an expired price.
 * Only add this to emails going to people who opted in to marketing.
 */
export function dealPostscript(medium = 'resource', style: 'light' | 'dark' = 'light'): string {
  if (!dealIsLive()) return '';
  const text = style === 'dark' ? 'rgba(255,255,255,0.85)' : COLORS.heading;
  const link = style === 'dark' ? '#ffffff' : COLORS.blue;
  return `<p style="margin:0 0 20px;color:${text};font-size:13px;line-height:1.5;"><strong>P.S.</strong> My new Land and Level Up group starts December 7. Black Friday pricing ends Monday, November 30. <a href="${dealUrl(medium)}" style="color:${link};font-weight:600;text-decoration:underline;">See the details</a></p>`;
}

/** The same P.S. as a table row, for the report emails that build their own HTML. */
export function dealPostscriptRow(medium = 'tool-report'): string {
  const p = dealPostscript(medium, 'light');
  if (!p) return '';
  return `<tr><td style="padding:16px 32px 0; background:white; text-align:center;">${p}</td></tr>`;
}

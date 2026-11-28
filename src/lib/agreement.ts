/**
 * The Land and Level Up client agreement.
 *
 * Wording lives in a Google Doc (GOOGLE_AGREEMENT_DOC_ID), created by scripts/google-auth.mjs
 * from DEFAULT_AGREEMENT_HTML below, so Izzy can edit it in Google Docs. If that doc isn't set up,
 * the default below is used. Either way the exact version someone signed is saved in their folder.
 *
 * DRAFT. Please have a lawyer review before the first client signs.
 * Placeholders: {{CLIENT_NAME}} {{CLIENT_EMAIL}} {{PROGRAM}} {{PRICE}} {{DATE}}
 */
import { offer, RESULTS_VARY } from '../data/llu.js';

export const AGREEMENT_DEFAULT_VERSION = 'v3-draft-2026-11-28';

const li = (items: readonly string[]) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;

export const DEFAULT_AGREEMENT_HTML = `<h1>Land and Level Up: Client Agreement</h1>
<p>This agreement is between <strong>ClearCareer</strong> (Izzy Piyale-Sheard, 710-20 Tubman Ave, Toronto, ON M5A 0M8, Canada, "ClearCareer", "I", "me") and <strong>{{CLIENT_NAME}}</strong> ({{CLIENT_EMAIL}}, "you").</p>
<p><strong>Date:</strong> {{DATE}}<br><strong>Program:</strong> {{PROGRAM}}<br><strong>Price paid:</strong> {{PRICE}} CAD plus HST</p>

<h2>1. What you get</h2>
<p>Land and Level Up runs for 6 weeks, starting ${offer.startDateLong}. The live calls are on ${offer.callDates}. ${offer.holidayBreak} It includes:</p>
${li(offer.group.includes)}
<p>If you joined the Group plus private rebuild, you also get:</p>
${li(offer.private.includes.slice(1))}
<p>Each group call is live and about 60 minutes. The community lives on Mighty Networks.</p>

<h2>2. Payment</h2>
<p>You paid in full at checkout, by card or through Klarna. If you used Klarna, your monthly payments are a separate agreement between you and Klarna. HST applies.</p>

<h2>3. The 7-day money-back guarantee</h2>
<p>If you change your mind, email izzy@joinclearcareer.com and I'll refund you in full. The guarantee ends at the earlier of:</p>
<ul><li>7 days after you paid, or</li><li>the moment rebuild work on your resume or LinkedIn starts: your first 1:1 rebuild session, or your resume or LinkedIn being reworked in a workshop hot seat.</li></ul>
<p>I can't take rebuild work back once it's done, which is why the guarantee ends there. After the guarantee ends, payments are not refundable, and you keep full access for the 6 weeks.</p>

<h2>4. No guarantee of results</h2>
<p>${RESULTS_VARY} Land and Level Up is career coaching. It is not legal, financial, tax or immigration advice.</p>

<h2>5. Your part</h2>
<p>You get out of this what you put in. You agree to give honest information, do the work between calls as best you can, and tell me if something isn't working so we can fix it.</p>

<h2>6. Group conduct and confidentiality</h2>
<ul>
<li>What members share in the group (their search, their numbers, their stories) stays in the group.</li>
<li>Don't record, screenshot or share other members' information outside the community.</li>
<li>Be kind. ClearCareer may remove anyone who harasses or disrespects other members.</li>
</ul>

<h2>7. Recordings</h2>
<p>Group calls may be recorded so members can rewatch them. Recordings are shared only inside the community. You tell me in your intake whether you're comfortable appearing in recordings, and you can keep your camera off any time.</p>

<h2>8. Your materials and privacy</h2>
<p>The resumes, LinkedIn exports and other files you share are stored in ClearCareer's Google Drive and used only to deliver this program. I won't share them. Ask me any time and I'll delete them. I'll only quote you or share your results publicly with your written permission. See joinclearcareer.com/privacy.</p>

<h2>9. After the 6 weeks</h2>
<p>${offer.afterProgram} Staying on is a separate monthly subscription that you choose to start. Nothing renews automatically.</p>

<h2>10. If ClearCareer cancels</h2>
<p>If I cancel the program before it starts, you get a full refund.</p>

<h2>11. Law</h2>
<p>This agreement is governed by the laws of Ontario and the federal laws of Canada that apply there.</p>

<h2>12. Signing</h2>
<p>Typing your full name and ticking "I agree" is your electronic signature, and it means the same as signing on paper.</p>`;

export interface Party { name: string; email: string; program: string; price: string; date: string }

export function fillAgreement(templateHtml: string, p: Party): string {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return templateHtml
    .replace(/\{\{\s*CLIENT_NAME\s*\}\}/g, esc(p.name))
    .replace(/\{\{\s*CLIENT_EMAIL\s*\}\}/g, esc(p.email))
    .replace(/\{\{\s*PROGRAM\s*\}\}/g, esc(p.program))
    .replace(/\{\{\s*PRICE\s*\}\}/g, esc(p.price))
    .replace(/\{\{\s*DATE\s*\}\}/g, esc(p.date));
}

export interface Signature { legalName: string; email: string; signedAt: Date; ip: string; version: string }

/** The block added to the end of the signed copy. */
export function signatureBlock(s: Signature): string {
  const when = s.signedAt.toLocaleString('en-CA', { timeZone: 'America/Toronto', dateStyle: 'long', timeStyle: 'short' });
  const esc = (x: string) => x.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<hr><h2>Signed electronically</h2>
<p><strong>Client:</strong> ${esc(s.legalName)} (${esc(s.email)})<br>
<strong>Signed:</strong> ${esc(when)} ET<br>
<strong>IP address:</strong> ${esc(s.ip)}<br>
<strong>Agreement version:</strong> ${esc(s.version)}</p>
<p><strong>ClearCareer:</strong> Izzy Piyale-Sheard</p>`;
}

/** Keep only the body of an exported Google Doc, and drop scripts, so it's safe to show on the page. */
export function cleanDocHtml(html: string): string {
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? html;
  return body.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/\son\w+="[^"]*"/gi, '');
}

/** A legal name has at least two words of letters. */
export function validLegalName(name: string): boolean {
  return /^[\p{L}'’.-]+(\s+[\p{L}'’.-]+)+$/u.test(name.trim()) && name.trim().length <= 120;
}

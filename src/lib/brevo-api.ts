/**
 * Small Brevo REST helpers for server routes. Never import this in client code.
 *
 * EMAIL_MODE controls every email this system sends (set it in Vercel):
 *   live     (default) send normally
 *   test     send ONLY to EMAIL_TEST_TO, with "[TEST for name@example.com]" in the subject.
 *            Uses one Brevo credit per email, but no real person ever gets one.
 *   off      send nothing at all, and use zero credits. The flow still runs and records each step,
 *            and the subject and recipient are written to the Vercel logs.
 *   sandbox  ask Brevo to check the email without delivering it (X-Sib-Sandbox: drop).
 *            Brevo doesn't say whether this saves credits, so prefer "off" for that.
 */
import { serverEnv } from './server-env.js';

export type EmailMode = 'live' | 'test' | 'off' | 'sandbox';

export function emailMode(env: Record<string, unknown> = serverEnv()): { mode: EmailMode; testTo: string } {
  const m = String(env.EMAIL_MODE || 'live').toLowerCase();
  const mode: EmailMode = m === 'test' || m === 'off' || m === 'sandbox' ? m : 'live';
  const testTo = String(env.EMAIL_TEST_TO || 'izzy@joinclearcareer.com');
  return { mode, testTo };
}

export interface Mail { to: string; toName?: string; subject: string; html: string; replyTo?: { email: string; name?: string }; tags?: string[]; senderName?: string; bcc?: string; attachments?: { name: string; content: string }[] }

/** The exact Brevo request for a mail in a given mode, or null when nothing should be sent. Pure, so it's easy to test. */
export function brevoPayload(mail: Mail, m = emailMode()): Record<string, unknown> | null {
  if (m.mode === 'off') return null;
  const test = m.mode === 'test';
  return {
    sender: { name: mail.senderName || 'Izzy from ClearCareer', email: 'izzy@joinclearcareer.com' },
    to: [test ? { email: m.testTo } : { email: mail.to, ...(mail.toName ? { name: mail.toName } : {}) }],
    ...(mail.replyTo ? { replyTo: mail.replyTo } : {}),
    subject: test ? `[TEST for ${mail.to}] ${mail.subject}` : mail.subject,
    htmlContent: mail.html,
    tags: [...(mail.tags || []), ...(test ? ['test'] : [])],
    ...(mail.bcc && !test ? { bcc: [{ email: mail.bcc }] } : {}),
    ...(mail.attachments?.length ? { attachment: mail.attachments } : {}),
    ...(m.mode === 'sandbox' ? { headers: { 'X-Sib-Sandbox': 'drop' } } : {}),
  };
}
export interface BrevoContact {
  email: string;
  emailBlacklisted?: boolean;
  attributes: Record<string, unknown>;
}

export function brevo(apiKey: string) {
  const headers = { 'api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' };
  const base = 'https://api.brevo.com/v3';

  return {
    async getContact(email: string): Promise<BrevoContact | null> {
      const r = await fetch(`${base}/contacts/${encodeURIComponent(email)}`, { headers });
      return r.ok ? ((await r.json()) as BrevoContact) : null;
    },

    /** Create or update a contact. Retries without attributes Brevo doesn't know yet, so a missing field never loses the contact. */
    async upsert(email: string, attributes: Record<string, unknown>, listIds: number[] = []): Promise<boolean> {
      const send = (attrs: Record<string, unknown>) =>
        fetch(`${base}/contacts`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ email, updateEnabled: true, attributes: attrs, ...(listIds.length ? { listIds } : {}) }),
        });
      let r = await send(attributes);
      if (!r.ok && r.status !== 204) {
        const t = await r.text();
        console.error('Brevo upsert error (run scripts/brevo-setup.mjs if an attribute is missing):', r.status, t);
        if (r.status === 400 && t.toLowerCase().includes('attribute')) r = await send({});
      }
      return r.ok || r.status === 204;
    },

    async listContacts(listId: number): Promise<BrevoContact[]> {
      const out: BrevoContact[] = [];
      for (let offset = 0; offset < 5000; offset += 500) {
        const r = await fetch(`${base}/contacts/lists/${listId}/contacts?limit=500&offset=${offset}`, { headers });
        if (!r.ok) { console.error('Brevo list error:', r.status, await r.text()); break; }
        const j = (await r.json()) as { contacts?: BrevoContact[]; count?: number };
        out.push(...(j.contacts || []));
        if (!j.contacts || j.contacts.length < 500) break;
      }
      return out;
    },

    /** `m` overrides EMAIL_MODE for one send (the test funnel never emails a real person). */
    async send(mail: Mail, m = emailMode()): Promise<boolean> {
      const payload = brevoPayload(mail, m);
      if (!payload) {
        console.log(`[EMAIL_MODE=off] not sent: "${mail.subject}" to ${mail.to}`);
        return true;
      }
      const r = await fetch(`${base}/smtp/email`, { method: 'POST', headers, body: JSON.stringify(payload) });
      if (!r.ok) console.error('Brevo send error:', r.status, await r.text());
      return r.ok;
    },
  };
}

/** Base64 for email attachments, without Node's Buffer (works on every runtime). */
export function toBase64(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

/** HMAC-SHA256 hex, for verifying Calendly and Stripe webhooks without extra packages. */
export async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let x = 0;
  for (let i = 0; i < a.length; i++) x |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return x === 0;
}

/** Parses "t=123,v1=abc,v1=def" signature headers (Calendly and Stripe use this shape). */
export function parseSigHeader(h: string): { t: string; v1: string[] } {
  const parts = h.split(',').map((p) => p.trim().split('='));
  return { t: parts.find(([k]) => k === 't')?.[1] || '', v1: parts.filter(([k]) => k === 'v1').map(([, v]) => v) };
}

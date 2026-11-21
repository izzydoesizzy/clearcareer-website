/**
 * Small Brevo REST helpers for server routes. Never import this in client code.
 */
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

    async send(mail: { to: string; toName?: string; subject: string; html: string; replyTo?: { email: string; name?: string }; tags?: string[]; senderName?: string }): Promise<boolean> {
      const r = await fetch(`${base}/smtp/email`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          sender: { name: mail.senderName || 'Izzy from ClearCareer', email: 'izzy@joinclearcareer.com' },
          to: [{ email: mail.to, ...(mail.toName ? { name: mail.toName } : {}) }],
          ...(mail.replyTo ? { replyTo: mail.replyTo } : {}),
          subject: mail.subject,
          htmlContent: mail.html,
          tags: mail.tags || [],
        }),
      });
      if (!r.ok) console.error('Brevo send error:', r.status, await r.text());
      return r.ok;
    },
  };
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

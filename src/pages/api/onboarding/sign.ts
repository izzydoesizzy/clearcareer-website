/** POST /api/onboarding/sign { t, legalName, agree, version }: records the signature and files the signed copy. */
import type { APIRoute } from 'astro';
import { authClient, clientIp, env, json } from '../../../lib/onboarding-api.js';
import { agreementFor, ensureFolder, updateRoster } from '../../../lib/clients.js';
import { signatureBlock, validLegalName } from '../../../lib/agreement.js';
import { brevo, toBase64 } from '../../../lib/brevo-api.js';
import { google, googleReady } from '../../../lib/google.js';
import { COL } from '../../../lib/onboarding.js';
import { signedCopyEmail } from '../../../lib/onboarding-emails.js';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const r = await authClient(body.t);
    if ('error' in r) return r.error;
    const c = r.client;
    if (c.agreementSignedAt) return json({ ok: true, already: true });

    const legalName = String(body.legalName || '').trim().replace(/\s+/g, ' ');
    if (!validLegalName(legalName)) return json({ error: 'Please type your full legal name (first and last).', field: 'legalName' }, 400);
    if (body.agree !== true) return json({ error: 'Please tick the box to agree.', field: 'agree' }, 400);

    const { html, version } = await agreementFor(env, c);
    if (body.version && body.version !== version) return json({ error: 'The agreement was just updated. Please refresh the page and read the latest version.' }, 409);

    const signedAt = new Date();
    const ip = clientIp(request, clientAddress);
    const signedHtml = `${html}${signatureBlock({ legalName, email: c.email, signedAt, ip, version })}`;
    const api = brevo(env.BREVO_API_KEY!);

    // Record first, so the signature is never lost even if Google is down.
    await api.upsert(c.email, { AGREEMENT_SIGNED_AT: signedAt.toISOString(), AGREEMENT_NAME: legalName, AGREEMENT_VERSION: version, AGREEMENT_IP: ip });

    let attachment = { name: 'Land and Level Up agreement (signed).html', content: toBase64(new TextEncoder().encode(`<!DOCTYPE html><meta charset="utf-8">${signedHtml}`)) };
    if (googleReady(env)) {
      try {
        const { folderId } = await ensureFolder(env, c);
        if (folderId) {
          const g = google(env);
          const doc = await g.createDocFromHtml(folderId, `Agreement - ${legalName} - signed ${signedAt.toISOString().slice(0, 10)}`, `<!DOCTYPE html><meta charset="utf-8">${signedHtml}`);
          const pdf = await g.exportDoc(doc.id, 'application/pdf');
          await g.uploadFile(folderId, `Agreement - ${legalName} - signed.pdf`, pdf, 'application/pdf');
          attachment = { name: 'Land and Level Up agreement (signed).pdf', content: toBase64(pdf) };
        }
      } catch (e) {
        console.error('signed copy to Drive failed (signature is still recorded):', e);
      }
    }
    await updateRoster(env, c.email, { [COL.agreement]: `Yes, ${signedAt.toLocaleDateString('en-CA', { timeZone: 'America/Toronto' })}` });

    const m = signedCopyEmail({ firstName: c.firstName, token: body.t });
    await api.send({ to: c.email, toName: c.firstName, subject: m.subject, html: m.html, bcc: env.BOOK_CALL_NOTIFY_EMAIL || 'izzy@joinclearcareer.com', attachments: [attachment], tags: ['agreement-signed'] });
    return json({ ok: true });
  } catch (e) {
    console.error('sign error:', e);
    return json({ error: 'Something went wrong saving your signature. Please try again.' }, 500);
  }
};

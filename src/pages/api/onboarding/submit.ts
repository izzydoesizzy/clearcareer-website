/** POST /api/onboarding/submit { t, ...intake }: saves the intake, files a summary doc, emails Izzy and the client. */
import type { APIRoute } from 'astro';
import { authClient, env, json } from '../../../lib/onboarding-api.js';
import { ensureFolder, updateRoster } from '../../../lib/clients.js';
import { brevo } from '../../../lib/brevo-api.js';
import { google, googleReady } from '../../../lib/google.js';
import { cleanIntake, COL, toolkitUrl } from '../../../lib/onboarding.js';
import { intakeBrief, intakeDoneEmail } from '../../../lib/onboarding-emails.js';

export const prerender = false;

const e = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const r = await authClient(body.t);
    if ('error' in r) return r.error;
    const c = r.client;
    if (!c.agreementSignedAt) return json({ error: 'Please sign the agreement first.' }, 400);
    const { data, errors } = cleanIntake(body);
    if (Object.keys(errors).length) return json({ error: 'A few answers need another look.', errors }, 400);

    const api = brevo(env.BREVO_API_KEY!);
    const files = String(c.attrs.INTAKE_FILES || '').split('|').filter(Boolean);
    const now = new Date();
    await api.upsert(c.email, { INTAKE_DONE_AT: now.toISOString(), INTAKE_LINKEDIN: data.linkedinUrl, INTAKE_RECORDING: data.recording, INTAKE_TIMEZONE: data.timezone });

    let summaryUrl = '';
    let folderUrl = c.folderUrl;
    if (googleReady(env)) {
      try {
        const f = await ensureFolder(env, c);
        folderUrl = f.folderUrl;
        if (f.folderId) {
          const rows: [string, string][] = [
            ['Goes by', data.preferredName], ['Email', c.email], ['Program', c.program], ['LinkedIn', data.linkedinUrl],
            ['Time zone', data.timezone], ['Phone', data.phone], ['Recordings', data.recording], ['Target roles', data.targetRoles],
            ['Target companies', data.targetCompanies], ['Job posts they want', data.jobPosts], ['5 wins', data.wins],
            ['Week 1, cover', data.week1], ['Anything else', data.anythingElse], ['Files uploaded', files.join('\n')],
          ];
          const html = `<!DOCTYPE html><meta charset="utf-8"><h1>Intake: ${e(c.name)}</h1><p>Submitted ${now.toLocaleString('en-CA', { timeZone: 'America/Toronto' })} ET</p>${rows.map(([k, v]) => `<h3>${e(k)}</h3><p>${e(v || '-')}</p>`).join('')}`;
          summaryUrl = (await google(env).createDocFromHtml(f.folderId, `Intake summary - ${c.name}`, html)).webViewLink;
        }
      } catch (err) {
        console.error('intake summary doc failed:', err);
      }
    }
    await updateRoster(env, c.email, { [COL.intake]: `Yes, ${now.toLocaleDateString('en-CA', { timeZone: 'America/Toronto' })}` });

    const brief = intakeBrief({ name: c.name, email: c.email, program: c.program, intake: data, files, folderUrl, summaryUrl });
    await api.send({ to: env.BOOK_CALL_NOTIFY_EMAIL || 'izzy@joinclearcareer.com', senderName: 'ClearCareer Bookings', subject: brief.subject, html: brief.html, replyTo: { email: c.email, name: c.name }, tags: ['intake'] });
    const done = intakeDoneEmail({ firstName: data.preferredName || c.firstName, program: c.program, toolkitUrl: await toolkitUrl(env as unknown as Record<string, unknown>, c.email) });
    await api.send({ to: c.email, toName: c.firstName, subject: done.subject, html: done.html, tags: ['intake-done'] });
    return json({ ok: true });
  } catch (err) {
    console.error('intake submit error:', err);
    return json({ error: 'Something went wrong saving your intake. Please try again.' }, 500);
  }
};

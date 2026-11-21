/** POST /api/onboarding/upload (multipart: t, kind, file): one file straight into the client's Drive folder. */
import type { APIRoute } from 'astro';
import { authClient, env, json } from '../../../lib/onboarding-api.js';
import { ensureFolder } from '../../../lib/clients.js';
import { brevo } from '../../../lib/brevo-api.js';
import { google, googleReady } from '../../../lib/google.js';
import { ALLOWED_TYPES, FILE_KINDS, MAX_FILE_BYTES, driveFileName, type FileKind } from '../../../lib/onboarding.js';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const form = await request.formData();
    const r = await authClient(String(form.get('t') || ''));
    if ('error' in r) return r.error;
    const c = r.client;
    if (!googleReady(env)) return json({ error: 'File uploads are not switched on yet. Please email your files to izzy@joinclearcareer.com.' }, 503);

    const kind = String(form.get('kind') || '') as FileKind;
    if (!(kind in FILE_KINDS)) return json({ error: 'Unknown file type.' }, 400);
    const file = form.get('file');
    if (!(file instanceof File)) return json({ error: 'No file received.' }, 400);
    if (file.size > MAX_FILE_BYTES) return json({ error: 'That file is over 4 MB. Try saving it as a PDF, or email it to izzy@joinclearcareer.com.' }, 400);
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    if (!ALLOWED_TYPES[file.type] && !Object.values(ALLOWED_TYPES).includes(ext)) return json({ error: 'Please upload a PDF, Word document or text file.' }, 400);

    const { folderId } = await ensureFolder(env, c);
    if (!folderId) return json({ error: 'Your folder is not ready yet. Please email your files to izzy@joinclearcareer.com.' }, 503);
    const name = driveFileName(kind, c.name, file.name);
    await google(env).uploadFile(folderId, name, new Uint8Array(await file.arrayBuffer()), file.type || 'application/octet-stream');

    const files = [...String(c.attrs.INTAKE_FILES || '').split('|').filter(Boolean), `${FILE_KINDS[kind]}: ${file.name}`];
    await brevo(env.BREVO_API_KEY!).upsert(c.email, { INTAKE_FILES: files.join('|').slice(0, 2000) });
    return json({ ok: true, files });
  } catch (e) {
    console.error('upload error:', e);
    return json({ error: 'The upload failed. Please try again, or email the file to izzy@joinclearcareer.com.' }, 500);
  }
};

/**
 * Paid downloads: GET /api/products/<slug>/download/<file>?t=<access token>
 *   <skill>.zip                 one Claude skill, ready to upload (text files only)
 *   start-here.md               the product's Start Here guide
 *   project-instructions.md     setup text for a Claude Project, Custom GPT or Gemini Gem
 * The token is the one on the buyer's access page and in their purchase email.
 */
import type { APIRoute } from 'astro';
import { verifyAccess } from '../../../../../lib/product-access';
import { skillZip, startHere, projectInstructions } from '../../../../../lib/product-files';
import { serverEnv } from '../../../../../lib/server-env';

export const prerender = false;

const headers = (type: string, name: string) => ({
  'Content-Type': type,
  'Content-Disposition': `attachment; filename="${name}"`,
  'Cache-Control': 'private, no-store',
  'X-Robots-Tag': 'noindex, nofollow',
  'X-Content-Type-Options': 'nosniff',
});

export const GET: APIRoute = async ({ params, url }) => {
  const slug = String(params.slug || '');
  const file = String(params.file || '');
  if (!/^[a-z0-9-]+$/.test(slug) || !/^[a-z0-9-]+\.(zip|md)$/.test(file)) return new Response('Not found', { status: 404 });

  const access = await verifyAccess(slug, url.searchParams.get('t'), serverEnv(), url);
  if (!access.ok) return new Response('This download needs your access link. Open it from your purchase email.', { status: 403 });

  if (file.endsWith('.zip')) {
    const zip = skillZip(slug, file.replace(/\.zip$/, ''));
    return zip ? new Response(zip as Uint8Array<ArrayBuffer>, { headers: headers('application/zip', file) }) : new Response('Not found', { status: 404 });
  }
  const text = file === 'start-here.md' ? startHere(slug) : file === 'project-instructions.md' ? projectInstructions(slug) : null;
  return text ? new Response(text, { headers: headers('text/markdown; charset=utf-8', `${slug}-${file}`) }) : new Response('Not found', { status: 404 });
};

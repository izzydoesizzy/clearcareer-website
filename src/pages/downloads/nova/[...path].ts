/**
 * The Prompt Vault's files used to be public here. They're private now (src/products/vault), so old
 * links go to the Vault page. Buyers open everything from the link in their purchase email.
 */
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = () =>
  new Response(null, { status: 301, headers: { Location: '/tools/career-prompt-vault', 'X-Robots-Tag': 'noindex' } });

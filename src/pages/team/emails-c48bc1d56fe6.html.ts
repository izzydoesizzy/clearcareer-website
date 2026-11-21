/**
 * Private, unlisted page: every Land and Level Up email with a sample lead.
 * Not linked anywhere, kept out of the sitemap, and marked noindex (meta tag + X-Robots-Tag header in vercel.json).
 * The address is random on purpose. Share it only with people who should see your sales playbook.
 */
import type { APIRoute } from 'astro';
import { buildGallery } from '../../lib/email/gallery.js';

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(buildGallery(), { headers: { 'Content-Type': 'text/html; charset=utf-8' } });

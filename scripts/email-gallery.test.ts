/**
 * Every email in the Land and Level Up system, rendered with a sample lead, in one HTML file.
 * Review them all without sending anything (zero Brevo credits).
 * Run: pnpm emails:gallery   (writes emails/gallery.html, which git ignores)
 */
import { it } from 'vitest';
import { writeFileSync, mkdirSync } from 'node:fs';
import { buildGallery } from '../src/lib/email/gallery';

it('builds the email gallery', () => {
  if (!process.env.RENDER_EMAILS) return;
  mkdirSync('emails', { recursive: true });
  writeFileSync(process.env.EMAIL_GALLERY_OUT || 'emails/gallery.html', buildGallery({ previewImages: true }));
});

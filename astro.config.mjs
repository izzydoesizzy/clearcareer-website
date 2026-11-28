// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import { readdirSync, existsSync } from 'node:fs';

// Career Suite downloads live outside public/ and are served by the gated
// /api/career-suite/download route, so they must be bundled into the function.
const SUITE_DIST = 'skills/clearcareer-career-suite/dist';
const suiteFiles = existsSync(SUITE_DIST)
  ? readdirSync(SUITE_DIST, { recursive: true, withFileTypes: true })
      .filter((d) => d.isFile())
      .map((d) => `./${d.parentPath ?? d.path}/${d.name}`.replace(/\\/g, '/'))
  : [];

// Only load Vercel adapter for production builds
const isProduction = process.env.NODE_ENV === 'production' || process.argv.includes('build');

export default defineConfig({
  site: 'https://joinclearcareer.com',
  adapter: isProduction ? (await import('@astrojs/vercel')).default({ includeFiles: suiteFiles }) : undefined,
  integrations: [
    mdx(),
    sitemap({ filter: (page) => { const p = new URL(page).pathname.replace(/\/$/, ''); return !['/book-a-call', '/tools/career-suite/access', '/booked', '/welcome', '/onboarding', '/roi', '/testimonial-variations'].includes(p) && !p.startsWith('/team/') && !p.endsWith('-old'); } }),
    react(),
  ],
  redirects: {
    // Old programs, hidden while Land and Level Up runs. Blog posts and old links still work.
    '/programs': '/land-and-level-up',
    '/programs/jsis': '/land-and-level-up',
    '/jsis': '/land-and-level-up',
    '/programs/community': '/land-and-level-up',
    '/community': '/land-and-level-up',
    '/blog/build-your-target-company-list-with-chatgpt': '/blog/build-your-target-company-list-with-ai',
  },
});

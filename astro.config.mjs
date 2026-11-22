// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

// Only load Vercel adapter for production builds
const isProduction = process.env.NODE_ENV === 'production' || process.argv.includes('build');

export default defineConfig({
  site: 'https://joinclearcareer.com',
  adapter: isProduction ? (await import('@astrojs/vercel')).default() : undefined,
  integrations: [
    mdx(),
    sitemap({ filter: (page) => { const p = new URL(page).pathname.replace(/\/$/, ''); return !['/book-a-call', '/booked', '/welcome', '/onboarding', '/roi', '/testimonial-variations'].includes(p) && !p.startsWith('/team/') && !p.endsWith('-old'); } }),
    react(),
  ],
  redirects: {
    // Old programs, hidden while Land and Level Up runs. Blog posts and old links still work.
    '/programs': '/land-and-level-up',
    '/programs/jsis': '/land-and-level-up',
    '/programs/community': '/land-and-level-up',
    '/community': '/land-and-level-up',
    '/blog/build-your-target-company-list-with-chatgpt': '/blog/build-your-target-company-list-with-ai',
  },
});

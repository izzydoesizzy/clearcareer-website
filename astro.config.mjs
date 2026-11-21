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
    // /land-and-level-up is noindex until launch. Remove this filter when it goes live.
    sitemap({ filter: (page) => !['/land-and-level-up', '/book-a-call', '/booked'].includes(new URL(page).pathname.replace(/\/$/, '')) }),
    react(),
  ],
  redirects: {
    '/blog/build-your-target-company-list-with-chatgpt': '/blog/build-your-target-company-list-with-ai',
  },
});

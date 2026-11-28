// Old product pages and where they go now, with or without a trailing slash. Handled by
// src/pages/products/[slug]/index.astro (not astro.config redirects: on Vercel those break the
// slash version). Buyers' access links (/products/<slug>/access/...) still work for all of these.
export const PRODUCT_REDIRECTS = {
  // Retired: folded into the new packs.
  'script-vault': '/products/complete-toolkit',
  'cold-outreach-pack': '/products/outreach-templates',
  // Hidden for now (see src/pages/products/_hidden/README.md).
  'adhd-cheat-sheet': '/shop',
  'job-search-scorecard': '/shop',
  'rejection-cards': '/shop',
  'ghost-job-checklist': '/shop',
  'adhd-focus-kit': '/shop',
  'linkedin-detox': '/shop',
  'emotional-survival-kit': '/shop',
  'adhd-career-change': '/shop',
  'career-change-command-center': '/shop',
  'over-40-toolkit': '/shop',
  'adhd-command-center': '/shop',
};

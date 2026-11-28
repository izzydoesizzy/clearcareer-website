// Old product pages and where they go now. Used by astro.config.mjs (exact URLs) and by
// src/pages/products/[slug]/index.astro (the same URLs with a trailing slash). Buyers' access
// links (/products/<slug>/access/...) still work for every product listed here.
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

# Hidden products

These sales pages are hidden for now (Izzy, Nov 2026). Folders starting with an underscore are not
routes, so these pages aren't served; `astro.config.mjs` redirects each old address to /shop.
Buyers' access links (/products/<slug>/access/...) keep working, and the guides stay in src/data.

To bring one back: move `<slug>.astro` to `src/pages/products/<slug>/index.astro`, remove its
redirect in `astro.config.mjs`, remove `hidden: true` in `src/data/product-config.ts`, and add it
back to `src/pages/shop.astro`.

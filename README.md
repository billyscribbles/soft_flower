# soft flowers

A cute little online shop for **handmade pipecleaner flowers**. Forever bouquets, twisted and shaped by hand.

Built on Billy's foundation starter (React 18 + Vite 5, plain CSS, Framer Motion). Ordering is by inquiry — no cart, no checkout. If you want the full project rules, read `CLAUDE.md`.

## Quick start

```bash
yarn install
cp .env.example .env      # fill VITE_FORMSPREE_ID + VITE_SITE_URL
yarn dev
```

Open http://localhost:5173.

## The three-file swap

All site-specific values live in:

1. **`src/config/site.config.js`** — brand, nav, footer, SEO, social, contact, Formspree ID.
2. **`src/config/theme.config.js`** — pastel palette, rounded radii, friendly fonts. Flows into CSS variables on `:root`.
3. **`src/content/*.js`** — per-section copy: `hero.js`, `services.js`, `testimonials.js`, `faq.js`, plus `products.js` for the catalogue.

Brand assets in `public/brand/`. Flower photos in `public/images/flowers/`.

## The catalogue

`src/content/products.js` is the source of truth for the shop. Each item looks like:

```js
{
  slug: 'blush-lily-bouquet',
  name: 'Blush Lily Bouquet',
  category: 'Bouquets',
  price: 68,
  image: '/images/flowers/flower-1.png',
  badge: 'Bestseller',
  blurb: 'Soft pink and white lilies wrapped in cream tissue.',
  description: '…',
}
```

Add a new flower by dropping a photo into `public/images/flowers/` and appending an item to `products.js`. The Shop page picks it up automatically and the slug becomes its detail route at `/shop/<slug>`.

## Routes

`/`, `/shop`, `/shop/<slug>`, `/about`, `/contact`, `/privacy`, `/terms`, `*` (404).

## Ordering flow

No cart. Each product card has an "Order this" button that opens the contact form with the item name prefilled. Inquiries route through Formspree; Billy fulfills manually.

## House rules

- No Tailwind. Plain CSS + CSS variables only.
- No TypeScript. JSX only.
- No hardcoded product names, prices, or copy inside components — always read from `site.config`/`content`.
- New design tokens go in `theme.config.js`, not as raw hex/rem in CSS.
- No cart / checkout / Stripe without asking first. If the shop outgrows order-by-inquiry, fork `elusive-racing` instead.

## Deployment

Ready for Railway (`railway.json` included). `yarn start` serves the production build on port 4173.

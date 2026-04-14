# CLAUDE.md — soft_flowers

A cute little online shop selling **handmade pipecleaner flowers**. This repo started from Billy's foundation starter and is now its own project — treat it as a real site, not a template.

## Vibe

Soft, playful, handmade. Pastel palette, rounded corners, generous whitespace, friendly type. Think craft fair stall meets a clean modern boutique — warm and personal, not corporate. Every flower is made by hand, and the site should feel like that.

## Scope (default — ask before expanding)

This is a **simple catalog + order-by-message** shop, not a full e-commerce store:

- Home with hero, featured bouquets, about-the-maker, testimonials/FAQ
- A **Shop / Gallery** page listing available flowers and bouquets with photos, names, prices, and short descriptions
- Per-item detail can be inline (modal/expand) — no separate product routes unless asked
- **Ordering:** contact form / email / DM — Formspree handles inquiries, Billy handles fulfillment manually
- No cart, no Stripe, no inventory system, no accounts. If the shop outgrows this, fork `elusive-racing` instead

If the user asks for real checkout, pause and confirm before pulling in commerce dependencies.

## Tech stack (keep as-is unless asked)

- React 18 + Vite 5, JSX (no TypeScript)
- React Router v7, lazy-loaded pages
- Plain CSS + CSS variables (no Tailwind / styled-components)
- Framer Motion 11 for scroll-in animations
- Lucide React icons
- `react-helmet-async` for per-page SEO
- Formspree for contact/order inquiries (env-driven)
- Yarn 4.12 (`.pnp`)
- Railway deploy (`railway.json`)

## The three-file swap model (inherited from foundation)

Components stay dumb. All project-specific values live in:

1. **`src/config/theme.config.js`** — colors, fonts, radii, shadows. Booted via `src/lib/applyTheme.js` which flattens to CSS custom properties on `:root`. Components read `var(--color-accent)` etc.
2. **`src/config/site.config.js`** — brand, nav, footer, social, SEO, contact, Formspree ID.
3. **`src/content/*.js`** — per-section copy (`hero.js`, `services.js`, `testimonials.js`, `faq.js`, etc.), plus a **`flowers.js`** (or `shop.js`) that lists the catalog items.

Brand assets live in `public/brand/` (`logo.svg`, `favicon.svg`, `og-image.png`) and `public/fonts/` (self-hosted, preloaded in `index.html`). Flower photos go in `public/images/flowers/`.

## Catalog shape

Each flower/bouquet in `src/content/flowers.js` should look roughly like:

```js
{
  id: 'daisy-bunch',
  name: 'Daisy Bunch',
  price: 18,
  currency: 'AUD',
  image: '/images/flowers/daisy-bunch.jpg',
  blurb: 'A cheerful little bunch of white pipecleaner daisies.',
  available: true,
  tags: ['daisy', 'white', 'small'],
}
```

The Shop component reads this list, renders a grid, and wires each card's "Order this" button to prefill the contact form with the item name.

## Rules

- **Never hardcode product names, prices, colors, or copy inside components** — add to config/content and read from there.
- **No Tailwind, no styled-components, no CSS-in-JS.** Plain CSS + variables only.
- **No TypeScript.** JSX only.
- **No new design tokens in raw CSS** — add them to `theme.config.js` and expose via `applyTheme.js`.
- **Prefer lifting patterns from the foundation/sibling repos** (`my_studio`, `elusive-racing`) over inventing new ones.
- **Keep it cute and small.** This is a handmade shop, not an enterprise site — resist over-engineering.
- **Ask before adding cart/checkout.** Default scope is order-by-inquiry.

## Sibling reference repos (read-only)

- `/Users/billyhuynh/Github/my_studio` — marketing patterns
- `/Users/billyhuynh/Github/elusive-racing` — only if real commerce gets greenlit

## When starting fresh

If the current `src/` still looks like the untouched foundation, the first pass is:

1. Set `site.config.js` — brand "soft flowers" (or whatever Billy decides), tagline, nav (Home, Shop, About, Contact), contact email, Formspree ID.
2. Set `theme.config.js` — soft pastel palette, rounded radii, friendly display font + clean body font.
3. Drop brand assets into `public/brand/` (generate SVG placeholders if none provided).
4. Rewrite `src/content/hero.js`, `about`, `testimonials`, `faq` with warm handmade-shop copy.
5. Create `src/content/flowers.js` with 4–8 starter items (placeholder images OK).
6. Add a `Shop` component + `/shop` route that renders the catalog grid.
7. Wire "Order this" buttons to the contact form with a prefilled subject.
8. `yarn dev`, verify every route, resize at 375/768/1280, then `yarn build && yarn preview`.

Always confirm the brand basics (name, colors, tone, logo) with Billy before editing if they aren't already in the conversation.

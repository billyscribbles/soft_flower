# Events page — design spec

**Date:** 2026-04-19
**Status:** Approved (brainstorm), pending implementation plan
**Scope:** New `/events` page for bespoke event inquiries (weddings, proposals/engagements, birthdays, corporate)

## Goal

Give big-event customers a dedicated destination that:

1. Makes it obvious Soft Florals does bespoke event work (currently hinted at in the banner and footer, but the links go nowhere meaningful).
2. Differentiates event inquiries from regular catalog "Order this daisy" messages, because event work needs context the current Contact form doesn't capture (event date, scale, vibe).
3. Gives Christine a pre-qualified inquiry that arrives with enough info to write a first-draft quote.

Stays firmly in the "order-by-inquiry" scope — no cart, no Stripe, no bookings system.

## Non-goals

- No pricing anywhere on the page (decision: POA / quote-on-request).
- No dedicated photoshoot assets — event cards reuse existing product photos as placeholders; Christine swaps in real event photos later.
- No calendar/availability system — the date field is informational, not a booking slot.
- No separate event-type sub-pages (all 4 event types live on `/events`).

## Architecture

### New files

- `src/content/events.js` — event type catalog (array of 4 entries).
- `src/components/Events.jsx` + `Events.css` — grid of event-type cards. Reads from `events.js`. Each card's "Enquire" button sets the selected event type on the inquiry form and scrolls to it.
- `src/components/EventInquiry.jsx` + `EventInquiry.css` — event-specific Formspree form (separate from the general Contact form).
- `src/pages/EventsPage.jsx` — page shell: Helmet SEO + Hero + Events grid + HowItWorks-style 3-step strip + EventInquiry.

### Edits

- Router (`src/App.jsx` or wherever routes live) — add a lazy-loaded `/events` route.
- `src/config/site.config.js`:
  - Add `{ label: 'Events', to: '/events' }` to `nav`.
  - Repoint footer "Custom orders" link from `/contact` to `/events`.
  - Point the banner "Custom orders open…" copy at `/events` (or leave copy alone and just ensure the footer/nav drive traffic there).

### Follows existing patterns

- Grid + card layout: mirror `Products.jsx` / `Products.css`.
- Formspree form wiring: mirror `Contact.jsx` (honeypot, `_subject`, env var `VITE_FORMSPREE_ID`).
- Page shell: mirror `ProductPage.jsx` (Helmet, lazy route).
- Content file shape: mirror `products.js`.

## Page structure (`/events`)

1. **Hero** — headline "Bespoke flowers for the moments that matter", one-line sub, minimal editorial style consistent with the rest of the site.
2. **Events grid** — 4 cards, 2×2 on desktop, stacked on mobile:
   - Weddings
   - Proposals & Engagements
   - Birthdays
   - Corporate
   Each card: image, title, 1-line blurb, bullet list of typical pieces, "Enquire" button.
3. **How it works** — 3 short steps: *Enquire* → *Quote & design chat* → *Handmade & delivered*. Visual tone consistent with existing `HowItWorks.jsx`.
4. **Event inquiry form** — the richer form described below. Anchor target (`id="inquire"`) for scroll-to behavior from event cards.
5. Footer — existing global Footer, unchanged.

## Data shape — `src/content/events.js`

```js
export const events = [
  {
    id: 'weddings',
    title: 'Weddings',
    blurb: 'Bouquets, bridal party pieces, arches and table florals — forever-keepsakes from your day.',
    image: '/images/flowers/flower-1.png', // placeholder, swap for real wedding photo
    pieces: ['Bridal bouquet', 'Bridesmaid posies', 'Buttonholes', 'Table florals', 'Arches & installations'],
  },
  {
    id: 'proposals-engagements',
    title: 'Proposals & Engagements',
    blurb: 'A forever flower for the forever question — keepsakes for the moment and the celebration after.',
    image: '/images/flowers/flower-2.png',
    pieces: ['Single statement stem', 'Proposal bouquet', 'Engagement party florals'],
  },
  {
    id: 'birthdays',
    title: 'Birthdays',
    blurb: 'Personalised bouquets and centrepieces for milestone birthdays and intimate celebrations.',
    image: '/images/flowers/flower-3.png',
    pieces: ['Birthday bouquet', 'Table centrepieces', 'Cake florals', 'Gift boxes'],
  },
  {
    id: 'corporate',
    title: 'Corporate',
    blurb: 'Launches, press events, client gifts, and reception florals — handmade, allergy-free, and reusable.',
    image: '/images/flowers/flower-4.png',
    pieces: ['Reception installations', 'Branded gift bouquets', 'Press event florals', 'Client keepsakes'],
  },
]
```

Image paths are placeholders that already exist in `public/images/flowers/`. Christine provides real event photos later; only the `image` field in `events.js` needs editing.

## Inquiry form (`EventInquiry.jsx`)

### Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| Name | text | ✓ | |
| Email | email | ✓ | |
| Event type | select | ✓ | Options = the 4 event ids. Auto-populated when a user clicks "Enquire" on a card. |
| Event date | date | – | "Not sure yet" is fine; include helper text. |
| Scale / guest count | text | – | Free text ("intimate", "100 guests"). |
| Vibe, colors, inspiration | textarea | ✓ | Most useful field for quoting. |
| Additional details | textarea | – | Catch-all. |
| Honeypot (`_gotcha`) | hidden | – | Mirrors `Contact.jsx` anti-spam pattern. |
| `_subject` | hidden | – | Set to `Event inquiry — {event type title}`. |

### Behavior

- Posts to Formspree using `VITE_FORMSPREE_ID` (reuse existing env var — no new secret).
- Click-from-card flow: clicking "Enquire" on an event card sets the `eventType` state, updates `_subject`, and smooth-scrolls the form into view. Implementation: lift `eventType` state into `EventsPage` or use URL hash + `useEffect`.
- Success state: same pattern as `Contact.jsx` (swap form for a thank-you message).
- Error state: inline error message + resubmit — same as `Contact.jsx`.

### Validation

- Client-side: required fields, email format.
- No server-side validation beyond what Formspree does.

## Navigation & SEO

- Nav: add `Events` between `Shop` and `About`.
- Footer: repoint "Custom orders" → `/events`.
- Helmet per-page SEO on `EventsPage`:
  - Title: `Events & Custom Orders`
  - Description: mentions weddings, proposals, birthdays, corporate, Melbourne, Australia, bespoke handmade pipecleaner flowers.

## Testing checklist

- [ ] `yarn dev` — `/events` renders at 375 / 768 / 1280.
- [ ] Clicking each of the 4 "Enquire" buttons sets the event type and scrolls to the form.
- [ ] Form submits to Formspree in dev (or stubbed with `VITE_FORMSPREE_ID` unset and a console-log fallback, matching current Contact behavior).
- [ ] Nav `Events` link highlights when active.
- [ ] Footer "Custom orders" now links to `/events`.
- [ ] `yarn build && yarn preview` passes.
- [ ] No console errors.

## Out of scope (explicit)

- Pricing, "from $X" badges, or ranges.
- Cart, Stripe, availability calendar.
- Image optimization / photography.
- CMS integration — content stays in `src/content/events.js`.

## Open items for implementation phase

- Exact hero copy — draft in plan, confirm with Christine.
- Exact banner line wording, if we want to point it at `/events`.

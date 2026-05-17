# Coupon codes — design

**Date:** 2026-05-17
**Status:** Approved for planning

## Goal

Let the shop owner hand out discount codes. A customer enters one code at
checkout and sees the discount applied to their order before paying.

## Decisions (from brainstorming)

- Codes are managed in a **config file** the owner edits and redeploys.
- Three discount types: **percentage off**, **fixed amount off**, **free shipping**.
- One restriction: **expiry date**. No minimum-order rule. No usage limits.
- Customers enter codes on the **checkout page only**.
- **Maximum one coupon per transaction** — no stacking. Applying a new code
  replaces any previously applied one.

## Out of scope

- One-time / N-use codes and per-customer limits — these require a database to
  track redemptions. Codes are reusable until they expire.
- Admin UI for creating codes — owner edits the config file.
- Coupon entry on the cart page — checkout only.

## Architecture

### 1. `src/config/coupons.config.js` (new)

Plain data, no `import.meta.env`, so the Node payment server can import it
directly — same pattern as `checkout.config.js`.

```js
export const coupons = [
  { code: 'SPRING10', type: 'percent',  value: 10,   expiresAt: '2026-09-01', label: '10% off' },
  { code: 'WELCOME5', type: 'fixed',    value: 5,    expiresAt: null,         label: '$5 off' },
  { code: 'FREESHIP', type: 'shipping', value: null, expiresAt: '2026-07-01', label: 'Free shipping' },
]
```

- `code` — matched case-insensitively (and trimmed) against customer input.
- `type` — `'percent'` | `'fixed'` | `'shipping'`.
- `value` — percent: whole number (10 = 10%). fixed: AUD amount. shipping: ignored (`null`).
- `expiresAt` — ISO date string, or `null` for never. The code is invalid on
  and after this date (expiry compared date-only, in the shop's terms).
- `label` — short human description, reused in UI and emails.

The starter list above is illustrative; the owner edits it freely.

### 2. `src/lib/coupons.js` (new)

Pure functions, no browser APIs — imported by **both** the browser and
`server.js`, same as `cart-totals.js`.

- `findCoupon(code)` → coupon object or `null`. Trims and lowercases input
  before matching.
- `validateCoupon(coupon, now)` → `{ valid: boolean, reason: string | null }`.
  `reason` is a stable key (`'unknown'`, `'expired'`) the UI maps to copy.
  `now` is passed in (a `Date`) so the function stays pure and testable.
- `applyCoupon({ coupon, subtotal, shipping })` →
  `{ discount, shippingAfter }`.
  - **percent** — `discount = round(subtotal * value / 100)`, applied to
    subtotal; `shippingAfter = shipping`.
  - **fixed** — `discount = min(value, subtotal)` (never sends the order
    negative); `shippingAfter = shipping`.
  - **shipping** — `discount = 0`; `shippingAfter = 0`. The waived shipping
    amount is shown in the UI as the saving.
  - Final total = `subtotal - discount + shippingAfter`.

All money rounding uses cents-safe rounding consistent with the existing
`computeSubtotal` / `formatAUD` behaviour.

### 3. Customer flow — checkout page

- `CheckoutSummary` gains a **"Have a coupon code?"** input + **Apply** button,
  plus a removable applied-state ("SPRING10 applied — 10% off ✕").
- The applied coupon is state in **`CheckoutPage`** (alongside `deliveryMethod`
  and `intent`), since both `CheckoutSummary` (display) and `CheckoutForm`
  (payload) need it. `CheckoutPage` passes `coupon`, `onApplyCoupon`, and
  `onRemoveCoupon` down to `CheckoutSummary`.
- On Apply, the browser runs `findCoupon` + `validateCoupon` for **instant
  friendly feedback** ("We don't recognise that code", "That code has
  expired"). On success it stores the coupon and shows a **Discount** row in
  the summary totals.
- `CheckoutPage` recomputes the displayed total via `applyCoupon`.
- Applying a second code replaces the first (one-per-transaction rule).

### 4. Server stays the price authority

`server.js` `/api/create-payment-intent`:

- Accepts an optional `couponCode` string in the request body.
- After computing `subtotal` and `shippingFee`, re-runs `findCoupon` +
  `validateCoupon` + `applyCoupon` **server-side** and recomputes `total`. A
  tampered browser cannot fake a discount.
- If `couponCode` is present but invalid/expired → respond `400` with a clear
  message. (The browser pre-validates, so this mainly guards tampering and the
  expiry boundary.)
- The applied code, discount amount, and final total go into the
  PaymentIntent **`metadata`** so the existing owner-notification email and
  order records show what was applied.
- The response JSON gains `discount` and `couponCode` alongside the existing
  `subtotal` / `shippingFee` / `amount` fields.

### 5. Copy & display

- All coupon strings (field label, placeholder, button text, success and error
  messages) go into `src/content/checkout.js` under a new `summary.coupon`
  block — no hardcoded copy in components (project rule).
- `CheckoutSummary` renders a **Discount** row between subtotal and total; for
  a free-shipping code the shipping row reads "Free" with the code noted.
- The `order` summary object built in `CheckoutForm` gains `discount` and
  `coupon` fields so `PaymentStep` / the confirmation reflect the discount.
- Styling follows the existing soft pastel theme; any new visual values are
  added to `theme.config.js` if needed (project rule — no raw-CSS tokens).

## Testing

- Unit tests for `src/lib/coupons.js`: each discount type, fixed-discount
  capped at subtotal, expiry boundary (valid the day before, invalid on/after),
  unknown code, case/whitespace-insensitive matching.
- Manual checkout walkthrough: apply each code type, replace a code, remove a
  code, submit with an expired code (server rejects), confirm the PaymentIntent
  metadata and owner email show the discount.

## Error handling

- Unknown / expired code on Apply → inline message, no coupon stored.
- Server rejects an invalid code → `400` surfaces in the existing
  `CheckoutForm` error area.
- A fixed discount never sends the total below zero; the server's existing
  "below minimum" (50c) check still applies after the discount.

## Pre-existing bug (noted, not in scope)

`computeShipping` in `cart-totals.js` expects `standardRate` / `expressRate`,
but `server.js` and `CheckoutPage` pass `flatRate` — shipping math may already
be wrong. Unrelated to coupons; left untouched unless separately requested.

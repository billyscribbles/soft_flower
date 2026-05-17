# Coupon Codes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the shop owner hand out discount codes that a customer applies once at checkout, with the discount enforced server-side.

**Architecture:** Coupons are plain data in a config file. A shared pure-function module (`src/lib/coupons.js`) does lookup, expiry validation, and discount math — imported by both the browser (instant feedback) and the Node payment server (the price authority). The browser shows a coupon field in the checkout order summary; the server re-validates and recomputes the charged total.

**Tech Stack:** React 18 + Vite 5 (JSX), plain CSS + CSS variables, Node/Express payment server, Stripe, Vitest (added in Task 1) for unit tests.

**Spec:** `docs/superpowers/specs/2026-05-17-coupon-codes-design.md`

**Conventions:** All `git commit` messages in this plan end with the trailer:
```
Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```
Do **not** run `git push` — committing locally is fine, publishing needs Billy's explicit say-so.

---

## File Structure

| File | Responsibility | Action |
|---|---|---|
| `package.json` | Add Vitest devDependency + `test` script | Modify |
| `src/config/coupons.config.js` | The coupon list (owner-edited data) | Create |
| `src/lib/coupons.js` | Pure lookup / validation / discount math | Create |
| `src/lib/coupons.test.js` | Unit tests for the above | Create |
| `src/content/checkout.js` | Coupon UI copy under `summary.coupon` | Modify |
| `src/config/theme.config.js` | `error` color token | Modify |
| `server.js` | Accept `couponCode`, re-validate, recompute total, write metadata | Modify |
| `src/lib/order-email.js` | Show the discount line in the owner email | Modify |
| `src/pages/CheckoutPage.jsx` | Hold applied-coupon state, recompute total | Modify |
| `src/components/checkout/CheckoutSummary.jsx` | Coupon input/applied UI + discount row | Modify |
| `src/components/checkout/CheckoutSummary.css` | Styles for the coupon UI | Modify |
| `src/components/checkout/CheckoutForm.jsx` | Send `couponCode`, carry discount into `order` | Modify |
| `src/pages/OrderConfirmationPage.jsx` | Show the discount row on the receipt | Modify |

---

## Task 1: Add Vitest

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add Vitest as a dev dependency**

Run: `yarn add -D vitest`

Expected: Vitest is added under `devDependencies` in `package.json`; `yarn.lock` and the Yarn PnP files (`.pnp.cjs`, `.yarn/`) update.

- [ ] **Step 2: Add a `test` script**

In `package.json`, add this line to the `"scripts"` block (after `"start"`):

```json
"test": "vitest run --passWithNoTests"
```

The `--passWithNoTests` flag makes the runner exit 0 when no test files exist yet.

- [ ] **Step 3: Verify the runner works**

Run: `yarn test`
Expected: exits with code 0, prints `No test files found, exiting with code 0`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
Add Vitest for unit tests

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

`git add -A` is used so the Yarn PnP files updated by `yarn add` are included.

---

## Task 2: Create the coupon config file

**Files:**
- Create: `src/config/coupons.config.js`

- [ ] **Step 1: Create the config file**

Create `src/config/coupons.config.js` with this exact content:

```js
// Coupon codes — plain data, no browser APIs.
// Lives in its own file (like checkout.config.js) because the Node payment
// server imports it directly. Edit this list to add, change, or retire codes.
//
// type:  'percent'  — value is a whole-number percent off the subtotal (10 = 10%)
//        'fixed'    — value is an AUD amount off the subtotal
//        'shipping' — waives the delivery fee; value is ignored
// expiresAt: ISO date string, or null to never expire. The code stops working
//            on and after this date.

export const coupons = [
  { code: 'SPRING10', type: 'percent', value: 10, expiresAt: '2026-09-01', label: '10% off' },
  { code: 'WELCOME5', type: 'fixed', value: 5, expiresAt: null, label: '$5 off' },
  { code: 'FREESHIP', type: 'shipping', value: null, expiresAt: '2026-07-01', label: 'Free shipping' },
]
```

- [ ] **Step 2: Commit**

```bash
git add src/config/coupons.config.js
git commit -m "$(cat <<'EOF'
Add coupon config file

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Build the coupon logic library (TDD)

**Files:**
- Create: `src/lib/coupons.js`
- Test: `src/lib/coupons.test.js`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/coupons.test.js` with this exact content:

```js
import { describe, it, expect } from 'vitest'
import { findCoupon, validateCoupon, applyCoupon } from './coupons.js'

describe('findCoupon', () => {
  it('finds a code case-insensitively and trimmed', () => {
    expect(findCoupon('  spring10 ')?.code).toBe('SPRING10')
    expect(findCoupon('WELCOME5')?.code).toBe('WELCOME5')
  })

  it('returns null for an unknown code', () => {
    expect(findCoupon('NOPE')).toBe(null)
  })

  it('returns null for empty or non-string input', () => {
    expect(findCoupon('')).toBe(null)
    expect(findCoupon('   ')).toBe(null)
    expect(findCoupon(null)).toBe(null)
    expect(findCoupon(undefined)).toBe(null)
    expect(findCoupon(42)).toBe(null)
  })
})

describe('validateCoupon', () => {
  it('marks a null coupon as unknown', () => {
    expect(validateCoupon(null, new Date())).toEqual({ valid: false, reason: 'unknown' })
  })

  it('accepts a coupon with no expiry', () => {
    const coupon = { code: 'X', type: 'fixed', value: 5, expiresAt: null }
    expect(validateCoupon(coupon, new Date())).toEqual({ valid: true, reason: null })
  })

  it('accepts a coupon before its expiry date', () => {
    const coupon = { code: 'X', type: 'percent', value: 10, expiresAt: '2026-09-01' }
    expect(validateCoupon(coupon, new Date('2026-08-31T23:00:00Z')).valid).toBe(true)
  })

  it('rejects a coupon on or after its expiry date', () => {
    const coupon = { code: 'X', type: 'percent', value: 10, expiresAt: '2026-09-01' }
    expect(validateCoupon(coupon, new Date('2026-09-01T00:00:00Z'))).toEqual({
      valid: false,
      reason: 'expired',
    })
    expect(validateCoupon(coupon, new Date('2026-10-01T00:00:00Z')).valid).toBe(false)
  })
})

describe('applyCoupon', () => {
  it('returns no discount when there is no coupon', () => {
    expect(applyCoupon({ coupon: null, subtotal: 100, shipping: 12 })).toEqual({
      discount: 0,
      shippingAfter: 12,
    })
  })

  it('applies a percentage discount to the subtotal', () => {
    const coupon = { code: 'X', type: 'percent', value: 10 }
    expect(applyCoupon({ coupon, subtotal: 100, shipping: 12 })).toEqual({
      discount: 10,
      shippingAfter: 12,
    })
  })

  it('rounds a percentage discount to cents', () => {
    const coupon = { code: 'X', type: 'percent', value: 10 }
    expect(applyCoupon({ coupon, subtotal: 33.33, shipping: 0 }).discount).toBe(3.33)
  })

  it('applies a fixed discount', () => {
    const coupon = { code: 'X', type: 'fixed', value: 5 }
    expect(applyCoupon({ coupon, subtotal: 100, shipping: 12 }).discount).toBe(5)
  })

  it('never lets a fixed discount exceed the subtotal', () => {
    const coupon = { code: 'X', type: 'fixed', value: 50 }
    expect(applyCoupon({ coupon, subtotal: 30, shipping: 12 }).discount).toBe(30)
  })

  it('waives shipping for a shipping coupon', () => {
    const coupon = { code: 'X', type: 'shipping', value: null }
    expect(applyCoupon({ coupon, subtotal: 100, shipping: 12 })).toEqual({
      discount: 0,
      shippingAfter: 0,
    })
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `yarn test`
Expected: FAIL — `Failed to resolve import "./coupons.js"` (the module does not exist yet).

- [ ] **Step 3: Implement the library**

Create `src/lib/coupons.js` with this exact content:

```js
// Coupon logic — pure functions, no browser APIs.
// Imported by both the browser (instant checkout feedback) and the Node
// payment server (server.js, the authority on price). Same pattern as
// cart-totals.js.

import { coupons } from '../config/coupons.config.js'

// Find a coupon by code — case-insensitive and trimmed. Returns the coupon
// object or null.
export function findCoupon(code) {
  if (typeof code !== 'string') return null
  const normalized = code.trim().toLowerCase()
  if (!normalized) return null
  return coupons.find((c) => c.code.toLowerCase() === normalized) || null
}

// Check whether a coupon is usable right now. `now` is a Date (passed in so
// this stays pure and testable). Returns { valid, reason } where reason is
// one of null | 'unknown' | 'expired'.
export function validateCoupon(coupon, now) {
  if (!coupon) return { valid: false, reason: 'unknown' }
  if (coupon.expiresAt) {
    const expiry = new Date(coupon.expiresAt)
    if (now.getTime() >= expiry.getTime()) {
      return { valid: false, reason: 'expired' }
    }
  }
  return { valid: true, reason: null }
}

// Compute the discount a coupon produces for an order.
// Returns { discount, shippingAfter }:
//   discount      — AUD taken off the subtotal (0 for free-shipping coupons)
//   shippingAfter — the shipping fee after the coupon (0 for free shipping)
// Final order total = subtotal - discount + shippingAfter.
export function applyCoupon({ coupon, subtotal, shipping }) {
  if (!coupon) return { discount: 0, shippingAfter: shipping }

  if (coupon.type === 'percent') {
    const discount = Math.round(subtotal * (coupon.value / 100) * 100) / 100
    return { discount, shippingAfter: shipping }
  }

  if (coupon.type === 'fixed') {
    return { discount: Math.min(coupon.value, subtotal), shippingAfter: shipping }
  }

  if (coupon.type === 'shipping') {
    return { discount: 0, shippingAfter: 0 }
  }

  return { discount: 0, shippingAfter: shipping }
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `yarn test`
Expected: PASS — all tests in `coupons.test.js` green.

- [ ] **Step 5: Commit**

```bash
git add src/lib/coupons.js src/lib/coupons.test.js
git commit -m "$(cat <<'EOF'
Add coupon lookup, validation, and discount logic

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Add coupon copy to the content file

**Files:**
- Modify: `src/content/checkout.js:110-118` (the `summary` block)

- [ ] **Step 1: Add the `coupon` block to `summary`**

In `src/content/checkout.js`, find the `summary` object:

```js
  summary: {
    heading: 'Order summary',
    subtotal: 'Subtotal',
    subtotalNote: '* excludes shipping fee',
    shipping: 'Shipping',
    shippingFree: 'Free',
    pickup: 'Pickup',
    total: 'Total',
  },
```

Replace it with:

```js
  summary: {
    heading: 'Order summary',
    subtotal: 'Subtotal',
    subtotalNote: '* excludes shipping fee',
    shipping: 'Shipping',
    shippingFree: 'Free',
    pickup: 'Pickup',
    total: 'Total',
    coupon: {
      label: 'Have a coupon code?',
      placeholder: 'Enter code',
      apply: 'Apply',
      applied: 'applied',
      remove: 'Remove',
      discountLabel: 'Discount',
      errors: {
        empty: 'Enter a coupon code first.',
        unknown: 'We don’t recognise that code.',
        expired: 'That code has expired.',
      },
    },
  },
```

- [ ] **Step 2: Verify the file still parses**

Run: `node --check src/content/checkout.js`
Expected: no output, exit code 0.

- [ ] **Step 3: Commit**

```bash
git add src/content/checkout.js
git commit -m "$(cat <<'EOF'
Add coupon UI copy to checkout content

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Apply coupons server-side

**Files:**
- Modify: `server.js` (imports near line 17-21; handler body lines 168-293)

- [ ] **Step 1: Import the coupon library**

In `server.js`, find the import block:

```js
import { computeSubtotal, computeShipping } from './src/lib/cart-totals.js'
import { sendOrderEmail } from './src/lib/order-email.js'
```

Replace it with:

```js
import { computeSubtotal, computeShipping } from './src/lib/cart-totals.js'
import { findCoupon, validateCoupon, applyCoupon } from './src/lib/coupons.js'
import { sendOrderEmail } from './src/lib/order-email.js'
```

- [ ] **Step 2: Accept `couponCode` from the request body**

In the `/api/create-payment-intent` handler, find:

```js
    const {
      items,
      deliveryMethod,
      customer = {},
      shipping = {},
      deliveryDate,
      notes,
      idempotencyKey,
    } = req.body || {}
```

Replace with:

```js
    const {
      items,
      deliveryMethod,
      customer = {},
      shipping = {},
      deliveryDate,
      notes,
      couponCode,
      idempotencyKey,
    } = req.body || {}
```

- [ ] **Step 3: Validate and apply the coupon, recompute the total**

Find this block:

```js
    // --- Recompute the amount (server is authoritative) ---
    const subtotal = computeSubtotal(lineItems)
    const shippingFee = computeShipping({
      subtotal,
      deliveryMethod,
      flatRate: checkoutConfig.flatShippingAUD,
      freeThreshold: checkoutConfig.freeShippingThresholdAUD,
    })
    const total = subtotal + shippingFee
    const amount = Math.round(total * 100)
    if (amount < 50) {
      return res.status(400).json({ error: 'Order total is below the minimum.' })
    }
```

Replace it with:

```js
    // --- Recompute the amount (server is authoritative) ---
    const subtotal = computeSubtotal(lineItems)
    const shippingFee = computeShipping({
      subtotal,
      deliveryMethod,
      flatRate: checkoutConfig.flatShippingAUD,
      freeThreshold: checkoutConfig.freeShippingThresholdAUD,
    })

    // --- Apply the coupon, if any (re-validated here — never trust the browser) ---
    let discount = 0
    let shippingAfterCoupon = shippingFee
    let appliedCoupon = null
    if (couponCode) {
      const coupon = findCoupon(String(couponCode))
      const { valid, reason } = validateCoupon(coupon, new Date())
      if (!valid) {
        return res.status(400).json({
          error:
            reason === 'expired'
              ? 'That coupon code has expired.'
              : 'We could not apply that coupon code.',
        })
      }
      const result = applyCoupon({ coupon, subtotal, shipping: shippingFee })
      discount = result.discount
      shippingAfterCoupon = result.shippingAfter
      appliedCoupon = coupon
    }

    const total = subtotal - discount + shippingAfterCoupon
    const amount = Math.round(total * 100)
    if (amount < 50) {
      return res.status(400).json({ error: 'Order total is below the minimum.' })
    }
```

- [ ] **Step 4: Record the coupon in the PaymentIntent metadata**

Find the `metadata` object inside `params`:

```js
      metadata: {
        order_ref: orderRef,
        items: itemSummary,
        delivery_method: deliveryMethod,
        delivery_date: String(deliveryDate || '').slice(0, 40),
        customer_name: String(customer.name || '').slice(0, 100),
        customer_phone: String(customer.phone || '').slice(0, 40),
        notes: String(notes || '').slice(0, 480),
        subtotal: subtotal.toFixed(2),
        shipping_fee: shippingFee.toFixed(2),
        total: total.toFixed(2),
      },
```

Replace it with:

```js
      metadata: {
        order_ref: orderRef,
        items: itemSummary,
        delivery_method: deliveryMethod,
        delivery_date: String(deliveryDate || '').slice(0, 40),
        customer_name: String(customer.name || '').slice(0, 100),
        customer_phone: String(customer.phone || '').slice(0, 40),
        notes: String(notes || '').slice(0, 480),
        subtotal: subtotal.toFixed(2),
        coupon_code: appliedCoupon ? appliedCoupon.code : '',
        coupon_label: appliedCoupon ? appliedCoupon.label : '',
        discount: discount.toFixed(2),
        shipping_fee: shippingAfterCoupon.toFixed(2),
        total: total.toFixed(2),
      },
```

Note: `shipping_fee` now records the shipping actually charged (0 when a free-shipping coupon applied).

- [ ] **Step 5: Return the coupon details to the browser**

Find the success response:

```js
    res.json({
      clientSecret: intent.client_secret,
      amount: total,
      subtotal,
      shippingFee,
      orderRef,
    })
```

Replace it with:

```js
    res.json({
      clientSecret: intent.client_secret,
      amount: total,
      subtotal,
      shippingFee: shippingAfterCoupon,
      discount,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      couponLabel: appliedCoupon ? appliedCoupon.label : null,
      orderRef,
    })
```

- [ ] **Step 6: Verify the server file parses**

Run: `node --check server.js`
Expected: no output, exit code 0.

- [ ] **Step 7: Commit**

```bash
git add server.js
git commit -m "$(cat <<'EOF'
Apply and re-validate coupon codes server-side

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Show the discount in the owner email

**Files:**
- Modify: `src/lib/order-email.js:39-46` (the totals lines in `buildLines`)

- [ ] **Step 1: Add the coupon and discount lines**

In `src/lib/order-email.js`, find:

```js
  lines.push(
    '',
    `Subtotal:  ${money(m.subtotal)}`,
    `Shipping:  ${money(m.shipping_fee)}`,
    `Total:     ${money(m.total)}`,
  )

  return lines
```

Replace it with:

```js
  lines.push('', `Subtotal:  ${money(m.subtotal)}`)

  if (m.coupon_code) {
    lines.push(
      `Coupon:    ${m.coupon_code}${m.coupon_label ? ` (${m.coupon_label})` : ''}`,
    )
  }
  if (m.discount && Number(m.discount) > 0) {
    lines.push(`Discount:  -${money(m.discount)}`)
  }

  lines.push(
    `Shipping:  ${money(m.shipping_fee)}`,
    `Total:     ${money(m.total)}`,
  )

  return lines
```

- [ ] **Step 2: Verify the file parses**

Run: `node --check src/lib/order-email.js`
Expected: no output, exit code 0.

- [ ] **Step 3: Commit**

```bash
git add src/lib/order-email.js
git commit -m "$(cat <<'EOF'
Show the coupon discount in the order email

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Coupon UI in the checkout summary

**Files:**
- Modify: `src/config/theme.config.js:6-31` (add an `error` color)
- Modify: `src/pages/CheckoutPage.jsx`
- Modify: `src/components/checkout/CheckoutSummary.jsx` (full rewrite below)
- Modify: `src/components/checkout/CheckoutSummary.css` (append styles)

- [ ] **Step 1: Add an `error` color token**

In `src/config/theme.config.js`, find the `border-strong` line in `colors`:

```js
    border: 'rgba(0, 0, 0, 0.08)',
    'border-strong': 'rgba(0, 0, 0, 0.16)',
```

Replace with:

```js
    border: 'rgba(0, 0, 0, 0.08)',
    'border-strong': 'rgba(0, 0, 0, 0.16)',
    // Muted rose-red for inline form errors — pastel, not harsh.
    error: '#B23A48',
```

`applyTheme.js` flattens this to the `--color-error` custom property automatically.

- [ ] **Step 2: Add coupon state to `CheckoutPage`**

In `src/pages/CheckoutPage.jsx`, find the imports:

```js
import { computeShipping, computeTotal } from '../lib/cart-totals.js'
import { isTestMode } from '../lib/stripe.js'
```

Replace with:

```js
import { computeShipping } from '../lib/cart-totals.js'
import { findCoupon, validateCoupon, applyCoupon } from '../lib/coupons.js'
import { isTestMode } from '../lib/stripe.js'
```

(`computeTotal` is dropped — the total is now computed with the coupon applied.)

Find:

```js
  const [deliveryMethod, setDeliveryMethod] = useState('delivery')
  // null while filling in details; set once the server opens a PaymentIntent.
  const [intent, setIntent] = useState(null)
```

Replace with:

```js
  const [deliveryMethod, setDeliveryMethod] = useState('delivery')
  // The applied coupon object, or null. One coupon per transaction —
  // applying another replaces this one.
  const [coupon, setCoupon] = useState(null)
  // null while filling in details; set once the server opens a PaymentIntent.
  const [intent, setIntent] = useState(null)

  const couponCopy = checkout.summary.coupon

  // Validate a typed code and, if good, store it. Returns { error } on
  // failure so CheckoutSummary can show an inline message.
  const applyCouponCode = (rawCode) => {
    const found = findCoupon(rawCode)
    if (!found) return { error: couponCopy.errors.unknown }
    const { valid } = validateCoupon(found, new Date())
    if (!valid) return { error: couponCopy.errors.expired }
    setCoupon(found)
    return { ok: true }
  }
```

Find:

```js
  const shipping = computeShipping({
    subtotal,
    deliveryMethod,
    flatRate: config.flatShippingAUD,
    freeThreshold: config.freeShippingThresholdAUD,
  })
  const total = computeTotal({ subtotal, shipping })
```

Replace with:

```js
  const baseShipping = computeShipping({
    subtotal,
    deliveryMethod,
    flatRate: config.flatShippingAUD,
    freeThreshold: config.freeShippingThresholdAUD,
  })
  const { discount, shippingAfter: shipping } = applyCoupon({
    coupon,
    subtotal,
    shipping: baseShipping,
  })
  const total = subtotal - discount + shipping
```

Find the `<CheckoutSummary ... />` element:

```js
            <CheckoutSummary
              items={items}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              deliveryMethod={deliveryMethod}
            />
```

Replace with:

```js
            <CheckoutSummary
              items={items}
              subtotal={subtotal}
              shipping={shipping}
              discount={discount}
              total={total}
              coupon={coupon}
              deliveryMethod={deliveryMethod}
              onApplyCoupon={applyCouponCode}
              onRemoveCoupon={() => setCoupon(null)}
            />
```

Find the `<CheckoutForm ... />` element:

```js
                <CheckoutForm
                  deliveryMethod={deliveryMethod}
                  onDeliveryMethodChange={setDeliveryMethod}
                  onIntentReady={setIntent}
                />
```

Replace with:

```js
                <CheckoutForm
                  deliveryMethod={deliveryMethod}
                  coupon={coupon}
                  onDeliveryMethodChange={setDeliveryMethod}
                  onIntentReady={setIntent}
                />
```

- [ ] **Step 3: Rewrite `CheckoutSummary` with the coupon UI**

Replace the entire contents of `src/components/checkout/CheckoutSummary.jsx` with:

```jsx
import { useState } from 'react'
import { checkout } from '../../content/checkout.js'
import { formatAUD } from '../../lib/money.js'
import CartLineItem from '../CartLineItem.jsx'
import './CheckoutSummary.css'

export default function CheckoutSummary({
  items,
  subtotal,
  shipping,
  discount = 0,
  total,
  coupon = null,
  deliveryMethod,
  onApplyCoupon,
  onRemoveCoupon,
}) {
  const { summary } = checkout
  const couponCopy = summary.coupon

  const [code, setCode] = useState('')
  const [error, setError] = useState(null)

  const shippingLabel = () => {
    if (deliveryMethod === 'pickup') return summary.pickup
    if (shipping === 0) return summary.shippingFree
    return formatAUD(shipping)
  }

  const handleApply = (e) => {
    e.preventDefault()
    const trimmed = code.trim()
    if (!trimmed) {
      setError(couponCopy.errors.empty)
      return
    }
    const result = onApplyCoupon(trimmed)
    if (result?.error) {
      setError(result.error)
      return
    }
    setError(null)
    setCode('')
  }

  const handleRemove = () => {
    onRemoveCoupon()
    setError(null)
  }

  return (
    <aside className="checkout-summary">
      <h2 className="checkout-summary__heading">{summary.heading}</h2>

      <div className="checkout-summary__items">
        {items.map((item) => (
          <CartLineItem key={item.slug} item={item} compact />
        ))}
      </div>

      <div className="checkout-summary__coupon">
        {coupon ? (
          <div className="checkout-summary__coupon-applied">
            <span>
              <strong>{coupon.code}</strong> — {coupon.label} {couponCopy.applied}
            </span>
            <button type="button" onClick={handleRemove}>
              {couponCopy.remove}
            </button>
          </div>
        ) : (
          <form className="checkout-summary__coupon-form" onSubmit={handleApply}>
            <label className="checkout-summary__coupon-label" htmlFor="coupon-code">
              {couponCopy.label}
            </label>
            <div className="checkout-summary__coupon-row">
              <input
                id="coupon-code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={couponCopy.placeholder}
                autoComplete="off"
              />
              <button type="submit">{couponCopy.apply}</button>
            </div>
          </form>
        )}
        {error && (
          <p className="checkout-summary__coupon-error" role="alert">
            {error}
          </p>
        )}
      </div>

      <dl className="checkout-summary__totals">
        <div>
          <dt>{summary.subtotal}</dt>
          <dd>{formatAUD(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className="checkout-summary__discount">
            <dt>
              {couponCopy.discountLabel}
              {coupon ? ` (${coupon.code})` : ''}
            </dt>
            <dd>−{formatAUD(discount)}</dd>
          </div>
        )}
        <div>
          <dt>{summary.shipping}</dt>
          <dd>{shippingLabel()}</dd>
        </div>
        <div className="checkout-summary__total">
          <dt>{summary.total}</dt>
          <dd>{formatAUD(total)}</dd>
        </div>
      </dl>
    </aside>
  )
}
```

- [ ] **Step 4: Append the coupon styles**

Append this to the end of `src/components/checkout/CheckoutSummary.css`:

```css
.checkout-summary__coupon {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border);
}

.checkout-summary__coupon-label {
  font-size: 13px;
  color: var(--color-text-soft);
}

.checkout-summary__coupon-row {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.checkout-summary__coupon-row input {
  flex: 1;
  min-width: 0;
  padding: 10px 12px;
  font: inherit;
  font-size: 14px;
  color: var(--color-text);
  background: var(--color-bg);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
}

.checkout-summary__coupon-row button {
  flex-shrink: 0;
  padding: 10px 18px;
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-accent-deep);
  background: var(--color-bg);
  border: 1px solid var(--color-accent-deep);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.checkout-summary__coupon-row button:hover {
  background: var(--color-accent-light);
}

.checkout-summary__coupon-applied {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--color-text);
}

.checkout-summary__coupon-applied button {
  flex-shrink: 0;
  padding: 0;
  font: inherit;
  font-size: 13px;
  color: var(--color-text-soft);
  background: none;
  border: none;
  text-decoration: underline;
  cursor: pointer;
}

.checkout-summary__coupon-error {
  margin: 0;
  font-size: 13px;
  color: var(--color-error);
}

.checkout-summary__discount dd {
  color: var(--color-accent-deep);
}
```

- [ ] **Step 5: Verify the build compiles**

Run: `yarn build`
Expected: build succeeds with no errors.

- [ ] **Step 6: Commit**

```bash
git add src/config/theme.config.js src/pages/CheckoutPage.jsx src/components/checkout/CheckoutSummary.jsx src/components/checkout/CheckoutSummary.css
git commit -m "$(cat <<'EOF'
Add coupon code field to the checkout summary

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Send the coupon from the checkout form

**Files:**
- Modify: `src/components/checkout/CheckoutForm.jsx`

- [ ] **Step 1: Accept the `coupon` prop**

In `src/components/checkout/CheckoutForm.jsx`, find:

```js
export default function CheckoutForm({ deliveryMethod, onDeliveryMethodChange, onIntentReady }) {
```

Replace with:

```js
export default function CheckoutForm({
  deliveryMethod,
  coupon = null,
  onDeliveryMethodChange,
  onIntentReady,
}) {
```

- [ ] **Step 2: Include `couponCode` in the request payload**

Find:

```js
    const payload = {
      items: items.map((i) => ({ slug: i.slug, quantity: i.quantity, note: i.note })),
      deliveryMethod,
      customer: { name: form.name, email: form.email, phone: form.phone },
      shipping: address || {},
      notes: form.notes,
      idempotencyKey: crypto.randomUUID(),
    }
```

Replace with:

```js
    const payload = {
      items: items.map((i) => ({ slug: i.slug, quantity: i.quantity, note: i.note })),
      deliveryMethod,
      customer: { name: form.name, email: form.email, phone: form.phone },
      shipping: address || {},
      notes: form.notes,
      couponCode: coupon ? coupon.code : undefined,
      idempotencyKey: crypto.randomUUID(),
    }
```

- [ ] **Step 3: Carry the discount into the `order` summary**

Find:

```js
      const order = {
        contact: { name: form.name, email: form.email, phone: form.phone },
        deliveryMethod,
        address,
        notes: form.notes,
        items,
        totals: {
          subtotal: data.subtotal,
          shipping: data.shippingFee,
          total: data.amount,
        },
        placedAt: new Date().toISOString(),
      }
```

Replace with:

```js
      const order = {
        contact: { name: form.name, email: form.email, phone: form.phone },
        deliveryMethod,
        address,
        notes: form.notes,
        items,
        totals: {
          subtotal: data.subtotal,
          shipping: data.shippingFee,
          discount: data.discount || 0,
          total: data.amount,
          coupon: data.couponCode
            ? { code: data.couponCode, label: data.couponLabel }
            : null,
        },
        placedAt: new Date().toISOString(),
      }
```

- [ ] **Step 4: Verify the build compiles**

Run: `yarn build`
Expected: build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/checkout/CheckoutForm.jsx
git commit -m "$(cat <<'EOF'
Send the applied coupon code with the checkout request

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Show the discount on the order confirmation

**Files:**
- Modify: `src/pages/OrderConfirmationPage.jsx` (the full-summary totals, lines ~237-256)

- [ ] **Step 1: Add a discount row to the full-summary totals**

In `src/pages/OrderConfirmationPage.jsx`, find the `order-page__totals` block in the "Full summary" return:

```jsx
            <dl className="order-page__totals">
              <div>
                <dt>Subtotal</dt>
                <dd>{formatAUD(totals.subtotal)}</dd>
              </div>
              <div>
                <dt>Shipping</dt>
                <dd>
                  {isPickup
                    ? confirmation.pickupLabel
                    : totals.shipping === 0
                    ? 'Free'
                    : formatAUD(totals.shipping)}
                </dd>
              </div>
              <div className="order-page__total">
                <dt>Total paid</dt>
                <dd>{formatAUD(totals.total)}</dd>
              </div>
            </dl>
```

Replace it with:

```jsx
            <dl className="order-page__totals">
              <div>
                <dt>Subtotal</dt>
                <dd>{formatAUD(totals.subtotal)}</dd>
              </div>
              {totals.discount > 0 && (
                <div>
                  <dt>
                    Discount
                    {totals.coupon ? ` (${totals.coupon.code})` : ''}
                  </dt>
                  <dd>−{formatAUD(totals.discount)}</dd>
                </div>
              )}
              <div>
                <dt>Shipping</dt>
                <dd>
                  {isPickup
                    ? confirmation.pickupLabel
                    : totals.shipping === 0
                    ? 'Free'
                    : formatAUD(totals.shipping)}
                </dd>
              </div>
              <div className="order-page__total">
                <dt>Total paid</dt>
                <dd>{formatAUD(totals.total)}</dd>
              </div>
            </dl>
```

- [ ] **Step 2: Verify the build compiles**

Run: `yarn build`
Expected: build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/OrderConfirmationPage.jsx
git commit -m "$(cat <<'EOF'
Show the coupon discount on the order confirmation

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Run the unit tests**

Run: `yarn test`
Expected: PASS — all `coupons.test.js` tests green.

- [ ] **Step 2: Production build**

Run: `yarn build`
Expected: build succeeds, no errors.

- [ ] **Step 3: Manual checkout walkthrough**

Run: `yarn dev`, then in the browser:

1. Add an item to the cart and go to `/checkout`.
2. In the order summary, enter `SPRING10` → Apply. Confirm: a **Discount (SPRING10)** row appears, the total drops by 10% of the subtotal, and the applied chip shows "SPRING10 — 10% off applied".
3. Enter `WELCOME5` → Apply. Confirm it **replaces** SPRING10 (one coupon per transaction) and the total drops by $5.
4. Enter `FREESHIP` → Apply. Confirm the Shipping row reads **Free** and no Discount row shows.
5. Enter `BOGUS` → Apply. Confirm the inline error "We don't recognise that code." and no change to totals.
6. Click **Remove**. Confirm the coupon field returns and totals reset.
7. Apply `SPRING10`, fill in the form, click "Continue to payment". Confirm the **Pay** button shows the discounted total, and the confirmation page (after a test-card payment) shows the Discount row.

- [ ] **Step 4: Confirm no uncommitted changes remain**

Run: `git status`
Expected: clean working tree (all task commits made).

---

## Self-Review Notes

- **Spec coverage:** config file (Task 2), shared logic (Task 3), three discount types + expiry (Task 3), server authority + re-validation (Task 5), one-coupon-per-transaction (Task 7, `setCoupon` replaces), checkout-page-only entry (Task 7), copy in content (Task 4), email + confirmation display (Tasks 6, 9). All spec sections map to a task.
- **Pre-existing `computeShipping` bug** (param name mismatch) is left untouched per the spec — out of scope.
- **No usage limits / DB** — not implemented, matches the spec's out-of-scope list.

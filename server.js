// Soft Florals payment server.
//
// A deliberately small Node/Express server. Two jobs:
//   1. POST /api/create-payment-intent — create a Stripe PaymentIntent for a cart.
//   2. In production, serve the built SPA from dist/.
//
// The server is the authority on price: the browser only sends { slug, quantity }.
// We look every slug up in the catalogue and recompute the amount here, so a
// tampered cart in localStorage can never change what the customer is charged.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import Stripe from 'stripe'

import { products } from './src/content/products.js'
import { addons } from './src/content/addons.js'
import { checkoutConfig } from './src/config/checkout.config.js'
import { computeSubtotal, computeShipping } from './src/lib/cart-totals.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// --- Minimal .env loader (no dependency). On Railway, env vars come from the
// platform and no .env file exists, so this simply no-ops. ---
function loadDotEnv() {
  const envPath = path.join(__dirname, '.env')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!match) continue
    const key = match[1]
    let value = match[2].trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = value
  }
}
loadDotEnv()

const PORT = process.env.PORT || 8787
const IS_PROD = process.env.NODE_ENV === 'production'
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

if (!STRIPE_SECRET_KEY) {
  const msg =
    'STRIPE_SECRET_KEY is not set. Add it to .env (dev) or the Railway variables (prod).'
  if (IS_PROD) {
    console.error(`[server] FATAL: ${msg}`)
    process.exit(1)
  }
  console.warn(`[server] WARNING: ${msg} /api/create-payment-intent will return 503.`)
} else if (IS_PROD && STRIPE_SECRET_KEY.startsWith('sk_test_')) {
  const allowTestKeys = process.env.ALLOW_TEST_KEYS === 'true'
  if (!allowTestKeys) {
    console.error('[server] FATAL: a Stripe TEST key is set in production. Use a live key.')
    process.exit(1)
  }
  console.warn('[server] WARNING: Stripe test key is in use in production (ALLOW_TEST_KEYS=true).')
}

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null

// --- Catalogue: flatten every purchasable slug into one price lookup. ---
const catalogue = new Map()
for (const item of products.items) {
  catalogue.set(item.slug, { name: item.name, price: item.price })
}
for (const addon of addons.items) {
  catalogue.set(addon.slug, { name: addon.name, price: addon.price })
}
if (addons.cardOnly) {
  catalogue.set(addons.cardOnly.slug, {
    name: addons.cardOnly.name,
    price: addons.cardOnly.price,
  })
}

const app = express()
app.use(express.json({ limit: '64kb' }))

app.get('/api/health', (req, res) => {
  res.json({ ok: true, stripe: Boolean(stripe) })
})

app.post('/api/create-payment-intent', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({ error: 'Payments are not configured yet.' })
    }

    const {
      items,
      deliveryMethod,
      customer = {},
      shipping = {},
      deliveryDate,
      notes,
      idempotencyKey,
    } = req.body || {}

    // --- Validate the cart ---
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Your cart is empty.' })
    }
    const lineItems = []
    for (const entry of items) {
      const found = catalogue.get(entry?.slug)
      if (!found) {
        return res.status(400).json({ error: `Unknown item: ${entry?.slug}` })
      }
      const quantity = Math.floor(Number(entry?.quantity))
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        return res.status(400).json({ error: `Invalid quantity for ${found.name}.` })
      }
      lineItems.push({ slug: entry.slug, name: found.name, price: found.price, quantity })
    }

    if (deliveryMethod !== 'delivery' && deliveryMethod !== 'pickup') {
      return res.status(400).json({ error: 'Choose a delivery method.' })
    }
    if (deliveryMethod === 'pickup' && !checkoutConfig.pickupEnabled) {
      return res.status(400).json({ error: 'Pickup is not available.' })
    }

    const email = String(customer.email || '').trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'A valid email is required.' })
    }

    if (deliveryMethod === 'delivery') {
      const missing = ['street', 'suburb', 'state', 'postcode'].filter(
        (f) => !String(shipping[f] || '').trim(),
      )
      if (missing.length) {
        return res.status(400).json({ error: 'A complete delivery address is required.' })
      }
    }

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

    const orderRef = `SF-${Date.now().toString(36).toUpperCase()}`
    const itemSummary = lineItems
      .map((li) => `${li.name} x${li.quantity}`)
      .join(', ')
      .slice(0, 480)

    const params = {
      amount,
      currency: checkoutConfig.currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
      receipt_email: email,
      description: `Soft Florals ${orderRef} — ${itemSummary}`,
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
    }

    if (deliveryMethod === 'delivery') {
      params.shipping = {
        name: String(customer.name || '').slice(0, 100) || 'Soft Florals customer',
        phone: String(customer.phone || '').slice(0, 40) || undefined,
        address: {
          line1: String(shipping.street).slice(0, 200),
          city: String(shipping.suburb).slice(0, 100),
          state: String(shipping.state).slice(0, 40),
          postal_code: String(shipping.postcode).slice(0, 16),
          country: 'AU',
        },
      }
    }

    const options =
      typeof idempotencyKey === 'string' && idempotencyKey
        ? { idempotencyKey }
        : undefined
    const intent = await stripe.paymentIntents.create(params, options)

    res.json({
      clientSecret: intent.client_secret,
      amount: total,
      subtotal,
      shippingFee,
      orderRef,
    })
  } catch (err) {
    console.error('[server] create-payment-intent failed:', err?.message || err)
    res.status(500).json({ error: 'We could not start the payment. Please try again.' })
  }
})

// --- Production: serve the built SPA. In dev, Vite serves the app itself. ---
const distDir = path.join(__dirname, 'dist')
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir))
  app.use((req, res) => {
    res.sendFile(path.join(distDir, 'index.html'))
  })
} else {
  console.warn('[server] dist/ not found — API-only mode (expected in dev).')
}

app.listen(PORT, () => {
  console.log(`[server] listening on :${PORT} (stripe ${stripe ? 'ready' : 'OFF'})`)
})

// Stripe.js loader — one shared promise for the whole app.
// The publishable key is safe to ship to the browser; the secret key is not
// and lives only on the server (see server.js).

import { loadStripe } from '@stripe/stripe-js'

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

export const stripePromise = publishableKey ? loadStripe(publishableKey) : null

export const stripeConfigured = Boolean(publishableKey)

import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import SEO from '../lib/seo.jsx'
import CheckoutForm from '../components/checkout/CheckoutForm.jsx'
import CheckoutSummary from '../components/checkout/CheckoutSummary.jsx'
import PaymentStep from '../components/checkout/PaymentStep.jsx'
import { useCart } from '../context/CartContext.jsx'
import { site } from '../config/site.config.js'
import { checkout } from '../content/checkout.js'
import { computeShipping, computeTotal } from '../lib/cart-totals.js'
import { isTestMode } from '../lib/stripe.js'
import './CheckoutPage.css'

export default function CheckoutPage() {
  const { items, subtotal } = useCart()
  const { checkout: config } = site
  const { page, testMode } = checkout

  const [deliveryMethod, setDeliveryMethod] = useState('delivery')
  // null while filling in details; set once the server opens a PaymentIntent.
  const [intent, setIntent] = useState(null)

  // Once a PaymentIntent is open, the cart may empty mid-payment — don't
  // bounce to /cart while a payment is in progress.
  if (items.length === 0 && !intent) {
    return <Navigate to="/cart" replace />
  }

  const shipping = computeShipping({
    subtotal,
    deliveryMethod,
    flatRate: config.flatShippingAUD,
    freeThreshold: config.freeShippingThresholdAUD,
  })
  const total = computeTotal({ subtotal, shipping })

  const onPayment = Boolean(intent)

  return (
    <main className="checkout-page">
      <SEO title={page.seoTitle} path="/checkout" />

      <section className="checkout-page__section section">
        <div className="container">
          {isTestMode && (
            <p className="checkout-page__test-banner" role="status">
              {testMode.banner}
            </p>
          )}

          <div className="checkout-page__head">
            <span className="section-eyebrow">{page.eyebrow}</span>
            <h1 className="section-label">{page.heading}</h1>
            <p className="section-sub">{page.sub}</p>
          </div>

          <div className="checkout-page__grid">
            <div className="checkout-page__main">
              {/* The form stays mounted (just hidden) during payment so
                  "Edit details" returns to it with everything still filled. */}
              <div hidden={onPayment}>
                <CheckoutForm
                  deliveryMethod={deliveryMethod}
                  onDeliveryMethodChange={setDeliveryMethod}
                  onIntentReady={setIntent}
                />
              </div>

              {onPayment && (
                <PaymentStep
                  clientSecret={intent.clientSecret}
                  order={intent.order}
                  orderRef={intent.orderRef}
                  total={intent.total}
                  onEdit={() => setIntent(null)}
                />
              )}

              <Link to="/cart" className="checkout-page__back">
                ← Back to cart
              </Link>
            </div>

            <CheckoutSummary
              items={items}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              deliveryMethod={deliveryMethod}
            />
          </div>
        </div>
      </section>
    </main>
  )
}

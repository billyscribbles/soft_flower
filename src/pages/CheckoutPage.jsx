import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import SEO from '../lib/seo.jsx'
import CheckoutForm from '../components/checkout/CheckoutForm.jsx'
import CheckoutSummary from '../components/checkout/CheckoutSummary.jsx'
import PaymentStep from '../components/checkout/PaymentStep.jsx'
import { useCart } from '../context/CartContext.jsx'
import { site } from '../config/site.config.js'
import { checkout } from '../content/checkout.js'
import { computeShipping } from '../lib/cart-totals.js'
import { findCoupon, validateCoupon, applyCoupon } from '../lib/coupons.js'
import { isTestMode } from '../lib/stripe.js'
import './CheckoutPage.css'

export default function CheckoutPage() {
  const { items, subtotal } = useCart()
  const { checkout: config } = site
  const { page, testMode } = checkout

  const [deliveryMethod, setDeliveryMethod] = useState('standard')
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

  // Once a PaymentIntent is open, the cart may empty mid-payment — don't
  // bounce to /cart while a payment is in progress.
  if (items.length === 0 && !intent) {
    return <Navigate to="/cart" replace />
  }

  const baseShipping = computeShipping({
    subtotal,
    deliveryMethod,
    standardRate: config.standardShippingAUD,
    expressRate: config.expressShippingAUD,
    freeThreshold: config.freeShippingThresholdAUD,
  })
  const { discount, shippingAfter: shipping } = applyCoupon({
    coupon,
    subtotal,
    shipping: baseShipping,
  })
  const total = subtotal - discount + shipping

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
                  coupon={coupon}
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
              discount={discount}
              total={total}
              coupon={coupon}
              deliveryMethod={deliveryMethod}
              onApplyCoupon={applyCouponCode}
              onRemoveCoupon={() => setCoupon(null)}
            />
          </div>
        </div>
      </section>
    </main>
  )
}

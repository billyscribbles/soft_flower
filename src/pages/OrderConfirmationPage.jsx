import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SEO from '../lib/seo.jsx'
import { checkout } from '../content/checkout.js'
import { formatAUD } from '../lib/money.js'
import { useCart } from '../context/CartContext.jsx'
import { stripePromise } from '../lib/stripe.js'
import './OrderConfirmationPage.css'

export default function OrderConfirmationPage() {
  const { state } = useLocation()
  const { confirmation } = checkout
  const { clearCart } = useCart()

  const order = state?.order
  const reference = state?.reference

  // Recovery path: a redirect-based payment lands here without router state,
  // but with Stripe's params in the URL. Verify the PaymentIntent and rebuild
  // a summary from its metadata.
  const [recovered, setRecovered] = useState(null)
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    if (order) return
    const params = new URLSearchParams(window.location.search)
    const clientSecret = params.get('payment_intent_client_secret')
    if (!clientSecret || !stripePromise) return

    let active = true
    setVerifying(true)
    stripePromise
      .then((stripe) => stripe.retrievePaymentIntent(clientSecret))
      .then(({ paymentIntent }) => {
        if (!active) return
        if (paymentIntent?.status === 'succeeded') {
          const m = paymentIntent.metadata || {}
          setRecovered({
            reference: m.order_ref || paymentIntent.id,
            items: m.items || '',
            deliveryMethod: m.delivery_method || '',
            total: Number(m.total) || paymentIntent.amount / 100,
            shipping: paymentIntent.shipping || null,
          })
          clearCart()
        }
        setVerifying(false)
      })
      .catch(() => active && setVerifying(false))

    return () => {
      active = false
    }
    // Mount-only: clearCart's identity changes when the cart updates, and
    // re-running this effect would re-verify the PaymentIntent in a loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // --- Verifying a redirect-based payment ---
  if (!order && verifying) {
    return (
      <main className="order-page">
        <SEO title="Order confirmation" path="/order/thanks" />
        <section className="order-page__section section">
          <div className="container order-page__inner">
            <div className="order-page__fallback">
              <p className="section-sub">{confirmation.verifying}</p>
            </div>
          </div>
        </section>
      </main>
    )
  }

  // --- Recovered summary (redirect-based payment) ---
  if (!order && recovered) {
    const isPickup = recovered.deliveryMethod === 'pickup'
    return (
      <main className="order-page">
        <SEO title="Thank you" path="/order/thanks" />
        <section className="order-page__section section">
          <div className="container order-page__inner">
            <div className="order-page__head">
              <span className="section-eyebrow">{confirmation.eyebrow}</span>
              <h1 className="section-label">{confirmation.heading}</h1>
              <p className="section-sub">{confirmation.sub}</p>
              <p className="order-page__ref">
                <span>{confirmation.referenceLabel}</span>
                <code>{recovered.reference}</code>
              </p>
            </div>

            <div className="order-page__card">
              <dl className="order-page__meta">
                <div>
                  <dt>{confirmation.deliveryLabel}</dt>
                  <dd>
                    {confirmation.methodLabels[recovered.deliveryMethod] ||
                      confirmation.deliveryLabel}
                  </dd>
                </div>
                {recovered.shipping?.address && !isPickup && (
                  <div className="order-page__address">
                    <dt>{confirmation.addressLabel}</dt>
                    <dd>
                      {recovered.shipping.address.line1}
                      <br />
                      {recovered.shipping.address.city}{' '}
                      {recovered.shipping.address.state}{' '}
                      {recovered.shipping.address.postal_code}
                    </dd>
                  </div>
                )}
                {recovered.items && (
                  <div className="order-page__notes">
                    <dt>Items</dt>
                    <dd>{recovered.items}</dd>
                  </div>
                )}
              </dl>

              <dl className="order-page__totals">
                <div className="order-page__total">
                  <dt>Total paid</dt>
                  <dd>{formatAUD(recovered.total)}</dd>
                </div>
              </dl>
            </div>

            <Link to={confirmation.ctaTo} className="order-page__cta">
              {confirmation.ctaLabel} →
            </Link>
          </div>
        </section>
      </main>
    )
  }

  // --- No order at all ---
  if (!order) {
    return (
      <main className="order-page">
        <SEO title="Order confirmation" path="/order/thanks" />
        <section className="order-page__section section">
          <div className="container order-page__inner">
            <div className="order-page__fallback">
              <h1 className="section-label">{confirmation.fallback.heading}</h1>
              <p className="section-sub">{confirmation.fallback.body}</p>
              <Link to={confirmation.fallback.ctaTo} className="order-page__cta">
                {confirmation.fallback.ctaLabel} →
              </Link>
            </div>
          </div>
        </section>
      </main>
    )
  }

  // --- Full summary (in-page card payment) ---
  const { contact, address, deliveryMethod, items, totals } = order
  const isPickup = deliveryMethod === 'pickup'

  return (
    <main className="order-page">
      <SEO title="Thank you" path="/order/thanks" />

      <section className="order-page__section section">
        <div className="container order-page__inner">
          <div className="order-page__head">
            <span className="section-eyebrow">{confirmation.eyebrow}</span>
            <h1 className="section-label">{confirmation.heading}</h1>
            <p className="section-sub">{confirmation.sub}</p>
            {reference && (
              <p className="order-page__ref">
                <span>{confirmation.referenceLabel}</span>
                <code>{reference}</code>
              </p>
            )}
          </div>

          <div className="order-page__card">
            <dl className="order-page__meta">
              <div>
                <dt>Name</dt>
                <dd>{contact?.name}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{contact?.email}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{contact?.phone}</dd>
              </div>
              <div>
                <dt>{confirmation.deliveryLabel}</dt>
                <dd>
                  {confirmation.methodLabels[deliveryMethod] ||
                    confirmation.deliveryLabel}
                </dd>
              </div>
              {address && !isPickup && (
                <div className="order-page__address">
                  <dt>{confirmation.addressLabel}</dt>
                  <dd>
                    {address.street}
                    <br />
                    {address.suburb} {address.state} {address.postcode}
                  </dd>
                </div>
              )}
            </dl>

            <div className="order-page__items">
              {items.map((item) => (
                <div key={item.slug} className="order-page__line">
                  <div className="order-page__line-name">
                    <span>{item.name}</span>
                    <span className="order-page__line-qty">× {item.quantity}</span>
                    {item.note && (
                      <span className="order-page__line-note">“{item.note}”</span>
                    )}
                  </div>
                  <span className="order-page__line-price">
                    {formatAUD(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

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
          </div>

          <Link to={confirmation.ctaTo} className="order-page__cta">
            {confirmation.ctaLabel} →
          </Link>
        </div>
      </section>
    </main>
  )
}

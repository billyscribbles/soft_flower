import { Link, useLocation } from 'react-router-dom'
import SEO from '../lib/seo.jsx'
import { checkout } from '../content/checkout.js'
import { formatAUD } from '../lib/money.js'
import './OrderConfirmationPage.css'

function formatDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('en-AU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

export default function OrderConfirmationPage() {
  const { state } = useLocation()
  const { order, reference } = state || {}
  const { confirmation } = checkout

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

  const { contact, address, deliveryMethod, deliveryDate, notes, items, totals } = order
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
                <dd>{isPickup ? confirmation.pickupLabel : 'Delivery'}</dd>
              </div>
              <div>
                <dt>{confirmation.dateLabel}</dt>
                <dd>{formatDate(deliveryDate)}</dd>
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
              {notes && (
                <div className="order-page__notes">
                  <dt>{confirmation.notesLabel}</dt>
                  <dd>{notes}</dd>
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
                <dt>Total</dt>
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

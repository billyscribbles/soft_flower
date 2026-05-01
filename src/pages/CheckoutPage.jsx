import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import SEO from '../lib/seo.jsx'
import Contact from '../components/Contact.jsx'
import { useCart } from '../context/CartContext.jsx'
import { checkout } from '../content/checkout.js'
import { formatAUD } from '../lib/money.js'
import './CheckoutPage.css'

export default function CheckoutPage() {
  const { items, subtotal } = useCart()
  const [showForm, setShowForm] = useState(false)

  if (items.length === 0) {
    return <Navigate to="/cart" replace />
  }

  const cartParam = items.map((i) => `${i.slug}:${i.quantity}`).join(',')
  const { comingSoon } = checkout

  return (
    <main className="checkout-page">
      <SEO title={comingSoon.seoTitle} path="/checkout" />

      <section className="checkout-page__section section">
        <div className="container">
          <div className="checkout-page__banner">{comingSoon.banner}</div>

          <div className="checkout-page__head">
            <span className="section-eyebrow">{comingSoon.eyebrow}</span>
            <h1 className="section-label">{comingSoon.heading}</h1>
            <p className="section-sub">{comingSoon.sub}</p>
          </div>

          <div className="checkout-page__panel">
            <h2 className="checkout-page__panel-heading">{comingSoon.wishlistHeading}</h2>
            <ul className="checkout-page__items">
              {items.map((item) => (
                <li key={item.slug} className="checkout-page__item">
                  <span className="checkout-page__item-name">
                    {item.name}
                    <span className="checkout-page__item-qty"> × {item.quantity}</span>
                  </span>
                  <span className="checkout-page__item-price">
                    {formatAUD(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="checkout-page__subtotal">
              <span>
                {checkout.summary.subtotal}
                <sup className="checkout-page__subtotal-mark">*</sup>
              </span>
              <span>{formatAUD(subtotal)}</span>
            </div>
            <p className="checkout-page__subtotal-note">{checkout.summary.subtotalNote}</p>

            {!showForm && (
              <button
                type="button"
                className="checkout-page__cta"
                onClick={() => setShowForm(true)}
              >
                {comingSoon.nextCta}
              </button>
            )}

            <Link to="/cart" className="checkout-page__back">
              ← Back to cart
            </Link>
          </div>
        </div>
      </section>

      {showForm && (
        <Contact
          tone="plain"
          cartParam={cartParam}
          autoFocusName
          hideHead
          includeAddress
        />
      )}
    </main>
  )
}

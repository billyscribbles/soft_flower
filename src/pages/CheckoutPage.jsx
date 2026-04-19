import { useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import SEO from '../lib/seo.jsx'
import CheckoutForm from '../components/checkout/CheckoutForm.jsx'
import CheckoutSummary from '../components/checkout/CheckoutSummary.jsx'
import { useCart } from '../context/CartContext.jsx'
import { site } from '../config/site.config.js'
import { checkout } from '../content/checkout.js'
import { computeShipping, computeTotal } from '../lib/cart-totals.js'
import './CheckoutPage.css'

export default function CheckoutPage() {
  const { items, subtotal } = useCart()
  const [deliveryMethod, setDeliveryMethod] = useState('delivery')

  if (items.length === 0) {
    return <Navigate to="/cart" replace />
  }

  const { checkout: config } = site

  const shipping = useMemo(
    () =>
      computeShipping({
        subtotal,
        deliveryMethod,
        flatRate: config.flatShippingAUD,
        freeThreshold: config.freeShippingThresholdAUD,
      }),
    [subtotal, deliveryMethod, config.flatShippingAUD, config.freeShippingThresholdAUD],
  )
  const total = computeTotal({ subtotal, shipping })

  return (
    <main className="checkout-page">
      <SEO title="Checkout" path="/checkout" />

      <section className="checkout-page__section section">
        <div className="container">
          <div className="checkout-page__head">
            <span className="section-eyebrow">{checkout.page.eyebrow}</span>
            <h1 className="section-label">{checkout.page.heading}</h1>
            <p className="section-sub">{checkout.page.sub}</p>
            <Link to="/cart" className="checkout-page__back">
              ← Back to cart
            </Link>
          </div>

          <div className="checkout-page__grid">
            <CheckoutForm
              deliveryMethod={deliveryMethod}
              onDeliveryMethodChange={setDeliveryMethod}
              shipping={shipping}
              total={total}
            />
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

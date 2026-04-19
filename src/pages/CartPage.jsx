import { Link } from 'react-router-dom'
import SEO from '../lib/seo.jsx'
import CartLineItem from '../components/CartLineItem.jsx'
import { useCart } from '../context/CartContext.jsx'
import { checkout } from '../content/checkout.js'
import { formatAUD } from '../lib/money.js'
import './CartPage.css'

export default function CartPage() {
  const { items, subtotal } = useCart()
  const isEmpty = items.length === 0

  return (
    <main className="cart-page">
      <SEO title="Cart" path="/cart" />

      <section className="cart-page__section section">
        <div className="container cart-page__inner">
          <div className="cart-page__head">
            <span className="section-eyebrow">{checkout.cart.eyebrow}</span>
            <h1 className="section-label">{checkout.cart.heading}</h1>
            {!isEmpty && <p className="section-sub">{checkout.cart.sub}</p>}
          </div>

          {isEmpty ? (
            <div className="cart-page__empty">
              <p className="cart-page__empty-heading">{checkout.cart.empty.heading}</p>
              <p className="cart-page__empty-body">{checkout.cart.empty.body}</p>
              <Link to={checkout.cart.empty.ctaTo} className="cart-page__empty-cta">
                {checkout.cart.empty.ctaLabel} →
              </Link>
            </div>
          ) : (
            <div className="cart-page__grid">
              <div className="cart-page__items">
                {items.map((item) => (
                  <CartLineItem key={item.slug} item={item} />
                ))}
              </div>

              <aside className="cart-page__summary">
                <div className="cart-page__subtotal">
                  <span>{checkout.cart.subtotalLabel}</span>
                  <span>{formatAUD(subtotal)}</span>
                </div>
                <p className="cart-page__note">{checkout.cart.subtotalNote}</p>
                <Link to="/checkout" className="cart-page__checkout">
                  {checkout.cart.checkoutCta}
                </Link>
                <Link to="/shop" className="cart-page__continue">
                  {checkout.cart.continueCta}
                </Link>
              </aside>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

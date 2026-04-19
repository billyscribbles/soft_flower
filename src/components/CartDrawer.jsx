import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { checkout } from '../content/checkout.js'
import { formatAUD } from '../lib/money.js'
import CartLineItem from './CartLineItem.jsx'
import './CartDrawer.css'

export default function CartDrawer() {
  const { items, isOpen, closeDrawer, subtotal } = useCart()

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') closeDrawer() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, closeDrawer])

  return (
    <div
      className={`cart-drawer${isOpen ? ' cart-drawer--open' : ''}`}
      aria-hidden={!isOpen}
    >
      <div
        className="cart-drawer__scrim"
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <aside
        className="cart-drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Cart"
      >
        <header className="cart-drawer__head">
          <h2 className="cart-drawer__heading">{checkout.drawer.heading}</h2>
          <button
            type="button"
            className="cart-drawer__close"
            onClick={closeDrawer}
            aria-label={checkout.drawer.close}
          >
            <X size={20} strokeWidth={1.6} />
          </button>
        </header>

        <div className="cart-drawer__body">
          {items.length === 0 ? (
            <div className="cart-drawer__empty">
              <p>{checkout.cart.empty.heading}</p>
              <Link
                to={checkout.cart.empty.ctaTo}
                className="cart-drawer__empty-cta"
                onClick={closeDrawer}
              >
                {checkout.cart.empty.ctaLabel} →
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <CartLineItem key={item.slug} item={item} compact />
            ))
          )}
        </div>

        {items.length > 0 && (
          <footer className="cart-drawer__foot">
            <div className="cart-drawer__subtotal">
              <span>{checkout.cart.subtotalLabel}</span>
              <span>{formatAUD(subtotal)}</span>
            </div>
            <p className="cart-drawer__note">{checkout.cart.subtotalNote}</p>
            <div className="cart-drawer__actions">
              <Link
                to="/cart"
                className="cart-drawer__secondary"
                onClick={closeDrawer}
              >
                {checkout.drawer.viewCart}
              </Link>
              <Link
                to="/checkout"
                className="cart-drawer__primary"
                onClick={closeDrawer}
              >
                {checkout.drawer.checkout}
              </Link>
            </div>
          </footer>
        )}
      </aside>
    </div>
  )
}

import { useState } from 'react'
import { checkout } from '../../content/checkout.js'
import { formatAUD } from '../../lib/money.js'
import CartLineItem from '../CartLineItem.jsx'
import './CheckoutSummary.css'

export default function CheckoutSummary({
  items,
  subtotal,
  shipping,
  discount = 0,
  total,
  coupon = null,
  deliveryMethod,
  onApplyCoupon,
  onRemoveCoupon,
}) {
  const { summary } = checkout
  const couponCopy = summary.coupon

  const [code, setCode] = useState('')
  const [error, setError] = useState(null)

  const shippingLabel = () => {
    if (deliveryMethod === 'pickup') return summary.pickup
    if (shipping === 0) return summary.shippingFree
    return formatAUD(shipping)
  }

  const handleApply = (e) => {
    e.preventDefault()
    const trimmed = code.trim()
    if (!trimmed) {
      setError(couponCopy.errors.empty)
      return
    }
    const result = onApplyCoupon(trimmed)
    if (result?.error) {
      setError(result.error)
      return
    }
    setError(null)
    setCode('')
  }

  const handleRemove = () => {
    onRemoveCoupon()
    setError(null)
  }

  return (
    <aside className="checkout-summary">
      <h2 className="checkout-summary__heading">{summary.heading}</h2>

      <div className="checkout-summary__items">
        {items.map((item) => (
          <CartLineItem key={item.slug} item={item} compact />
        ))}
      </div>

      <div className="checkout-summary__coupon">
        {coupon ? (
          <div className="checkout-summary__coupon-applied">
            <span>
              <strong>{coupon.code}</strong> — {coupon.label} {couponCopy.applied}
            </span>
            <button type="button" onClick={handleRemove}>
              {couponCopy.remove}
            </button>
          </div>
        ) : (
          <form className="checkout-summary__coupon-form" onSubmit={handleApply}>
            <label className="checkout-summary__coupon-label" htmlFor="coupon-code">
              {couponCopy.label}
            </label>
            <div className="checkout-summary__coupon-row">
              <input
                id="coupon-code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={couponCopy.placeholder}
                autoComplete="off"
              />
              <button type="submit">{couponCopy.apply}</button>
            </div>
          </form>
        )}
        {error && (
          <p className="checkout-summary__coupon-error" role="alert">
            {error}
          </p>
        )}
      </div>

      <dl className="checkout-summary__totals">
        <div>
          <dt>{summary.subtotal}</dt>
          <dd>{formatAUD(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className="checkout-summary__discount">
            <dt>
              {couponCopy.discountLabel}
              {coupon ? ` (${coupon.code})` : ''}
            </dt>
            <dd>−{formatAUD(discount)}</dd>
          </div>
        )}
        <div>
          <dt>{summary.shipping}</dt>
          <dd>{shippingLabel()}</dd>
        </div>
        <div className="checkout-summary__total">
          <dt>{summary.total}</dt>
          <dd>{formatAUD(total)}</dd>
        </div>
      </dl>
    </aside>
  )
}

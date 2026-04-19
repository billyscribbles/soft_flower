import { checkout } from '../../content/checkout.js'
import { formatAUD } from '../../lib/money.js'
import CartLineItem from '../CartLineItem.jsx'
import './CheckoutSummary.css'

export default function CheckoutSummary({ items, subtotal, shipping, total, deliveryMethod }) {
  const { summary } = checkout

  const shippingLabel = () => {
    if (deliveryMethod === 'pickup') return summary.pickup
    if (shipping === 0) return summary.shippingFree
    return formatAUD(shipping)
  }

  return (
    <aside className="checkout-summary">
      <h2 className="checkout-summary__heading">{summary.heading}</h2>

      <div className="checkout-summary__items">
        {items.map((item) => (
          <CartLineItem key={item.slug} item={item} compact />
        ))}
      </div>

      <dl className="checkout-summary__totals">
        <div>
          <dt>{summary.subtotal}</dt>
          <dd>{formatAUD(subtotal)}</dd>
        </div>
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

import { Minus, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { formatAUD } from '../lib/money.js'
import './CartLineItem.css'

export default function CartLineItem({ item, compact = false }) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className={`line-item${compact ? ' line-item--compact' : ''}`}>
      <Link to={`/shop/${item.slug}`} className="line-item__media">
        <img src={item.image} alt={item.name} loading="lazy" />
      </Link>

      <div className="line-item__body">
        <div className="line-item__head">
          <Link to={`/shop/${item.slug}`} className="line-item__name">
            {item.name}
          </Link>
          <span className="line-item__price">{formatAUD(item.price * item.quantity)}</span>
        </div>
        <span className="line-item__unit">{formatAUD(item.price)} each</span>

        {item.note && (
          <p className="line-item__note">
            <span className="line-item__note-label">Note:</span> “{item.note}”
          </p>
        )}

        <div className="line-item__controls">
          <div className="line-item__stepper" role="group" aria-label={`Quantity for ${item.name}`}>
            <button
              type="button"
              onClick={() => updateQuantity(item.slug, item.quantity - 1)}
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus size={14} strokeWidth={1.8} />
            </button>
            <span aria-live="polite">{item.quantity}</span>
            <button
              type="button"
              onClick={() => updateQuantity(item.slug, item.quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus size={14} strokeWidth={1.8} />
            </button>
          </div>

          <button
            type="button"
            className="line-item__remove"
            onClick={() => removeItem(item.slug)}
            aria-label={`Remove ${item.name} from cart`}
          >
            <Trash2 size={15} strokeWidth={1.6} />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'

export default function CartIcon({ className = 'navbar__cart', label = 'Open cart' }) {
  const { itemCount, openDrawer } = useCart()

  return (
    <button
      type="button"
      className={className}
      onClick={openDrawer}
      aria-label={`${label} (${itemCount} ${itemCount === 1 ? 'item' : 'items'})`}
    >
      <ShoppingBag size={20} strokeWidth={1.6} />
      {itemCount > 0 && (
        <span className="navbar__cart-count" aria-hidden="true">
          {itemCount}
        </span>
      )}
    </button>
  )
}

// Keep a Link alternative for places (like mobile menu) where we want a nav,
// not a drawer toggle.
export function CartLink({ className = 'navbar__cart', to = '/cart', label = 'View cart' }) {
  const { itemCount } = useCart()
  return (
    <Link
      to={to}
      className={className}
      aria-label={`${label} (${itemCount} ${itemCount === 1 ? 'item' : 'items'})`}
    >
      <ShoppingBag size={20} strokeWidth={1.6} />
      {itemCount > 0 && (
        <span className="navbar__cart-count" aria-hidden="true">
          {itemCount}
        </span>
      )}
    </Link>
  )
}

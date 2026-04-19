import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { computeSubtotal } from '../lib/cart-totals.js'

const STORAGE_KEY = 'soft_flowers_cart_v1'

const CartContext = createContext(null)

function readFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed?.items) ? parsed.items : []
  } catch {
    return []
  }
}

function writeToStorage(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, updatedAt: Date.now() }))
  } catch {
    // private-mode Safari or quota exceeded — cart just becomes session-only.
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const { product, quantity, note } = action
      const existing = state.find((i) => i.slug === product.slug)
      if (existing) {
        return state.map((i) =>
          i.slug === product.slug
            ? {
                ...i,
                quantity: i.quantity + quantity,
                ...(note !== undefined ? { note } : {}),
              }
            : i,
        )
      }
      return [
        ...state,
        {
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
          ...(note ? { note } : {}),
        },
      ]
    }
    case 'remove':
      return state.filter((i) => i.slug !== action.slug)
    case 'setQuantity': {
      const qty = Math.max(1, Math.floor(action.quantity))
      return state.map((i) => (i.slug === action.slug ? { ...i, quantity: qty } : i))
    }
    case 'clear':
      return []
    case 'hydrate':
      return Array.isArray(action.items) ? action.items : []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], readFromStorage)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    writeToStorage(items)
  }, [items])

  const value = useMemo(() => {
    const subtotal = computeSubtotal(items)
    const itemCount = items.reduce((n, i) => n + i.quantity, 0)
    return {
      items,
      itemCount,
      subtotal,
      isOpen,
      addItem: (product, quantity = 1, opts = {}) => {
        dispatch({ type: 'add', product, quantity, note: opts.note })
        setIsOpen(true)
      },
      removeItem: (slug) => dispatch({ type: 'remove', slug }),
      updateQuantity: (slug, quantity) => dispatch({ type: 'setQuantity', slug, quantity }),
      clearCart: () => dispatch({ type: 'clear' }),
      openDrawer: () => setIsOpen(true),
      closeDrawer: () => setIsOpen(false),
    }
  }, [items, isOpen])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}

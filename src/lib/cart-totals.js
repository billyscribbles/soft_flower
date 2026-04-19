export function computeSubtotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export function computeShipping({ subtotal, deliveryMethod, flatRate, freeThreshold }) {
  if (deliveryMethod === 'pickup') return 0
  if (subtotal >= freeThreshold) return 0
  return flatRate
}

export function computeTotal({ subtotal, shipping }) {
  return subtotal + shipping
}

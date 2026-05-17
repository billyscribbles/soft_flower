export function computeSubtotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export function computeShipping({
  subtotal,
  deliveryMethod,
  standardRate,
  expressRate,
  freeThreshold,
}) {
  if (deliveryMethod === 'pickup') return 0
  // Express is a flat priority rate — the free-shipping threshold never applies.
  if (deliveryMethod === 'express') return expressRate
  if (subtotal >= freeThreshold) return 0
  return standardRate
}

export function computeTotal({ subtotal, shipping }) {
  return subtotal + shipping
}

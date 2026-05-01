import { site } from '../config/site.config.js'
import { formatAUD } from './money.js'

function generateReference() {
  return `SF-${Date.now().toString(36).toUpperCase()}`
}

function formatAddress(address) {
  if (!address) return ''
  return `${address.street}, ${address.suburb} ${address.state} ${address.postcode}`
}

function formatItems(items) {
  return items
    .map((it) => {
      const lineTotal = formatAUD(it.price * it.quantity)
      const noteLine = it.note ? `\n  Note: "${it.note}"` : ''
      return `• ${it.name} × ${it.quantity} — ${lineTotal}${noteLine}`
    })
    .join('\n')
}

function buildSummary(order, reference) {
  const lines = [
    `Reference: ${reference}`,
    `Placed: ${order.placedAt}`,
    '',
    'Customer',
    `  ${order.contact.name}`,
    `  ${order.contact.email}`,
    `  ${order.contact.phone}`,
    '',
    `Delivery: ${order.deliveryMethod}`,
  ]
  if (order.address) lines.push(`Address: ${formatAddress(order.address)}`)
  lines.push(`Date: ${order.deliveryDate}`)
  if (order.notes?.trim()) lines.push('', 'Notes:', `  ${order.notes.trim()}`)
  lines.push('', 'Items:', formatItems(order.items))
  lines.push(
    '',
    `Subtotal: ${formatAUD(order.totals.subtotal)}`,
    `Shipping: ${formatAUD(order.totals.shipping)}`,
    `Total: ${formatAUD(order.totals.total)}`,
  )
  return lines.join('\n')
}

export async function submitOrder(order) {
  const reference = generateReference()
  const formspreeId = site.integrations.formspreeId

  if (!formspreeId) {
    return { ok: false, error: 'Order submission is not configured yet.', reference }
  }

  const body = new FormData()
  body.append('_subject', `New order — ${reference}`)
  body.append('reference', reference)
  body.append('name', order.contact.name)
  body.append('email', order.contact.email)
  body.append('phone', order.contact.phone)
  body.append('delivery_method', order.deliveryMethod)
  if (order.address) body.append('address', formatAddress(order.address))
  body.append('delivery_date', order.deliveryDate)
  if (order.notes?.trim()) body.append('customer_notes', order.notes.trim())
  body.append('items_summary', formatItems(order.items))
  body.append('subtotal', formatAUD(order.totals.subtotal))
  body.append('shipping', formatAUD(order.totals.shipping))
  body.append('total', formatAUD(order.totals.total))
  body.append('order_json', JSON.stringify(order))
  body.append('summary', buildSummary(order, reference))

  try {
    const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
      method: 'POST',
      body,
      headers: { Accept: 'application/json' },
    })
    if (res.ok) return { ok: true, reference, order }
    return { ok: false, error: 'We couldn’t send your order. Please try again or email us directly.', reference }
  } catch (err) {
    return { ok: false, error: err?.message || 'Network error', reference }
  }
}

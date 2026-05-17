// Order notification email — server-only.
//
// Called from server.js when a Stripe `payment_intent.succeeded` webhook
// arrives. Formats the order (all of it already lives on the PaymentIntent)
// and emails the shop owner via Resend.
//
// No SDK dependency: a plain fetch to the Resend API keeps this in step with
// the rest of the server (which also avoids non-essential dependencies).

const RESEND_ENDPOINT = 'https://api.resend.com/emails'

// Amounts in PaymentIntent metadata are already formatted strings ("123.00").
function money(value) {
  return `$${value || '0.00'}`
}

function buildLines(pi) {
  const m = pi.metadata || {}
  const lines = [
    `Order:     ${m.order_ref || '(no ref)'}`,
    `Items:     ${m.items || '(none listed)'}`,
    '',
    `Customer:  ${m.customer_name || '(no name)'}`,
    `Email:     ${pi.receipt_email || '(no email)'}`,
    `Phone:     ${m.customer_phone || '(no phone)'}`,
    '',
    `Delivery:  ${m.delivery_method || '(unknown)'}`,
  ]

  if (m.delivery_date) lines.push(`Preferred: ${m.delivery_date}`)

  if (m.delivery_method === 'delivery' && pi.shipping?.address) {
    const a = pi.shipping.address
    lines.push(
      `Address:   ${a.line1 || ''}, ${a.city || ''} ${a.state || ''} ${a.postal_code || ''}`.trim(),
    )
  }

  if (m.notes) lines.push('', `Notes:     ${m.notes}`)

  lines.push(
    '',
    `Subtotal:  ${money(m.subtotal)}`,
    `Shipping:  ${money(m.shipping_fee)}`,
    `Total:     ${money(m.total)}`,
  )

  return lines
}

// Sends the order email. Throws on a missing config or a non-2xx Resend
// response so the caller (the webhook) can return a non-2xx and let Stripe
// retry delivery.
export async function sendOrderEmail(paymentIntent) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set — cannot send the order email.')
  }

  // onboarding@resend.dev is Resend's shared sender — it works with no domain
  // verification, but only delivers to the email that owns the Resend account.
  // Set ORDER_EMAIL_FROM to an address on a verified domain to change that.
  const from = process.env.ORDER_EMAIL_FROM || 'onboarding@resend.dev'
  const to = process.env.ORDER_EMAIL_TO || 'hello.softflorals@gmail.com'

  const m = paymentIntent.metadata || {}
  const lines = buildLines(paymentIntent)
  const text = lines.join('\n')
  const html = `<pre style="font:14px/1.6 ui-monospace,Menlo,monospace">${lines
    .join('\n')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')}</pre>`

  const res = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: paymentIntent.receipt_email || undefined,
      subject: `New order ${m.order_ref || ''} — Soft Florals`.trim(),
      text,
      html,
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Resend responded ${res.status}: ${detail.slice(0, 200)}`)
  }
}

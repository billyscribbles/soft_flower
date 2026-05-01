import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { site } from '../config/site.config.js'
import { products } from '../content/products.js'
import { addons } from '../content/addons.js'
import './Contact.css'

function buildPrefill(productSlug, addonSlugs, cartParam) {
  const cartItems = cartParam
    ? cartParam
        .split(',')
        .map((entry) => {
          const [slug, qtyRaw] = entry.split(':')
          const product = products.items.find((p) => p.slug === slug)
          if (!product) return null
          const quantity = Math.max(1, parseInt(qtyRaw, 10) || 1)
          return { product, quantity }
        })
        .filter(Boolean)
    : []

  const product = productSlug
    ? products.items.find((p) => p.slug === productSlug)
    : null
  const pickedAddons = addonSlugs
    .map((slug) => addons.items.find((a) => a.slug === slug))
    .filter(Boolean)

  if (!product && pickedAddons.length === 0 && cartItems.length === 0) {
    return { message: '', subject: null }
  }

  const lines = ["Hi! I'd love to order:"]
  let cartTotal = 0
  for (const { product: p, quantity } of cartItems) {
    const lineTotal = p.price * quantity
    cartTotal += lineTotal
    lines.push(`• ${p.name} × ${quantity} ($${lineTotal})`)
  }
  if (product) lines.push(`• ${product.name} ($${product.price})`)
  for (const a of pickedAddons) {
    lines.push(`• + ${a.name}${a.price > 0 ? ` (+$${a.price})` : ' (free)'}`)
  }
  if (cartItems.length > 0) {
    lines.push('', `Estimated subtotal: $${cartTotal} (final invoice will confirm shipping).`)
  }
  lines.push('', '')

  let subject
  if (cartItems.length > 0) {
    subject = `Custom order request — ${cartItems.length} item${cartItems.length > 1 ? 's' : ''}`
  } else if (product) {
    subject = `New enquiry — ${product.name}`
  } else {
    subject = 'New enquiry — soft florals site'
  }

  return { message: lines.join('\n'), subject }
}

export default function Contact({ tone = 'alt' }) {
  const isAlt = tone === 'alt'
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [searchParams] = useSearchParams()
  const formspreeId = site.integrations.formspreeId

  const { message: prefilledMessage, subject: prefilledSubject } = useMemo(() => {
    const productSlug = searchParams.get('product') || ''
    const addonSlugs = (searchParams.get('addons') || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const cartParam = searchParams.get('cart') || ''
    return buildPrefill(productSlug, addonSlugs, cartParam)
  }, [searchParams])

  const subjectValue = prefilledSubject || 'New enquiry — soft florals site'

  async function handleSubmit(e) {
    e.preventDefault()
    if (!formspreeId) {
      setStatus('error')
      return
    }
    setStatus('submitting')
    const form = e.currentTarget
    const data = new FormData(form)
    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className={`contact section${isAlt ? ' section--alt' : ''}`} id="contact">
      <div className="container contact__inner">
        <div className="contact__head">
          <span className="section-eyebrow">Custom orders & hellos</span>
          <h2 className="section-label">Tell us what you're dreaming up.</h2>
          <p className="section-sub">
            Custom bouquets, wedding pieces, gift orders, or just a friendly hello — we reply within one business day.
          </p>
        </div>

        <ul className="contact__details">
          <li>
            <span>Email</span>
            <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
          </li>
          <li>
            <span>Studio</span>
            <p>{site.contact.location}</p>
          </li>
          <li>
            <span>Delivery</span>
            <p>{site.contact.delivery}</p>
          </li>
        </ul>

        <form
          key={searchParams.toString()}
          className="contact__form"
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="_subject" value={subjectValue} />
          <input
            type="text"
            name="_gotcha"
            tabIndex="-1"
            autoComplete="off"
            aria-hidden="true"
            style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
          />
          <div className="contact__row">
            <label className="contact__field">
              <span>Name</span>
              <input type="text" name="name" required />
            </label>
            <label className="contact__field">
              <span>Email</span>
              <input type="email" name="email" required />
            </label>
          </div>
          <label className="contact__field">
            <span>Message</span>
            <textarea
              name="message"
              rows="6"
              required
              defaultValue={prefilledMessage}
            />
          </label>
          <button
            type="submit"
            className="contact__submit"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Sending…' : 'Send message →'}
          </button>
          {status === 'success' && (
            <p className="contact__status contact__status--success">
              Thanks — we'll be in touch shortly.
            </p>
          )}
          {status === 'error' && (
            <p className="contact__status contact__status--error">
              Something went wrong. Email us directly at {site.contact.email}.
            </p>
          )}
        </form>
      </div>
    </section>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext.jsx'
import { site } from '../../config/site.config.js'
import { checkout } from '../../content/checkout.js'
import './CheckoutForm.css'

// Collects delivery details, then asks the server to open a Stripe
// PaymentIntent. On success it hands the clientSecret + order summary up to
// CheckoutPage, which reveals the payment step.
export default function CheckoutForm({
  deliveryMethod,
  coupon = null,
  onDeliveryMethodChange,
  onIntentReady,
}) {
  const { items } = useCart()
  const { checkout: config } = site

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    suburb: '',
    state: 'VIC',
    postcode: '',
    notes: '',
    agreeTerms: false,
  })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)

  // Pickup is the only method without a shipping address.
  const isDelivery = deliveryMethod !== 'pickup'

  const update = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'submitting') return
    if (!form.agreeTerms) return

    setStatus('submitting')
    setError(null)

    const address = isDelivery
      ? {
          street: form.street,
          suburb: form.suburb,
          state: form.state,
          postcode: form.postcode,
        }
      : null

    const payload = {
      items: items.map((i) => ({ slug: i.slug, quantity: i.quantity, note: i.note })),
      deliveryMethod,
      customer: { name: form.name, email: form.email, phone: form.phone },
      shipping: address || {},
      notes: form.notes,
      couponCode: coupon ? coupon.code : undefined,
      idempotencyKey: crypto.randomUUID(),
    }

    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok || !data.clientSecret) {
        setStatus('error')
        setError(data.error || checkout.submit.error)
        return
      }

      const order = {
        contact: { name: form.name, email: form.email, phone: form.phone },
        deliveryMethod,
        address,
        notes: form.notes,
        items,
        totals: {
          subtotal: data.subtotal,
          shipping: data.shippingFee,
          discount: data.discount || 0,
          total: data.amount,
          coupon: data.couponCode
            ? { code: data.couponCode, label: data.couponLabel }
            : null,
        },
        placedAt: new Date().toISOString(),
      }

      onIntentReady({
        clientSecret: data.clientSecret,
        orderRef: data.orderRef,
        total: data.amount,
        order,
      })
    } catch (err) {
      setStatus('error')
      setError(err?.message || checkout.submit.error)
    }
  }

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <fieldset className="checkout-form__section">
        <legend>{checkout.contact.legend}</legend>
        <div className="checkout-form__row">
          <label className="checkout-form__field">
            <span>{checkout.contact.fields.name}</span>
            <input type="text" value={form.name} onChange={update('name')} required />
          </label>
          <label className="checkout-form__field">
            <span>{checkout.contact.fields.email}</span>
            <input type="email" value={form.email} onChange={update('email')} required />
          </label>
        </div>
        <label className="checkout-form__field">
          <span>{checkout.contact.fields.phone}</span>
          <input
            type="tel"
            inputMode="tel"
            value={form.phone}
            onChange={update('phone')}
            required
          />
        </label>
      </fieldset>

      <fieldset className="checkout-form__section">
        <legend>{checkout.delivery.legend}</legend>
        <div className="checkout-form__methods">
          {checkout.delivery.options.map((opt) => {
            const comingSoon = opt.value === 'pickup' && !config.pickupEnabled
            return (
              <label
                key={opt.value}
                className={`checkout-form__method${
                  deliveryMethod === opt.value ? ' checkout-form__method--active' : ''
                }${comingSoon ? ' checkout-form__method--disabled' : ''}`}
              >
                <input
                  type="radio"
                  name="deliveryMethod"
                  value={opt.value}
                  checked={deliveryMethod === opt.value}
                  onChange={(e) => onDeliveryMethodChange(e.target.value)}
                  disabled={comingSoon}
                />
                <div>
                  <span className="checkout-form__method-label">
                    {opt.label}
                    {comingSoon && <span className="checkout-form__method-badge">Coming soon</span>}
                  </span>
                  <span className="checkout-form__method-note">
                    {comingSoon ? 'Pickup isn’t available just yet — check back soon.' : opt.note}
                  </span>
                </div>
              </label>
            )
          })}
        </div>
      </fieldset>

      {isDelivery ? (
        <fieldset className="checkout-form__section">
          <legend>{checkout.address.legend}</legend>
          <label className="checkout-form__field">
            <span>{checkout.address.fields.street}</span>
            <input
              type="text"
              value={form.street}
              onChange={update('street')}
              autoComplete="street-address"
              required
            />
          </label>
          <div className="checkout-form__row">
            <label className="checkout-form__field">
              <span>{checkout.address.fields.suburb}</span>
              <input
                type="text"
                value={form.suburb}
                onChange={update('suburb')}
                autoComplete="address-level2"
                required
              />
            </label>
            <label className="checkout-form__field">
              <span>{checkout.address.fields.state}</span>
              <select value={form.state} onChange={update('state')} required>
                {checkout.address.states.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="checkout-form__field">
              <span>{checkout.address.fields.postcode}</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{4}"
                maxLength={4}
                value={form.postcode}
                onChange={update('postcode')}
                autoComplete="postal-code"
                required
              />
            </label>
          </div>
        </fieldset>
      ) : (
        <div className="checkout-form__pickup">
          <h3>{checkout.pickup.heading}</h3>
          <p>{checkout.pickup.body}</p>
        </div>
      )}

      <fieldset className="checkout-form__section">
        <legend>{checkout.notes.label}</legend>
        <textarea
          className="checkout-form__textarea"
          rows={4}
          placeholder={checkout.notes.placeholder}
          value={form.notes}
          onChange={update('notes')}
        />
      </fieldset>

      <label className="checkout-form__terms">
        <input
          type="checkbox"
          checked={form.agreeTerms}
          onChange={update('agreeTerms')}
          required
        />
        <span>
          {checkout.terms.label}{' '}
          <Link to={checkout.terms.linkTo}>{checkout.terms.linkLabel}</Link>.
        </span>
      </label>

      <button
        type="submit"
        className="checkout-form__submit"
        disabled={!form.agreeTerms || status === 'submitting'}
      >
        {status === 'submitting' ? checkout.submit.submitting : checkout.submit.idle}
      </button>

      {status === 'error' && error && (
        <p className="checkout-form__error">{error}</p>
      )}
    </form>
  )
}

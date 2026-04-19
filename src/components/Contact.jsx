import { useState } from 'react'
import { site } from '../config/site.config.js'
import './Contact.css'

export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const formspreeId = site.integrations.formspreeId

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
    <section className="contact section section--alt" id="contact">
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
            <span>Phone</span>
            <a href={`tel:${site.contact.phone.replace(/\s+/g, '')}`}>{site.contact.phone}</a>
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

        <form className="contact__form" onSubmit={handleSubmit}>
          <input type="hidden" name="_subject" value="New enquiry — soft flowers site" />
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
            <textarea name="message" rows="5" required />
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

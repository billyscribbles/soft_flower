import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { site } from '../config/site.config.js'
import { events } from '../content/events.js'
import './EventInquiry.css'

const EventInquiry = forwardRef(function EventInquiry(_, ref) {
  const [status, setStatus] = useState('idle')
  const [eventType, setEventType] = useState(events.items[0].id)
  const sectionRef = useRef(null)
  const formspreeId = site.integrations.formspreeId

  useImperativeHandle(ref, () => ({
    setEventType: (id) => {
      if (events.items.some((e) => e.id === id)) setEventType(id)
    },
    scrollIntoView: () => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    },
  }))

  const selected = events.items.find((e) => e.id === eventType) || events.items[0]
  const subjectValue = `Event inquiry — ${selected.title}`

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
    <section
      ref={sectionRef}
      className="event-inquiry section section--alt"
      id="inquire"
    >
      <div className="container event-inquiry__inner">
        <div className="event-inquiry__head">
          <span className="section-eyebrow">Enquire</span>
          <h2 className="section-label">Tell us about your day.</h2>
          <p className="section-sub">
            Share a few details and we&apos;ll reply within one business day with ideas and a quote.
          </p>
        </div>

        <form className="event-inquiry__form" onSubmit={handleSubmit}>
          <input type="hidden" name="_subject" value={subjectValue} />
          <input
            type="text"
            name="_gotcha"
            tabIndex="-1"
            autoComplete="off"
            aria-hidden="true"
            style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
          />

          <div className="event-inquiry__row">
            <label className="event-inquiry__field">
              <span>Name</span>
              <input type="text" name="name" required />
            </label>
            <label className="event-inquiry__field">
              <span>Email</span>
              <input type="email" name="email" required />
            </label>
          </div>

          <div className="event-inquiry__row">
            <label className="event-inquiry__field">
              <span>Event type</span>
              <select
                name="event_type"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                required
              >
                {events.items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="event-inquiry__field">
              <span>Event date</span>
              <input type="date" name="event_date" />
              <span className="event-inquiry__hint">Not sure yet? Leave blank.</span>
            </label>
          </div>

          <label className="event-inquiry__field">
            <span>Scale / guest count</span>
            <input
              type="text"
              name="scale"
              placeholder="e.g. intimate, 100 guests, 12 tables"
            />
          </label>

          <label className="event-inquiry__field">
            <span>Vibe, colours, inspiration</span>
            <textarea
              name="vibe"
              rows="5"
              required
              placeholder="Blush and ivory, garden-style, a little wild — whatever you're picturing."
            />
          </label>

          <label className="event-inquiry__field">
            <span>Anything else</span>
            <textarea
              name="notes"
              rows="3"
              placeholder="Venue, delivery location, timelines, inspiration links…"
            />
          </label>

          <button
            type="submit"
            className="event-inquiry__submit"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Sending…' : 'Send enquiry →'}
          </button>

          {status === 'success' && (
            <p className="event-inquiry__status event-inquiry__status--success">
              Thanks — we&apos;ll be in touch shortly.
            </p>
          )}
          {status === 'error' && (
            <p className="event-inquiry__status event-inquiry__status--error">
              Something went wrong. Email us directly at {site.contact.email}.
            </p>
          )}
        </form>
      </div>
    </section>
  )
})

export default EventInquiry

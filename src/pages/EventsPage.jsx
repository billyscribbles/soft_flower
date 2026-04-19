import { useRef } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../lib/seo.jsx'
import Events from '../components/Events.jsx'
import EventInquiry from '../components/EventInquiry.jsx'

const HOW_STEPS = [
  {
    title: 'Enquire',
    body: 'Send us your event details — date, scale, vibe. We read every message personally.',
  },
  {
    title: 'Quote & design chat',
    body: 'Within one business day we reply with ideas, options, and a clear quote. Revisions are welcome.',
  },
  {
    title: 'Handmade & delivered',
    body: 'Christine twists each flower by hand in the studio. We ship or hand-deliver anywhere in Australia.',
  },
]

export default function EventsPage() {
  const inquiryRef = useRef(null)

  const handleEnquire = (eventId) => {
    inquiryRef.current?.setEventType(eventId)
    inquiryRef.current?.scrollIntoView()
  }

  return (
    <main className="events-page">
      <SEO
        title="Events & Custom Orders"
        description="Bespoke handmade pipecleaner flowers for weddings, proposals, engagements, birthdays and corporate events. Forever-keepsakes handmade in Melbourne, delivered Australia-wide."
        path="/events"
      />

      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container" style={{ maxWidth: 820, textAlign: 'center' }}>
          <span className="section-eyebrow">Bespoke events</span>
          <h1 className="section-label" style={{ marginBottom: 16 }}>
            Flowers for the moments that matter.
          </h1>
          <p className="section-sub">
            Weddings, proposals, birthdays and corporate events — handmade to your brief, kept forever.
          </p>
          <div style={{ marginTop: 28 }}>
            <Link
              to="#inquire"
              onClick={(e) => {
                e.preventDefault()
                inquiryRef.current?.scrollIntoView()
              }}
              className="hero__cta-primary"
            >
              Start an enquiry →
            </Link>
          </div>
        </div>
      </section>

      <Events onEnquire={handleEnquire} />

      <section className="section section--alt">
        <div className="container" style={{ maxWidth: 1040 }}>
          <div className="events__head" style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
            <span className="section-eyebrow">How it works</span>
            <h2 className="section-label">Simple, personal, unhurried.</h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 32,
            }}
            className="events-page__steps"
          >
            {HOW_STEPS.map((s, i) => (
              <div key={s.title}>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 14,
                    letterSpacing: '0.08em',
                    color: 'var(--color-text-soft)',
                    marginBottom: 12,
                  }}
                >
                  0{i + 1}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 20,
                    fontWeight: 500,
                    marginBottom: 8,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {s.title}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-soft)' }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EventInquiry ref={inquiryRef} />
    </main>
  )
}

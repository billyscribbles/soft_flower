import { motion } from 'framer-motion'
import { events } from '../content/events.js'
import './Events.css'

export default function Events({ onEnquire }) {
  return (
    <section className="events section">
      <div className="container">
        <div className="events__head">
          {events.eyebrow && <span className="section-eyebrow">{events.eyebrow}</span>}
          <h2 className="section-label">{events.heading}</h2>
          {events.sub && <p className="section-sub">{events.sub}</p>}
        </div>

        <div className="events__grid">
          {events.items.map((item, i) => (
            <motion.div
              key={item.id}
              className="events__card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="events__media">
                <img src={item.image} alt={item.title} loading="lazy" />
              </div>
              <div className="events__body">
                <h3 className="events__title">{item.title}</h3>
                <p className="events__blurb">{item.blurb}</p>
                <ul className="events__pieces">
                  {item.pieces.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="events__cta"
                  onClick={() => onEnquire?.(item.id)}
                >
                  Enquire →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

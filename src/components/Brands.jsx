import { motion } from 'framer-motion'
import { brands } from '../content/brands.js'
import './Brands.css'

// Tile the logo list so a single marquee group is wide enough to
// overflow even large screens — keeps the infinite loop gap-free
// no matter how few brands are in the content file.
function tile(items, min = 8) {
  if (items.length === 0) return []
  const out = []
  while (out.length < min) out.push(...items)
  return out
}

export default function Brands({ tone }) {
  const isAlt = tone === 'alt'
  const { eyebrow, heading, items } = brands
  if (!items?.length) return null

  const group = tile(items)

  return (
    <section className={`brands section${isAlt ? ' section--alt' : ''}`}>
      <div className="container">
        <motion.div
          className="brands__head"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
          <h2 className="brands__heading">{heading}</h2>
        </motion.div>
      </div>

      {/* Two identical groups scroll as one track; translating the track
          by -50% lands exactly on the start of the duplicate, so the loop
          has no visible seam. The duplicate is hidden from assistive tech. */}
      <div className="brands__marquee" aria-label="Markets and pop-ups we’ve appeared at">
        <div className="brands__track">
          <ul className="brands__group">
            {group.map((b, i) => (
              <li className="brands__item" key={`a-${i}`}>
                <div className="brands__card">
                  <img className="brands__logo" src={b.logo} alt={b.name} loading="lazy" />
                </div>
              </li>
            ))}
          </ul>
          <ul className="brands__group" aria-hidden="true">
            {group.map((b, i) => (
              <li className="brands__item" key={`b-${i}`}>
                <div className="brands__card">
                  <img className="brands__logo" src={b.logo} alt="" loading="lazy" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

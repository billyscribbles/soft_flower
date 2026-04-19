import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import './EditorialSection.css'

export default function EditorialSection({ image, alt, eyebrow, heading, body, cta, reverse = false }) {
  return (
    <section className={`editorial${reverse ? ' editorial--reverse' : ''}`}>
      <div className="editorial__media">
        <img src={image} alt={alt} loading="lazy" />
      </div>

      <motion.div
        className="editorial__content"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="editorial__content-inner">
          {eyebrow && <span className="editorial__eyebrow">{eyebrow}</span>}
          <h2 className="editorial__heading">{heading}</h2>
          {body && <p className="editorial__body">{body}</p>}
          {cta && (
            <Link to={cta.to} className="editorial__cta">
              {cta.label} →
            </Link>
          )}
        </div>
      </motion.div>
    </section>
  )
}

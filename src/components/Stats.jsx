import { motion } from 'framer-motion'
import { story } from '../content/stats.js'
import './Stats.css'

export default function Story({ tone }) {
  const isAlt = tone === 'alt'
  return (
    <section className={`story${isAlt ? ' story--alt' : ''}`}>
      <div className="container">
        <motion.div
          className="story__inner"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {story.eyebrow && <span className="section-eyebrow">{story.eyebrow}</span>}
          <h2 className="story__heading">{story.heading}</h2>
          <p className="story__body">{story.body}</p>
          {story.signature && <p className="story__signature">{story.signature}</p>}
        </motion.div>
      </div>
    </section>
  )
}

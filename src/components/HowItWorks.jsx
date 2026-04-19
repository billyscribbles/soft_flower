import { motion } from 'framer-motion'
import { howItWorks } from '../content/howItWorks.js'
import './HowItWorks.css'

export default function HowItWorks() {
  return (
    <section className="hiw section section--alt">
      <div className="container">
        <div className="hiw__head">
          {howItWorks.eyebrow && <span className="section-eyebrow">{howItWorks.eyebrow}</span>}
          <h2 className="section-label">{howItWorks.heading}</h2>
          {howItWorks.sub && <p className="section-sub">{howItWorks.sub}</p>}
        </div>

        <div className="hiw__grid">
          {howItWorks.steps.map((step, i) => (
            <motion.div
              key={step.title}
              className="hiw__step"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              {step.number && <div className="hiw__number">{step.number}</div>}
              <h3 className="hiw__title">{step.title}</h3>
              <p className="hiw__body">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

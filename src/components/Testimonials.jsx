import { motion } from 'framer-motion'
import { testimonials } from '../content/testimonials.js'
import './Testimonials.css'

export default function Testimonials() {
  return (
    <section className="testimonials section">
      <div className="container">
        <div className="testimonials__head">
          {testimonials.eyebrow && <span className="section-eyebrow">{testimonials.eyebrow}</span>}
          <h2 className="section-label">{testimonials.heading}</h2>
        </div>

        <div className="testimonials__grid">
          {testimonials.items.map((t, i) => (
            <motion.figure
              key={t.author}
              className="testimonials__card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <blockquote className="testimonials__quote">"{t.quote}"</blockquote>
              <figcaption className="testimonials__author">
                <div className="testimonials__author-name">{t.author}</div>
                <div className="testimonials__author-role">{t.role}</div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}

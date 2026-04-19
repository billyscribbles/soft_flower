import { motion } from 'framer-motion'
import { Flower, Flower2, Sparkles, Frame, Gift, Scissors, Heart, Baby, Leaf } from 'lucide-react'
import { services } from '../content/services.js'
import './Services.css'

const ICONS = { Flower, Flower2, Sparkles, Frame, Gift, Scissors, Heart, Baby, Leaf, FlowerIcon: Flower }

export default function Services() {
  return (
    <section className="services section">
      <div className="container">
        <div className="services__head">
          {services.eyebrow && <span className="section-eyebrow">{services.eyebrow}</span>}
          <h2 className="section-label">{services.heading}</h2>
          {services.sub && <p className="section-sub">{services.sub}</p>}
        </div>

        <div className="services__grid">
          {services.items.map((item, i) => {
            const Icon = ICONS[item.icon] || Sparkles
            return (
              <motion.div
                key={item.title}
                className="services__card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="services__icon">
                  <Icon size={28} strokeWidth={1.25} />
                </div>
                <h3 className="services__title">{item.title}</h3>
                <p className="services__body">{item.body}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

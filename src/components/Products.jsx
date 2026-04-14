import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { products } from '../content/products.js'
import './Products.css'

export default function Products({ featuredOnly = false, limit, excludeSlug, category, heading, sub, eyebrow }) {
  let items = products.items
  if (category) items = items.filter((p) => p.category === category)
  if (excludeSlug) items = items.filter((p) => p.slug !== excludeSlug)
  if (featuredOnly) items = items.slice(0, 6)
  if (limit) items = items.slice(0, limit)

  return (
    <section className="products section">
      <div className="container">
        <div className="products__head">
          {(eyebrow ?? products.eyebrow) && (
            <span className="section-eyebrow">{eyebrow ?? products.eyebrow}</span>
          )}
          <h2 className="section-label">{heading ?? products.heading}</h2>
          {(sub ?? products.sub) && (
            <p className="section-sub">{sub ?? products.sub}</p>
          )}
        </div>

        <div className="products__grid">
          {items.map((item, i) => (
            <motion.div
              key={item.slug}
              className="products__card glow-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to={`/shop/${item.slug}`} className="products__card-link">
                <div className="products__media">
                  <img src={item.image} alt={item.name} loading="lazy" />
                  {item.badge && <span className="products__badge">{item.badge}</span>}
                </div>
                <div className="products__body">
                  <span className="products__category">{item.category}</span>
                  <h3 className="products__title">{item.name}</h3>
                  <p className="products__blurb">{item.blurb}</p>
                  <div className="products__foot">
                    <span className="products__price">${item.price}</span>
                    <span className="products__view">View →</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { products } from '../content/products.js'
import { useCart } from '../context/CartContext.jsx'
import MediaPlaceholder from './MediaPlaceholder.jsx'
import './Products.css'

function ProductCard({ item, index, addItem }) {
  return (
    <motion.div
      className="products__card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/shop/${item.slug}`} className="products__card-link">
        <div className="products__media">
          {item.hasPhoto && item.image ? (
            <>
              <img
                className="products__media-img products__media-img--primary"
                src={item.image}
                alt={item.name}
                loading="lazy"
              />
              {item.images?.[1] && (
                <img
                  className="products__media-img products__media-img--hover"
                  src={item.images[1]}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                />
              )}
            </>
          ) : (
            <MediaPlaceholder />
          )}
        </div>
        <div className="products__body">
          <h3 className="products__title">{item.name}</h3>
          <span className="products__price">${item.price}</span>
        </div>
      </Link>
      <button
        type="button"
        className="products__add"
        onClick={() => addItem(item)}
        aria-label={`Add ${item.name} to cart`}
      >
        Add to cart
      </button>
    </motion.div>
  )
}

export default function Products({ featuredOnly = false, limit, excludeSlug, category, grouped = false, heading, sub, eyebrow, className = '', as = 'h2' }) {
  const { addItem } = useCart()
  const HeadingTag = as

  let items = products.items
  if (category) items = items.filter((p) => p.category === category)
  if (excludeSlug) items = items.filter((p) => p.slug !== excludeSlug)
  if (featuredOnly) items = items.slice(0, 4)
  if (limit) items = items.slice(0, limit)

  return (
    <section className={`products section ${className}`.trim()}>
      <div className="container">
        <div className="products__head">
          {(eyebrow ?? products.eyebrow) && (
            <span className="section-eyebrow">{eyebrow ?? products.eyebrow}</span>
          )}
          <HeadingTag className="section-label">{heading ?? products.heading}</HeadingTag>
          {(sub ?? products.sub) && (
            <p className="section-sub">{sub ?? products.sub}</p>
          )}
        </div>

        {grouped ? (
          products.groups.map((group) => {
            const groupItems = items.filter((p) => p.size === group.size)
            if (groupItems.length === 0) return null
            return (
              <div key={group.size} className="products__group">
                <div className="products__group-head">
                  <h2 className="products__group-title">{group.title}</h2>
                  {group.sub && <p className="products__group-sub">{group.sub}</p>}
                </div>
                <div className="products__grid">
                  {groupItems.map((item, i) => (
                    <ProductCard key={item.slug} item={item} index={i} addItem={addItem} />
                  ))}
                </div>
              </div>
            )
          })
        ) : (
          <div className="products__grid">
            {items.map((item, i) => (
              <ProductCard key={item.slug} item={item} index={i} addItem={addItem} />
            ))}
          </div>
        )}

        {featuredOnly && (
          <div className="products__more">
            <Link to="/shop" className="products__more-cta">
              See the whole shop →
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

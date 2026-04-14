import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDown, ArrowLeft, Heart } from 'lucide-react'
import SEO from '../lib/seo.jsx'
import Products from '../components/Products.jsx'
import Contact from '../components/Contact.jsx'
import { products } from '../content/products.js'
import './ProductPage.css'

export default function ProductPage() {
  const { slug } = useParams()
  const product = products.items.find((p) => p.slug === slug)
  const [openSection, setOpenSection] = useState(null)

  if (!product) return <Navigate to="/shop" replace />

  const toggle = (id) => setOpenSection(openSection === id ? null : id)

  return (
    <main className="product-page">
      <SEO
        title={product.name}
        description={product.blurb}
        path={`/shop/${product.slug}`}
      />

      <section className="product-page__hero section">
        <div className="container">
          <Link to="/shop" className="product-page__back">
            <ArrowLeft size={16} strokeWidth={2} /> Back to shop
          </Link>

          <div className="product-page__grid">
            <motion.div
              className="product-page__media glow-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src={product.image} alt={product.name} />
              {product.badge && (
                <span className="product-page__badge">{product.badge}</span>
              )}
            </motion.div>

            <motion.div
              className="product-page__details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="product-page__category">{product.category}</span>
              <h1 className="product-page__title">{product.name}</h1>
              <p className="product-page__blurb">{product.blurb}</p>
              <div className="product-page__price">${product.price}</div>
              <p className="product-page__desc">{product.description}</p>

              <div className="product-page__ctas">
                <Link
                  to={`/contact?product=${product.slug}`}
                  className="product-page__cta-primary"
                >
                  Add to cart →
                </Link>
                <button className="product-page__cta-secondary" aria-label="Save for later">
                  <Heart size={18} strokeWidth={1.8} />
                  Save
                </button>
              </div>

              <div className="product-page__accordion">
                {[
                  {
                    id: 'shipping',
                    title: 'Shipping & delivery',
                    body:
                      'Ready-made pieces ship in 2–3 business days. We post worldwide with tracked shipping. Every order is wrapped in soft tissue inside a cushioned box so it arrives looking perfect.',
                  },
                  {
                    id: 'care',
                    title: 'Care & longevity',
                    body:
                      'Keep your flowers out of direct sunlight to prevent fading. Dust gently with a soft brush or hairdryer on cool setting every few months. They\u2019ll stay beautiful for years.',
                  },
                  {
                    id: 'custom',
                    title: 'Custom orders',
                    body:
                      'Want this piece in different colours or a different size? Send us a message with your brief and we\u2019ll reply within one business day.',
                  },
                ].map((s) => (
                  <div key={s.id} className="product-page__acc-item">
                    <button
                      className="product-page__acc-head"
                      onClick={() => toggle(s.id)}
                      aria-expanded={openSection === s.id}
                    >
                      <span>{s.title}</span>
                      <ChevronDown
                        size={18}
                        strokeWidth={2}
                        className={`product-page__acc-icon${openSection === s.id ? ' open' : ''}`}
                      />
                    </button>
                    {openSection === s.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="product-page__acc-body"
                      >
                        {s.body}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Products
        eyebrow="You might also like"
        heading="More from the collection"
        sub={null}
        category={product.category}
        excludeSlug={product.slug}
        limit={3}
      />

      <Contact />
    </main>
  )
}

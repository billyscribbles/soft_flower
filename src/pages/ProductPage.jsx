import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ArrowLeft, Heart, Minus, Plus } from 'lucide-react'
import SEO from '../lib/seo.jsx'
import Products from '../components/Products.jsx'
import AddOns from '../components/AddOns.jsx'
import RecentlyViewed from '../components/RecentlyViewed.jsx'
import FAQ from '../components/FAQ.jsx'
import Contact from '../components/Contact.jsx'
import MediaPlaceholder from '../components/MediaPlaceholder.jsx'
import NotFoundPage from './NotFoundPage.jsx'
import { products } from '../content/products.js'
import { addons as addonsContent } from '../content/addons.js'
import { productPanels } from '../content/productPanels.js'
import { useCart } from '../context/CartContext.jsx'
import { track as trackViewed } from '../lib/recentlyViewed.js'
import { isSaved, toggle as toggleSaved } from '../lib/savedItems.js'
import './ProductPage.css'

export default function ProductPage() {
  const { slug } = useParams()
  const product = products.items.find((p) => p.slug === slug)
  const [openSection, setOpenSection] = useState(null)
  const [selectedAddons, setSelectedAddons] = useState([])
  const [addonNotes, setAddonNotes] = useState({})
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [saved, setSaved] = useState(false)
  const { addItem } = useCart()

  const gallery = product?.images?.length ? product.images : product?.image ? [product.image] : []

  useEffect(() => {
    if (product) trackViewed(product.slug)
    setSelectedAddons([])
    setAddonNotes({})
    setQuantity(1)
    setActiveImage(0)
    setSaved(product ? isSaved(product.slug) : false)
  }, [product])

  if (!product) return <NotFoundPage />

  const toggle = (id) => setOpenSection(openSection === id ? null : id)
  const toggleAddon = (addonSlug) =>
    setSelectedAddons((cur) => {
      if (cur.includes(addonSlug)) {
        setAddonNotes((notes) => {
          const { [addonSlug]: _drop, ...rest } = notes
          return rest
        })
        return cur.filter((s) => s !== addonSlug)
      }
      return [...cur, addonSlug]
    })
  const handleNoteChange = (addonSlug, value) =>
    setAddonNotes((cur) => ({ ...cur, [addonSlug]: value }))

  const handleAddToCart = () => {
    addItem(product, quantity)
    for (const addonSlug of selectedAddons) {
      const addon = addonsContent.items.find((a) => a.slug === addonSlug)
      if (!addon || addon.price <= 0) continue
      const note = addonNotes[addonSlug]?.trim() || undefined
      addItem(
        {
          slug: `addon-${addon.slug}`,
          name: addon.name,
          price: addon.price,
          image: product.image,
        },
        1,
        note ? { note } : undefined,
      )
    }
  }

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
              className="product-page__gallery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="product-page__media">
                {product.hasPhoto && gallery.length > 0 ? (
                  <img
                    key={gallery[activeImage]}
                    src={gallery[activeImage]}
                    alt={product.name}
                  />
                ) : (
                  <MediaPlaceholder />
                )}
                {product.badge && (
                  <span className="product-page__badge">{product.badge}</span>
                )}
              </div>
              {gallery.length > 1 && (
                <div className="product-page__thumbs" role="group" aria-label={`${product.name} images`}>
                  {gallery.map((src, idx) => (
                    <button
                      key={src}
                      type="button"
                      aria-pressed={activeImage === idx}
                      aria-label={`Show image ${idx + 1} of ${gallery.length}`}
                      className={`product-page__thumb${activeImage === idx ? ' is-active' : ''}`}
                      onClick={() => setActiveImage(idx)}
                      onMouseEnter={() => setActiveImage(idx)}
                    >
                      <img src={src} alt="" loading="lazy" />
                    </button>
                  ))}
                </div>
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

              <AddOns
                selected={selectedAddons}
                notes={addonNotes}
                onToggle={toggleAddon}
                onNoteChange={handleNoteChange}
              />

              <div className="product-page__quantity" role="group" aria-label="Quantity">
                <span className="product-page__quantity-label">Quantity</span>
                <div className="product-page__quantity-stepper">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} strokeWidth={1.8} />
                  </button>
                  <span aria-live="polite">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} strokeWidth={1.8} />
                  </button>
                </div>
              </div>

              <div className="product-page__ctas">
                <button
                  type="button"
                  className="product-page__cta-primary"
                  onClick={handleAddToCart}
                >
                  {selectedAddons.length > 0
                    ? `Add ${quantity + selectedAddons.length} to cart →`
                    : `Add ${quantity > 1 ? `${quantity} ` : ''}to cart →`}
                </button>
                <button
                  type="button"
                  className={`product-page__cta-secondary${saved ? ' is-saved' : ''}`}
                  onClick={() => setSaved(toggleSaved(product.slug))}
                  aria-pressed={saved}
                  aria-label={saved ? 'Remove from saved items' : 'Save for later'}
                >
                  <Heart size={18} strokeWidth={1.8} fill={saved ? 'currentColor' : 'none'} />
                  {saved ? 'Saved' : 'Save'}
                </button>
              </div>

              <div className="product-page__accordion">
                {productPanels.map((s) => (
                  <div key={s.id} className="product-page__acc-item">
                    <button
                      type="button"
                      className="product-page__acc-head"
                      onClick={() => toggle(s.id)}
                      aria-expanded={openSection === s.id}
                      aria-controls={`acc-panel-${s.id}`}
                      id={`acc-head-${s.id}`}
                    >
                      <span>{s.title}</span>
                      <ChevronDown
                        size={18}
                        strokeWidth={2}
                        className={`product-page__acc-icon${openSection === s.id ? ' open' : ''}`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {openSection === s.id && (
                        <motion.div
                          id={`acc-panel-${s.id}`}
                          role="region"
                          aria-labelledby={`acc-head-${s.id}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="product-page__acc-body"
                        >
                          {s.body}
                        </motion.div>
                      )}
                    </AnimatePresence>
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
        limit={4}
      />

      <RecentlyViewed excludeSlug={product.slug} />

      <FAQ />

      <Contact />
    </main>
  )
}

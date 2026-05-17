import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { products } from '../content/products.js'
import { get as getRecentlyViewed } from '../lib/recentlyViewed.js'
import { formatAUD } from '../lib/money.js'
import MediaPlaceholder from './MediaPlaceholder.jsx'
import './RecentlyViewed.css'

export default function RecentlyViewed({ excludeSlug, limit = 4 }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    const slugs = getRecentlyViewed(excludeSlug).slice(0, limit)
    const matched = slugs
      .map((slug) => products.items.find((p) => p.slug === slug))
      .filter(Boolean)
    setItems(matched)
  }, [excludeSlug, limit])

  if (items.length === 0) return null

  return (
    <section className="recently section">
      <div className="container">
        <div className="recently__head">
          <h2 className="recently__heading">Recently viewed</h2>
        </div>
        <div className="recently__grid">
          {items.map((item) => (
            <Link
              key={item.slug}
              to={`/shop/${item.slug}`}
              className="recently__card"
            >
              <div className="recently__media">
                {item.hasPhoto && item.image ? (
                  <img src={item.image} alt={item.name} loading="lazy" />
                ) : (
                  <MediaPlaceholder />
                )}
              </div>
              <div className="recently__body">
                <h3 className="recently__title">{item.name}</h3>
                <span className="recently__price">{formatAUD(item.price)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

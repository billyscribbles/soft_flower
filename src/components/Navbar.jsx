import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Instagram } from 'lucide-react'
import { site } from '../config/site.config.js'
import CartIcon, { CartLink } from './CartIcon.jsx'
import './Navbar.css'

function TikTokIcon({ size = 18, strokeWidth = 1.8 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  const { brand, nav, cta, banner, social } = site
  const messages = banner?.messages ?? []
  const durationSec = banner?.durationSec ?? 60

  return (
    <header className={`navbar${scrolled ? ' scrolled' : ''}`}>
      {banner?.enabled && messages.length > 0 && (
        <div className="navbar__banner" role="region" aria-label="Site announcement">
          <div
            className="navbar__banner-track"
            style={{ animationDuration: `${durationSec}s` }}
          >
            {[...messages, ...messages].map((m, i) => (
              <span key={i} className="navbar__banner-item" aria-hidden={i >= messages.length || undefined}>
                {m}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo" aria-label={brand.name}>
          {brand.logoSrc ? (
            <img src={brand.logoSrc} alt={brand.name} className="navbar__logo-img" />
          ) : (
            <>
              {brand.logoText}
              <span className="navbar__logo-dot" aria-hidden="true" />
            </>
          )}
        </Link>

        <nav className="navbar__links" aria-label="Main navigation">
          {nav.map((l) => (
            <Link key={l.to} to={l.to} className="navbar__link">{l.label}</Link>
          ))}
          <div className="navbar__socials">
            {social?.instagram && (
              <a
                href={social.instagram}
                className="navbar__social"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram size={18} strokeWidth={1.6} />
              </a>
            )}
            {social?.tiktok && (
              <a
                href={social.tiktok}
                className="navbar__social"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
              >
                <TikTokIcon size={18} strokeWidth={1.6} />
              </a>
            )}
          </div>
          {cta && (
            <Link to={cta.to}>
              <button className="navbar__cta">{cta.label}</button>
            </Link>
          )}
        </nav>

        <div className="navbar__right">
          <CartIcon />
          <button
            className={`navbar__hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <nav
        className={`navbar__mobile${menuOpen ? ' open' : ''}`}
        aria-label="Mobile navigation"
      >
        {nav.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="navbar__mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            {l.label}
          </Link>
        ))}
        {cta && (
          <Link to={cta.to} onClick={() => setMenuOpen(false)}>
            <button className="navbar__mobile-cta">{cta.label}</button>
          </Link>
        )}
        <CartLink
          className="navbar__mobile-cart"
          to="/cart"
          label="Go to cart"
        />
      </nav>
    </header>
  )
}

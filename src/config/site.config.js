// Single source of truth for brand identity, nav, SEO, integrations.
// Every new site starts by editing this file.

import { checkoutConfig } from './checkout.config.js'

export const site = {
  banner: {
    enabled: true,
    durationSec: 60,
    messages: [
      'Free shipping on all Australian orders over $150 ✿',
      'Custom orders open — wedding pieces, gifts, anniversaries',
      'Handmade in Melbourne · Ships Australia-wide',
      'Every flower twisted by hand · Lasts forever',
    ],
  },

  brand: {
    name: 'soft florals',
    logoText: 'soft florals',
    tagline: 'Handmade forever flowers — twisted, shaped, and styled by hand in our studio.',
    // Optional image logo — if set, Navbar/Footer render this instead of logoText.
    logoSrc: '/brand/logo.png',
  },

  nav: [
    { label: 'Shop', to: '/shop' },
    { label: 'Events', to: '/events' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ],

  cta: {
    label: 'Shop now',
    to: '/shop',
  },

  footer: {
    columns: [
      {
        title: 'Shop',
        links: [
          { label: 'All flowers', to: '/shop' },
          { label: 'Bouquets', to: '/shop' },
        ],
      },
      {
        title: 'Studio',
        links: [
          { label: 'Our story', to: '/about' },
          { label: 'Custom orders', to: '/events' },
          { label: 'Contact', to: '/contact' },
        ],
      },
      {
        title: 'Info',
        links: [
          { label: 'Shipping & care', to: '/shop#faq' },
          { label: 'FAQ', to: '/shop#faq' },
          { label: 'Privacy', to: '/privacy' },
          { label: 'Terms', to: '/terms' },
        ],
      },
    ],
    copyright: '© 2026 Soft Florals. Handmade with love.',
  },

  social: {
    instagram: 'https://www.instagram.com/soft.florals',
    tiktok: '',
    linkedin: '',
    twitter: '',
  },

  contact: {
    email: 'hello.softflorals@gmail.com',
    location: 'Melbourne, Australia',
    delivery: 'We deliver everywhere in Australia',
  },

  seo: {
    defaultTitle: 'Soft Florals — Handmade Forever Flowers',
    titleTemplate: '%s · Soft Florals',
    description:
      'Handmade pipe cleaner flowers that never fade. Allergy-free forever bouquets and gifts, twisted and styled by hand.',
    siteUrl: import.meta.env.VITE_SITE_URL || 'https://softflorals.com',
    ogImage: '/brand/og-image.png',
    locale: 'en_AU',
  },

  integrations: {
    formspreeId: import.meta.env.VITE_FORMSPREE_ID || 'mpqbznwd',
    gaId: import.meta.env.VITE_GA_ID || '',
  },

  checkout: checkoutConfig,
}

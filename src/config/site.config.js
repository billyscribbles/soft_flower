// Single source of truth for brand identity, nav, SEO, integrations.
// Every new site starts by editing this file.

export const site = {
  banner: {
    enabled: true,
    durationSec: 60,
    messages: [
      'Free shipping on all Australian orders over $60 ✿',
      'Custom orders open — wedding pieces, gifts, anniversaries',
      'Handmade in Melbourne · Ships worldwide',
      'Every flower twisted by hand · Lasts forever',
    ],
  },

  brand: {
    name: 'flowers',
    logoText: 'flowers',
    tagline: 'Handmade forever flowers — twisted, shaped, and styled by hand in our studio.',
    // Optional image logo — if set, Navbar/Footer render this instead of logoText.
    logoSrc: null,
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
          { label: 'Flower frames', to: '/shop' },
          { label: 'DIY kits', to: '/shop' },
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
          { label: 'Shipping & care', to: '/shop' },
          { label: 'FAQ', to: '/shop' },
          { label: 'Privacy', to: '/privacy' },
          { label: 'Terms', to: '/terms' },
        ],
      },
    ],
    copyright: '© 2026 Soft Flowers. Handmade with love.',
  },

  social: {
    instagram: 'https://instagram.com/softflowers',
    tiktok: 'https://tiktok.com/@softflowers',
    linkedin: '',
    twitter: '',
  },

  contact: {
    email: 'hello@softflowers.com.au',
    phone: '0400 123 456',
    location: 'Melbourne, Australia',
    delivery: 'We deliver everywhere in Australia',
  },

  seo: {
    defaultTitle: 'Soft Flowers — Handmade Forever Flowers',
    titleTemplate: '%s · Soft Flowers',
    description:
      'Handmade pipe cleaner flowers that never fade. Allergy-free forever bouquets, flower frames, bud vases, gifts and DIY kits — twisted and styled by hand.',
    siteUrl: import.meta.env.VITE_SITE_URL || 'https://softflowers.com',
    ogImage: '/brand/og-image.svg',
    locale: 'en_AU',
  },

  integrations: {
    formspreeId: import.meta.env.VITE_FORMSPREE_ID || '',
    gaId: import.meta.env.VITE_GA_ID || '',
  },

  checkout: {
    leadTimeDays: 3,
    flatShippingAUD: 10,
    freeShippingThresholdAUD: 60,
    pickupEnabled: true,
    currency: 'AUD',
  },
}

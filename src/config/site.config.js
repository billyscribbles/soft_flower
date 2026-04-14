// Single source of truth for brand identity, nav, SEO, integrations.
// Every new site starts by editing this file.

export const site = {
  brand: {
    name: 'flowers',
    logoText: 'flowers',
    tagline: 'Handmade forever flowers — twisted, shaped, and styled by hand in our studio.',
    // Optional image logo — if set, Navbar/Footer render this instead of logoText.
    logoSrc: null,
  },

  nav: [
    { label: 'Shop', to: '/shop' },
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
          { label: 'Custom orders', to: '/contact' },
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
    linkedin: '',
    instagram: 'https://instagram.com/softflowers',
    twitter: '',
  },

  contact: {
    email: 'hello@softflowers.com',
    phone: '',
    location: 'Made by hand · Melbourne, Australia',
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
}

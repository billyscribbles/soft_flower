// Add-ons offered alongside any order. Slugs are referenced via URL params
// when a customer adds them to their enquiry from a product page.
export const addons = {
  eyebrow: 'Often added',
  heading: 'Make it extra special.',
  items: [
    {
      slug: 'handwritten-note',
      name: 'Handwritten note',
      price: 4,
      blurb: 'Up to 60 words, written on a small cream card and tucked inside the wrap.',
      noteable: true,
      noteMaxWords: 60,
      notePlaceholder: 'What would you like the card to say?',
    },
    {
      slug: 'gift-wrap-upgrade',
      name: 'Gift wrap upgrade',
      price: 8,
      blurb: 'Premium tissue, satin ribbon and a small wax seal. Looks beautiful unwrapped.',
    },
    {
      slug: 'bud-vase',
      name: 'Mini bud vase',
      price: 18,
      blurb: 'A small handmade ceramic bud vase to display single stems or short bunches.',
    },
    {
      slug: 'care-card',
      name: 'Care card',
      price: 0,
      blurb: 'Free with every order. A small printed card with care tips and a thank-you note.',
      free: true,
    },
  ],
  cardOnly: {
    slug: 'branded-card',
    name: 'Soft Florals branded card',
    price: 6,
    image: '/images/flowers/branded-card.jpg',
    blurb: 'Our handmade-print A6 card, blank inside. Posted on its own.',
    ctaText: 'Just want to send a card? Add one to your cart →',
  },
}

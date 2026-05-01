// Catalogue of handmade pipecleaner flowers.
// Each item's `slug` drives its detail page route: /shop/<slug>

export const products = {
  eyebrow: 'Handmade with love',
  heading: 'Forever flowers, made by hand.',
  sub: 'Four little pieces from our current collection. Each one twisted, shaped and styled in our studio.',
  items: [
    {
      slug: 'soft-blue',
      name: 'Soft Blue',
      category: 'Bouquets',
      price: 120,
      image: '/images/flowers/soft-blue.png',
      hasPhoto: true,
      blurb: 'A serene bouquet of deep blue roses and sky-blue lilies wrapped in soft tulle.',
      description:
        'A statement bouquet in every shade of blue — hand-twisted indigo roses, pale sky-blue lilies and crisp white blossoms, layered with greenery and wrapped in dusty-blue tissue and a cloud of sheer white tulle. Finished with a wide satin ribbon. A gift that feels calm, considered and quietly luxurious.',
    },
    {
      slug: 'soft-purple',
      name: 'Soft Purple',
      category: 'Bouquets',
      price: 120,
      image: '/images/flowers/soft-purple.png',
      hasPhoto: true,
      blurb: 'A dreamy lavender bouquet of lilies, tulips and a single deep-purple rose.',
      description:
        'A romantic bouquet in every shade of purple — hand-twisted lilac lilies and tulips, crisp white florals and one rich deep-purple rose at the centre, layered with greenery and wrapped in lavender tissue and a cloud of sheer tulle. Finished with a wide satin ribbon. Soft, considered and quietly luxurious.',
    },
    {
      slug: 'soft-pink',
      name: 'Soft Pink',
      category: 'Bouquets',
      price: 120,
      image: '/images/flowers/soft-pink.png',
      hasPhoto: true,
      blurb: 'A sweet pink bouquet of lilies, tulips and rich rose-pink carnations.',
      description:
        'A romantic bouquet in every shade of pink — hand-twisted blush lilies and tulips, crisp white florals and rich rose-pink carnations, layered with greenery and wrapped in soft pink tissue and a cloud of sheer tulle. Finished with a wide blush satin ribbon. Sweet, considered and quietly luxurious.',
    },
    {
      slug: 'soft-yellow',
      name: 'Soft Yellow',
      category: 'Bouquets',
      price: 120,
      image: '/images/flowers/soft-yellow.png',
      hasPhoto: true,
      blurb: 'A sunny bouquet of buttery tulips, white lilies and pom-pom chrysanthemums.',
      description:
        'A cheerful bouquet in every shade of yellow — hand-twisted buttery tulips, crisp white lilies and round pom-pom chrysanthemums in pale yellow, layered with greenery and wrapped in cream tissue and a cloud of sheer tulle. Finished with a wide pale-yellow satin ribbon. Soft, sunny and quietly luxurious.',
    },
  ],
}

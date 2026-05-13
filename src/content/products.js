// Catalogue of handmade pipecleaner flowers.
// Each item's `slug` drives its detail page route: /shop/<slug>

export const products = {
  eyebrow: 'Handmade with love',
  heading: 'Forever flowers, made by hand.',
  sub: 'A little collection of single-tone posies and bigger mixed bouquets. Each one twisted, shaped and styled in our studio.',
  items: [
    {
      slug: 'soft-blue',
      name: 'Soft Blue',
      category: 'Bouquets',
      price: 50,
      image: '/images/flowers/soft-blue.jpg',
      images: ['/images/flowers/soft-blue.jpg'],
      hasPhoto: true,
      blurb: 'A serene bouquet of deep blue roses and sky-blue lilies wrapped in soft tulle.',
      description:
        'A statement bouquet in every shade of blue — hand-twisted indigo roses, pale sky-blue lilies and crisp white blossoms, layered with greenery and wrapped in dusty-blue tissue and a cloud of sheer white tulle. Finished with a wide satin ribbon. A gift that feels calm, considered and quietly luxurious.',
    },
    {
      slug: 'soft-purple',
      name: 'Soft Purple',
      category: 'Bouquets',
      price: 50,
      image: '/images/flowers/soft-purple.jpg',
      images: ['/images/flowers/soft-purple.jpg'],
      hasPhoto: true,
      blurb: 'A dreamy lavender bouquet of lilies, tulips and a single deep-purple rose.',
      description:
        'A romantic bouquet in every shade of purple — hand-twisted lilac lilies and tulips, crisp white florals and one rich deep-purple rose at the centre, layered with greenery and wrapped in lavender tissue and a cloud of sheer tulle. Finished with a wide satin ribbon. Soft, considered and quietly luxurious.',
    },
    {
      slug: 'soft-pink',
      name: 'Soft Pink',
      category: 'Bouquets',
      price: 50,
      image: '/images/flowers/soft-pink.jpg',
      images: [
        '/images/flowers/soft-pink.jpg',
        '/images/flowers/soft-pink-alt.jpg',
        '/images/flowers/soft-pink-blossom.jpg',
      ],
      hasPhoto: true,
      blurb: 'A sweet pink bouquet of lilies, tulips and rich rose-pink carnations.',
      description:
        'A romantic bouquet in every shade of pink — hand-twisted blush lilies and tulips, crisp white florals and rich rose-pink carnations, layered with greenery and wrapped in soft pink tissue and a cloud of sheer tulle. Finished with a wide blush satin ribbon. Sweet, considered and quietly luxurious.',
    },
    {
      slug: 'soft-yellow',
      name: 'Soft Yellow',
      category: 'Bouquets',
      price: 50,
      image: '/images/flowers/soft-yellow.jpg',
      images: ['/images/flowers/soft-yellow.jpg'],
      hasPhoto: true,
      blurb: 'A sunny bouquet of buttery tulips, white lilies and pom-pom chrysanthemums.',
      description:
        'A cheerful bouquet in every shade of yellow — hand-twisted buttery tulips, crisp white lilies and round pom-pom chrysanthemums in pale yellow, layered with greenery and wrapped in cream tissue and a cloud of sheer tulle. Finished with a wide pale-yellow satin ribbon. Soft, sunny and quietly luxurious.',
    },
    {
      slug: 'peach-sorbet',
      name: 'Peach Sorbet',
      category: 'Bouquets',
      price: 100,
      image: '/images/flowers/peach-sorbet.jpg',
      images: ['/images/flowers/peach-sorbet.jpg'],
      hasPhoto: true,
      badge: 'Large mix',
      blurb: 'A sun-warmed mix of peach lilies, butter-yellow blossoms and blush pinks.',
      description:
        'A generous mixed bouquet in warm sorbet tones — coral and peach lilies, butter-yellow blossoms, soft blush pinks and a crisp white centrepiece, layered with curling greenery and wrapped in cream tissue and a wide ivory satin ribbon. A bigger, brighter piece that feels like a Sunday-morning farmers’ market in full bloom.',
    },
    {
      slug: 'lilac-crush',
      name: 'Lilac Crush',
      category: 'Bouquets',
      price: 100,
      image: '/images/flowers/lilac-crush.jpg',
      images: ['/images/flowers/lilac-crush.jpg'],
      hasPhoto: true,
      badge: 'Large mix',
      blurb: 'Pink, peach and lavender lilies bundled with a sweet pink rosette.',
      description:
        'A romantic mixed bouquet in every shade of pink and purple — lilac and lavender lilies, blush and coral pinks, a deep violet bloom and a sweet pink rosette tucked into the middle, layered with greenery and wrapped in soft tissue and a wide lilac satin ribbon. A bigger statement piece for when one shade isn’t quite enough.',
    },
    {
      slug: 'twilight-bloom',
      name: 'Twilight Bloom',
      category: 'Bouquets',
      price: 100,
      image: '/images/flowers/twilight-bloom.jpg',
      images: ['/images/flowers/twilight-bloom.jpg'],
      hasPhoto: true,
      badge: 'Large mix',
      blurb: 'A cool-toned bouquet of indigo, lilac, sky-blue and dusty-pink lilies.',
      description:
        'A dreamy mixed bouquet in cool dusk tones — deep indigo, sky and powder blue, soft lilac, dusty pink and crisp white lilies layered with curling greenery and wrapped in sheer tissue and a powder-blue satin ribbon. A bigger, moodier piece that feels like the very last light of a summer evening.',
    },
  ],
}

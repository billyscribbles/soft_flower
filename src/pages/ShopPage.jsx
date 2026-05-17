import SEO from '../lib/seo.jsx'
import Products from '../components/Products.jsx'
import FAQ from '../components/FAQ.jsx'

export default function ShopPage() {
  return (
    <main>
      <SEO
        title="Shop"
        description="Shop handmade pipe cleaner bouquets: allergy-free forever flowers, each one twisted by hand."
        path="/shop"
      />
      <Products
        grouped
        as="h1"
        className="section--page-top"
        eyebrow="The shop"
        heading="Every little flower we make."
        sub="Our full collection of handmade forever bouquets. Each one twisted, shaped and styled by hand."
      />
      <FAQ />
    </main>
  )
}

import SEO from '../lib/seo.jsx'
import Products from '../components/Products.jsx'
import RecentlyViewed from '../components/RecentlyViewed.jsx'
import FAQ from '../components/FAQ.jsx'
import Contact from '../components/Contact.jsx'

export default function ShopPage() {
  return (
    <main>
      <SEO
        title="Shop"
        description="Shop handmade pipe cleaner bouquets, single stems, flower frames, bud vases, gift sets, and DIY kits. Every piece twisted by hand."
        path="/shop"
      />
      <div style={{ paddingTop: 96 }} />
      <Products
        eyebrow="The shop"
        heading="Every little flower we make."
        sub="Our full collection of forever flowers — bouquets, frames, bud vases, gift sets and DIY kits. Each one twisted, shaped and styled by hand."
      />
      <RecentlyViewed />
      <FAQ />
      <Contact />
    </main>
  )
}

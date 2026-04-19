import SEO from '../lib/seo.jsx'
import Hero from '../components/Hero.jsx'
import Products from '../components/Products.jsx'
import Services from '../components/Services.jsx'
import Story from '../components/Stats.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import Testimonials from '../components/Testimonials.jsx'
import Contact from '../components/Contact.jsx'
import EditorialSection from '../components/EditorialSection.jsx'
import { editorial } from '../content/editorial.js'

export default function Home() {
  return (
    <main>
      <SEO />
      <Hero />
      <Services />
      <Products featuredOnly />
      {editorial.map((e) => (
        <EditorialSection key={e.heading} {...e} />
      ))}
      <Story />
      <HowItWorks />
      <Testimonials />
      <Contact />
    </main>
  )
}

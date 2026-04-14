import SEO from '../lib/seo.jsx'
import Hero from '../components/Hero.jsx'
import Products from '../components/Products.jsx'
import Services from '../components/Services.jsx'
import Story from '../components/Stats.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import Testimonials from '../components/Testimonials.jsx'
import Contact from '../components/Contact.jsx'

export default function Home() {
  return (
    <main>
      <SEO />
      <Hero />
      <Products featuredOnly />
      <Services />
      <Story />
      <HowItWorks />
      <Testimonials />
      <Contact />
    </main>
  )
}

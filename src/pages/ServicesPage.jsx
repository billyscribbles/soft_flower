import SEO from '../lib/seo.jsx'
import Services from '../components/Services.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import Contact from '../components/Contact.jsx'

export default function ServicesPage() {
  return (
    <main>
      <SEO title="Services" path="/services" />
      <div style={{ paddingTop: 64 }} />
      <Services />
      <HowItWorks />
      <Contact />
    </main>
  )
}

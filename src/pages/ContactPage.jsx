import SEO from '../lib/seo.jsx'
import Contact from '../components/Contact.jsx'

export default function ContactPage() {
  return (
    <main>
      <SEO title="Contact" path="/contact" />
      <Contact />
    </main>
  )
}

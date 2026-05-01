import SEO from '../lib/seo.jsx'
import Contact from '../components/Contact.jsx'
import './ContactPage.css'

export default function ContactPage() {
  return (
    <main>
      <SEO title="Contact" path="/contact" />
      <section className="contact-hero">
        <div className="container">
          <span className="section-eyebrow">Get in touch</span>
          <h1 className="contact-hero__title">Say hello.</h1>
          <p className="contact-hero__sub">
            Custom orders, weddings, gifts, or a friendly chat — drop us a note and we'll reply within one business day.
          </p>
        </div>
      </section>
      <Contact tone="plain" />
    </main>
  )
}

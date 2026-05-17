import { motion } from 'framer-motion'
import SEO from '../lib/seo.jsx'
import { site } from '../config/site.config.js'
import Stats from '../components/Stats.jsx'
import { aboutSections } from '../content/about.js'
import './AboutPage.css'

export default function AboutPage() {
  return (
    <main>
      <SEO title="About" path="/about" />
      <section className="about-hero">
        <div className="container">
          <span className="section-eyebrow">About</span>
          <h1 className="about-hero__title">{site.brand.name}</h1>
          <p className="about-hero__sub">{site.brand.tagline}</p>
        </div>
      </section>
      <section className="about-studio">
        <div className="container about-studio__grid">
          {aboutSections.map((s, i) => (
            <motion.figure
              key={s.heading}
              className={`studio-card${i % 2 === 1 ? ' studio-card--alt' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="studio-card__frame">
                <img src={s.image} alt={s.alt} loading="lazy" />
              </div>
              <figcaption className="studio-card__caption">
                {s.eyebrow && <span className="studio-card__eyebrow">{s.eyebrow}</span>}
                <h2 className="studio-card__heading">{s.heading}</h2>
                {s.body && <p className="studio-card__body">{s.body}</p>}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>
      <Stats />
    </main>
  )
}

import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SEO from '../lib/seo.jsx'
import './NotFoundPage.css'

const REDIRECT_SECONDS = 6

export default function NotFoundPage() {
  const navigate = useNavigate()
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS)

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1))
    }, 1000)
    const timeout = setTimeout(() => {
      navigate('/', { replace: true })
    }, REDIRECT_SECONDS * 1000)
    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [navigate])

  return (
    <main className="notfound">
      <SEO title="Looking for something?" />
      <div className="container notfound__inner">
        <span className="section-eyebrow">Whoops</span>
        <h1 className="notfound__title">This little corner is empty.</h1>
        <p className="notfound__sub">
          We couldn't find that page — taking you back to the shop in {secondsLeft}…
        </p>
        <Link to="/" className="notfound__cta">Take me home now →</Link>
      </div>
    </main>
  )
}

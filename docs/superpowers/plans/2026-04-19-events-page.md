# Events page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a `/events` page that gives weddings, proposals/engagements, birthdays, and corporate clients a dedicated inquiry flow, wired to the existing Formspree integration, with POA pricing and placeholder imagery.

**Architecture:** New content file (`events.js`) drives a grid of event cards (`Events.jsx`). Clicking a card's "Enquire" button sets the event type on a dedicated inquiry form (`EventInquiry.jsx`) and scrolls to it. A page shell (`EventsPage.jsx`) composes Hero + Events grid + a 3-step "How it works" strip + the inquiry form, and is registered as a lazy-loaded `/events` route in `App.jsx`. Nav and footer in `site.config.js` are updated to point at the new page.

**Tech Stack:** React 18 + Vite, React Router v7 (lazy routes), Framer Motion 11 (scroll-in fades), Lucide React icons, plain CSS with CSS custom properties, Formspree (env-driven), `react-helmet-async` via `lib/seo.jsx`. No TypeScript. No new dependencies.

**Testing approach:** This repo has no automated test infrastructure (no `vitest`/`jest` script in `package.json`). Verification is manual, matching the project's convention: `yarn dev` + browser checks at 375/768/1280, console inspection, and `yarn build && yarn preview`. Each task ends with a concrete manual verification step and a commit.

**Publish gate (from `CLAUDE.md`):** Never `git push`, create PRs, or deploy without Billy's explicit ack in the same turn. Local commits after each task are expected; publishing is not.

---

## File structure

### Create
- `src/content/events.js` — event-type catalog (named export `events`, array of 4 entries).
- `src/components/Events.jsx` — grid section that renders event cards from `events.js`. Receives `onEnquire(eventId)` and calls it when a card's Enquire button is clicked.
- `src/components/Events.css` — card/grid styles; mirrors the `products__*` naming and breakpoints.
- `src/components/EventInquiry.jsx` — Formspree form with event-type dropdown; exposes an imperative handle (via `forwardRef`) so `EventsPage` can set the event type and scroll it into view.
- `src/components/EventInquiry.css` — form styles; mirrors `contact__*` patterns.
- `src/pages/EventsPage.jsx` — page shell: `SEO` + hero section + `<Events>` + a local 3-step "How it works" strip (inline, to avoid coupling `HowItWorks.jsx` to event copy) + `<EventInquiry>`.

### Modify
- `src/App.jsx` — add lazy-loaded `EventsPage` import and `<Route path="/events" element={<EventsPage />} />`.
- `src/config/site.config.js` — insert `{ label: 'Events', to: '/events' }` into `nav` (between Shop and About); repoint footer "Custom orders" to `/events`.

### Rationale for these boundaries
- **`Events.jsx` stays dumb** — only knows how to render a grid and emit `onEnquire(eventId)`. No form state, no Formspree.
- **`EventInquiry.jsx` owns its own form state** (status, fields) and exposes a tiny imperative API (`setEventType`, `scrollIntoView`) via `forwardRef`. Keeps the parent simple.
- **`EventsPage.jsx` is the coordinator** — holds a ref to the inquiry form, passes `onEnquire` to `Events`, delegates to the ref on click.
- **Inline "How it works" strip** (not reused from `HowItWorks.jsx`) because the existing component is tightly bound to `howItWorks.js` content about flower care. Events has different 3 steps (enquire → quote → delivered). Copy-lite, one-time use — inline markup is the simpler call.

---

## Task 1: Create `src/content/events.js`

**Files:**
- Create: `src/content/events.js`

- [ ] **Step 1: Create the content file**

Create `src/content/events.js` with exactly:

```js
export const events = {
  eyebrow: 'Bespoke event work',
  heading: 'For the moments that matter.',
  sub: 'Forever flowers for the days you want to remember forever — handmade to your brief, delivered anywhere in Australia.',
  items: [
    {
      id: 'weddings',
      title: 'Weddings',
      blurb: 'Bouquets, bridal party pieces, arches and table florals — forever-keepsakes from your day.',
      image: '/images/flowers/flower-1.png',
      pieces: ['Bridal bouquet', 'Bridesmaid posies', 'Buttonholes', 'Table florals', 'Arches & installations'],
    },
    {
      id: 'proposals-engagements',
      title: 'Proposals & Engagements',
      blurb: 'A forever flower for the forever question — keepsakes for the moment and the celebration after.',
      image: '/images/flowers/flower-2.png',
      pieces: ['Single statement stem', 'Proposal bouquet', 'Engagement party florals'],
    },
    {
      id: 'birthdays',
      title: 'Birthdays',
      blurb: 'Personalised bouquets and centrepieces for milestone birthdays and intimate celebrations.',
      image: '/images/flowers/flower-3.png',
      pieces: ['Birthday bouquet', 'Table centrepieces', 'Cake florals', 'Gift boxes'],
    },
    {
      id: 'corporate',
      title: 'Corporate',
      blurb: 'Launches, press events, client gifts and reception florals — handmade, allergy-free, and reusable.',
      image: '/images/flowers/flower-4.png',
      pieces: ['Reception installations', 'Branded gift bouquets', 'Press event florals', 'Client keepsakes'],
    },
  ],
}
```

- [ ] **Step 2: Verify the referenced images exist**

Run: `ls public/images/flowers/flower-1.png public/images/flowers/flower-2.png public/images/flowers/flower-3.png public/images/flowers/flower-4.png`
Expected: All four paths listed without error.

- [ ] **Step 3: Commit**

```bash
git add src/content/events.js
git commit -m "Add events content catalog"
```

---

## Task 2: Build `Events.jsx` + `Events.css`

**Files:**
- Create: `src/components/Events.jsx`
- Create: `src/components/Events.css`

- [ ] **Step 1: Create `Events.css`**

Create `src/components/Events.css` with exactly:

```css
.events__head {
  max-width: 720px;
  margin-bottom: 64px;
}

.events__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 48px;
}

.events__card {
  display: flex;
  flex-direction: column;
  background: transparent;
  padding: 0;
}

.events__media {
  position: relative;
  aspect-ratio: 4 / 3;
  background: var(--color-bg-alt);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: var(--radius-md);
}

.events__media img {
  width: 68%;
  height: 68%;
  object-fit: contain;
  transition: transform var(--transition-slow);
}

.events__card:hover .events__media img {
  transform: scale(1.03);
}

.events__body {
  padding: 20px 4px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.events__title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 500;
  color: var(--color-text);
  line-height: 1.25;
  letter-spacing: -0.01em;
}

.events__blurb {
  font-size: 14px;
  color: var(--color-text-soft);
  line-height: 1.55;
}

.events__pieces {
  list-style: none;
  padding: 0;
  margin: 4px 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px 10px;
}

.events__pieces li {
  font-size: 12px;
  color: var(--color-text-soft);
  letter-spacing: 0.01em;
}

.events__pieces li::after {
  content: '·';
  margin-left: 10px;
  color: var(--color-border-strong);
}

.events__pieces li:last-child::after {
  content: '';
}

.events__cta {
  margin-top: 20px;
  align-self: flex-start;
  padding: 12px 22px;
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
}

.events__cta:hover {
  background: var(--color-text);
  color: #fff;
  border-color: var(--color-text);
}

@media (max-width: 800px) {
  .events__grid { grid-template-columns: 1fr; gap: 32px; }
}
```

- [ ] **Step 2: Create `Events.jsx`**

Create `src/components/Events.jsx` with exactly:

```jsx
import { motion } from 'framer-motion'
import { events } from '../content/events.js'
import './Events.css'

export default function Events({ onEnquire }) {
  return (
    <section className="events section">
      <div className="container">
        <div className="events__head">
          {events.eyebrow && <span className="section-eyebrow">{events.eyebrow}</span>}
          <h2 className="section-label">{events.heading}</h2>
          {events.sub && <p className="section-sub">{events.sub}</p>}
        </div>

        <div className="events__grid">
          {events.items.map((item, i) => (
            <motion.div
              key={item.id}
              className="events__card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="events__media">
                <img src={item.image} alt={item.title} loading="lazy" />
              </div>
              <div className="events__body">
                <h3 className="events__title">{item.title}</h3>
                <p className="events__blurb">{item.blurb}</p>
                <ul className="events__pieces">
                  {item.pieces.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="events__cta"
                  onClick={() => onEnquire?.(item.id)}
                >
                  Enquire →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Events.jsx src/components/Events.css
git commit -m "Add Events grid component"
```

---

## Task 3: Build `EventInquiry.jsx` + `EventInquiry.css`

**Files:**
- Create: `src/components/EventInquiry.jsx`
- Create: `src/components/EventInquiry.css`

- [ ] **Step 1: Create `EventInquiry.css`**

Create `src/components/EventInquiry.css` with exactly:

```css
.event-inquiry {
  scroll-margin-top: 96px;
}

.event-inquiry__inner {
  max-width: 720px;
  margin: 0 auto;
}

.event-inquiry__head {
  text-align: center;
  margin-bottom: 48px;
}

.event-inquiry__form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.event-inquiry__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.event-inquiry__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.event-inquiry__field > span {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

.event-inquiry__field input,
.event-inquiry__field select,
.event-inquiry__field textarea {
  padding: 14px 16px;
  background: var(--color-bg);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-family: inherit;
  font-size: 14px;
  line-height: 1.45;
  transition: border-color var(--transition-fast);
}

.event-inquiry__field input:focus,
.event-inquiry__field select:focus,
.event-inquiry__field textarea:focus {
  outline: none;
  border-color: var(--color-text);
}

.event-inquiry__hint {
  font-size: 12px;
  color: var(--color-text-soft);
}

.event-inquiry__submit {
  margin-top: 8px;
  padding: 14px 28px;
  background: var(--color-text);
  color: #fff;
  border: 1px solid var(--color-text);
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: opacity var(--transition-fast);
}

.event-inquiry__submit:disabled {
  opacity: 0.6;
  cursor: default;
}

.event-inquiry__status {
  margin-top: 12px;
  font-size: 14px;
  text-align: center;
}

.event-inquiry__status--success { color: var(--color-text); }
.event-inquiry__status--error { color: #b3261e; }

@media (max-width: 640px) {
  .event-inquiry__row { grid-template-columns: 1fr; }
}
```

- [ ] **Step 2: Create `EventInquiry.jsx`**

Create `src/components/EventInquiry.jsx` with exactly:

```jsx
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { site } from '../config/site.config.js'
import { events } from '../content/events.js'
import './EventInquiry.css'

const EventInquiry = forwardRef(function EventInquiry(_, ref) {
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [eventType, setEventType] = useState(events.items[0].id)
  const sectionRef = useRef(null)
  const formspreeId = site.integrations.formspreeId

  useImperativeHandle(ref, () => ({
    setEventType: (id) => {
      if (events.items.some((e) => e.id === id)) setEventType(id)
    },
    scrollIntoView: () => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    },
  }))

  const selected = events.items.find((e) => e.id === eventType) || events.items[0]
  const subjectValue = `Event inquiry — ${selected.title}`

  async function handleSubmit(e) {
    e.preventDefault()
    if (!formspreeId) {
      setStatus('error')
      return
    }
    setStatus('submitting')
    const form = e.currentTarget
    const data = new FormData(form)
    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      ref={sectionRef}
      className="event-inquiry section section--alt"
      id="inquire"
    >
      <div className="container event-inquiry__inner">
        <div className="event-inquiry__head">
          <span className="section-eyebrow">Enquire</span>
          <h2 className="section-label">Tell us about your day.</h2>
          <p className="section-sub">
            Share a few details and we&apos;ll reply within one business day with ideas and a quote.
          </p>
        </div>

        <form className="event-inquiry__form" onSubmit={handleSubmit}>
          <input type="hidden" name="_subject" value={subjectValue} />
          <input
            type="text"
            name="_gotcha"
            tabIndex="-1"
            autoComplete="off"
            aria-hidden="true"
            style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
          />

          <div className="event-inquiry__row">
            <label className="event-inquiry__field">
              <span>Name</span>
              <input type="text" name="name" required />
            </label>
            <label className="event-inquiry__field">
              <span>Email</span>
              <input type="email" name="email" required />
            </label>
          </div>

          <div className="event-inquiry__row">
            <label className="event-inquiry__field">
              <span>Event type</span>
              <select
                name="event_type"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                required
              >
                {events.items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="event-inquiry__field">
              <span>Event date</span>
              <input type="date" name="event_date" />
              <span className="event-inquiry__hint">Not sure yet? Leave blank.</span>
            </label>
          </div>

          <label className="event-inquiry__field">
            <span>Scale / guest count</span>
            <input
              type="text"
              name="scale"
              placeholder="e.g. intimate, 100 guests, 12 tables"
            />
          </label>

          <label className="event-inquiry__field">
            <span>Vibe, colours, inspiration</span>
            <textarea
              name="vibe"
              rows="5"
              required
              placeholder="Blush and ivory, garden-style, a little wild — whatever you&apos;re picturing."
            />
          </label>

          <label className="event-inquiry__field">
            <span>Anything else</span>
            <textarea
              name="notes"
              rows="3"
              placeholder="Venue, delivery location, timelines, inspiration links…"
            />
          </label>

          <button
            type="submit"
            className="event-inquiry__submit"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Sending…' : 'Send enquiry →'}
          </button>

          {status === 'success' && (
            <p className="event-inquiry__status event-inquiry__status--success">
              Thanks — we&apos;ll be in touch shortly.
            </p>
          )}
          {status === 'error' && (
            <p className="event-inquiry__status event-inquiry__status--error">
              Something went wrong. Email us directly at {site.contact.email}.
            </p>
          )}
        </form>
      </div>
    </section>
  )
})

export default EventInquiry
```

- [ ] **Step 3: Commit**

```bash
git add src/components/EventInquiry.jsx src/components/EventInquiry.css
git commit -m "Add EventInquiry form component"
```

---

## Task 4: Build `EventsPage.jsx`

**Files:**
- Create: `src/pages/EventsPage.jsx`

- [ ] **Step 1: Create `EventsPage.jsx`**

Create `src/pages/EventsPage.jsx` with exactly:

```jsx
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../lib/seo.jsx'
import Events from '../components/Events.jsx'
import EventInquiry from '../components/EventInquiry.jsx'

const HOW_STEPS = [
  {
    title: 'Enquire',
    body: 'Send us your event details — date, scale, vibe. We read every message personally.',
  },
  {
    title: 'Quote & design chat',
    body: 'Within one business day we reply with ideas, options, and a clear quote. Revisions are welcome.',
  },
  {
    title: 'Handmade & delivered',
    body: 'Christine twists each flower by hand in the studio. We ship or hand-deliver anywhere in Australia.',
  },
]

export default function EventsPage() {
  const inquiryRef = useRef(null)

  const handleEnquire = (eventId) => {
    inquiryRef.current?.setEventType(eventId)
    inquiryRef.current?.scrollIntoView()
  }

  return (
    <main className="events-page">
      <SEO
        title="Events & Custom Orders"
        description="Bespoke handmade pipecleaner flowers for weddings, proposals, engagements, birthdays and corporate events. Forever-keepsakes handmade in Melbourne, delivered Australia-wide."
        path="/events"
      />

      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container" style={{ maxWidth: 820, textAlign: 'center' }}>
          <span className="section-eyebrow">Bespoke events</span>
          <h1 className="section-label" style={{ marginBottom: 16 }}>
            Flowers for the moments that matter.
          </h1>
          <p className="section-sub">
            Weddings, proposals, birthdays and corporate events — handmade to your brief, kept forever.
          </p>
          <div style={{ marginTop: 28 }}>
            <Link
              to="#inquire"
              onClick={(e) => {
                e.preventDefault()
                inquiryRef.current?.scrollIntoView()
              }}
              className="hero__cta-primary"
            >
              Start an enquiry →
            </Link>
          </div>
        </div>
      </section>

      <Events onEnquire={handleEnquire} />

      <section className="section section--alt">
        <div className="container" style={{ maxWidth: 1040 }}>
          <div className="events__head" style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
            <span className="section-eyebrow">How it works</span>
            <h2 className="section-label">Simple, personal, unhurried.</h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 32,
            }}
            className="events-page__steps"
          >
            {HOW_STEPS.map((s, i) => (
              <div key={s.title}>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 14,
                    letterSpacing: '0.08em',
                    color: 'var(--color-text-soft)',
                    marginBottom: 12,
                  }}
                >
                  0{i + 1}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 20,
                    fontWeight: 500,
                    marginBottom: 8,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {s.title}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-soft)' }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EventInquiry ref={inquiryRef} />
    </main>
  )
}
```

Notes for the engineer:
- The "How it works" strip is intentionally inline (no new CSS file) because it's one-shot markup for this page. If Christine later asks for styling parity with the home `HowItWorks` section, lift this into `EventsPage.css` or generalize `HowItWorks.jsx` then.
- The hero CTA reuses the existing `hero__cta-primary` class from `Hero.css` so button styling stays consistent across the site.

- [ ] **Step 2: Verify the hero CTA class exists**

Run: `grep -n "hero__cta-primary" src/components/Hero.css`
Expected: At least one matching style rule is printed.

- [ ] **Step 3: Commit**

```bash
git add src/pages/EventsPage.jsx
git commit -m "Add EventsPage shell"
```

---

## Task 5: Wire route + update nav/footer

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/config/site.config.js`

- [ ] **Step 1: Register the lazy route in `App.jsx`**

In `src/App.jsx`, add the lazy import alongside the existing `lazyWithRetry` block. After this existing line:

```js
const ContactPage = lazyWithRetry(() => import('./pages/ContactPage.jsx'))
```

insert:

```js
const EventsPage = lazyWithRetry(() => import('./pages/EventsPage.jsx'))
```

Then, inside `<Routes>`, add the route immediately after the `/contact` route. After this existing line:

```jsx
<Route path="/contact" element={<ContactPage />} />
```

insert:

```jsx
<Route path="/events" element={<EventsPage />} />
```

- [ ] **Step 2: Add `Events` to the nav in `site.config.js`**

In `src/config/site.config.js`, replace this block:

```js
  nav: [
    { label: 'Shop', to: '/shop' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ],
```

with:

```js
  nav: [
    { label: 'Shop', to: '/shop' },
    { label: 'Events', to: '/events' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ],
```

- [ ] **Step 3: Repoint the footer "Custom orders" link in `site.config.js`**

In the same file, inside `footer.columns`, find the Studio column. Replace this line:

```js
          { label: 'Custom orders', to: '/contact' },
```

with:

```js
          { label: 'Custom orders', to: '/events' },
```

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx src/config/site.config.js
git commit -m "Wire /events route, nav and footer"
```

---

## Task 6: Manual verification

**Files:**
- None (verification only)

- [ ] **Step 1: Start the dev server**

Run (in a separate terminal so it stays up): `yarn dev`
Expected: Vite prints a local URL (typically `http://localhost:5173`) with no console errors in the terminal.

- [ ] **Step 2: Visit `/events` and check the golden path**

Open `http://localhost:5173/events` in a browser.

Verify:
- [ ] Hero renders with "Flowers for the moments that matter."
- [ ] Four event cards render (Weddings, Proposals & Engagements, Birthdays, Corporate) each with an image, blurb, pieces list, and "Enquire →" button.
- [ ] "How it works" 3-step strip renders (Enquire / Quote & design chat / Handmade & delivered).
- [ ] The event inquiry form renders at the bottom with all fields (Name, Email, Event type, Event date, Scale, Vibe, Anything else).
- [ ] No errors in the browser devtools console.

- [ ] **Step 3: Verify card → form wiring**

Click the "Enquire →" button on each of the 4 cards in turn. For each:
- [ ] The page smooth-scrolls to the form.
- [ ] The "Event type" select shows the matching option (e.g. clicking the Weddings card selects "Weddings").
- [ ] The hidden `_subject` field updates (inspect via devtools: the `<input name="_subject">` value should be e.g. `Event inquiry — Weddings`).

- [ ] **Step 4: Verify form submission (dev behavior)**

Fill out the form with test values and submit.
- If `VITE_FORMSPREE_ID` is set in the local `.env`: expect a success message (`Thanks — we'll be in touch shortly.`) and the form to clear.
- If `VITE_FORMSPREE_ID` is NOT set: expect the error message (`Something went wrong. Email us directly at hello@softflowers.com.au.`). This matches `Contact.jsx` behavior and is correct.

- [ ] **Step 5: Verify nav and footer**

On any page:
- [ ] Top nav shows `Shop · Events · About · Contact` in order.
- [ ] Clicking `Events` navigates to `/events`.
- [ ] Footer "Studio" column: clicking "Custom orders" navigates to `/events` (not `/contact`).

- [ ] **Step 6: Responsive check**

In browser devtools, resize to 375px, 768px, and 1280px widths. Verify on each:
- [ ] Events grid collapses from 2 columns to 1 column at the ~800px breakpoint.
- [ ] Form row fields (Name/Email, Event type/Date) collapse to single column at the ~640px breakpoint.
- [ ] No horizontal overflow, no overlapping text, all CTAs tappable.

- [ ] **Step 7: Production build smoke test**

Run: `yarn build && yarn preview`
Expected: Build completes without errors; preview URL serves `/events` identically to dev.

- [ ] **Step 8: Stop the dev server and commit any incidental fixes**

If verification steps forced any tweaks (e.g. a typo, a missing image), commit them as separate small fixes using descriptive messages.

- [ ] **Step 9: Summarize for Billy**

Output a brief summary for Billy with:
- What was built (the file list).
- What was verified locally.
- That nothing has been pushed — `git push` requires explicit approval per `CLAUDE.md`.

---

## Self-review checklist for the engineer (run before declaring done)

- [ ] Every file listed in "File structure" exists.
- [ ] `yarn build` produces no errors and no warnings about missing modules.
- [ ] No console errors on `/events` in devtools.
- [ ] Clicking each of the 4 card buttons sets the correct event type on the form.
- [ ] Nav link active state highlights on `/events` (if Navbar uses `NavLink` — if it uses plain `Link`, confirm the link renders and is clickable; styling parity with other nav items is enough).
- [ ] Footer "Custom orders" → `/events`.
- [ ] No unused imports in new files. No TypeScript. No Tailwind. No new npm dependencies added.

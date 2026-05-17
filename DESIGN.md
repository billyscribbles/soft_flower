---
name: soft florals
description: Handmade pipe cleaner forever flowers, twisted and styled by hand in Melbourne.
colors:
  petal-pink: "#F9DEE5"
  dusty-rose: "#D67F8C"
  petal-wash: "#FDF1F4"
  studio-white: "#FFFFFF"
  paper-cream: "#FAF7F4"
  ink: "#1A1A1A"
  ink-deep: "#0F0F0F"
  stem-grey: "#5A5A5A"
  faded-grey: "#8A8A8A"
  hairline: "#00000014"
  hairline-strong: "#00000029"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 6.4vw, 5.5rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.005em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.18em"
rounded:
  none: "0"
  sm: "4px"
  md: "8px"
  lg: "16px"
  full: "9999px"
spacing:
  xs: "6px"
  sm: "12px"
  md: "20px"
  lg: "32px"
  xl: "64px"
  section: "88px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.studio-white}"
    rounded: "{rounded.full}"
    padding: "16px 32px"
  button-primary-hover:
    backgroundColor: "{colors.ink-deep}"
    textColor: "{colors.studio-white}"
    rounded: "{rounded.full}"
    padding: "16px 32px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "12px 18px"
  button-outline-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.studio-white}"
    rounded: "{rounded.full}"
    padding: "12px 18px"
  input-underline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "14px 0"
  product-media:
    backgroundColor: "{colors.paper-cream}"
    rounded: "{rounded.md}"
---

# Design System: soft florals

## 1. Overview

**Creative North Star: "The Pressed-Flower Keepsake"**

soft florals sells flowers that never wilt: pipe cleaner bouquets twisted by hand
in a Melbourne studio. The interface treats each piece the way you would treat a
flower worth keeping forever, something pressed flat between pages, saved, and
given as a gift. The site is the tissue paper, not the bouquet. It stays soft,
quiet, and deliberately plain so the photography of the actual handmade work
carries every screen.

The system is built on warmth and restraint. Backgrounds are studio white and a
warm paper cream; the only saturated color is a pale Petal Pink used as a
signature, never as decoration. Action is carried by near-black Ink, so the
shop reads as calm and confident rather than busy or sugary. Surfaces are flat
at rest. Depth comes from generous whitespace, the cream-on-white tonal shift,
and gentle motion on interaction, not from shadows or boxes. Product items have
no border, no shadow, and no card frame; the photograph simply sits in space.

This system explicitly rejects two things. It is **not corporate or SaaS**: no
cold gradients, no hero-metric stat blocks, no stock-photo gloss, no startup
polish. And it is **not cutesy-cluttered**: no tiled florals, no sticker
overload, no comic-energy type, no discount-store loudness. Playful is earned
through a few deliberate details (a single pink accent word, a pink logo dot, a
slow marquee), never by piling them on.

**Key Characteristics:**
- Photography leads; chrome recedes. The flowers are the loudest thing on screen.
- Restrained color: Petal Pink as a rare signature, Ink as the action color.
- Flat by default. No resting shadows, no card frames around products.
- Pill-shaped actions, underline-only inputs, hairline dividers.
- Warm, unhurried, gift-worthy. Premium but never cold.

## 2. Colors

A near-monochrome warm-neutral base with one pale pink signature: restrained, so
the rare appearances of pink read as intentional.

### Primary
- **Petal Pink** (#F9DEE5): The brand signature, a pale warm rose. Used sparingly
  and on purpose: the scrolling announcement banner, the dot in the wordmark, a
  single accent word in the hero headline, and the resting underline on form
  fields and the hero's secondary link. It marks the brand, it does not decorate
  the page.
- **Dusty Rose** (#D67F8C): The deeper, readable rose. Used for interactive pink
  states where pale Petal Pink would fail contrast: form-field underline on
  focus, link hover, the cart icon on hover. Petal Pink's working counterpart.

### Secondary
- **Petal Wash** (#FDF1F4): The faintest pink tint, almost white. Used only as a
  large quiet ground, such as the hero's base color behind the wallpaper image.

### Neutral
- **Studio White** (#FFFFFF): The default page background. Clean, gallery-like.
- **Warm Paper Cream** (#FAF7F4): The alternate section background. The tonal
  step that creates rhythm between sections without rules or borders.
- **Pressed Ink** (#1A1A1A): The text color and, critically, the action color.
  Primary buttons, the nav CTA, and "add" actions are all Ink, not pink.
- **Ink Deep** (#0F0F0F): The hover state for Ink surfaces. A deepening, not a
  jump to pure black.
- **Stem Grey** (#5A5A5A): Secondary text: subheadlines, body copy, nav links,
  prices, eyebrow labels.
- **Faded Grey** (#8A8A8A): Tertiary text: separators, the quietest metadata.
- **Hairline** (#00000014) and **Hairline Strong** (#00000029): Translucent black
  dividers and outline-button borders. Translucent so they sit softly on both
  white and cream.

### Named Rules
**The Signature Rule.** Petal Pink appears on roughly 5% of any screen or less.
It is a signature, not a theme. If pink is filling space or tinting components
by reflex, remove it. Its rarity is what makes it read as the brand.

**The Black-Is-The-Action Rule.** Every committed action (primary button, nav
CTA, "add to cart") is Pressed Ink, never pink. Pink invites; Ink commits. Do
not swap a primary button to pink to make it "softer".

## 3. Typography

**Display Font:** Inter (with system-ui, sans-serif fallback)
**Body Font:** Inter (with system-ui, sans-serif fallback)

**Character:** A single neutral humanist sans, used across the whole site. The
voice comes entirely from how Inter is set, not from a second face: large
headline sizes with tight negative tracking (-0.025em) for a crafted, condensed
feel, against airy 1.65 body leading. The restraint is deliberate; the
photography supplies the warmth that a display face otherwise would.

### Hierarchy
- **Display** (600, clamp 2.75rem to 5.5rem, line-height 1.02, tracking -0.025em):
  The hero headline only. One per page, oversized, tightly set.
- **Headline** (600, clamp 2rem to 3rem, line-height 1.1, tracking -0.02em):
  Section titles (`.section-label`).
- **Title** (500, 1rem, line-height 1.3): Product names and prices in the
  catalogue grid. Quiet on purpose; the photo is the headline of a product item.
- **Body** (400, 1.0625rem, line-height 1.65): Paragraph copy, subheadlines, in
  Stem Grey. Cap measure at 65 to 75 characters.
- **Label** (500, 0.75rem, tracking 0.18em, UPPERCASE): Eyebrows above section
  titles and field labels. Stem Grey, never Ink.

### Named Rules
**The One-Family Rule.** Inter carries the entire system. Hierarchy is built from
size and weight contrast (steps stay at or above a 1.25 ratio), never from
introducing a second typeface. A display serif would pull the site toward the
editorial-magazine lane it is not in.

**The Tight-Headline Rule.** Headlines and display type carry negative tracking
(-0.02em to -0.025em). Body and labels never do; labels are loosely tracked
(+0.18em) instead. The contrast between the two is part of the voice.

## 4. Elevation

Flat by default; lift on interaction. Surfaces are flat at rest with no resting
shadows. Product items in particular have no border, no shadow, and no card
frame: the photograph sits directly in whitespace. Depth and grouping come from
three sources instead: generous whitespace, the tonal step between Studio White
and Warm Paper Cream sections, and translucent hairline dividers. Shadow tokens
exist (`--shadow-sm` through `--shadow-accent`) but are reserved; reach for them
only as a response to state, not as resting decoration.

### Shadow Vocabulary
- **Hover lift** (`transform: translateY(-1px)`): The primary feedback for
  buttons and CTAs. A physical nudge, not a shadow.
- **Image bloom** (`transform: scale(1.03)`): Product photography scales gently
  on card hover, often crossfading to a second image.
- **Scrolled navbar** (`backdrop-filter: saturate(160%) blur(10px)` over
  `rgba(255,255,255,0.96)` with a hairline border): The one sanctioned blur. It
  earns its place by keeping product imagery legible behind a floating nav.

### Named Rules
**The Flat-At-Rest Rule.** If a surface has a shadow when nothing is happening to
it, the shadow is wrong. Elevation is a verb here: it is what hover and focus
do, not how a component looks by default.

## 5. Components

### Buttons
- **Shape:** Fully pill-shaped (`border-radius: 9999px`). Always. The pill is the
  brand's button silhouette across primary, outline, and nav.
- **Primary:** Pressed Ink (#1A1A1A) background, white text, padding `16px 32px`,
  13 to 14px text at weight 500 with +0.02em tracking. The committed action.
- **Hover / Focus:** Background deepens to Ink Deep (#0F0F0F) and the button
  lifts `translateY(-1px)`, over `--transition-fast` (150ms). No shadow.
- **Outline:** Transparent background, Ink text, 1px Hairline Strong border,
  tighter padding (`12px 18px`). Used for the per-product "add" action. On hover
  it fills: background and border go to Ink, text to white.
- **Underline link:** A text action with no fill. Ink text over a 1.5px Petal
  Pink bottom border, zero radius. Used for the hero's secondary CTA. The
  borderless, quietest call to action.

### Inputs / Fields
- **Style:** Underline only. Transparent background, no box, no radius. The field
  is a 1.5px Petal Pink bottom border and nothing else; the label sits above as
  a tracked uppercase Label.
- **Focus:** The underline shifts from Petal Pink to Dusty Rose (#D67F8C). No
  glow, no box, no outline ring beyond that color shift.
- **Error / Disabled:** Underline carries the state color; submit buttons dim on
  `:disabled`.

### Product Item
The signature component. Not a card: transparent background, no border, no
shadow, no padding frame. A square (`aspect-ratio: 1/1`) photograph with an 8px
radius sits over Warm Paper Cream, with the name and price set quietly below in
Title type. On hover the image scales to 1.03 and crossfades to a second
photograph. The product is the design; the chrome around it is intentionally
almost nothing.

### Navigation
- **Banner:** A slow horizontal marquee on a full-width Petal Pink strip, 12px
  uppercase tracked text in Stem Grey. Pauses on hover; static and centered
  under `prefers-reduced-motion`.
- **Bar:** Sticky and transparent at the top of the page. On scroll it gains a
  semi-opaque white background, a backdrop blur, and a hairline bottom border.
- **Links:** 14px weight-500 Stem Grey, shifting to Ink on hover. The wordmark
  carries a single 6px Petal Pink dot.
- **Mobile:** Links collapse into a hamburger that animates to an X; the panel
  expands by transitioning `max-height`.

## 6. Do's and Don'ts

### Do:
- **Do** keep Petal Pink (#F9DEE5) under roughly 5% of any screen. It is a
  signature: banner, logo dot, one hero accent word, input underlines. Nothing else.
- **Do** make every committed action Pressed Ink (#1A1A1A), pill-shaped, with a
  `translateY(-1px)` hover lift. Pink invites, Ink commits.
- **Do** let product photography lead. Items are borderless and shadowless;
  the photo sits directly in whitespace over Warm Paper Cream.
- **Do** convey depth through whitespace and the white/cream tonal step, not
  shadows. Surfaces are flat at rest.
- **Do** build hierarchy from Inter's size and weight contrast alone, with tight
  negative tracking on headlines and loose +0.18em tracking on uppercase labels.
- **Do** ship real, well-lit photography of the actual handmade flowers. This is
  an imagery-led shop; a colored block where a product photo belongs is a bug.

### Don't:
- **Don't** look corporate or SaaS: no cold gradients, no hero-metric stat
  blocks, no stock-photo gloss, no generic startup polish.
- **Don't** look cutesy-cluttered: no tiled florals, no sticker overload, no
  comic-energy type, no discount-store loudness. Playful is a few details, not many.
- **Don't** wrap products in card frames, borders, or resting shadows. The
  borderless product item is the signature; a bordered grid kills it.
- **Don't** use `border-left` or `border-right` greater than 1px as a colored
  accent stripe on anything. Use full hairline borders or background tints.
- **Don't** introduce a second typeface. One family, Inter, carries the system.
- **Don't** flood the page with pink to seem "soft". Restraint is the softness.
- **Don't** add `background-clip: text` gradient headings, decorative
  glassmorphism, or bounce/elastic easing. Ease out; the one sanctioned blur is
  the scrolled navbar.
- **Don't** ship pure `#FFF` or `#000` in new work; the build still uses
  `#FFFFFF` and a `#000` button hover. New surfaces should warm neutrals toward
  the brand hue and deepen to Ink Deep (#0F0F0F), not pure black.

---
name: Kariyer Expo 27
description: A bright, photo-led event site. White ground, one tight grotesk (Geist) at 400/500, large calm headings, big rounded photographs and soft motion, in the same language as the Sungur İnşaat site. The logo's orange is the accent, reserved for primary actions and active states; the logo's navy carries the text.
colors:
  background: "oklch(0.995 0 0)"
  foreground: "oklch(0.2764 0.0915 261.1)"
  muted: "oklch(0.965 0.002 90)"
  muted-foreground: "oklch(0.47 0.03 261)"
  accent: "oklch(0.6847 0.1781 38.4)"
  accent-foreground: "oklch(0.2764 0.0915 261.1)"
  line: "oklch(0.53 0.17 38.4)"
  border: "oklch(0.92 0.004 261)"
  input: "oklch(0.55 0.04 260)"
  silver: "oklch(0.8585 0.02 260.2)"
  destructive: "oklch(0.52 0.19 26)"
typography:
  family: "Geist 400/500 (latin, latin-ext); one family for everything"
  hero: { size: "clamp(2.5rem, 5.6vw, 4.5rem)", lineHeight: 1.02, tracking: "-0.035em", class: ".text-hero" }
  display: { size: "clamp(2rem, 4vw, 3.25rem)", lineHeight: 1.05, tracking: "-0.03em", class: ".text-display" }
  h2: { size: "clamp(1.625rem, 2.8vw, 2.375rem)", lineHeight: 1.1, tracking: "-0.025em", class: ".text-h2" }
  h3: { size: "clamp(1.1875rem, 1.6vw, 1.375rem)", lineHeight: 1.25, tracking: "-0.015em", class: ".text-h3" }
  lead: { size: "clamp(1rem, 1.15vw, 1.0625rem)", lineHeight: 1.6, class: ".text-lead" }
  body: { size: "0.9375rem", lineHeight: 1.6 }
  meta: { size: "0.8125rem", lineHeight: 1.4, class: ".text-meta" }
spacing:
  section: "py-section: clamp(4rem, 9vw, 7.5rem)"
  section-tight: "py-section-tight: clamp(3rem, 6vw, 5rem)"
  container: ".container-page: 1320px, px-4 sm:px-6 lg:px-10"
radius:
  media: "20px (rounded-media): photos, the CTA band"
  card: "16px (rounded-card): info bar, FAQ rows, form panel"
  pill: "9999px: buttons, tabs, badges, inputs"
motion:
  library: "motion, all m.* under MotionProvider's LazyMotion strict (components/reveal.tsx)"
  ease: "[0.16, 1, 0.3, 1]; spring { stiffness: 260, damping: 30 } for the nav pill"
  rise: "Reveal, RevealText: opacity 0 to 1, y 24 to 0, 0.7s; on mount in the hero, once in view elsewhere"
  stagger: "RevealGroup: 0.08s per item"
  photo: "PhotoReveal: inset(8% round 20px) to inset(0), with 1.08 to 1 zoom, 1.1s"
  hero: "headline (0s), lede (0.12s), photo (0.2s), info bar (0.5s)"
  tabs: "the active pill is a shared view transition (indicator); panels cross-fade"
  press: "pills scale 0.97, 0.15s"
  header: "white sticky bar, 72px to 60px with a hairline after 24px of scroll; sliding muted nav pill"
  reduced-motion: "MotionConfig reducedMotion=user drops transforms and keeps fades; [data-reveal] clip forced off; the marquee stops and its names wrap"
---

## Overview

Kariyer Expo 27 reads like a bright, modern event site: white space, one confident grotesk, big rounded photographs and an orange that only ever means "act here". The language comes from the Sungur İnşaat site (`~/Workspace/sungurinsaat/DESIGN.md`). The one deliberate difference: Sungur's accent is its navy with near-black text; here the accent is the logo's orange and navy is the text.

## Colors

- One page theme: light. The only dark area is the CTA band, a photo under a navy scrim.
- `accent` (orange) appears only as a fill: primary pills, active tabs, the selected form role. Text on it is navy (4.91:1), never white (3.04:1).
- `line` is the readable orange (5.63:1 on white): small icons, the open FAQ chevron, the focus ring. Raw `accent` is 2.99:1 on white, so it never carries a word.
- `muted` is the only tinted ground: info bar, FAQ rows, inactive tabs, speaker frames.
- Text: `foreground` for headings and body, `muted-foreground` for leads and meta (6.74:1 on white, 6.19:1 on muted).
- Run `bun scripts/check-contrast.ts` after changing a token; it keeps its own copy.

## Typography

- Geist for everything: 500 for headings and buttons, 400 for text. No serif, no italics, no uppercase.
- A heading's second phrase is `muted-foreground` (two tones), through `RevealText`'s `accent`.
- Headings `text-wrap: balance`, paragraphs `pretty`, body measure at most about 62ch.
- Numbers use `tabular-nums`. No eyebrows above headings.

## Sections

| Block | Content | Component |
|---|---|---|
| Hero | headline at the start; tagline, lede and programme link at the end; full-width photo; info bar over its edge with date, place, free entry and the form | `sections/hero.tsx` |
| About | heading and story; large photo with three facts | `sections/about.tsx` |
| Stats | last year's four numbers on hairlines | `sections/stats.tsx` |
| Audiences | pill tabs; photo with summary, points, note, CTA | `sections/audiences-selector.tsx` |
| Program | pill toggle; numbered session rows in two columns | `sections/program-list.tsx` |
| Speakers | grid of four portrait frames; muted "yakında" until announced | `sections/speakers.tsx` |
| Partners | one marquee of names with a pause button | `sections/partners.tsx` |
| FAQ | accordion in muted rows at the start, photo at the end | `sections/faq.tsx` |
| CTA | rounded photo band, navy scrim, centred heading, form on a white panel | `sections/cta-band.tsx` |

## Components

- **PillLink** (`components/pill-link.tsx`): action links over `buttonVariants`. `accent` is primary, `default` is navy, plus `outline`, `light`.
- **Header** (`layout/site-header.tsx`): lockup, links with a sliding muted pill, orange CTA. Below lg, a full-screen sheet under the bar.
- **Footer** (`layout/site-footer.tsx`): white ground, top hairline; lockup, blurb and social icons; pages, contact and Instagram columns; bottom row.
- **Form** (`subscribe-form.tsx`): `bar` in the hero, `stacked` with role pills in the CTA. Inputs are 48px pills with a 3:1 border.

## Don'ts

- No eyebrows, tilted type, doodles, em dashes, gradients on text or glass; no shadow but the info bar's.
- No second marquee. No `transition: all`.
- No invented numbers, speakers or testimonials. The fair's day, venue and speakers stay in their pending state until announced.

## Known gaps

- All photos in `public/photos/stock/` are Unsplash placeholders, listed in `images` in `lib/content.ts`. They show generic events, not this fair.
- The older Physiocoree photos (`public/photos/1-6.jpg`) are no longer referenced.
- The Instagram post set is still in the previous hand-lettered style, and `app/opengraph-image.png` was not regenerated.
- Video loops from the Sungur site are not built here.

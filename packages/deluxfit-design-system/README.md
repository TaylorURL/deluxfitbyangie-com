# @deluxfit/ds

The DeluxFit by Angie design system — a red/black "gym-luxe" theme for the
coaching sales funnel. Bold, high-contrast, athletic: true blacks and charcoals,
an aggressive crimson accent, off-white text, a heavy condensed display face
(Oswald) for headlines, and a clean sans (Inter) for body.

It is consumed by the app via the `@deluxfit/ds` path alias (aliased to source
in `vite.config.js` + `jsconfig.json`) — there is **no separate build step**.

```js
import { Button, PricingCard, Section } from '@deluxfit/ds'
```

Importing the package entry also pulls in the token stylesheet.

## Tokens

Tokens are the single source of truth, exposed two ways:

1. **CSS variables** under the `--df-*` namespace, defined in
   `src/styles/tokens.css` on the `.df-root` wrapper.
2. **A Tailwind preset** (`tailwind-preset.cjs`) that maps those vars onto
   `df-*` utilities plus a literal `red-*` / `brand-*` crimson scale. The app's
   `tailwind.config.js` extends this preset.

| Group      | Examples                                                                 |
| ---------- | ------------------------------------------------------------------------ |
| Surfaces   | `bg-df-bg`, `bg-df-surface`, `bg-df-surface-2`, `bg-df-surface-3`         |
| Borders    | `border-df-border`, `border-df-border-strong`, `border-df-border-hover`  |
| Text       | `text-df-text`, `text-df-text-muted`, `text-df-text-faint`               |
| Accent     | `bg-df-accent`, `text-df-accent-bright`, `bg-df-accent-soft`             |
| Brand red  | `text-red-600`, `bg-brand-700` (literal 50–950 crimson scale)            |
| Semantic   | `text-df-positive`, `text-df-warning`, `text-df-danger`                   |
| Radii      | `rounded-df-sm` … `rounded-df-2xl`, `rounded-df-full`                     |
| Shadows    | `shadow-df-md`, `shadow-df-lg`, `shadow-df-glow` (signature red glow)     |
| Fonts      | `font-display` (Oswald), `font-sans` (Inter)                             |
| Motion     | `ease-df-out`, `ease-df-spring`, `animate-df-fade-up`, `animate-df-marquee` |

## Components

All components are `cva`-based, composable, accessible, and theme-bound.

- **Button** — `variant`: `primary` (solid red) · `secondary` (outline surface) ·
  `outline` · `ghost`; `size`: `sm` · `md` · `lg`; `block`; `asChild` for anchors.
- **Badge** — eyebrow / status pill; `tone` × `variant` (`soft`/`solid`/`outline`).
- **Card** — elevated charcoal surface; `variant`, `padded`, `interactive`.
- **PricingCard** — tier name, price, period, feature list with check icons, a
  highlighted "Most Popular" state (red glow + scale), and an anchor CTA that
  opens a Stripe link in a new tab.
- **Testimonial** — quote, star rating, avatar (monogram fallback), name, result.
- **StatBlock** — oversized metric + label, optional accent color.
- **Accordion / FaqItem** — Radix accordion wrapper for the FAQ.
- **Input + Field** — email-capture control with a labelled, a11y-wired wrapper.
- **SectionEyebrow** — uppercase kicker with a red rule.
- **Marquee** — seamless scrolling logo/label strip (pauses on hover, freezes
  under reduced motion).

## Layout

- **Container** — width-capped, centered, responsive gutters (`sm`–`full`).
- **Section** — vertical rhythm band with an optional reveal-on-scroll header
  (eyebrow → heading → subhead) and inner Container.

## Motion

`Reveal` fades + lifts children into view once on scroll and honors
`prefers-reduced-motion`. `revealVariants` / `staggerContainer` are exported for
hand-tuned sequences.

<h1 align="center">@deluxfit/ds</h1>

<p align="center">
  <b>The DeluxFit by Angie design system — a red/black "gym-luxe" theme for the coaching funnel.</b>
</p>
<p align="center">
  Bold, high-contrast, athletic: true blacks and crimson, a condensed display face,<br />
  and <code>cva</code>-based components — consumed straight from source, no build step.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-2563eb?style=for-the-badge&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-preset-2563eb?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind preset" />
  <img src="https://img.shields.io/badge/Radix_UI-slot-2563eb?style=for-the-badge&logo=radixui&logoColor=white" alt="Radix UI" />
  <img src="https://img.shields.io/badge/private-UNLICENSED-2563eb?style=for-the-badge" alt="Private / UNLICENSED" />
</p>

<br />

## Why @deluxfit/ds

The whole site — funnel, portal, and coach dashboard — is drawn from one visual language: true blacks and charcoals, an aggressive crimson accent, off-white text, an ultra-condensed display face (Anton) for headlines, a high-contrast serif (Fraunces, set in italic) for accent phrases, and a clean sans (Inter) for body. `@deluxfit/ds` is that language made importable. It exposes tokens as CSS variables and a Tailwind preset, ships accessible `cva`-based components, and is aliased to source in the app — so a change to a token or component shows up everywhere with no publish and no build.

## Usage

Consumed via the `@deluxfit/ds` path alias (aliased to source in `vite.config.js` +
`jsconfig.json`). Importing the package entry also pulls in the token stylesheet.

```js
import { Button, PricingCard, Section } from '@deluxfit/ds'
```

## Tokens

Tokens are the single source of truth, exposed two ways:

1. **CSS variables** under the `--df-*` namespace, defined in `src/styles/tokens.css` on the
   `.df-root` wrapper.
2. **A Tailwind preset** (`tailwind-preset.cjs`) that maps those vars onto `df-*` utilities
   plus a literal `red-*` / `brand-*` crimson scale. The app's `tailwind.config.js` extends
   this preset.

| Group      | Examples |
| :--------- | :------- |
| Surfaces   | `bg-df-bg`, `bg-df-surface`, `bg-df-surface-2`, `bg-df-surface-3` |
| Borders    | `border-df-border`, `border-df-border-strong`, `border-df-border-hover` |
| Text       | `text-df-text`, `text-df-text-muted`, `text-df-text-faint` |
| Accent     | `bg-df-accent`, `text-df-accent-bright`, `bg-df-accent-soft` |
| Brand red  | `text-red-600`, `bg-brand-700` (literal 50–950 crimson scale) |
| Semantic   | `text-df-positive`, `text-df-warning`, `text-df-danger` |
| Radii      | `rounded-df-sm` … `rounded-df-2xl`, `rounded-df-full` |
| Shadows    | `shadow-df-md`, `shadow-df-lg`, `shadow-df-glow` (signature red glow) |
| Fonts      | `font-display` (Anton), `font-accent` (Fraunces, italic), `font-sans` (Inter) |
| Motion     | `ease-df-out`, `ease-df-spring`, `animate-df-fade-up`, `animate-df-marquee` |

## Components

All components are `cva`-based, composable, accessible, and theme-bound.

- **Button** — `variant`: `primary` (solid red) · `secondary` (outline surface) · `outline` ·
  `ghost`; `size`: `sm` · `md` · `lg`; `block`; `asChild` for anchors.
- **Badge** — eyebrow / status pill; `tone` × `variant` (`soft`/`solid`/`outline`).
- **Card** — elevated charcoal surface; `variant`, `padded`, `interactive`.
- **PricingCard** — tier name, price, period, feature list with check icons, a highlighted
  "Most Popular" state (red glow + scale), and an anchor CTA that opens a Stripe link.
- **Testimonial** — quote, star rating, avatar (monogram fallback), name, result.
- **StatBlock** — oversized metric + label, optional accent color.
- **Input / Textarea / Select + Field** — form controls with a labelled, a11y-wired wrapper.
- **SectionEyebrow / SectionIndex / SplitHeading** — uppercase kickers, numbered index labels,
  and split display headings for section headers.
- **Marquee** — seamless scrolling logo/label strip (pauses on hover, freezes under reduced
  motion).

## Layout

- **Container** — width-capped, centered, responsive gutters (`sm`–`full`).
- **Section** — vertical rhythm band with an optional reveal-on-scroll header
  (eyebrow → heading → subhead) and inner Container.

## Motion

`Reveal` fades + lifts children into view once on scroll and honors
`prefers-reduced-motion`. The `delay` prop offsets the entrance for hand-tuned
sequencing.

## Exports

| Entry | Purpose |
| :---- | :------ |
| `@deluxfit/ds` | Components, layout, `cn()`, and the token stylesheet side-effect |
| `@deluxfit/ds/styles/tokens.css` | Raw `--df-*` token stylesheet |
| `@deluxfit/ds/tailwind-preset` | Tailwind preset mapping tokens onto `df-*` utilities |

## License

Private and proprietary — `UNLICENSED`. Part of the DeluxFit by Angie codebase.

<br />

<p align="center">
  <sub>One crimson language — tokens in, whole site out.</sub>
</p>

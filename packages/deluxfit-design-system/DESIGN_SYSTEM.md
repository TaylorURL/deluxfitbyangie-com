<h1 align="center">@deluxfit/ds</h1>

<p align="center">
  <b>The DeluxFit by Angie design system. A red and black “gym-luxe” theme for the coaching funnel.</b>
</p>
<p align="center">
  High-contrast and athletic: near-black grounds and crimson, a condensed display face,<br />
  ring-first elevation, and <code>cva</code>-based components, consumed straight from source with no build step.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-e11d2a?style=for-the-badge&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-preset-e11d2a?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind preset" />
  <img src="https://img.shields.io/badge/Radix_UI-slot-e11d2a?style=for-the-badge&logo=radixui&logoColor=white" alt="Radix UI" />
  <img src="https://img.shields.io/badge/private-UNLICENSED-e11d2a?style=for-the-badge" alt="Private / UNLICENSED" />
</p>

<br />

## Why @deluxfit/ds

The whole site (funnel, portal, and coach dashboard) is drawn from one visual language: near-black grounds and charcoals, a crimson accent, off-white text, an ultra-condensed display face (Anton) for headlines, a didone serif (Bodoni Moda) reserved for pull quotes, and a clean sans (Inter) for everything else. `@deluxfit/ds` is that language made importable. It exposes tokens as CSS variables and a Tailwind preset, ships accessible `cva`-based components, and is aliased to source in the app, so a change to a token or component shows up everywhere with no publish and no build.

Emphasis inside a headline is carried by colour in the same face at the same size. The other way to do it — dropping the phrase into an italic serif — costs the headline its line, because two faces at two widths never sit on one baseline the way one face does.

Elevation is a ring first. Every shadow in the scale opens with a hairline of the surface's own border colour and then adds the ambient and key drops, so a raised surface is legible before any blur is drawn and stays legible on a ground the blur disappears into. A key sits on the surface rather than floating above it, which makes its light a contact shadow rather than a coloured bloom: one glowing button looks important, and a screen of them looks like a demo.

## Usage

Consumed via the `@deluxfit/ds` path alias (aliased to source in `vite.config.js` +
`jsconfig.json`). Importing the package entry also pulls in the token stylesheet.

```js
import { Button, PricingCard, Section } from '@deluxfit/ds'
```

## Tokens

Tokens are the single source of truth, exposed two ways:

1. **CSS variables** under the `--df-*` namespace, defined in `src/styles/tokens.css`. The
   scales that do not change with tone (radii, motion, elevation, header height, layering)
   sit on `:root`; the colours are declared per tone, so a `data-theme` of `dark`, `light`
   or `gray` on any element re-scopes every colour token below it. `.df-root` carries the
   dark set and the base element styles.
2. **A Tailwind preset** (`tailwind-preset.cjs`) that maps those vars onto `df-*` utilities
   plus a literal `red-*` / `brand-*` crimson scale. The app's `tailwind.config.js` extends
   this preset.

| Group     | Examples                                                                                                                                                       |
| :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Surfaces  | `bg-df-bg`, `bg-df-surface`, `bg-df-surface-2`, `bg-df-surface-3`                                                                                              |
| Borders   | `border-df-border`, `border-df-border-strong`, `border-df-border-hover`                                                                                        |
| Text      | `text-df-text`, `text-df-text-muted`, `text-df-text-faint`                                                                                                     |
| Accent    | `bg-df-accent`, `text-df-accent-bright`, `bg-df-accent-soft`                                                                                                   |
| Brand red | `text-red-600`, `bg-brand-700` (literal 50-950 crimson scale)                                                                                                  |
| Semantic  | `text-df-positive`, `text-df-warning`, `text-df-danger`                                                                                                        |
| Fields    | `bg-df-field`, `bg-df-field-hover`, `border-df-border-input`                                                                                                   |
| Radii     | `rounded-df-xs` (4px) · `sm` (6) · `md` (8) · `lg` (12) · `xl` (16) · `2xl` (20) · `full`                                                                      |
| Shadows   | `shadow-df-sm` · `md` · `lg` · `xl` (ring first, then ambient, then key), `shadow-df-key` / `key-soft` (a control's contact light), `shadow-df-ring` (focus)   |
| Controls  | `h-df-control-sm` (36px) · `h-df-control` (44) · `h-df-control-lg` (52); `h-df-bar` for the floating navigation bar                                            |
| Widths    | `max-w-df-measure` (68ch, the reading measure)                                                                                                                 |
| Fonts     | `font-display` (Anton), `font-accent` (Bodoni Moda, pull quotes only), `font-sans` (Inter)                                                                     |
| Motion    | `duration-df-fast` (120ms) · `df-base` (180) · `df-slow` (260); `ease-df-out`, `ease-df-in-out`; `animate-df-rise`, `animate-df-shimmer`, `animate-df-marquee` |

## Components

All components are `cva`-based, composable, accessible, and theme-bound.

- **Button**: `variant`: `primary` (solid crimson) · `secondary` · `outline` · `ghost` ·
  `danger`; `size`: `sm` · `md` · `lg` from the control-height tokens; `block`; `asChild` for
  anchors. The filled key deepens under the pointer rather than brightening.
- **Badge**: eyebrow / status pill; `tone` × `variant` (`soft`/`solid`/`outline`).
- **Panel**: the surface a reader works inside — a form, a calendar, a sheet of controls.
  `elevation`: `flat` · `raised`; `padded`; `as` to render it as the form itself.
- **Card**: the surface a reader reads. Ring-first, no border of its own; `interactive`
  deepens the ring rather than lifting the card.
- **PricingCard**: tier name, price, period, feature list, a recommended state named by its
  edge rather than by being scaled up, and an anchor CTA — an internal path stays in the app,
  an absolute URL opens in a new tab with `rel="noopener noreferrer"`.
- **Testimonial**: quote, star rating, avatar (monogram fallback), name, result.
- **Stat / StatBlock**: a figure with its unit and, where there is one, the change from
  before — carried by an arrow as well as a colour, with `goodDirection` deciding which way
  green points.
- **Meter**: a bounded figure drawn as a bar, `role="meter"`, filled on `scaleX`.
- **DataTable**: sticky head, right-aligned tabular numerics, an `sm:hidden` card list for
  phones, and distinct loading, empty and error states.
- **Skeleton / SkeletonText**: the one placeholder in the system. The sweep is a child
  travelling on `transform`, and it is not drawn at all under reduced motion.
- **Field + Input / Textarea / Select / NumberField / DateField / SegmentedControl / Switch /
  FileDrop**: the form vocabulary. The label is always drawn, so the placeholder is free to
  show the shape of a valid answer; an error is carried by a marker and a sentence as well as
  the edge, tied to the control through `aria-describedby`. `Input` takes a leading `icon` and
  a trailing `suffix`, `Textarea` grows to fit, `NumberField` repeats on press-and-hold and
  can start from the last logged value, `DateField` carries relative shortcuts, and
  `SegmentedControl`'s selected ground travels on a shared layout id.
- **SectionEyebrow / SplitHeading**: uppercase kickers, and display headings on a three-step
  scale (`page` · `section` · `sub`) with one phrase carried in the accent colour.
- **Marquee**: scrolling logo/label strip that loops without a visible seam (pauses on hover, freezes under reduced
  motion).

## Layout

- **Container**: width-capped, centered, responsive gutters (`sm` to `full`).
- **Section**: vertical rhythm band with an optional reveal-on-scroll header
  (eyebrow, then heading, then subhead) and inner Container.

## Motion

`Reveal` lifts children into view once on scroll and honours
`prefers-reduced-motion`, which drops the wrapper entirely. `delay` offsets the
entrance for hand-tuned sequencing.

Above the fold it is the wrong tool twice over: it waits on an observer to say
what the reader can already see, and an element first painted at nothing is never
reconsidered as the page's largest paint. So the first screen arrives on the
`animate-df-rise` keyframe instead — a transform with no opacity, running on the
compositor rather than on a frame loop, which is also what makes it arrive in a
tab the browser has throttled. `onMount` and `fade={false}` give `Reveal` the
same two properties where a component needs them.

## Exports

| Entry                            | Purpose                                                                                                                |
| :------------------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| `@deluxfit/ds`                   | Components, layout, `cn()`, the token readers (`useTokenColors`, `hexToUnitRgb`), and the token stylesheet side-effect |
| `@deluxfit/ds/styles/tokens.css` | Raw `--df-*` token stylesheet                                                                                          |
| `@deluxfit/ds/tailwind-preset`   | Tailwind preset mapping tokens onto `df-*` utilities                                                                   |

## License

Private and proprietary, `UNLICENSED`. Part of the DeluxFit by Angie codebase.

<br />

<p align="center">
  <sub>One crimson language: tokens in, whole site out.</sub>
</p>

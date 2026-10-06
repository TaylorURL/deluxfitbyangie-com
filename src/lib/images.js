/*
 * Every raster the site serves, with the box it occupies and the widths it
 * is offered at.
 *
 * The browser picks a file before layout runs, so the choice is made from
 * `srcset` and `sizes` and from nothing else. A single 1600px file means a
 * 390 point phone downloads the desktop image; the intrinsic dimensions in
 * the same record are what hold the box while it arrives.
 *
 * `scripts/images.py` writes the variants and this table together, so a
 * photo added to `public/brand` without a run of that script is a photo with
 * no small file behind it.
 */
const SOURCES = {
  '/brand/gym-back-squat-discipline.webp': {
    width: 1600,
    height: 2240,
    variants: [480, 800, 1200],
  },
  '/brand/gym-barbell-squat.webp': { width: 1600, height: 2240, variants: [480, 800, 1200] },
  '/brand/gym-battle-ropes.webp': { width: 1600, height: 2240, variants: [480, 800, 1200] },
  '/brand/gym-dumbbell-deadlift.webp': { width: 1600, height: 2240, variants: [480, 800, 1200] },
  '/brand/gym-lat-pulldown.webp': { width: 1600, height: 2240, variants: [480, 800, 1200] },
  '/brand/gym-leg-press.webp': { width: 1600, height: 1142, variants: [480, 800, 1200] },
  '/brand/gym-squat-rack-portrait.webp': { width: 1600, height: 2240, variants: [480, 800, 1200] },
  '/brand/studio-back-pose.webp': { width: 1600, height: 2240, variants: [480, 800, 1200] },
  '/brand/studio-cobra-stretch.webp': { width: 1600, height: 2240, variants: [480, 800, 1200] },
  '/brand/studio-dumbbell-side-pose.webp': {
    width: 1600,
    height: 2400,
    variants: [480, 800, 1200],
  },
  '/brand/studio-kettlebell-portrait.webp': {
    width: 1600,
    height: 2240,
    variants: [480, 800, 1200],
  },
  '/brand/studio-portrait-dumbbells.webp': {
    width: 1600,
    height: 2240,
    variants: [480, 800, 1200],
  },
  '/brand/studio-red-mat-seated.webp': { width: 1600, height: 2240, variants: [480, 800, 1200] },
  '/brand/studio-seated-portrait.webp': { width: 1600, height: 2400, variants: [480, 800, 1200] },
  '/brand/studio-step-up-dumbbell.webp': { width: 1600, height: 2400, variants: [480, 800, 1200] },
  '/brand/transformation-1.webp': { width: 1080, height: 1350, variants: [480, 800] },
  '/brand/transformation-2.webp': { width: 1080, height: 1350, variants: [480, 800] },
  '/brand/transformation-3.webp': { width: 1080, height: 1350, variants: [480, 800] },
  '/brand/transformation-4.webp': { width: 1080, height: 1350, variants: [480, 800] },
  '/brand/transformation-5.webp': { width: 1080, height: 1350, variants: [480, 800] },
  '/brand/transformation-6.webp': { width: 1080, height: 1350, variants: [480, 800] },
  '/brand/transformation-7.webp': { width: 1080, height: 1350, variants: [480, 800] },
  '/deluxfit-logo.webp': { width: 946, height: 308, variants: [320, 640] },
}

/**
 * The intrinsic box of a source, so an `img` can declare it and hold its space.
 *
 * @param {string} src - a site-absolute path under `public`
 * @returns {{ width: number, height: number } | undefined}
 */
export function imageBox(src) {
  return SOURCES[src]
}

/**
 * A `srcset` offering every variant that is smaller than the original, plus the
 * original itself at its own width.
 *
 * @param {string} src - a site-absolute path under `public`
 * @returns {string | undefined} undefined when the source has no variants, which
 *   leaves the `img` with its single `src` rather than a broken candidate list
 */
export function imageSrcSet(src) {
  const source = SOURCES[src]
  if (!source) return undefined
  const stem = src.replace(/\.webp$/, '')
  const candidates = source.variants.map(width => `${stem}-${width}.webp ${width}w`)
  if (!candidates.length) return undefined
  return [...candidates, `${src} ${source.width}w`].join(', ')
}

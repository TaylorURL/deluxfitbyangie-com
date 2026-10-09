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

/*
 * A photograph that loses its fetch stays lost.
 *
 * An `img` gets exactly one attempt: the browser asks for the candidate
 * `srcset` chose, and if that request dies — a connection that drops between
 * the document and the pictures, a laptop changing network mid-page, an edge
 * that resets one stream of a dozen — the element fires `error` once and then
 * holds an empty box for as long as the reader stays on the page. The frames
 * on this site are dark boxes on a dark ground, so the page does not look
 * broken; it looks like a page that was designed with holes in it, and the
 * wordmark in the bar simply is not there. Nothing short of a reload brings
 * any of it back, and a reader who has already seen the page once has no
 * reason to reload it.
 *
 * A retry is the whole of the repair, because the files are not the problem:
 * the request is. Asking again a few hundred milliseconds later is what the
 * reader would have done by hand.
 *
 * The retry carries a parameter the first request did not, because an `img`
 * handed the `src` it already holds does nothing at all — the attribute has
 * not changed, so there is no new fetch to make. A distinct URL is what makes
 * it a second request rather than a no-op, and it reaches the same file: the
 * origin serves these by path and ignores the query.
 *
 * Both attempts are counted on the element, so a file that is genuinely gone
 * costs two requests and stops, rather than retrying for as long as the page
 * is open. The report still goes out on the first failure — the handler in
 * the entry document is on `window` in the capture phase and runs before this
 * one — so a recovery that works is still visible as a fault that happened.
 */
const RECOVERY_ATTEMPTS = 2

/** Short enough to beat the reader to the empty box, spaced enough to outlast a blip. */
const RECOVERY_DELAYS_MS = [350, 1400]

function retriedUrl(url, attempt) {
  if (!url) return url
  return `${url}${url.includes('?') ? '&' : '?'}retry=${attempt}`
}

function retriedSrcSet(srcSet, attempt) {
  return srcSet
    .split(',')
    .map(candidate => candidate.trim())
    .filter(Boolean)
    .map(candidate => {
      const [url, ...descriptor] = candidate.split(/\s+/)
      return [retriedUrl(url, attempt), ...descriptor].join(' ')
    })
    .join(', ')
}

/**
 * Asks again for an image whose fetch failed, twice at most.
 *
 * Wire it to `onError` on any `img` a reader is meant to see.
 *
 * @param {{ currentTarget: HTMLImageElement }} event - the element's own error event
 */
export function recoverImage(event) {
  const image = event?.currentTarget
  if (!image || !image.isConnected) return
  const attempt = Number(image.dataset.retry || 0) + 1
  if (attempt > RECOVERY_ATTEMPTS) return
  // The URLs the markup asked for, kept aside on the first failure so the
  // second attempt is built from them rather than from the first attempt's.
  if (image.dataset.retryFrom === undefined) {
    image.dataset.retryFrom = image.getAttribute('src') || ''
    image.dataset.retryFromSet = image.getAttribute('srcset') || ''
  }
  image.dataset.retry = String(attempt)
  const src = image.dataset.retryFrom
  const srcSet = image.dataset.retryFromSet
  window.setTimeout(
    () => {
      if (!image.isConnected) return
      if (srcSet) image.setAttribute('srcset', retriedSrcSet(srcSet, attempt))
      if (src) image.setAttribute('src', retriedUrl(src, attempt))
    },
    RECOVERY_DELAYS_MS[attempt - 1]
  )
}

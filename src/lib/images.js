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
 * the request is. Asking again is what the reader would have done by hand.
 *
 * ASK FOR AS LONG AS THE READER IS STILL THERE, AND ASK WHEN THERE IS
 * SOMETHING TO ASK OVER. Two attempts at 350ms and 1400ms spend the entire
 * recovery inside the first 1.75 seconds of the failure, which answers a
 * dropped packet and nothing slower than one. A phone walking out of wifi
 * onto cellular, a laptop waking up, a tunnel — each of those is down for
 * seconds, so both attempts are made into a connection that is still gone,
 * the budget is finished before the reader has looked up, and the box is
 * empty for the rest of the visit. The delays therefore back off far enough
 * to outlast an interruption rather than a blip, an attempt the browser
 * already knows has nothing to travel over is not made at all, and the
 * connection coming back asks again on the spot: `online` is the one moment
 * where asking is known to be worth it, and it is the moment a reader is
 * looking at the page waiting for it to come right.
 *
 * The retry carries a parameter the first request did not, because an `img`
 * handed the `src` it already holds does nothing at all — the attribute has
 * not changed, so there is no new fetch to make. A distinct URL is what makes
 * it a second request rather than a no-op, and it reaches the same file: the
 * origin serves these by path and ignores the query. The token counts every
 * ask the element has ever made and never goes back, so an ask after the
 * connection returns is still a URL the browser has not seen.
 *
 * The attempts are counted separately from that token, and the count starts
 * again when the connection does, so a file that is genuinely gone on a
 * healthy connection costs a bounded handful of requests and stops rather
 * than retrying for as long as the page is open.
 *
 * The report still goes out on the first failure — the handler in the entry
 * document is on `window` in the capture phase and runs before this one — so
 * a recovery that works is still visible as a fault that happened.
 */
const RECOVERY_ATTEMPTS = 4

/**
 * Short enough to beat the reader to the empty box, then long enough to
 * outlast a connection that is changing rather than dropping a packet.
 */
const RECOVERY_DELAYS_MS = [350, 1400, 5000, 15000]

/** Images whose last ask failed, still on the page and still showing nothing. */
const waiting = new Set()

let watchingTheConnection = false

function retriedUrl(url, token) {
  if (!url) return url
  return `${url}${url.includes('?') ? '&' : '?'}retry=${token}`
}

function retriedSrcSet(srcSet, token) {
  return srcSet
    .split(',')
    .map(candidate => candidate.trim())
    .filter(Boolean)
    .map(candidate => {
      const [url, ...descriptor] = candidate.split(/\s+/)
      return [retriedUrl(url, token), ...descriptor].join(' ')
    })
    .join(', ')
}

/** Asks for the URLs the markup wanted, under a token no earlier ask used. */
function askAgain(image) {
  if (!image.isConnected) {
    waiting.delete(image)
    return
  }
  const token = Number(image.dataset.retry || 0) + 1
  image.dataset.retry = String(token)
  const src = image.dataset.retryFrom
  const srcSet = image.dataset.retryFromSet
  if (srcSet) image.setAttribute('srcset', retriedSrcSet(srcSet, token))
  if (src) image.setAttribute('src', retriedUrl(src, token))
}

/**
 * Asks again for every image still showing nothing, the moment the browser
 * says it has a connection again. Attached once, on the first failure, so a
 * visit that loses nothing never installs it.
 */
function watchTheConnection() {
  if (watchingTheConnection) return
  watchingTheConnection = true
  window.addEventListener('online', () => {
    for (const image of [...waiting]) {
      if (!image.isConnected || image.naturalWidth > 0) {
        waiting.delete(image)
        continue
      }
      // A connection that has come back is new information rather than one
      // more go at the old one, so the attempts start again with it.
      image.dataset.retrySpent = '0'
      askAgain(image)
    }
  })
}

/**
 * Asks again for an image whose fetch failed, backing off, and again as soon
 * as a lost connection returns.
 *
 * Wire it to `onError` on any `img` a reader is meant to see.
 *
 * @param {{ currentTarget: HTMLImageElement }} event - the element's own error event
 */
export function recoverImage(event) {
  const image = event?.currentTarget
  if (!image || !image.isConnected) return
  // The URLs the markup asked for, kept aside on the first failure so every
  // later ask is built from them rather than from the ask before it.
  if (image.dataset.retryFrom === undefined) {
    image.dataset.retryFrom = image.getAttribute('src') || ''
    image.dataset.retryFromSet = image.getAttribute('srcset') || ''
  }
  waiting.add(image)
  watchTheConnection()
  // An ask the browser already knows has nothing to travel over is an attempt
  // spent on nothing. The handler above makes it when there is a connection.
  if (navigator.onLine === false) return
  const spent = Number(image.dataset.retrySpent || 0)
  if (spent >= RECOVERY_ATTEMPTS) return
  image.dataset.retrySpent = String(spent + 1)
  window.setTimeout(() => askAgain(image), RECOVERY_DELAYS_MS[spent])
}

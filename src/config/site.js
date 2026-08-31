/**
 * The canonical origin the site is served from.
 *
 * Canonical links, `og:url`, share images and structured data are all read away
 * from the page that carried them, so every URL they hold has to be absolute
 * and has to name one host. Without that, the www and bare-domain variants of
 * a route compete with each other for the same ranking.
 */
export const SITE_URL = 'https://www.deluxfitbyangie.com'

/** The 1200x630 share card served for any route that does not name its own. */
export const SITE_SHARE_IMAGE = `${SITE_URL}/og.png`

/** Resolves a site-relative path to its absolute URL on the canonical origin. */
export function absoluteUrl(path) {
  if (!path) return SITE_URL
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

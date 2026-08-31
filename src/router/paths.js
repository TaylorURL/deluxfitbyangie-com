/*
 * The public paths, as plain data.
 *
 * `routes.js` hangs a component off each one and the build reads the same list
 * to write `sitemap.xml`. Keeping the paths here — with no React import in the
 * file — is what lets the Vite config import it directly, so a route added to
 * the site is a route in the sitemap without anyone remembering to add it.
 *
 * `priority` is the crawler's hint about relative importance within this site
 * only; it says nothing about ranking against anyone else.
 */
export const ROUTE_PATHS = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/about', priority: 0.8, changefreq: 'monthly' },
  { path: '/membership', priority: 0.9, changefreq: 'monthly' },
  { path: '/online-coaching', priority: 0.9, changefreq: 'monthly' },
  { path: '/single-session', priority: 0.8, changefreq: 'monthly' },
  { path: '/training', priority: 0.8, changefreq: 'monthly' },
  { path: '/testimonials', priority: 0.6, changefreq: 'weekly' },
  { path: '/contact', priority: 0.6, changefreq: 'yearly' },
  { path: '/privacy', priority: 0.3, changefreq: 'yearly' },
  { path: '/terms', priority: 0.3, changefreq: 'yearly' },
]

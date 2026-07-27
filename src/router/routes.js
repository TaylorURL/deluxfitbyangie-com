/*
 * The public site map. Vercel rewrites every URL to `index.html`, so the client
 * picks the page off the path. `matchRoute` compares normalized paths for exact
 * equality — there is no pattern or prefix matching here, so entry order does
 * not affect which route wins.
 *
 * Anything that renders its own root-level shell instead of SiteShell lives in
 * `App.jsx` under STANDALONE_ROUTES, not here.
 */

import Home from '../pages/Home'
import About from '../pages/About'
import Membership from '../pages/Membership'
import OnlineCoaching from '../pages/OnlineCoaching'
import SingleSession from '../pages/SingleSession'
import LiveTrainingProgram from '../pages/LiveTrainingProgram'
import Testimonials from '../pages/Testimonials'
import Contact from '../pages/Contact'
import NotFound from '../pages/NotFound'

export const ROUTES = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/membership', component: Membership },
  { path: '/online-coaching', component: OnlineCoaching },
  { path: '/single-session', component: SingleSession },
  { path: '/training', component: LiveTrainingProgram },
  { path: '/testimonials', component: Testimonials },
  { path: '/contact', component: Contact },
]

export const NOT_FOUND = NotFound

/**
 * Normalize a pathname by stripping trailing slashes (except root) and
 * lower-casing — so `/About/` and `/about` resolve to the same route.
 */
export function normalizePath(pathname) {
  if (typeof pathname !== 'string' || pathname.length === 0) return '/'
  const trimmed = pathname.replace(/\/+$/, '').toLowerCase()
  return trimmed === '' ? '/' : trimmed
}

export function matchRoute(pathname) {
  const normalized = normalizePath(pathname)
  return ROUTES.find(route => normalizePath(route.path) === normalized) ?? null
}

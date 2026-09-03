/*
 * The public site map. Vercel rewrites every URL to `index.html`, so the client
 * picks the page off the path. `matchRoute` compares normalized paths for exact
 * equality — there is no pattern or prefix matching here, so entry order does
 * not affect which route wins.
 *
 * Anything that renders its own root-level shell instead of SiteShell lives in
 * `App.jsx` under STANDALONE_ROUTES, not here.
 *
 * The paths come from `./paths.js`, which the build also reads to write
 * `sitemap.xml`. A route mounted here is therefore published, and one that is
 * not mounted is not — which is the point of taking the list from the router
 * rather than from the file tree.
 */

import { lazy } from 'react'
import Home from '../pages/Home'
import { ROUTE_PATHS } from './paths'

/*
 * Each page is its own chunk. A visitor reading the membership page has no use
 * for the contact form's validation or the testimonials gallery, and one
 * bundle holding them all makes the first page wait for every other one.
 *
 * The home page is the exception and rides with the bundle. It is where most
 * visits begin, and a chunk of its own is a second round trip between the app
 * arriving and the first screen being drawn.
 */
const COMPONENTS = {
  '/': Home,
  '/about': lazy(() => import('../pages/About')),
  '/membership': lazy(() => import('../pages/Membership')),
  '/online-coaching': lazy(() => import('../pages/OnlineCoaching')),
  '/single-session': lazy(() => import('../pages/SingleSession')),
  '/training': lazy(() => import('../pages/LiveTrainingProgram')),
  '/testimonials': lazy(() => import('../pages/Testimonials')),
  '/contact': lazy(() => import('../pages/Contact')),
  '/privacy': lazy(() => import('../pages/Privacy')),
  '/terms': lazy(() => import('../pages/Terms')),
}

const ROUTES = ROUTE_PATHS.map(({ path }) => ({ path, component: COMPONENTS[path] }))

export const NOT_FOUND = lazy(() => import('../pages/NotFound'))

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

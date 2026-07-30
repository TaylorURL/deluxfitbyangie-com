import { useEffect } from 'react'
import ClientPortal from './portal/ClientPortal'
import DevUpload from './components/DevUpload'
import SiteShell from './components/SiteShell'
import AdminApp from './admin/AdminApp'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ResetPassword from './pages/ResetPassword'
import UpdatePassword from './pages/UpdatePassword'
import { matchRoute, NOT_FOUND, normalizePath, useLocation } from './router'
import { useContent } from './i18n'

/**
 * Standalone routes — these render outside the SiteShell because they own
 * their own chrome (header + footer treatment).
 *
 * `/admin` matches by prefix (the matcher uses startsWith) so every
 * `/admin/*` sub-route lands inside AdminApp, which gates access on
 * `profiles.role = 'staff'` via ProtectedRoute. The auth pages
 * (/login, /signup, /reset-password, /update-password) carry their own
 * AuthShell — same back-to-site treatment, no SiteShell chrome.
 */
const STANDALONE_ROUTES = [
  { path: '/portal', component: ClientPortal },
  { path: '/admin', component: AdminApp },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  { path: '/reset-password', component: ResetPassword },
  { path: '/update-password', component: UpdatePassword },
  { path: '/dev-upload', component: DevUpload },
]

function matchStandalone(pathname) {
  const normalized = normalizePath(pathname)
  return (
    STANDALONE_ROUTES.find(route =>
      normalized === normalizePath(route.path) ||
      normalized.startsWith(`${normalizePath(route.path)}/`)
    ) ?? null
  )
}

/**
 * Keep <title> and the description / OG meta tags in sync with the active
 * locale and the current route so search engines and social previews stay
 * accurate.
 */
function useDocumentMeta(meta, pathname) {
  useEffect(() => {
    if (typeof document === 'undefined') return
    document.title = meta.title

    const setMeta = (selector, value) => {
      const tag = document.head.querySelector(selector)
      if (tag) tag.setAttribute('content', value)
    }

    setMeta('meta[name="description"]', meta.description)
    setMeta('meta[property="og:title"]', meta.title)
    setMeta('meta[property="og:description"]', meta.description)
  }, [meta.title, meta.description, pathname])
}

/**
 * useScrollToTopOnNavigate — when the SPA router lands on a new pathname (no
 * hash), reset scroll to the top so each page reads from its hero. Anchors
 * within a page handle their own scrolling via the Link component.
 */
function useScrollToTopOnNavigate(pathname, hash) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [pathname, hash])
}

/**
 * useGlobalLinkInterception — Catches clicks on plain anchors with internal
 * paths (e.g. those rendered by the design-system PricingCard / CTAs that
 * don't go through the SPA <Link>) and routes them through the SPA history
 * API so the page transitions client-side instead of doing a full reload.
 */
function useGlobalLinkInterception(navigate) {
  useEffect(() => {
    if (typeof document === 'undefined') return
    const handler = event => {
      if (event.defaultPrevented) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button === 1) {
        return
      }
      const anchor = event.target.closest?.('a[href]')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || !href.startsWith('/')) return
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return
      if (anchor.dataset.routerSkip === 'true') return
      // Cross-origin anchors with absolute URLs slip past the startsWith check.
      const url = new URL(anchor.href, window.location.origin)
      if (url.origin !== window.location.origin) return

      event.preventDefault()
      const isSamePath = url.pathname === window.location.pathname
      if (isSamePath && url.hash) {
        window.history.replaceState({}, '', `${url.pathname}${url.hash}`)
        document
          .getElementById(url.hash.slice(1))
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
      navigate(`${url.pathname}${url.hash || ''}`)
      if (url.hash) {
        requestAnimationFrame(() => {
          document
            .getElementById(url.hash.slice(1))
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [navigate])
}

/**
 * Resolves the current pathname in three passes: a standalone route first (it
 * owns its own chrome and renders bare), then a SPA route from
 * `src/router/routes.js`, then a branded 404 — the last two inside SiteShell.
 */
export default function App() {
  const { meta } = useContent()
  const { pathname, hash, navigate } = useLocation()

  useDocumentMeta(meta, pathname)
  useScrollToTopOnNavigate(pathname, hash)
  useGlobalLinkInterception(navigate)

  const standalone = matchStandalone(pathname)
  if (standalone) {
    const Standalone = standalone.component
    return <Standalone />
  }

  const matched = matchRoute(pathname)
  const PageComponent = matched ? matched.component : NOT_FOUND

  return (
    <SiteShell>
      <PageComponent />
    </SiteShell>
  )
}

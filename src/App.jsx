import { lazy, Suspense, useEffect } from 'react'
import SiteShell from './components/SiteShell'
import RouteFallback from './components/RouteFallback'
import { matchRoute, NOT_FOUND, normalizePath, useLocation } from './router'
import { useContent, useLanguage } from './i18n'
import { absoluteUrl, SITE_SHARE_IMAGE } from './config/site'

/**
 * Standalone routes — these render outside the SiteShell because they own
 * their own chrome (header + footer treatment).
 *
 * `/admin` matches by prefix (the matcher uses startsWith) so every
 * `/admin/*` sub-route lands inside AdminApp, which gates access on
 * `profiles.role = 'staff'` via ProtectedRoute, and again in the database
 * through row level security. The auth pages (/login, /signup,
 * /reset-password, /update-password) carry their own AuthShell: same
 * back-to-site treatment, no SiteShell chrome.
 */
const STANDALONE_ROUTES = [
  { path: '/portal', component: lazy(() => import('./portal/ClientPortal')) },
  { path: '/admin', component: lazy(() => import('./admin/AdminApp')) },
  { path: '/login', component: lazy(() => import('./pages/Login')) },
  { path: '/signup', component: lazy(() => import('./pages/Signup')) },
  { path: '/reset-password', component: lazy(() => import('./pages/ResetPassword')) },
  { path: '/update-password', component: lazy(() => import('./pages/UpdatePassword')) },
]

function matchStandalone(pathname) {
  const normalized = normalizePath(pathname)
  return (
    STANDALONE_ROUTES.find(
      route =>
        normalized === normalizePath(route.path) ||
        normalized.startsWith(`${normalizePath(route.path)}/`)
    ) ?? null
  )
}

/**
 * The head is written from JavaScript because the shell is one static
 * `index.html` served for every path. Everything a crawler or a share service
 * reads about a route — its title, its description, the URL it considers
 * canonical, and the card it renders — has to be rewritten as the router moves,
 * or every route presents itself as the same page.
 */
function upsertMeta(attribute, name, content) {
  const head = document.head
  let tag = head.querySelector(`meta[${attribute}="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, name)
    head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function upsertLink(rel, href) {
  const head = document.head
  let tag = head.querySelector(`link[rel="${rel}"]`)
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', rel)
    head.appendChild(tag)
  }
  tag.setAttribute('href', href)
}

/**
 * Structured data is written as its own island rather than merged into the
 * shell's, so a route's breadcrumb goes away with the route instead of
 * outliving it.
 */
function upsertJsonLd(id, data) {
  const head = document.head
  let tag = head.querySelector(`script[data-jsonld="${id}"]`)
  if (!data) {
    tag?.remove()
    return
  }
  if (!tag) {
    tag = document.createElement('script')
    tag.type = 'application/ld+json'
    tag.setAttribute('data-jsonld', id)
    head.appendChild(tag)
  }
  tag.textContent = JSON.stringify(data)
}

function breadcrumbFor(routeMeta, canonical, homeName) {
  if (!routeMeta?.breadcrumb || canonical === absoluteUrl('/')) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeName, item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: routeMeta.breadcrumb, item: canonical },
    ],
  }
}

/**
 * Keeps the title, description, canonical link, share card, and breadcrumb
 * structured data in step with the active locale and the current route.
 */
function useDocumentMeta(content, pathname, locale) {
  const normalized = normalizePath(pathname)
  const routeMeta = content.routes?.[normalized]
  const isKnownRoute = Boolean(routeMeta) || Boolean(matchStandalone(pathname))
  const resolved =
    routeMeta ?? (isKnownRoute ? content.meta : content.routes?.notFound) ?? content.meta
  const { title, description } = resolved

  useEffect(() => {
    if (typeof document === 'undefined') return
    const canonical = absoluteUrl(normalized)

    document.title = title

    upsertMeta('name', 'description', description)
    upsertLink('canonical', canonical)

    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:site_name', content.brand.fullName)
    upsertMeta('property', 'og:locale', locale === 'es' ? 'es_US' : 'en_US')
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', canonical)
    upsertMeta('property', 'og:image', SITE_SHARE_IMAGE)

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', SITE_SHARE_IMAGE)

    upsertJsonLd('breadcrumb', breadcrumbFor(routeMeta, canonical, content.nav[0].label))
  }, [title, description, normalized, locale, routeMeta, content])
}

/**
 * Landing on a new pathname starts the page at its hero. A hash is left alone:
 * the Link component scrolls to the anchor itself.
 */
function useScrollToTopOnNavigate(pathname, hash) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
    // Scroll alone moves the page but not the reading position, which strands a
    // screen reader wherever the previous route left it.
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [pathname, hash])
}

/**
 * Not every internal link goes through the SPA <Link> — the design system's
 * PricingCard and CTAs render plain anchors. Catching the click at the document
 * routes those through history instead of letting the browser reload the app.
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
  const content = useContent()
  const { locale } = useLanguage()
  const { pathname, hash, navigate } = useLocation()

  useDocumentMeta(content, pathname, locale)
  useScrollToTopOnNavigate(pathname, hash)
  useGlobalLinkInterception(navigate)

  const standalone = matchStandalone(pathname)
  if (standalone) {
    const Standalone = standalone.component
    return (
      <Suspense fallback={<RouteFallback />}>
        <Standalone />
      </Suspense>
    )
  }

  const matched = matchRoute(pathname)
  const PageComponent = matched ? matched.component : NOT_FOUND

  return (
    <SiteShell>
      <Suspense fallback={<RouteFallback hero={matched?.hero} />}>
        <PageComponent />
      </Suspense>
    </SiteShell>
  )
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpRight, Menu, ShieldCheck, UserCircle, X } from 'lucide-react'
import { useMotionValueEvent, useScroll } from 'framer-motion'
import { Button, MicroLabel, SplitHeading, cn } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { useAuth } from '@/auth/useAuth'
import { Link, useLocation, normalizePath } from '@/router'
import BrandLogo from '@/components/layout/BrandLogo'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'

/**
 * Client portal entry — the "Client Login" affordance routes here. The portal
 * is gated by ProtectedRoute; unauthenticated visitors bounce to
 * /login?next=/portal.
 */
const PORTAL_HREF = '/portal'

/** Staff-only backend. The link is gated on the signed-in role being 'staff'. */
const ADMIN_HREF = '/admin'

/**
 * The four top-level destinations. The three service pages are not among them:
 * they are one decision — which program — and a bar that lists them separately
 * asks a visitor to make that decision from four words with no prices and no
 * differences shown. They live in the panel `programs` opens, where each one
 * gets the line that tells them apart.
 */
const DESTINATIONS = [
  { key: 'about', href: '/about' },
  { key: 'programs', panel: true },
  { key: 'testimonials', href: '/testimonials' },
  { key: 'contact', href: '/contact' },
]

const PANEL_SERVICES = ['membership', 'coaching', 'singleSession', 'liveProgram']

/**
 * Whether anything has scrolled beneath the bar. The position is read from a
 * motion value rather than from a scroll listener: a listener fires on every
 * frame, batches nothing, and here it would be setting a boolean that changes
 * twice in a page. The event only reaches React when the boolean actually
 * flips.
 */
function useScrolled(threshold = 12) {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(() =>
    typeof window === 'undefined' ? false : window.scrollY > threshold
  )
  useMotionValueEvent(scrollY, 'change', latest => {
    const next = latest > threshold
    setScrolled(previous => (previous === next ? previous : next))
  })
  return scrolled
}

/**
 * iOS-safe body scroll lock. Plain `overflow: hidden` does not stop momentum
 * scroll on mobile Safari, and toggling it can leave the page jumped to top
 * once the menu closes. Pinning the body with `position: fixed` and a negative
 * top offset locks scroll without losing the user's place.
 */
function useBodyScrollLock(locked) {
  const scrollYRef = useRef(0)
  useEffect(() => {
    if (!locked) return
    scrollYRef.current = window.scrollY
    const { body } = document
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    }
    body.style.position = 'fixed'
    body.style.top = `-${scrollYRef.current}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
    body.style.overflow = 'hidden'
    return () => {
      body.style.position = previous.position
      body.style.top = previous.top
      body.style.left = previous.left
      body.style.right = previous.right
      body.style.width = previous.width
      body.style.overflow = previous.overflow
      window.scrollTo(0, scrollYRef.current)
    }
  }, [locked])
}

function useEscapeKey(active, onEscape) {
  useEffect(() => {
    if (!active) return
    const onKey = event => {
      if (event.key === 'Escape') onEscape()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, onEscape])
}

const LINK_BASE =
  'relative inline-flex h-9 items-center rounded-df-full px-3 text-[12px] font-700 uppercase tracking-[0.1em] transition-colors duration-df-fast ease-df-out'

function PillLink({ href, label, active }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        LINK_BASE,
        active ? 'text-df-accent-bright' : 'text-df-text-muted hover:text-df-text'
      )}
    >
      {label}
    </Link>
  )
}

/**
 * The programs panel, laid out inside the bar's own surface rather than under
 * it. Four rows, each carrying the service's name, the line that tells it
 * apart, and its price — which is the comparison a visitor opening this menu
 * is actually making.
 */
function ProgramsPanel({ services, header, onNavigate, ...props }) {
  return (
    <div className="border-t border-df-border px-2 pb-2 pt-3" {...props}>
      <MicroLabel size="xs" tone="faint" className="px-3 pb-2">
        {header.programsPanelLabel}
      </MicroLabel>
      <ul className="grid gap-1 sm:grid-cols-2">
        {PANEL_SERVICES.map(key => {
          const service = services[key]
          return (
            <li key={key}>
              <Link
                href={service.href}
                onClick={onNavigate}
                className="group/row flex items-start gap-3 rounded-df-sm px-3 py-2.5 transition-colors duration-df-fast ease-df-out hover:bg-df-surface-2"
              >
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-[14px] font-600 text-df-text">
                      {service.name}
                    </span>
                    <span className="shrink-0 text-[12px] font-600 tabular-nums text-df-accent-bright">
                      {service.price}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-df-text-muted">
                    {service.tagline}
                  </span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function Header() {
  const { brand, nav, header, services } = useContent()
  const { isStaff } = useAuth()
  const { pathname } = useLocation()
  const scrolled = useScrolled()
  const [menuOpen, setMenuOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const panelTriggerRef = useRef(null)
  const currentPath = normalizePath(pathname)

  useBodyScrollLock(menuOpen)
  useEscapeKey(menuOpen, () => setMenuOpen(false))

  const closePanel = useCallback(() => {
    setPanelOpen(false)
    panelTriggerRef.current?.focus()
  }, [])
  useEscapeKey(panelOpen, closePanel)

  // Both the drawer and the panel close on a route change, and the panel also
  // closes when the pointer leaves the bar entirely.
  useEffect(() => {
    setMenuOpen(false)
    setPanelOpen(false)
  }, [pathname])

  const labelFor = key => nav.find(item => item.href.includes(key))?.label ?? key
  const isActive = href => {
    const target = normalizePath(href.split('#')[0])
    if (target === '/') return currentPath === '/'
    return currentPath === target || currentPath.startsWith(`${target}/`)
  }
  const programsActive = PANEL_SERVICES.some(key => isActive(services[key].href))

  return (
    <>
      {/* The bar is content-sized and detached from every edge, so it reads as
          an object standing over the page rather than as a band welded to the
          top of it. Below `lg` it holds the wordmark alone: the destinations
          and the one action move to the bottom of the screen, where a thumb
          already is. */}
      {/* The page acknowledges the open panel. Without it the two read as one
          plane and the type behind the menu competes with the type inside it. */}
      <div
        aria-hidden="true"
        onMouseEnter={() => setPanelOpen(false)}
        className={cn(
          'fixed inset-0 z-scrim hidden bg-df-overlay lg:block',
          'transition-opacity duration-df-base ease-df-out motion-reduce:transition-none',
          panelOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      />

      <header
        data-navbar
        data-theme="dark"
        className="pointer-events-none fixed inset-x-0 top-0 z-sticky flex justify-center px-4 pt-[var(--df-bar-inset)]"
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <div
          onMouseLeave={() => setPanelOpen(false)}
          className={cn(
            'pointer-events-auto w-auto max-w-full overflow-hidden rounded-df-xl transition-[background-color,box-shadow] duration-df-base ease-df-out',
            // Two states and nothing between them. At the top of the page the
            // bar is the hero's own ground and carries no box; the moment
            // anything passes under it, it takes a surface. With the panel open
            // that surface goes fully solid: a menu that lets the page show
            // through puts two pages of type on top of each other exactly when
            // a visitor is reading to choose.
            scrolled
              ? 'bg-df-glass-fill shadow-df-lg [-webkit-backdrop-filter:blur(20px)] [backdrop-filter:blur(20px)]'
              : 'bg-transparent',
            panelOpen &&
              'bg-df-bg-elevated shadow-df-lg [-webkit-backdrop-filter:none] [backdrop-filter:none]'
          )}
        >
          <div className="flex h-df-bar items-center gap-0.5 px-2 sm:px-2.5">
            <Link
              href="/"
              aria-label={brand.fullName}
              className="inline-flex min-h-11 shrink-0 items-center rounded-df-sm px-2 transition-opacity duration-df-fast ease-df-out hover:opacity-80"
            >
              <BrandLogo alt={brand.fullName} inverted className="h-6 sm:h-7" />
            </Link>

            <nav
              aria-label={header.primaryNavLabel}
              className="hidden items-center gap-0.5 lg:flex"
            >
              {DESTINATIONS.map(destination =>
                destination.panel ? (
                  <button
                    key={destination.key}
                    ref={panelTriggerRef}
                    type="button"
                    aria-expanded={panelOpen}
                    aria-haspopup="true"
                    aria-controls="programs-panel"
                    onClick={() => setPanelOpen(open => !open)}
                    onMouseEnter={() => setPanelOpen(true)}
                    className={cn(
                      LINK_BASE,
                      panelOpen || programsActive
                        ? 'text-df-accent-bright'
                        : 'text-df-text-muted hover:text-df-text'
                    )}
                  >
                    {header.programs}
                  </button>
                ) : (
                  <PillLink
                    key={destination.key}
                    href={destination.href}
                    label={labelFor(destination.key)}
                    active={isActive(destination.href)}
                  />
                )
              )}
            </nav>

            <div className="ml-auto flex shrink-0 items-center gap-1 lg:ml-2">
              {isStaff && (
                <Link
                  href={ADMIN_HREF}
                  aria-label={header.adminAria}
                  className="hidden h-10 w-10 items-center justify-center rounded-df-full text-df-accent-bright transition-colors duration-df-fast ease-df-out hover:bg-df-accent-soft lg:inline-flex"
                >
                  <ShieldCheck aria-hidden="true" className="h-4 w-4" />
                </Link>
              )}
              <Link
                href={PORTAL_HREF}
                aria-label={header.clientLoginAria}
                className="hidden h-10 w-10 items-center justify-center rounded-df-full text-df-text-muted transition-colors duration-df-fast ease-df-out hover:bg-df-surface-2 hover:text-df-text lg:inline-flex"
              >
                <UserCircle aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Button asChild size="sm" className="hidden lg:inline-flex">
                <Link href={header.primaryCtaHref}>
                  {header.primaryCta}
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* The panel is the bar: its height grows and the rows lay out inside
              the same rounded surface, so there is no seam and nothing floats
              beneath a bar it does not touch.
              It stays in the document rather than mounting on open, so the id
              the trigger names in aria-controls always resolves to something,
              and it opens on a grid row travelling 0fr to 1fr - a transition
              the compositor finishes even in a tab the browser has throttled,
              which an animated height driven from frames does not. */}
          <div
            id="programs-panel"
            className={cn(
              'hidden overflow-hidden transition-[grid-template-rows] duration-df-base ease-df-out motion-reduce:transition-none lg:grid',
              panelOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            )}
          >
            {/* A collapsed row still holds its children's boxes: they are clipped
                rather than removed, so find-in-page and hit testing still reach
                them. Visibility takes them out, and it is delayed past the
                collapse so the rows do not blank before the panel has closed. */}
            <div
              className={cn(
                'min-h-0 overflow-hidden transition-[visibility] duration-0 ease-linear motion-reduce:transition-none',
                panelOpen ? 'visible delay-0' : 'invisible delay-200'
              )}
            >
              <ProgramsPanel
                services={services}
                header={header}
                onNavigate={() => setPanelOpen(false)}
                inert={panelOpen ? undefined : ''}
              />
            </div>
          </div>
        </div>
      </header>

      {/* The phone gets the bar at the other end. The one action the site is
          asking for sits under the thumb from anywhere on the page, with the
          way into everything else beside it. */}
      <div
        className="fixed inset-x-0 bottom-0 z-sticky border-t border-df-border bg-df-bg-elevated px-4 py-3 lg:hidden"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)' }}
      >
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <button
            type="button"
            aria-label={header.openMenu}
            aria-expanded={menuOpen}
            aria-controls="site-navigation"
            onClick={() => setMenuOpen(open => !open)}
            className="inline-flex h-df-control shrink-0 items-center gap-2 rounded-df-sm border border-df-border-strong px-4 text-[12px] font-700 uppercase tracking-[0.12em] text-df-text transition-colors duration-df-fast ease-df-out hover:bg-df-surface-2"
          >
            <Menu aria-hidden="true" className="h-4 w-4" />
            {header.menu}
          </button>
          <Button asChild size="md" className="min-w-0 flex-1">
            <Link href={header.primaryCtaHref}>
              {header.primaryCta}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4 max-[399px]:hidden" />
            </Link>
          </Button>
        </div>
      </div>

      <MobileNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        nav={nav}
        services={services}
        header={header}
        brand={brand}
        isStaff={isStaff}
        isActive={isActive}
      />
    </>
  )
}

/**
 * The menu rises from the edge the button that opened it sits on, so the thing
 * that opened it and the thing it opened are in the same place and every row
 * lands inside thumb reach. It scrolls inside itself against the visible
 * viewport rather than against the document, which is what stops the last row
 * of a long menu sitting under the browser's own chrome.
 */
function MobileNav({ open, onClose, nav, services, header, brand, isStaff, isActive }) {
  // The sheet stays in the document once it has been opened, so the id the
  // trigger names resolves to the panel itself rather than to a wrapper with
  // no box. `hidden` is what closes it, and it waits for the slide out.
  const [rendered, setRendered] = useState(open)
  // Set during render rather than in an effect: an effect would leave one
  // frame in which the sheet is told to travel while its wrapper is still
  // display:none, and an element that is not laid out does not animate.
  if (open && !rendered) setRendered(true)

  if (typeof document === 'undefined') return null

  const rowClass =
    'flex min-h-14 items-center justify-between gap-3 border-b border-df-border text-[17px] font-600 transition-colors duration-df-fast ease-df-out hover:text-df-accent-bright last:border-0'

  return createPortal(
    <div className="lg:hidden" data-theme="dark" hidden={!rendered}>
      <button
        type="button"
        aria-label={header.closeMenu}
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-overlay cursor-pointer bg-df-overlay [touch-action:manipulation]',
          'transition-opacity duration-df-base ease-df-out',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      />
      {/* The sheet travels on a CSS transition rather than on the motion
          library. A spring is driven from animation frames, and a tab the
          browser has throttled stops handing them out - which strands the
          panel halfway up the screen with no way back. A transition is the
          compositor's own job and always arrives. */}
      <div
        id="site-navigation"
        role="dialog"
        aria-modal="true"
        aria-label={header.mobileDialogLabel}
        className={cn(
          'fixed inset-x-0 bottom-0 z-modal flex max-h-[88dvh] flex-col overflow-y-auto overscroll-contain rounded-t-df-2xl border-t border-df-border bg-df-bg-elevated',
          'transition-transform duration-df-base ease-df-out motion-reduce:transition-none',
          open ? 'translate-y-0' : 'translate-y-full'
        )}
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
        onTransitionEnd={event => {
          if (event.propertyName === 'transform' && !open) setRendered(false)
        }}
      >
        <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between gap-3 bg-df-bg-elevated px-5 pb-2 pt-3">
          <SplitHeading as="span" size="card" text={`${brand.name}.`} accent="." />
          <button
            type="button"
            aria-label={header.closeMenu}
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-df-sm text-df-text-muted transition-colors duration-df-fast ease-df-out hover:bg-df-surface-2 hover:text-df-text"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5">
          <MicroLabel size="xs" tone="faint" className="pb-1 pt-3">
            {header.programsPanelLabel}
          </MicroLabel>
          <nav aria-label={header.programsPanelLabel} className="flex flex-col">
            {PANEL_SERVICES.map(key => {
              const service = services[key]
              return (
                <Link
                  key={key}
                  href={service.href}
                  onClick={onClose}
                  aria-current={isActive(service.href) ? 'page' : undefined}
                  className={cn(
                    rowClass,
                    'py-3',
                    isActive(service.href) ? 'text-df-accent-bright' : 'text-df-text'
                  )}
                >
                  <span className="min-w-0">
                    <span className="block truncate">{service.name}</span>
                    <span className="mt-0.5 block text-[13px] font-500 leading-snug text-df-text-muted">
                      {service.tagline}
                    </span>
                  </span>
                  <span className="shrink-0 text-[13px] font-600 tabular-nums text-df-accent-bright">
                    {service.price}
                  </span>
                </Link>
              )
            })}
          </nav>

          <MicroLabel size="xs" tone="faint" className="pb-1 pt-6">
            {header.primaryNavLabel}
          </MicroLabel>
          <nav aria-label={header.mobileNavLabel} className="flex flex-col">
            {nav
              .filter(item => !PANEL_SERVICES.some(key => services[key].href === item.href))
              .map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    rowClass,
                    isActive(item.href) ? 'text-df-accent-bright' : 'text-df-text'
                  )}
                >
                  {item.label}
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-df-text-faint" />
                </Link>
              ))}
          </nav>

          <div className="flex flex-col gap-3 pb-2 pt-6">
            <Link
              href={PORTAL_HREF}
              onClick={onClose}
              aria-label={header.clientLoginAria}
              className="inline-flex h-df-control items-center justify-center gap-2 rounded-df-sm border border-df-border-strong text-[12px] font-700 uppercase tracking-[0.14em] text-df-text-muted transition-colors duration-df-fast ease-df-out hover:bg-df-surface-2 hover:text-df-text"
            >
              <UserCircle aria-hidden="true" className="h-4 w-4" />
              {header.clientLogin}
            </Link>
            {isStaff && (
              <Link
                href={ADMIN_HREF}
                onClick={onClose}
                aria-label={header.adminAria}
                className="inline-flex h-df-control items-center justify-center gap-2 rounded-df-sm border border-df-accent bg-df-accent-softer text-[12px] font-700 uppercase tracking-[0.14em] text-df-accent-bright transition-colors duration-df-fast ease-df-out hover:bg-df-accent-soft"
              >
                <ShieldCheck aria-hidden="true" className="h-4 w-4" />
                {header.admin}
              </Link>
            )}
            <LanguageSwitcher block />
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

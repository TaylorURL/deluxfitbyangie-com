import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Menu, X, UserCircle, ArrowUpRight, ShieldCheck } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Button, Container, cn } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { useAuth } from '@/auth/useAuth'
import { Link, useLocation, normalizePath } from '@/router'

const MotionDiv = motion.div
const MotionButton = motion.button

/**
 * PORTAL ENTRY POINT — temporary destination for the "Client Login" affordance.
 * The route renders a branded "coming soon" placeholder until the real member
 * portal ships; when it does, repoint this constant to the production portal
 * URL and the rest of the navbar wiring stays as-is.
 */
const PORTAL_HREF = '/portal'

/** Staff-only backend. The link is gated on the signed-in role being 'staff'. */
const ADMIN_HREF = '/admin'

const NAV_LINK_BASE =
  'group/link relative inline-flex h-9 shrink-0 items-center whitespace-nowrap px-1 text-[12px] font-700 uppercase tracking-[0.16em] transition-colors duration-200 ease-df-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-4 focus-visible:ring-offset-df-bg 2xl:tracking-[0.18em]'

const DRAWER_TRANSITION = { type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.42 }
const DRAWER_VARIANTS = { hidden: { x: '100%' }, visible: { x: 0 } }
const BACKDROP_VARIANTS = { hidden: { opacity: 0 }, visible: { opacity: 1 } }

function useScrolled(threshold = 12) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return scrolled
}

const NAVBAR_TONES = new Set(['dark', 'light', 'gray'])

/**
 * useNavbarTone — resolves the tone of whatever toned section currently sits
 * under the fixed navbar, by hit-testing every `[data-theme]` panel against a
 * probe line through the middle of the navbar's height band. Reuses the same
 * source of truth the page already declares (the anduril-style alternating
 * sections) so we never re-detect colors from pixels. Re-runs on scroll,
 * resize, and route change.
 */
function useNavbarTone(defaultTone, pathname) {
  const [tone, setTone] = useState(defaultTone)
  useEffect(() => {
    if (typeof window === 'undefined') return
    let pending = false
    const probe = () => {
      pending = false
      const navbar = document.querySelector('[data-navbar]')
      if (!navbar) return
      const navRect = navbar.getBoundingClientRect()
      const probeY = navRect.top + navRect.height / 2
      const sections = document.querySelectorAll('[data-theme]')
      let next = defaultTone
      for (const el of sections) {
        if (navbar.contains(el) || el === navbar) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= probeY && rect.bottom > probeY) {
          const value = el.getAttribute('data-theme')
          if (NAVBAR_TONES.has(value)) next = value
        }
      }
      setTone(prev => (prev === next ? prev : next))
    }
    const onScroll = () => {
      if (pending) return
      pending = true
      requestAnimationFrame(probe)
    }
    probe()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [defaultTone, pathname])
  return tone
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

function NavLink({ href, label, active, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        NAV_LINK_BASE,
        active ? 'text-df-text' : 'text-df-text-muted hover:text-df-text'
      )}
    >
      <span className="relative">
        {label}
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute -bottom-2 left-0 h-[2px] w-full origin-left bg-df-accent transition-transform duration-300 ease-df-out',
            active ? 'scale-x-100' : 'scale-x-0 group-hover/link:scale-x-100'
          )}
        />
      </span>
    </Link>
  )
}

function ClientLoginLink({ block = false, iconOnly = false, onClick, label, ariaLabel }) {
  return (
    <Link
      href={PORTAL_HREF}
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        'group/login inline-flex shrink-0 items-center justify-center gap-2 rounded-df-sm border border-df-border-strong text-[11px] font-700 uppercase tracking-[0.2em] text-df-text-muted transition-colors duration-200 ease-df-out hover:border-df-border-hover hover:bg-df-surface-2 hover:text-df-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-df-bg',
        block && 'h-12 w-full px-3.5 text-[12px]',
        !block && iconOnly && 'h-10 w-10',
        !block && !iconOnly && 'h-10 px-3.5'
      )}
    >
      <UserCircle
        aria-hidden="true"
        className="h-4 w-4 text-df-text-muted transition-colors duration-200 group-hover/login:text-df-accent-bright"
      />
      {!iconOnly && <span>{label}</span>}
    </Link>
  )
}

/**
 * AdminLink — staff-only shortcut to the role-gated backend. Shares the
 * ClientLoginLink chrome (border + uppercase + tracking) but reads as an
 * accent-tinted "Admin" pill with a shield so it's clearly distinct. Callers
 * gate it on `isStaff`; it never renders for clients or logged-out visitors.
 */
function AdminLink({ block = false, onClick, label, ariaLabel }) {
  return (
    <Link
      href={ADMIN_HREF}
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        'group/admin inline-flex shrink-0 items-center justify-center gap-2 rounded-df-sm border border-df-accent bg-df-accent-softer text-[11px] font-700 uppercase tracking-[0.2em] text-df-accent-bright transition-colors duration-200 ease-df-out hover:bg-df-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-df-bg',
        block ? 'h-12 w-full px-3.5 text-[12px]' : 'h-10 px-3.5'
      )}
    >
      <ShieldCheck aria-hidden="true" className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  )
}

function PrimaryCta({ size = 'sm', block = false, onClick, href, label }) {
  return (
    <Button asChild size={size} block={block} onClick={onClick}>
      <Link href={href}>
        {label}
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </Button>
  )
}

/**
 * Header — the DeluxFit branded site chrome. Sits transparent over the hero
 * type-specimen, then crystallises into a blurred, hairline-bordered surface
 * once the page scrolls. The page-based nav reads from the active i18n
 * content tree; active state matches the current pathname.
 *
 * The mobile drawer + backdrop are rendered through a body-level portal so
 * they live outside the header's stacking context — keeping the nav reliably
 * tappable at any scroll position.
 */
export default function Header() {
  const { brand, nav, header } = useContent()
  const { isStaff } = useAuth()
  const { pathname } = useLocation()
  const scrolled = useScrolled()
  const [menuOpen, setMenuOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const currentPath = normalizePath(pathname)
  const navbarTone = useNavbarTone('dark', pathname)
  const isLightTone = navbarTone === 'light'

  useBodyScrollLock(menuOpen)
  useEscapeKey(menuOpen, () => setMenuOpen(false))

  // Close the drawer automatically when the route changes (e.g. via Link).
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const closeMenu = () => setMenuOpen(false)
  const isActive = href => {
    const target = normalizePath(href.split('#')[0])
    if (target === '/') return currentPath === '/'
    return currentPath === target || currentPath.startsWith(`${target}/`)
  }

  return (
    <>
      <header
        data-navbar
        data-theme={navbarTone}
        className={cn(
          // `transform-gpu` pins the header to its own compositor layer so the
          // browser doesn't re-promote it mid-scroll (which can drop the first
          // touch event on iOS Safari). We deliberately do NOT transition
          // `backdrop-filter` — that transition can also drop touches on the
          // 12px scroll-threshold crossover. `color` is in the transition list
          // so descendant text smoothly fades between tones as the navbar's
          // `data-theme` flips at section boundaries.
          'fixed inset-x-0 top-0 z-sticky transform-gpu transition-[background-color,color,border-color,box-shadow] duration-200 ease-df-out',
          scrolled
            ? 'border-b border-df-border bg-df-bg/85 shadow-[0_1px_0_rgba(225,29,42,0.18),0_18px_40px_-22px_var(--df-shadow-key)] [backdrop-filter:blur(20px)] [-webkit-backdrop-filter:blur(20px)]'
            : 'border-b border-transparent bg-transparent'
        )}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <Container size="xl">
          <div
            className={cn(
              'relative flex items-center justify-between gap-3 transition-[height] duration-300 ease-df-out sm:gap-4',
              scrolled ? 'h-14 sm:h-[68px]' : 'h-16 sm:h-24'
            )}
          >
            <Link
              href="/"
              aria-label={brand.fullName}
              className="group/logo relative inline-flex shrink-0 items-center rounded-df-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-4 focus-visible:ring-offset-df-bg"
            >
              <span
                aria-hidden="true"
                className="absolute -inset-3 -z-10 rounded-df-md bg-df-accent opacity-0 blur-2xl transition-opacity duration-500 ease-df-out group-hover/logo:opacity-30"
              />
              <img
                src="/deluxfit-logo.png"
                alt={brand.fullName}
                width="946"
                height="308"
                className={cn(
                  // The source PNG is black text + red accent on transparent.
                  // Over dark sections we invert (white + red); over light we
                  // leave it untouched (black + red). Both states use the same
                  // filter function list so the interpolation is smooth.
                  'w-auto select-none transition-[height,filter] duration-200 ease-df-out',
                  scrolled ? 'h-6 sm:h-8' : 'h-7 sm:h-10',
                  isLightTone
                    ? '[filter:invert(0)_hue-rotate(0deg)]'
                    : '[filter:invert(1)_hue-rotate(180deg)]'
                )}
                draggable="false"
              />
            </Link>

            <nav
              aria-label={header.primaryNavLabel}
              className="hidden flex-1 items-center justify-center gap-4 xl:flex 2xl:gap-7"
            >
              {nav.map(item => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  active={isActive(item.href)}
                />
              ))}
            </nav>

            <div className="hidden shrink-0 items-center gap-2.5 xl:flex">
              {isStaff && <AdminLink label={header.admin} ariaLabel={header.adminAria} />}
              <ClientLoginLink
                iconOnly
                label={header.clientLogin}
                ariaLabel={header.clientLoginAria}
              />
              <PrimaryCta href={header.primaryCtaHref} label={header.primaryCta} />
            </div>

            <button
              type="button"
              aria-label={menuOpen ? header.closeMenu : header.openMenu}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen(open => !open)}
              className="-mr-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-df-sm border border-df-border-strong bg-df-surface/40 text-df-text transition-colors duration-200 ease-df-out hover:border-df-border-hover hover:bg-df-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-df-bg xl:hidden"
            >
              {menuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </Container>
      </header>

      <MobileNavPortal
        open={menuOpen}
        onClose={closeMenu}
        nav={nav}
        header={header}
        brand={brand}
        isStaff={isStaff}
        isActive={isActive}
        prefersReducedMotion={prefersReducedMotion}
      />
    </>
  )
}

/**
 * MobileNavPortal — renders the slide-out drawer and its backdrop into a
 * body-level portal so they're free of the header's stacking context, which
 * is critical for touch responsiveness on mobile Safari at non-zero scroll.
 */
function MobileNavPortal({ open, onClose, nav, header, brand, isActive, prefersReducedMotion }) {
  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <MotionDiv
          key="mobile-navigation"
          id="mobile-navigation"
          // Pin the drawer to the dark tone so its surface tokens are
          // deterministic — the page's adaptive navbar tone never bleeds in.
          data-theme="dark"
          className="xl:hidden"
        >
          <MotionButton
            type="button"
            aria-label={header.closeMenu}
            onClick={onClose}
            className="fixed inset-0 z-overlay bg-df-overlay [backdrop-filter:blur(8px)] [-webkit-backdrop-filter:blur(8px)]"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={BACKDROP_VARIANTS}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
          />
          <MotionDiv
            role="dialog"
            aria-modal="true"
            aria-label={header.mobileDialogLabel}
            className="fixed inset-y-0 right-0 z-modal flex w-[min(22rem,100vw)] flex-col border-l border-df-border bg-df-bg-elevated/95 shadow-df-xl [backdrop-filter:blur(28px)] [-webkit-backdrop-filter:blur(28px)]"
            style={{
              paddingTop: 'env(safe-area-inset-top)',
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={DRAWER_VARIANTS}
            transition={prefersReducedMotion ? { duration: 0 } : DRAWER_TRANSITION}
          >
            <div className="flex items-center justify-between border-b border-df-border px-5 py-4">
              <span className="font-display text-2xl font-400 uppercase tracking-tight text-df-text">
                {brand.name}
                <span className="text-df-accent">.</span>
              </span>
              <button
                type="button"
                aria-label={header.closeMenu}
                onClick={onClose}
                className="flex h-11 w-11 items-center justify-center rounded-df-sm border border-df-border-strong text-df-text transition-colors hover:border-df-border-hover hover:bg-df-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-df-bg"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto overscroll-contain px-5 py-6">
              <nav aria-label={header.mobileNavLabel} className="flex flex-col">
                {nav.map(item => {
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'group/mlink flex min-h-[3.5rem] items-center justify-between border-b border-df-border py-4 font-display text-2xl font-400 uppercase tracking-tight transition-colors duration-200 ease-df-out',
                        active
                          ? 'text-df-accent-bright'
                          : 'text-df-text hover:text-df-accent-bright'
                      )}
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-6 w-6 text-df-text-faint transition-all duration-300 ease-df-out group-hover/mlink:translate-x-1 group-hover/mlink:-translate-y-1 group-hover/mlink:text-df-accent"
                      />
                    </Link>
                  )
                })}
              </nav>

              <div className="mt-8 flex flex-col gap-3">
                <PrimaryCta
                  size="lg"
                  block
                  onClick={onClose}
                  href={header.primaryCtaHref}
                  label={header.primaryCta}
                />
                <ClientLoginLink
                  block
                  onClick={onClose}
                  label={header.clientLogin}
                  ariaLabel={header.clientLoginAria}
                />
              </div>

              <p className="mt-auto pt-10 text-[11px] font-600 uppercase tracking-[0.22em] text-df-text-faint">
                {brand.tagline}
              </p>
            </div>
          </MotionDiv>
        </MotionDiv>
      )}
    </AnimatePresence>,
    document.body
  )
}

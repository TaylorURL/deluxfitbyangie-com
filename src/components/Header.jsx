import { useEffect, useState } from 'react'
import { Menu, X, UserCircle, ArrowUpRight } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Button, Container, cn } from '@deluxfit/ds'
import { brand, nav } from '@/content/site'

const MotionDiv = motion.div
const MotionButton = motion.button
const MotionAnchor = motion.a

/**
 * PORTAL ENTRY POINT — temporary destination for the "Client Login" affordance.
 * The route renders a branded "coming soon" placeholder until the real member
 * portal ships; when it does, repoint this constant to the production portal
 * URL and the rest of the navbar wiring stays as-is.
 */
const PORTAL_HREF = '/portal'

const PRIMARY_CTA_HREF = '#pricing'
const PRIMARY_CTA_LABEL = 'Apply Now'

const SECTION_IDS = nav
  .map(item => item.href)
  .filter(href => href.startsWith('#') && href !== '#top')
  .map(href => href.slice(1))

const NAV_LINK_BASE =
  'group/link relative inline-flex h-9 items-center px-1 text-[12px] font-700 uppercase tracking-[0.18em] transition-colors duration-200 ease-df-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-4 focus-visible:ring-offset-df-bg'

const DRAWER_TRANSITION = { type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.42 }
const DRAWER_VARIANTS = {
  hidden: { x: '100%' },
  visible: { x: 0 },
}
const BACKDROP_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

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

function useActiveSection(ids) {
  const [active, setActive] = useState(null)
  useEffect(() => {
    if (!ids.length) return
    const elements = ids.map(id => document.getElementById(id)).filter(Boolean)
    if (!elements.length) return

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    )
    elements.forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [ids])
  return active
}

function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
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
    <a
      href={href}
      onClick={onClick}
      aria-current={active ? 'true' : undefined}
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
    </a>
  )
}

function ClientLoginLink({ block = false, onClick }) {
  return (
    <a
      href={PORTAL_HREF}
      onClick={onClick}
      aria-label="Client login portal"
      className={cn(
        'group/login inline-flex items-center justify-center gap-2 rounded-df-sm border border-df-border-strong px-3.5 text-[11px] font-700 uppercase tracking-[0.2em] text-df-text-muted transition-colors duration-200 ease-df-out hover:border-df-border-hover hover:bg-df-surface-2 hover:text-df-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-df-bg',
        block ? 'h-12 w-full text-[12px]' : 'h-10'
      )}
    >
      <UserCircle
        aria-hidden="true"
        className="h-4 w-4 text-df-text-muted transition-colors duration-200 group-hover/login:text-df-accent-bright"
      />
      Client Login
    </a>
  )
}

function PrimaryCta({ size = 'sm', block = false, onClick }) {
  return (
    <Button asChild size={size} block={block} onClick={onClick}>
      <a href={PRIMARY_CTA_HREF}>
        {PRIMARY_CTA_LABEL}
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </Button>
  )
}

/**
 * Header — the DeluxFit branded site chrome. Sits transparent over the hero
 * type-specimen, then crystallises into a blurred, hairline-bordered surface
 * once the page scrolls. On wide screens it shows the logo, an animated
 * underline nav with active-section tracking, a ghost-styled Client Login
 * entry point for the forthcoming member portal, and the red primary CTA. On
 * mobile it collapses into a polished right-side drawer with a backdrop blur,
 * staggered link entry, and both action affordances pinned to the bottom.
 */
export default function Header() {
  const scrolled = useScrolled()
  const [menuOpen, setMenuOpen] = useState(false)
  const activeSection = useActiveSection(SECTION_IDS)
  const prefersReducedMotion = useReducedMotion()

  useBodyScrollLock(menuOpen)
  useEscapeKey(menuOpen, () => setMenuOpen(false))

  const closeMenu = () => setMenuOpen(false)
  const isActive = href => href.startsWith('#') && activeSection === href.slice(1)

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-sticky transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-df-out',
        scrolled
          ? 'border-b border-df-border bg-df-bg/80 shadow-[0_1px_0_rgba(225,29,42,0.18),0_18px_40px_-22px_rgba(0,0,0,0.7)] backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <Container size="xl">
        <div
          className={cn(
            'relative flex items-center justify-between transition-[height] duration-300 ease-df-out',
            scrolled ? 'h-16 sm:h-[68px]' : 'h-20 sm:h-24'
          )}
        >
          <a
            href="#top"
            aria-label={brand.fullName}
            className="group/logo relative inline-flex items-center rounded-df-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-4 focus-visible:ring-offset-df-bg"
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
                'w-auto select-none [filter:invert(1)_hue-rotate(180deg)] transition-[height] duration-300 ease-df-out',
                scrolled ? 'h-7 sm:h-8' : 'h-8 sm:h-10'
              )}
              draggable="false"
            />
          </a>

          <nav
            aria-label="Primary"
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex lg:gap-9"
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

          <div className="hidden items-center gap-2.5 md:flex">
            <ClientLoginLink />
            <PrimaryCta />
          </div>

          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(open => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-df-sm border border-df-border-strong bg-df-surface/40 text-df-text transition-colors duration-200 ease-df-out hover:border-df-border-hover hover:bg-df-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-df-bg md:hidden"
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {menuOpen && (
          <MotionDiv key="mobile-navigation" id="mobile-navigation" className="md:hidden">
            <MotionButton
              type="button"
              aria-label="Close menu"
              onClick={closeMenu}
              className="fixed inset-0 z-overlay bg-df-overlay backdrop-blur-md"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={BACKDROP_VARIANTS}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
            />
            <MotionDiv
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              className="fixed inset-y-0 right-0 z-modal flex w-full max-w-sm flex-col border-l border-df-border bg-df-bg-elevated/95 shadow-df-xl backdrop-blur-2xl"
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
                  aria-label="Close menu"
                  onClick={closeMenu}
                  className="flex h-10 w-10 items-center justify-center rounded-df-sm border border-df-border-strong text-df-text transition-colors hover:border-df-border-hover hover:bg-df-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-df-bg"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <div className="flex flex-1 flex-col overflow-y-auto px-5 py-6">
                <nav aria-label="Mobile" className="flex flex-col">
                  {nav.map((item, index) => {
                    const active = isActive(item.href)
                    return (
                      <motion.a
                        key={item.href}
                        href={item.href}
                        onClick={closeMenu}
                        aria-current={active ? 'true' : undefined}
                        initial={prefersReducedMotion ? false : { opacity: 0, x: 24 }}
                        animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.1 + index * 0.05,
                          duration: 0.4,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className={cn(
                          'group/mlink flex items-center justify-between border-b border-df-border py-5 font-display text-3xl font-400 uppercase tracking-tight transition-colors duration-200 ease-df-out',
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
                      </motion.a>
                    )
                  })}
                </nav>

                <div className="mt-8 flex flex-col gap-3">
                  <PrimaryCta size="lg" block onClick={closeMenu} />
                  <ClientLoginLink block onClick={closeMenu} />
                </div>

                <p className="mt-auto pt-10 text-[11px] font-600 uppercase tracking-[0.22em] text-df-text-faint">
                  {brand.tagline}
                </p>
              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>
    </header>
  )
}

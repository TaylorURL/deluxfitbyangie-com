import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, LogOut, MoreHorizontal, ShieldCheck, X } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { MicroLabel, cn } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { useAuth } from '@/auth/useAuth'
import BrandLogo from '@/components/layout/BrandLogo'

const MotionDiv = motion.div

/**
 * The rail, at the width a laptop has room for: a column down the left edge
 * of the screen that holds the wordmark, the whole map of the portal, and the
 * account it belongs to. It is the frame the work sits in rather than a menu
 * that has to be asked for, which is the difference between knowing where you
 * are and remembering where you were.
 *
 * The marker under the active row is one element that travels between rows on
 * a shared layout id, so the eye follows the move instead of finding it
 * already made. It carries the brand red as a bar down its left edge, which
 * is how the row says "here" without filling itself in.
 */
function Rail({ sections, activeId, onSelect, layoutId, label, displayName, entitlements }) {
  const { portal, brand, header } = useContent()
  const { user, isStaff, signOut } = useAuth()
  const prefersReducedMotion = useReducedMotion()
  const monogram = (displayName.trim()[0] || '·').toUpperCase()
  const level = entitlements.hasCoaching
    ? portal.overview.coachingStatus
    : entitlements.hasMembership
      ? portal.overview.membershipStatus
      : null

  return (
    <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:border-r lg:border-df-border lg:bg-df-bg-elevated">
      <div className="flex h-[var(--df-header-height)] shrink-0 items-center border-b border-df-border px-6">
        <a
          href="/"
          aria-label={brand.fullName}
          className="inline-flex items-center gap-3 rounded-df-sm transition-opacity duration-df-fast ease-df-out hover:opacity-80"
        >
          <BrandLogo alt="" className="h-7" />
        </a>
        <span className="ml-3 inline-flex h-6 items-center rounded-df-full border border-df-border-strong px-2.5 text-[9px] font-700 uppercase tracking-[0.2em] text-df-text-faint">
          {portal.brandLockup}
        </span>
      </div>

      <nav aria-label={label} className="flex-1 overflow-y-auto px-4 py-6">
        <MicroLabel size="xs" tone="faint" className="mb-3 px-3">
          {portal.sectionsLabel}
        </MicroLabel>
        <ul className="flex flex-col gap-1">
          {sections.map(({ id, icon: Icon }) => {
            const active = activeId === id
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => onSelect(id)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'group relative isolate flex h-11 w-full items-center gap-3 rounded-df-sm px-3 text-left text-[13px] font-600 transition-colors duration-df-fast ease-df-out',
                    active ? 'text-df-text' : 'text-df-text-muted hover:text-df-text'
                  )}
                >
                  {active && (
                    <MotionDiv
                      aria-hidden="true"
                      layoutId={layoutId}
                      className="absolute inset-0 -z-10 overflow-hidden rounded-df-sm bg-df-surface-2 shadow-df-md"
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { type: 'tween', duration: 0.2, ease: [0.22, 1, 0.36, 1] }
                      }
                    >
                      <span className="absolute inset-y-2 left-0 w-0.5 rounded-df-full bg-df-accent" />
                    </MotionDiv>
                  )}
                  <span
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-df-sm transition-colors duration-df-fast ease-df-out',
                      active
                        ? 'bg-df-accent-soft text-df-accent-bright'
                        : 'text-df-text-faint group-hover:text-df-text-muted'
                    )}
                  >
                    <Icon aria-hidden="true" className="h-4 w-4" />
                  </span>
                  {portal.nav[id]}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-df-border p-4">
        <div className="flex items-center gap-3 rounded-df-md bg-df-surface p-3 shadow-df-sm">
          <span
            aria-hidden="true"
            className="font-400 flex h-10 w-10 shrink-0 items-center justify-center rounded-df-full bg-df-accent bg-df-accent-gradient font-display text-lg leading-none text-df-on-accent"
          >
            {monogram}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-600 text-df-text">{displayName}</p>
            <p className="truncate text-[11px] font-600 uppercase tracking-[0.12em] text-df-text-faint">
              {level ?? portal.overview.inactive}
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-0.5">
          {isStaff && (
            <a
              href="/admin"
              className="flex h-10 items-center gap-3 rounded-df-sm px-3 text-[12px] font-600 text-df-accent-bright transition-colors duration-df-fast ease-df-out hover:bg-df-accent-softer"
            >
              <ShieldCheck aria-hidden="true" className="h-4 w-4" />
              {header.admin}
            </a>
          )}
          <a
            href="/"
            className="flex h-10 items-center gap-3 rounded-df-sm px-3 text-[12px] font-600 text-df-text-muted transition-colors duration-df-fast ease-df-out hover:bg-df-surface-2 hover:text-df-text"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            {portal.backToSite}
          </a>
          {user && (
            <button
              type="button"
              onClick={signOut}
              className="flex h-10 items-center gap-3 rounded-df-sm px-3 text-left text-[12px] font-600 text-df-text-muted transition-colors duration-df-fast ease-df-out hover:bg-df-surface-2 hover:text-df-text"
            >
              <LogOut aria-hidden="true" className="h-4 w-4" />
              {portal.auth.signOut}
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}

/**
 * The phone gets a different object, not a narrower one. A rail is unreachable
 * at the top of a tall screen and a row of seven chips is a scroll the reader
 * has to discover, so the four sections that carry the daily work sit in a bar
 * against the bottom edge, under the thumb, and the rest are behind one more
 * tap.
 *
 * The bar reserves its own height at the foot of the page rather than floating
 * over the end of it, and it clears the home indicator with the safe-area
 * inset instead of guessing at a gap.
 */
const PHONE_PRIMARY = 4

function TabBar({ sections, activeId, onSelect, onMore, moreActive, label }) {
  const { portal } = useContent()
  const primary = sections.slice(0, PHONE_PRIMARY)

  return (
    <nav
      aria-label={label}
      className="fixed inset-x-0 bottom-0 z-sticky border-t border-df-border bg-df-glass-fill [-webkit-backdrop-filter:blur(20px)] [backdrop-filter:blur(20px)] lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex max-w-lg items-stretch">
        {primary.map(({ id, icon: Icon }) => {
          const active = activeId === id
          return (
            <li key={id} className="flex-1">
              <button
                type="button"
                onClick={() => onSelect(id)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex h-df-tabbar w-full cursor-pointer flex-col items-center justify-center gap-1 px-1 text-[10px] font-700 uppercase tracking-[0.1em] transition-colors duration-df-fast ease-df-out [touch-action:manipulation] hover:text-df-text active:text-df-accent',
                  active ? 'text-df-accent-bright' : 'text-df-text-muted'
                )}
              >
                <span
                  className={cn(
                    'flex h-7 w-10 items-center justify-center rounded-df-full transition-colors duration-df-fast ease-df-out',
                    active && 'bg-df-accent-soft'
                  )}
                >
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <span className="max-w-full truncate">{portal.nav[id]}</span>
              </button>
            </li>
          )
        })}
        <li className="flex-1">
          <button
            type="button"
            onClick={onMore}
            aria-haspopup="dialog"
            className={cn(
              'flex h-df-tabbar w-full cursor-pointer flex-col items-center justify-center gap-1 px-1 text-[10px] font-700 uppercase tracking-[0.1em] transition-colors duration-df-fast ease-df-out [touch-action:manipulation] hover:text-df-text active:text-df-accent',
              moreActive ? 'text-df-accent-bright' : 'text-df-text-muted'
            )}
          >
            <span
              className={cn(
                'flex h-7 w-10 items-center justify-center rounded-df-full transition-colors duration-df-fast ease-df-out',
                moreActive && 'bg-df-accent-soft'
              )}
            >
              <MoreHorizontal aria-hidden="true" className="h-5 w-5" />
            </span>
            <span>{portal.more}</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}

/**
 * What the bar could not hold, as a sheet that rises from the same edge the
 * bar sits on — so the thing that opened it and the thing it opened are in the
 * same place, and every row is inside thumb reach rather than at the top of
 * the screen.
 */
function MoreSheet({ open, onClose, sections, activeId, onSelect }) {
  const { portal } = useContent()

  // The sheet stays in the document once it has been opened, so it is laid out
  // before it is asked to travel, and `hidden` is what closes it — after the
  // slide out, not instead of it.
  const [rendered, setRendered] = useState(open)
  if (open && !rendered) setRendered(true)

  useEffect(() => {
    if (!open) return undefined
    const onKey = event => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <div className="lg:hidden" hidden={!rendered}>
      <button
        type="button"
        aria-label={portal.close}
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-overlay cursor-pointer bg-df-overlay [touch-action:manipulation]',
          'transition-opacity duration-df-base ease-df-out motion-reduce:transition-none',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      />
      {/* The sheet travels on a CSS transition rather than on the motion
          library, exactly as the site header's does. A spring is driven from
          animation frames, and a tab the browser has throttled stops handing
          them out — which strands the sheet halfway up the screen with no way
          back. A transition is the compositor's own job and always arrives. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={portal.moreLabel}
        className={cn(
          'fixed inset-x-0 bottom-0 z-modal rounded-t-df-2xl border-t border-df-border bg-df-bg-elevated px-4 pt-3',
          'transition-transform duration-df-slow ease-df-out motion-reduce:transition-none',
          open ? 'translate-y-0' : 'translate-y-full'
        )}
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
        onTransitionEnd={event => {
          if (event.propertyName === 'transform' && !open) setRendered(false)
        }}
      >
        <span
          aria-hidden="true"
          className="mx-auto block h-1 w-10 rounded-df-full bg-df-surface-3"
        />
        <div className="mt-4 flex items-center justify-between">
          <MicroLabel>{portal.moreLabel}</MicroLabel>
          <button
            type="button"
            onClick={onClose}
            aria-label={portal.close}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-df-sm text-df-text-muted transition-colors duration-df-fast ease-df-out [touch-action:manipulation] hover:bg-df-surface-2 hover:text-df-text active:bg-df-surface-3"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
        <ul className="mt-2 flex max-h-[50dvh] flex-col overflow-y-auto overscroll-contain">
          {sections.map(({ id, icon: Icon }) => {
            const active = activeId === id
            return (
              <li key={id}>
                <button
                  type="button"
                  tabIndex={open ? 0 : -1}
                  onClick={() => {
                    onSelect(id)
                    onClose()
                  }}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex min-h-14 w-full cursor-pointer items-center gap-3 border-b border-df-border px-1 text-left text-[15px] font-600 transition-colors duration-df-fast ease-df-out [touch-action:manipulation] last:border-0 active:text-df-accent',
                    active ? 'text-df-accent-bright' : 'text-df-text hover:text-df-accent-bright'
                  )}
                >
                  <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-df-text-faint" />
                  {portal.nav[id]}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>,
    document.body
  )
}

export { PHONE_PRIMARY, MoreSheet, Rail, TabBar }

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { MoreHorizontal, X } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { MicroLabel, cn } from '@deluxfit/ds'
import { useContent } from '@/i18n'

const MotionDiv = motion.div

/**
 * The rail, at the width a laptop has room for. It is the whole map of the
 * portal held open beside the work rather than a menu that has to be asked
 * for, which is the difference between knowing where you are and remembering
 * where you were.
 *
 * The marker under the active row is one element that travels between rows on
 * a shared layout id, so the eye follows the move instead of finding it
 * already made.
 */
function Rail({ sections, activeId, onSelect, layoutId, label }) {
  const { portal } = useContent()
  const prefersReducedMotion = useReducedMotion()

  return (
    <nav aria-label={label} className="hidden lg:block">
      <ul className="sticky top-[calc(var(--df-header-height)+1.5rem)] flex flex-col gap-0.5">
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
                    className="absolute inset-0 -z-10 rounded-df-sm bg-df-surface-2 shadow-df-sm"
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { type: 'tween', duration: 0.2, ease: [0.22, 1, 0.36, 1] }
                    }
                  />
                )}
                <Icon
                  aria-hidden="true"
                  className={cn(
                    'h-4 w-4 shrink-0 transition-colors duration-df-fast ease-df-out',
                    active
                      ? 'text-df-accent-bright'
                      : 'text-df-text-faint group-hover:text-df-text-muted'
                  )}
                />
                {portal.nav[id]}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
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
      className="fixed inset-x-0 bottom-0 z-sticky border-t border-df-border bg-df-bg-elevated lg:hidden"
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
                <Icon aria-hidden="true" className="h-5 w-5" />
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
            <MoreHorizontal aria-hidden="true" className="h-5 w-5" />
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

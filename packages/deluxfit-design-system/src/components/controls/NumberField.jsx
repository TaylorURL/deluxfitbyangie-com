import { forwardRef, useCallback, useEffect, useRef } from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '../../lib/cn'
import { FIELD_EDGE, FIELD_SURFACE } from '../../lib/field'

/**
 * A measurement is entered far more often as a nudge than as a fresh number:
 * a weight moves half a pound from last week, a macro moves five grams. So the
 * field puts the two nudges either side of the value and holds the keyboard in
 * reserve — one thumb, no keypad, no page zoom.
 *
 * Holding a nudge repeats it, slowly at first and then quickly, which is what
 * makes a thirty-gram change one gesture instead of thirty taps. The repeat is
 * driven by timers rather than by the key-repeat the platform would give a
 * held key, because a finger on a screen generates no key repeat at all.
 *
 * The two nudges are named but kept out of the tab order: the same change is
 * on the arrow keys, and a form of five measurements would otherwise cost a
 * keyboard fifteen stops to cross.
 *
 * `startFrom` is where a nudge on an empty field begins. Zero is the wrong
 * floor for a measurement — the number being entered is nearly always a small
 * move from the last one — so the caller passes what was logged before and one
 * tap lands beside it rather than a hundred taps away.
 */
const HOLD_DELAY = 420
const HOLD_INTERVAL = 70

export const NumberField = forwardRef(function NumberField(
  {
    className,
    value,
    onValueChange,
    step = 1,
    min,
    max,
    suffix,
    invalid,
    disabled,
    decimals = 1,
    startFrom,
    decrementLabel = 'Decrease',
    incrementLabel = 'Increase',
    'aria-label': ariaLabel,
    ...props
  },
  ref
) {
  const holdRef = useRef({ timeout: 0, interval: 0 })

  const clamp = useCallback(
    next => {
      let bounded = next
      if (min != null) bounded = Math.max(min, bounded)
      if (max != null) bounded = Math.min(max, bounded)
      // Floating-point steps accumulate error the moment they are added, so
      // the value is rounded back to the precision the field advertises.
      return Number(bounded.toFixed(decimals))
    },
    [decimals, max, min]
  )

  const nudge = useCallback(
    direction => {
      const seed = value === '' || value == null ? (startFrom ?? 0) : value
      const current = Number(seed)
      const base = Number.isNaN(current) ? 0 : current
      onValueChange(String(clamp(base + direction * step)))
    },
    [clamp, onValueChange, startFrom, step, value]
  )

  const stopHold = useCallback(() => {
    window.clearTimeout(holdRef.current.timeout)
    window.clearInterval(holdRef.current.interval)
    holdRef.current = { timeout: 0, interval: 0 }
  }, [])

  const startHold = direction => {
    nudge(direction)
    holdRef.current.timeout = window.setTimeout(() => {
      holdRef.current.interval = window.setInterval(() => nudge(direction), HOLD_INTERVAL)
    }, HOLD_DELAY)
  }

  // A pointer released outside the button, or a component unmounted mid-hold,
  // would otherwise leave the interval running against a gone handler.
  useEffect(() => stopHold, [stopHold])

  const nudgeClass =
    'flex h-df-control w-11 shrink-0 items-center justify-center text-df-text-muted transition-colors duration-df-fast ease-df-out hover:bg-df-surface-2 hover:text-df-text focus-visible:relative focus-visible:z-10 disabled:pointer-events-none disabled:text-df-text-faint'

  return (
    <div
      className={cn(
        'flex items-stretch overflow-hidden rounded-df-sm border bg-df-field',
        'transition-[border-color,box-shadow] duration-df-fast ease-df-out',
        'focus-within:border-df-accent focus-within:shadow-df-ring',
        invalid ? FIELD_EDGE.true : 'border-df-border-input hover:border-df-border-hover',
        disabled && 'opacity-60',
        className
      )}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label={decrementLabel}
        disabled={disabled || (min != null && Number(value) <= min)}
        onPointerDown={() => startHold(-1)}
        onPointerUp={stopHold}
        onPointerLeave={stopHold}
        onPointerCancel={stopHold}
        className={cn(nudgeClass, 'border-r border-df-border')}
      >
        <Minus aria-hidden="true" className="h-4 w-4" />
      </button>

      <input
        ref={ref}
        type="text"
        inputMode="decimal"
        value={value}
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        onChange={event => {
          const raw = event.target.value
          // Anything that is not a number on its way to being one is dropped
          // at the keystroke, so the field never holds a value it would have
          // to reject on submit.
          if (raw === '' || /^-?\d*\.?\d*$/.test(raw)) onValueChange(raw)
        }}
        onKeyDown={event => {
          if (event.key === 'ArrowUp') {
            event.preventDefault()
            nudge(1)
          } else if (event.key === 'ArrowDown') {
            event.preventDefault()
            nudge(-1)
          }
        }}
        className={cn(
          FIELD_SURFACE,
          'h-df-control min-w-0 flex-1 border-0 bg-transparent px-2 text-center font-600 tabular-nums',
          'focus-visible:shadow-none',
          suffix && 'pr-0'
        )}
        {...props}
      />

      {suffix && (
        <span
          aria-hidden="true"
          className="flex shrink-0 select-none items-center pr-2 text-[13px] font-600 uppercase tracking-[0.1em] text-df-text-faint"
        >
          {suffix}
        </span>
      )}

      <button
        type="button"
        tabIndex={-1}
        aria-label={incrementLabel}
        disabled={disabled || (max != null && Number(value) >= max)}
        onPointerDown={() => startHold(1)}
        onPointerUp={stopHold}
        onPointerLeave={stopHold}
        onPointerCancel={stopHold}
        className={cn(nudgeClass, 'border-l border-df-border')}
      >
        <Plus aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  )
})

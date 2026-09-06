import { forwardRef } from 'react'
import { cn } from '../lib/cn'
import { FIELD_EDGE, FIELD_SURFACE } from '../lib/field'

/**
 * A date entered in a log is almost always today, and occasionally yesterday.
 * The picker is still there for the third case, but the two that account for
 * nearly everything are one tap above it rather than four inside it.
 *
 * The chips read as pressed when the field already holds the day they name,
 * so the row doubles as a statement of which day is being logged — which is
 * the question a reader looking at a half-filled form actually has.
 */
const dayKey = date =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`

const shiftedDay = offset => {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return dayKey(date)
}

export const DateField = forwardRef(function DateField(
  { className, value, onValueChange, shortcuts = [], invalid, ...props },
  ref
) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="relative">
        <input
          ref={ref}
          type="date"
          value={value}
          onChange={event => onValueChange(event.target.value)}
          aria-invalid={invalid || undefined}
          className={cn(
            FIELD_SURFACE,
            'h-df-control px-3.5 tabular-nums',
            // The browser draws the picker's own indicator, and the only thing
            // that reaches it is `color-scheme`, which each theme declares.
            '[&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70',
            invalid ? FIELD_EDGE.true : FIELD_EDGE.false
          )}
          {...props}
        />
      </div>
      {shortcuts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {shortcuts.map(shortcut => {
            const target = shiftedDay(shortcut.offset)
            const pressed = value === target
            return (
              <button
                key={shortcut.label}
                type="button"
                aria-pressed={pressed}
                onClick={() => onValueChange(target)}
                className={cn(
                  'inline-flex h-9 items-center rounded-df-full border px-3.5 text-[11px] font-700 uppercase tracking-[0.14em] transition-colors duration-df-fast ease-df-out',
                  pressed
                    ? 'border-df-accent bg-df-accent-soft text-df-accent-bright'
                    : 'border-df-border text-df-text-muted hover:border-df-border-hover hover:text-df-text'
                )}
              >
                {shortcut.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
})

export { dayKey }

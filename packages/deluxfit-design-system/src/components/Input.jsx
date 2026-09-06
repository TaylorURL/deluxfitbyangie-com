import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../lib/cn'
import { FIELD_EDGE, FIELD_HEIGHT, FIELD_SURFACE } from '../lib/field'

const inputVariants = cva(FIELD_SURFACE, {
  variants: {
    size: FIELD_HEIGHT,
    invalid: FIELD_EDGE,
    hasLeading: { true: 'pl-11', false: 'pl-3.5' },
    hasTrailing: { true: 'pr-11', false: 'pr-3.5' },
  },
  defaultVariants: { size: 'md', invalid: false, hasLeading: false, hasTrailing: false },
})

/**
 * `icon` puts a mark inside the field's left inset, which is how a field says
 * what it holds without spending a line of the label on it. `suffix` is the
 * unit the value is measured in, set inside the right inset so the reader
 * types a number and reads a measurement.
 *
 * Both are inert: the icon is hidden from the reader of a screen reader
 * because the label already said it, and the suffix cannot be clicked or
 * selected, so a tap anywhere across the field lands in the field.
 */
export const Input = forwardRef(function Input(
  { className, type = 'text', size, invalid, icon: Icon, suffix, ...props },
  ref
) {
  const field = (
    <input
      ref={ref}
      type={type}
      aria-invalid={invalid || undefined}
      className={cn(
        inputVariants({
          size,
          invalid,
          hasLeading: Boolean(Icon),
          hasTrailing: Boolean(suffix),
          className,
        }),
        suffix && 'tabular-nums'
      )}
      {...props}
    />
  )

  if (!Icon && !suffix) return field

  return (
    <div className="relative">
      {Icon && (
        <Icon
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-df-text-faint"
        />
      )}
      {field}
      {suffix && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 select-none text-[13px] font-600 uppercase tracking-[0.1em] text-df-text-faint"
        >
          {suffix}
        </span>
      )}
    </div>
  )
})

export { inputVariants }

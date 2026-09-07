import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/cn'
import { FIELD_EDGE, FIELD_HEIGHT, FIELD_SURFACE } from '../../lib/field'

/**
 * The native control with its OS chrome removed and this system's chevron put
 * back. The platform's own option list survives that, which is the reason to
 * take this route rather than build a listbox: on a phone it is the wheel the
 * reader already knows, it is keyboard-navigable and screen-reader-correct for
 * free, and it never renders off the bottom of a scrolling panel.
 */
const selectVariants = cva([FIELD_SURFACE, 'appearance-none pl-3.5 pr-11'].join(' '), {
  variants: { size: FIELD_HEIGHT, invalid: FIELD_EDGE },
  defaultVariants: { size: 'md', invalid: false },
})

/**
 * Options come either from the `options` array — plain strings, or
 * `{ value, label }` pairs — or from `<option>` children. A `placeholder` adds
 * a disabled first option and selects it, which is the only way a native
 * select can show prompt text.
 */
export const Select = forwardRef(function Select(
  { className, size, invalid, placeholder, options, value, defaultValue, children, ...props },
  ref
) {
  const showPlaceholder = Boolean(placeholder)
  return (
    <div className="relative">
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        defaultValue={
          value === undefined && defaultValue === undefined && showPlaceholder ? '' : defaultValue
        }
        value={value}
        className={cn(selectVariants({ size, invalid, className }))}
        {...props}
      >
        {showPlaceholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {Array.isArray(options)
          ? options.map(option =>
              typeof option === 'string' ? (
                <option key={option} value={option}>
                  {option}
                </option>
              ) : (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              )
            )
          : children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-df-text-muted"
      />
    </div>
  )
})

export { selectVariants }

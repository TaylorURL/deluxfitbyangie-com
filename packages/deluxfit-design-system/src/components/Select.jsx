import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cva } from 'class-variance-authority'
import { cn } from '../lib/cn'

/**
 * Select — a native <select> styled to match Input/Textarea. Pairs with
 * <Field> for label + helper/error wrapping. The chevron is a decorative
 * lucide glyph layered over the native control.
 *
 * Children are the option list (use <option> nodes); pass a `placeholder`
 * to render a disabled-selected first option.
 */
const selectVariants = cva(
  [
    'w-full appearance-none rounded-df-sm border bg-df-surface-2 pl-4 pr-10 text-df-text placeholder:text-df-text-faint',
    'transition-colors duration-150 ease-df-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-df-bg',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      size: { sm: 'h-10 text-sm', md: 'h-12 text-[15px]', lg: 'h-14 text-base' },
      invalid: {
        true: 'border-df-danger focus-visible:ring-df-danger',
        false: 'border-df-border-input hover:border-df-border-hover',
      },
    },
    defaultVariants: { size: 'md', invalid: false },
  }
)

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
        defaultValue={value === undefined && defaultValue === undefined && showPlaceholder ? '' : defaultValue}
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
          ? options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))
          : children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-df-text-muted"
      />
    </div>
  )
})

export { selectVariants }

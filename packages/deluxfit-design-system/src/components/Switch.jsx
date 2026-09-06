import { forwardRef } from 'react'
import { cn } from '../lib/cn'

/**
 * A checkbox drawn as a switch. It stays a checkbox underneath — the input is
 * the control, and the track and knob are painted from its checked state — so
 * the label association, the keyboard, the form value and the announcement all
 * come from the platform rather than from a div pretending.
 */
export const Switch = forwardRef(function Switch(
  { className, label, description, id, ...props },
  ref
) {
  return (
    <label
      className={cn(
        'group flex cursor-pointer items-start gap-3 rounded-df-sm py-1',
        props.disabled && 'cursor-not-allowed opacity-60',
        className
      )}
    >
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          role="switch"
          className="peer h-6 w-11 cursor-pointer appearance-none rounded-df-full border border-df-border-input bg-df-surface-2 transition-colors duration-df-fast ease-df-out checked:border-df-accent checked:bg-df-accent disabled:cursor-not-allowed"
          {...props}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-[3px] top-1/2 h-4 w-4 -translate-y-1/2 rounded-df-full bg-df-text-muted transition-[transform,background-color] duration-df-fast ease-df-out peer-checked:translate-x-5 peer-checked:bg-df-on-accent"
        />
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] font-600 leading-snug text-df-text">{label}</span>
        {description && (
          <span className="mt-1 block text-[13px] leading-snug text-df-text-muted">
            {description}
          </span>
        )}
      </span>
    </label>
  )
})

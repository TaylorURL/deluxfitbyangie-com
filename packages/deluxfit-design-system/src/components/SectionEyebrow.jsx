import { forwardRef } from 'react'
import { cn } from '../lib/cn'

/**
 * SectionEyebrow — a small uppercase kicker above a section heading, with a
 * short red rule for the athletic accent.
 */
export const SectionEyebrow = forwardRef(function SectionEyebrow(
  { className, children, ...props },
  ref
) {
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-2.5 text-xs font-700 uppercase tracking-[0.22em] text-df-accent-bright',
        className
      )}
      {...props}
    >
      <span className="h-px w-7 bg-df-accent" aria-hidden="true" />
      {children}
    </span>
  )
})

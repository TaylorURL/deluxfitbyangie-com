import { forwardRef } from 'react'
import { cn } from '../lib/cn'

/**
 * SectionIndex — the oversized, crimson-outlined section numeral that recurs
 * across the site as type furniture (01 → 09). Purely decorative: hidden from
 * assistive tech so the visible numbering never competes with the heading.
 *
 * The outline is drawn with `-webkit-text-stroke` (referencing the accent
 * token) so the glyph reads as structure, not a filled label.
 */
export const SectionIndex = forwardRef(function SectionIndex(
  { className, children, ...props },
  ref
) {
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn(
        'font-display text-[clamp(1.75rem,6vw,3.75rem)] font-400 leading-none tracking-tight text-transparent [-webkit-text-stroke:1.5px_var(--df-accent)]',
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
})

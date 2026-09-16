import { forwardRef } from 'react'
import { cn } from '../../lib/cn'

/**
 * The word above a section's headline, set as a chip: a hairline pill with a
 * live red dot and the label in small caps.
 *
 * It used to be a rule and a word, which is the quietest possible way to
 * introduce a section and was quiet enough to miss. The chip gives the
 * introduction an object the eye lands on before the headline, and the dot
 * carries the brand red into a section without the headline having to.
 *
 * `tone="accent"` fills the chip for the one section on a page that is the
 * point of the page — the programs, the application.
 */
export const SectionEyebrow = forwardRef(function SectionEyebrow(
  { className, tone = 'neutral', children, ...props },
  ref
) {
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex h-8 items-center gap-2.5 rounded-df-full border px-3.5 text-[11px] font-700 uppercase tracking-[0.18em]',
        tone === 'accent'
          ? 'border-df-accent bg-df-accent-soft text-df-accent-bright'
          : 'border-df-border-strong bg-df-surface text-df-text-muted shadow-df-key-soft',
        className
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="relative flex h-1.5 w-1.5 shrink-0 items-center justify-center"
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-df-full bg-df-accent-bright opacity-60 motion-reduce:hidden" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-df-full bg-df-accent-bright" />
      </span>
      {children}
    </span>
  )
})

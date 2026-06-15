import { forwardRef } from 'react'
import { cn } from '../lib/cn'

/**
 * StatBlock — an oversized metric paired with a label. Use in trust strips and
 * the program breakdown to make proof scannable.
 *
 * @param {object} props
 * @param {string} props.value - the headline number (e.g. "500+")
 * @param {string} props.label - what the number measures
 * @param {boolean} [props.accent] - color the value in brand red
 */
export const StatBlock = forwardRef(function StatBlock(
  { className, value, label, accent = false, ...props },
  ref
) {
  return (
    <div ref={ref} className={cn('text-center', className)} {...props}>
      <div
        className={cn(
          'font-display text-4xl font-700 leading-none tracking-tight sm:text-5xl',
          accent ? 'text-df-accent-bright' : 'text-df-text'
        )}
      >
        {value}
      </div>
      <div className="mt-2 text-xs font-500 uppercase tracking-wider text-df-text-muted">
        {label}
      </div>
    </div>
  )
})

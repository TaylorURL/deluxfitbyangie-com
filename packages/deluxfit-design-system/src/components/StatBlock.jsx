import { forwardRef } from 'react'
import { cn } from '../lib/cn'

const VALUE_SIZE = {
  md: 'text-[clamp(2.5rem,6vw,3.5rem)]',
  giant: 'text-[clamp(3.5rem,12vw,9rem)]',
}

/**
 * StatBlock — an oversized numeral paired with a label, the visual anchor of the
 * proof strips. `size="giant"` renders the program stats as hero-scale graphics;
 * numerals are tabular so a row of figures stays optically aligned.
 *
 * @param {object} props
 * @param {string} props.value - the headline number (e.g. "500+")
 * @param {string} props.label - what the number measures
 * @param {boolean} [props.accent] - color the value in brand crimson
 * @param {'md'|'giant'} [props.size='md']
 * @param {'left'|'center'} [props.align='center']
 */
export const StatBlock = forwardRef(function StatBlock(
  { className, value, label, accent = false, size = 'md', align = 'center', ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(align === 'center' ? 'text-center' : 'text-left', className)}
      {...props}
    >
      <div
        className={cn(
          'font-display font-400 leading-[0.82] tracking-tight tabular-nums',
          VALUE_SIZE[size] ?? VALUE_SIZE.md,
          accent ? 'text-df-accent-bright' : 'text-df-text'
        )}
      >
        {value}
      </div>
      <div
        className={cn(
          'mt-3 text-[11px] font-600 uppercase tracking-[0.2em] text-df-text-muted',
          size === 'giant' && 'sm:text-xs'
        )}
      >
        {label}
      </div>
    </div>
  )
})

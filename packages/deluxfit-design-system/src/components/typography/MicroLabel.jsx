import { forwardRef } from 'react'
import { cn } from '../../lib/cn'

/**
 * The smallest label in the system: the word above a figure, a fieldset's
 * legend, a column head, the name of a group of controls.
 *
 * It was written out longhand in twenty-three places, at two different
 * trackings, which is how the same label ends up looking like two labels on
 * two screens of one application. One letter-spacing, one weight, one size,
 * and a name to ask for it by.
 *
 * `SectionEyebrow` is the larger relation — it introduces a section of a page
 * and carries the accent rule; this one sits inside a panel and stays quiet.
 *
 * `size="xs"` is the register below it — the word over a group of links in a
 * dense menu. It is the only place the letter-spacing opens up, because at ten
 * pixels the standard tracking closes the word into a block.
 */
const SIZE = {
  md: 'text-[11px] tracking-[0.14em]',
  xs: 'text-[10px] tracking-[0.2em]',
}

const TONE = {
  muted: 'text-df-text-muted',
  faint: 'text-df-text-faint',
  accent: 'text-df-accent-bright',
}

export const MicroLabel = forwardRef(function MicroLabel(
  { className, as: Component = 'p', size = 'md', tone = 'muted', ...props },
  ref
) {
  return (
    <Component
      ref={ref}
      className={cn('font-700 uppercase', SIZE[size], TONE[tone], className)}
      {...props}
    />
  )
})

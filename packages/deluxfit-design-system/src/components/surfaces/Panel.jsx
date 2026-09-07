import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/cn'

/**
 * The step above a card: a form, a calendar, a sheet of controls — something
 * the reader works inside rather than reads. It takes the largest corner in
 * the scale and the card's own ring-first light, so a page can hold both
 * without either being mistaken for the other.
 *
 * It exists so that the six forms on this site stop each describing their own
 * box. Where two files style the same kind of surface differently, one of them
 * is wrong even though both look fine alone.
 */
const panelVariants = cva('rounded-df-lg bg-df-surface', {
  variants: {
    elevation: { flat: 'shadow-df-sm', raised: 'shadow-df-md' },
    padded: { true: 'p-5 sm:p-8', false: '' },
  },
  defaultVariants: { elevation: 'raised', padded: true },
})

export const Panel = forwardRef(function Panel(
  { className, elevation, padded, as: Component = 'div', ...props },
  ref
) {
  return (
    <Component
      ref={ref}
      className={cn(panelVariants({ elevation, padded, className }))}
      {...props}
    />
  )
})

export { panelVariants }

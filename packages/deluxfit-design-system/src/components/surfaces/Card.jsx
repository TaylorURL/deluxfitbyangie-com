import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/cn'

/**
 * Elevation is ring-first: the edge is the first thing in every shadow, so a
 * card's boundary stays exactly one pixel however far the light beneath it
 * spreads. `border` is left off deliberately — the ring is the border, and a
 * second one beside it doubles the hairline.
 *
 * `inset` is the row that lives inside a Panel — a membership, a logged set,
 * a message. It steps its ground down rather than up and takes the ring
 * alone, because a row that casts a drop shadow inside a surface reads as
 * floating over the thing it belongs to.
 *
 * `interactive` is for a card that is itself a link or a button. It answers
 * the pointer by deepening its own light rather than by moving: a grid of
 * cards that each rise on hover makes the page feel loose, and a card that
 * lifts under a finger has already been tapped by the time it finishes.
 */
const cardVariants = cva(
  'rounded-df-md transition-[box-shadow,background-color] duration-df-base ease-df-out',
  {
    variants: {
      variant: {
        surface: 'bg-df-surface shadow-df-sm',
        elevated: 'bg-df-surface-2 shadow-df-md',
        inset: 'bg-df-surface-2 shadow-df-sm',
        glass: 'bg-df-glass-fill shadow-df-md backdrop-blur-xl',
      },
      padded: { true: 'p-5 sm:p-6', false: '' },
      interactive: { true: 'hover:shadow-df-lg', false: '' },
    },
    defaultVariants: { variant: 'surface', padded: true, interactive: false },
  }
)

export const Card = forwardRef(function Card(
  { className, variant, padded, interactive, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padded, interactive, className }))}
      {...props}
    />
  )
})

export { cardVariants }

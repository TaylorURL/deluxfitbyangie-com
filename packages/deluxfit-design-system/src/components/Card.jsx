import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../lib/cn'

/**
 * Card — an elevated charcoal surface. `variant` controls the base treatment;
 * `interactive` adds a hover lift + red border for clickable cards.
 */
const cardVariants = cva('rounded-df-lg border transition-colors duration-200 ease-df-out', {
  variants: {
    variant: {
      surface: 'border-df-border bg-df-surface',
      elevated: 'border-df-border-strong bg-df-surface-2 shadow-df-lg',
      glass: 'border-df-glass-border bg-df-glass-fill backdrop-blur-xl',
    },
    padded: { true: 'p-6 sm:p-8', false: '' },
    interactive: {
      true: 'hover:-translate-y-1 hover:border-df-border-hover hover:shadow-df-glow-soft',
      false: '',
    },
  },
  defaultVariants: { variant: 'surface', padded: true, interactive: false },
})

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

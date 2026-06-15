import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../lib/cn'

/**
 * Badge / Pill — a compact eyebrow or status chip. `tone` carries semantic
 * color; `variant` switches between a soft tinted fill, a solid fill, and an
 * outline.
 */
const badgeVariants = cva(
  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-df-full font-semibold uppercase tracking-wider leading-none',
  {
    variants: {
      tone: { accent: '', neutral: '', positive: '', warning: '' },
      variant: { soft: '', solid: '', outline: '' },
      size: {
        sm: 'px-2.5 py-1 text-[10px]',
        md: 'px-3 py-1.5 text-[11px]',
        lg: 'px-4 py-2 text-[12px]',
      },
    },
    compoundVariants: [
      { tone: 'accent', variant: 'soft', class: 'bg-df-accent-soft text-df-accent-bright' },
      { tone: 'neutral', variant: 'soft', class: 'bg-df-surface-3 text-df-text-muted' },
      { tone: 'positive', variant: 'soft', class: 'bg-df-positive-soft text-df-positive' },
      { tone: 'warning', variant: 'soft', class: 'bg-df-warning-soft text-df-warning' },
      { tone: 'accent', variant: 'solid', class: 'bg-df-accent text-df-on-accent' },
      { tone: 'neutral', variant: 'solid', class: 'bg-df-surface-3 text-df-text' },
      { tone: 'positive', variant: 'solid', class: 'bg-df-positive text-black' },
      { tone: 'warning', variant: 'solid', class: 'bg-df-warning text-black' },
      {
        tone: 'accent',
        variant: 'outline',
        class: 'border border-df-accent text-df-accent-bright',
      },
      {
        tone: 'neutral',
        variant: 'outline',
        class: 'border border-df-border-strong text-df-text-muted',
      },
      {
        tone: 'positive',
        variant: 'outline',
        class: 'border border-df-positive text-df-positive',
      },
      { tone: 'warning', variant: 'outline', class: 'border border-df-warning text-df-warning' },
    ],
    defaultVariants: { tone: 'accent', variant: 'soft', size: 'md' },
  }
)

export const Badge = forwardRef(function Badge(
  { className, tone, variant, size, ...props },
  ref
) {
  return (
    <span ref={ref} className={cn(badgeVariants({ tone, variant, size, className }))} {...props} />
  )
})

export { badgeVariants }

import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/cn'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-df-full font-700 uppercase tracking-[0.1em] leading-none',
  {
    variants: {
      tone: { accent: '', neutral: '', positive: '', warning: '', danger: '' },
      variant: { soft: '', solid: '', outline: '' },
      size: {
        sm: 'h-5 px-2 text-[10px]',
        md: 'h-6 px-2.5 text-[11px]',
        lg: 'h-7 px-3 text-[12px]',
      },
    },
    compoundVariants: [
      { tone: 'accent', variant: 'soft', class: 'bg-df-accent-soft text-df-accent-bright' },
      { tone: 'danger', variant: 'soft', class: 'bg-df-danger-soft text-df-danger' },
      { tone: 'neutral', variant: 'soft', class: 'bg-df-surface-3 text-df-text-muted' },
      { tone: 'positive', variant: 'soft', class: 'bg-df-positive-soft text-df-positive' },
      { tone: 'warning', variant: 'soft', class: 'bg-df-warning-soft text-df-warning' },
      {
        tone: 'accent',
        variant: 'solid',
        class: 'bg-df-accent bg-df-accent-gradient text-df-on-accent',
      },
      { tone: 'neutral', variant: 'solid', class: 'bg-df-surface-3 text-df-text' },
      { tone: 'positive', variant: 'solid', class: 'bg-df-positive text-df-bg' },
      { tone: 'warning', variant: 'solid', class: 'bg-df-warning text-df-bg' },
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
      { tone: 'danger', variant: 'outline', class: 'border border-df-danger text-df-danger' },
      { tone: 'danger', variant: 'solid', class: 'bg-df-danger text-df-on-accent' },
    ],
    defaultVariants: { tone: 'accent', variant: 'soft', size: 'md' },
  }
)

export const Badge = forwardRef(function Badge({ className, tone, variant, size, ...props }, ref) {
  return (
    <span ref={ref} className={cn(badgeVariants({ tone, variant, size, className }))} {...props} />
  )
})

export { badgeVariants }

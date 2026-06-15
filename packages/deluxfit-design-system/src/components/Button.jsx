import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '../lib/cn'

/**
 * Button — the system's primary action element.
 *
 * Variants bind to `--df-*` tokens so the red/black theme stays consistent.
 * `asChild` swaps the underlying element for Radix Slot composition — use it to
 * apply Button styling to an anchor (e.g. a Stripe checkout link) while keeping
 * a single set of classes. Pass icons as children; `iconRight` keeps a trailing
 * icon optically balanced.
 */
const buttonVariants = cva(
  [
    'group relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-df-sm font-semibold uppercase tracking-wide',
    'transition-[background-color,color,border-color,box-shadow,transform] duration-150 ease-df-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-df-bg',
    'active:translate-y-px disabled:pointer-events-none disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      variant: {
        primary:
          'border border-df-accent bg-df-accent text-df-on-accent shadow-df-glow-soft hover:bg-df-accent-bright hover:shadow-df-glow',
        secondary:
          'border border-df-border-strong bg-df-surface-2 text-df-text hover:border-df-border-hover hover:bg-df-surface-3',
        outline:
          'border border-df-accent bg-transparent text-df-accent-bright hover:bg-df-accent-soft',
        ghost: 'text-df-text-muted hover:bg-df-surface-2 hover:text-df-text',
      },
      size: {
        sm: 'h-10 px-4 text-[12px]',
        md: 'h-12 px-6 text-[13px]',
        lg: 'h-14 px-8 text-[15px]',
      },
      block: { true: 'w-full', false: '' },
    },
    defaultVariants: { variant: 'primary', size: 'md', block: false },
  }
)

export const Button = forwardRef(function Button(
  { className, variant, size, block, asChild = false, type, children, ...props },
  ref
) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      ref={ref}
      className={cn(buttonVariants({ variant, size, block, className }))}
      type={asChild ? undefined : (type ?? 'button')}
      {...props}
    >
      {children}
    </Comp>
  )
})

export { buttonVariants }

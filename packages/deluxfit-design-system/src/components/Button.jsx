import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '../lib/cn'

/**
 * A key sits on the surface rather than floating above it, so its light is a
 * contact shadow — a hairline of its own colour and two tight drops — and not
 * a coloured bloom. One glowing button looks important; a screen of them looks
 * like a demo, and this app has screens of them.
 *
 * The filled key deepens under the pointer instead of brightening. Lightening
 * a solid accent reads as the button fading out from under the finger, which
 * is the opposite of what a press is meant to say.
 *
 * Heights come from the shared control tokens, so a key and the field beside
 * it line up without either being tuned to the other.
 *
 * `asChild` swaps the underlying element for Radix Slot composition — use it
 * to apply Button styling to an anchor (e.g. a Stripe checkout link) while
 * keeping a single set of classes. Pass icons as children.
 */
const buttonVariants = cva(
  [
    'group relative inline-flex select-none items-center justify-center gap-2 rounded-df-sm text-center font-700 uppercase tracking-[0.1em]',
    'transition-[background-color,color,border-color,box-shadow] duration-df-fast ease-df-out',
    'disabled:pointer-events-none disabled:opacity-45',
  ].join(' '),
  {
    variants: {
      variant: {
        primary:
          'border border-df-accent-deep bg-df-accent text-df-on-accent shadow-df-key hover:bg-df-accent-deep hover:shadow-df-key-soft',
        secondary:
          'border border-df-border-strong bg-df-surface-2 text-df-text shadow-df-key-soft hover:border-df-border-hover hover:bg-df-surface-3',
        outline:
          'border border-df-accent bg-transparent text-df-accent-bright hover:bg-df-accent-soft',
        ghost:
          'border border-transparent text-df-text-muted hover:bg-df-surface-2 hover:text-df-text',
        danger:
          'border border-df-danger bg-df-danger-soft text-df-danger shadow-df-key-soft hover:bg-df-danger hover:text-df-on-accent',
      },
      size: {
        sm: 'h-df-control-sm px-3.5 text-[11px]',
        md: 'h-df-control px-5 text-[12px]',
        lg: 'h-df-control-lg px-7 text-[13px]',
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

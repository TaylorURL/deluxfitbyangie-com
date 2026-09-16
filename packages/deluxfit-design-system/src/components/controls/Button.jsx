import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/cn'

/**
 * Every key is a pill. The site's chrome is already round — the floating bar,
 * the eyebrow chip, the badges — and a rectangular button inside it was the
 * one square thing on the page. A pill also reads as a control from further
 * away than a rounded rectangle does, which is the whole job of a button on a
 * page a visitor is scanning rather than reading.
 *
 * The filled key takes the accent gradient rather than the flat fill, with a
 * one-pixel highlight along its top edge: the red with a light on it, so the
 * key reads as a form rather than as a warning label. It deepens under the
 * pointer instead of brightening. Lightening a solid accent reads as the
 * button fading out from under the finger, which is the opposite of what a
 * press is meant to say.
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
    'group relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-df-full text-center font-700 uppercase tracking-[0.08em]',
    'transition-[background-color,color,border-color,box-shadow,transform] duration-df-fast ease-df-out',
    'disabled:pointer-events-none disabled:opacity-45',
  ].join(' '),
  {
    variants: {
      variant: {
        primary:
          'border border-df-accent-deep bg-df-accent bg-df-accent-gradient text-df-on-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_1px_1px_var(--df-shadow-ambient),0_8px_20px_-8px_rgba(225,29,42,0.55)] hover:bg-df-accent-gradient-hover hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_1px_1px_var(--df-shadow-ambient),0_10px_24px_-8px_rgba(225,29,42,0.7)]',
        secondary:
          'border border-df-border-strong bg-df-surface-2 text-df-text shadow-[inset_0_1px_0_var(--df-edge-light),0_1px_2px_var(--df-shadow-ambient)] hover:border-df-border-hover hover:bg-df-surface-3',
        outline:
          'border border-df-accent bg-transparent text-df-accent-bright hover:bg-df-accent-soft',
        ghost:
          'border border-transparent text-df-text-muted hover:bg-df-surface-2 hover:text-df-text',
        danger:
          'border border-df-danger bg-df-danger-soft text-df-danger shadow-df-key-soft hover:bg-df-danger hover:text-df-on-accent',
      },
      size: {
        sm: 'h-df-control-sm px-4 text-[11px]',
        md: 'h-df-control px-6 text-[12px]',
        lg: 'h-df-control-lg px-8 text-[13px]',
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

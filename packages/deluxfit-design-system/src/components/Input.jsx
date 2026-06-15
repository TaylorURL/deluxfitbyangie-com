import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../lib/cn'

/**
 * Input — a single-line text/email field bound to DS tokens. Pairs with
 * <Field> for a label + helper/error wrapper.
 */
const inputVariants = cva(
  [
    'w-full rounded-df-sm border bg-df-surface-2 px-4 text-df-text placeholder:text-df-text-faint',
    'transition-colors duration-150 ease-df-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-df-bg',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      size: { sm: 'h-10 text-sm', md: 'h-12 text-[15px]', lg: 'h-14 text-base' },
      invalid: {
        true: 'border-df-danger focus-visible:ring-df-danger',
        false: 'border-df-border-input hover:border-df-border-hover',
      },
    },
    defaultVariants: { size: 'md', invalid: false },
  }
)

export const Input = forwardRef(function Input(
  { className, type = 'text', size, invalid, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      type={type}
      aria-invalid={invalid || undefined}
      className={cn(inputVariants({ size, invalid, className }))}
      {...props}
    />
  )
})

export { inputVariants }

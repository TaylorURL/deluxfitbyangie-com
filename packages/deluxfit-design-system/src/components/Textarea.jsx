import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../lib/cn'

/**
 * Textarea — a multi-line text field bound to the same DS tokens as Input.
 * Pairs with <Field> for label + helper/error wrapping.
 */
const textareaVariants = cva(
  [
    'w-full rounded-df-sm border bg-df-surface-2 px-4 py-3 text-df-text placeholder:text-df-text-faint',
    'transition-colors duration-150 ease-df-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-df-bg',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'resize-y',
  ].join(' '),
  {
    variants: {
      size: { sm: 'text-sm', md: 'text-[15px]', lg: 'text-base' },
      invalid: {
        true: 'border-df-danger focus-visible:ring-df-danger',
        false: 'border-df-border-input hover:border-df-border-hover',
      },
    },
    defaultVariants: { size: 'md', invalid: false },
  }
)

export const Textarea = forwardRef(function Textarea(
  { className, rows = 5, size, invalid, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(textareaVariants({ size, invalid, className }))}
      {...props}
    />
  )
})

export { textareaVariants }

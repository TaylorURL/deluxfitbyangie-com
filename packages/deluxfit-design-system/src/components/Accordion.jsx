import { forwardRef } from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { Plus } from 'lucide-react'
import { cn } from '../lib/cn'

/**
 * Accordion — a thin wrapper over Radix Accordion bound to DS tokens. Composes
 * as `Accordion` (root) → `FaqItem` (question/answer pair). The Radix primitive
 * supplies keyboard navigation, focus management, and ARIA wiring for free.
 */
export const Accordion = forwardRef(function Accordion(
  { className, type = 'single', collapsible = true, ...props },
  ref
) {
  return (
    <AccordionPrimitive.Root
      ref={ref}
      type={type}
      collapsible={type === 'single' ? collapsible : undefined}
      className={cn('flex flex-col gap-3', className)}
      {...props}
    />
  )
})

/**
 * FaqItem — a single collapsible question/answer row. The trigger rotates a
 * plus into a minus and the panel animates open via the preset keyframes.
 *
 * @param {object} props
 * @param {string} props.value - unique item id for Radix
 * @param {string} props.question
 * @param {React.ReactNode} props.answer
 */
export const FaqItem = forwardRef(function FaqItem(
  { className, value, question, answer, children, ...props },
  ref
) {
  return (
    <AccordionPrimitive.Item
      ref={ref}
      value={value}
      className={cn(
        'overflow-hidden rounded-df-lg border border-df-border bg-df-surface transition-colors data-[state=open]:border-df-border-strong',
        className
      )}
      {...props}
    >
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-display text-base font-500 uppercase tracking-wide text-df-text transition-colors hover:text-df-accent-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright sm:px-6 sm:text-lg">
          {question}
          <Plus
            className="h-5 w-5 shrink-0 text-df-accent-bright transition-transform duration-300 ease-df-out group-data-[state=open]:rotate-45"
            aria-hidden="true"
          />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-[df-acc-up_220ms_ease] data-[state=open]:animate-[df-acc-down_220ms_ease]">
        <div className="px-5 pb-5 text-[15px] leading-relaxed text-df-text-muted sm:px-6">
          {answer ?? children}
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  )
})

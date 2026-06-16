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
      className={cn('flex flex-col border-t border-df-border', className)}
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
  { className, value, index, question, answer, children, ...props },
  ref
) {
  return (
    <AccordionPrimitive.Item
      ref={ref}
      value={value}
      className={cn(
        'group/item border-b border-df-border transition-colors',
        className
      )}
      {...props}
    >
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger className="group flex w-full items-center gap-4 py-6 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright sm:gap-6">
          {index && (
            <span
              aria-hidden="true"
              className="font-display text-xl font-400 leading-none tabular-nums text-df-accent-bright sm:text-2xl"
            >
              {index}
            </span>
          )}
          <span className="flex-1 text-base font-600 text-df-text transition-colors group-hover:text-df-accent-bright sm:text-lg">
            {question}
          </span>
          <Plus
            className="h-5 w-5 shrink-0 text-df-accent-bright transition-transform duration-300 ease-df-out group-data-[state=open]:rotate-45"
            aria-hidden="true"
          />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-[df-acc-up_220ms_ease] data-[state=open]:animate-[df-acc-down_220ms_ease]">
        <div className="pb-6 pr-4 text-[15px] leading-relaxed text-df-text-muted sm:pl-[3.25rem]">
          {answer ?? children}
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  )
})

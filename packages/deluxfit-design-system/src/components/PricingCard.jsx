import { forwardRef } from 'react'
import { Check } from 'lucide-react'
import { cn } from '../lib/cn'
import { Badge } from './Badge'
import { Button } from './Button'

/**
 * PricingCard — a single coaching tier. The `highlighted` ("Most Popular") state
 * scales up, swaps to a red-glow border, and reads as the recommended choice.
 *
 * The CTA is rendered as an anchor (via Button `asChild`) so it can open a
 * Stripe Payment Link in a new tab without any backend.
 *
 * @param {object} props
 * @param {string} props.name - tier name
 * @param {string} props.price - formatted price (e.g. "$249")
 * @param {string} [props.period] - billing period label (e.g. "one-time")
 * @param {string} [props.description] - short positioning line
 * @param {string[]} props.features - feature list rendered with check icons
 * @param {string} props.ctaLabel - button text
 * @param {string} props.ctaHref - Stripe Payment Link URL
 * @param {boolean} [props.highlighted] - "Most Popular" emphasis
 * @param {string} [props.badgeLabel] - label for the highlight badge
 */
export const PricingCard = forwardRef(function PricingCard(
  {
    className,
    name,
    price,
    period,
    description,
    features = [],
    ctaLabel,
    ctaHref,
    highlighted = false,
    badgeLabel = 'Most Popular',
    ...props
  },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        'relative flex flex-col rounded-df-xl border p-7 transition-transform duration-300 ease-df-out sm:p-8',
        highlighted
          ? 'border-df-accent bg-df-surface-2 shadow-df-glow lg:scale-[1.04]'
          : 'border-df-border bg-df-surface hover:border-df-border-strong',
        className
      )}
      {...props}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge tone="accent" variant="solid" size="md" className="shadow-df-glow-soft">
            {badgeLabel}
          </Badge>
        </div>
      )}

      <h3 className="font-display text-2xl font-600 uppercase tracking-wide text-df-text">
        {name}
      </h3>
      {description && <p className="mt-1.5 text-sm text-df-text-muted">{description}</p>}

      <div className="mt-5 flex items-end gap-1.5">
        <span className="font-display text-5xl font-700 leading-none text-df-text">{price}</span>
        {period && <span className="pb-1 text-sm text-df-text-faint">{period}</span>}
      </div>

      <ul className="mt-7 flex flex-col gap-3.5">
        {features.map(feature => (
          <li key={feature} className="flex items-start gap-3 text-sm text-df-text-muted">
            <span
              className={cn(
                'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-df-full',
                highlighted ? 'bg-df-accent text-df-on-accent' : 'bg-df-accent-soft text-df-accent-bright'
              )}
            >
              <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        asChild
        variant={highlighted ? 'primary' : 'outline'}
        size="lg"
        block
        className="mt-8"
      >
        <a href={ctaHref} target="_blank" rel="noopener noreferrer">
          {ctaLabel}
        </a>
      </Button>
    </div>
  )
})

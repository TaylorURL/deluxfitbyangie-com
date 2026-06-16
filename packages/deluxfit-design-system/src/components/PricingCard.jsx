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
        'relative flex flex-col rounded-df-xl border p-7 transition-transform duration-300 ease-df-out sm:p-9',
        highlighted
          ? 'border-df-accent bg-df-surface-2 shadow-df-glow lg:scale-[1.04]'
          : 'border-df-border bg-df-surface hover:border-df-border-strong',
        className
      )}
      {...props}
    >
      {highlighted && (
        <div className="absolute -top-3 left-7 sm:left-9">
          <Badge tone="accent" variant="solid" size="md" className="shadow-df-glow-soft">
            {badgeLabel}
          </Badge>
        </div>
      )}

      <h3 className="font-display text-xl font-400 uppercase tracking-[0.04em] text-df-text-muted">
        {name}
      </h3>

      <div className="mt-6 flex items-end gap-2 border-b border-df-border pb-7">
        <span className="font-display text-[clamp(3.5rem,9vw,5.5rem)] font-400 leading-[0.82] tracking-tight tabular-nums text-df-text">
          {price}
        </span>
        {period && <span className="pb-2 text-sm text-df-text-faint">{period}</span>}
      </div>

      {description && (
        <p className="mt-5 text-[15px] leading-relaxed text-df-text-muted">{description}</p>
      )}

      <ul className="mt-7 flex flex-1 flex-col gap-3.5">
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
        className="mt-9"
      >
        <a href={ctaHref} target="_blank" rel="noopener noreferrer">
          {ctaLabel}
        </a>
      </Button>
    </div>
  )
})

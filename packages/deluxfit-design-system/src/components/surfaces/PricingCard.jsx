import { forwardRef } from 'react'
import { Check } from 'lucide-react'
import { cn } from '../../lib/cn'
import { SplitHeading } from '../typography/SplitHeading'
import { Badge } from '../typography/Badge'
import { Button } from '../controls/Button'

/**
 * The CTA renders as an anchor (via Button `asChild`). When `ctaHref` is an
 * internal path (starts with `/` or `#`) the link stays in the SPA and
 * navigates via the host's anchor handling. External URLs (Stripe Payment
 * Links, scheduling tools, etc.) open in a new tab with safe rel attributes.
 */
export const PricingCard = forwardRef(function PricingCard(
  {
    className,
    name,
    price,
    period,
    description,
    includes = [],
    ctaLabel,
    ctaHref,
    highlighted = false,
    badgeLabel = 'Most Popular',
    ...props
  },
  ref
) {
  const isInternal =
    typeof ctaHref === 'string' && (ctaHref.startsWith('/') || ctaHref.startsWith('#'))
  return (
    <div
      ref={ref}
      className={cn(
        // The card is its own container, so the price is set against the width
        // it actually has. A viewport-based clamp cannot tell a two-up grid
        // from a four-up one and sets the same figure in both, which is how a
        // long price came to run past the card that holds it.
        'flex flex-col rounded-df-lg p-6 transition-shadow duration-df-base ease-df-out [container-type:inline-size] sm:p-8',
        // The recommended tier is named by its edge, not by being scaled up.
        // A card drawn at 1.04 renders its own type off the pixel grid, which
        // is a strange price to pay for emphasis a hairline already carries.
        highlighted
          ? 'bg-df-surface-2 shadow-df-accent'
          : 'bg-df-surface shadow-df-sm hover:shadow-df-md',
        className
      )}
      {...props}
    >
      {/* The ribbon sits inside the card, above the tier name, rather than
          straddling the corner or sharing the name's line. A label hung over a
          rounded edge has to be clipped, and a wide chip beside the name takes
          the width the name needs in a three-up grid. */}
      <div className="flex flex-col items-start gap-4">
        {highlighted && (
          <Badge tone="accent" variant="solid" size="md">
            {badgeLabel}
          </Badge>
        )}
        <SplitHeading as="h3" size="card" text={name} className="text-df-text-muted" />
      </div>

      <div className="mt-6 flex items-end gap-2 border-b border-df-border pb-6">
        <span className="font-400 font-display text-[clamp(2.25rem,29cqi,5rem)] tabular-nums leading-[0.82] tracking-tight text-df-text">
          {price}
        </span>
        {period && <span className="shrink-0 pb-2 text-sm text-df-text-faint">{period}</span>}
      </div>

      {description && (
        <p className="mt-6 text-[15px] leading-relaxed text-df-text-muted">{description}</p>
      )}

      <ul className="mt-6 flex flex-1 flex-col gap-4">
        {includes.map(feature => (
          <li key={feature} className="flex items-start gap-3 text-sm text-df-text-muted">
            <span
              className={cn(
                'mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-df-full',
                highlighted
                  ? 'bg-df-accent text-df-on-accent'
                  : 'bg-df-accent-soft text-df-accent-bright'
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
        className="mt-6"
      >
        {isInternal ? (
          <a href={ctaHref}>{ctaLabel}</a>
        ) : (
          <a href={ctaHref} target="_blank" rel="noopener noreferrer">
            {ctaLabel}
          </a>
        )}
      </Button>
    </div>
  )
})

import { forwardRef } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { cn } from '../../lib/cn'
import { SplitHeading } from '../typography/SplitHeading'
import { Badge } from '../typography/Badge'
import { Button } from '../controls/Button'

/**
 * One program, priced. The figure is the largest thing on the card by a
 * distance, because the figure is what the visitor opened the card to read;
 * the name sits above it as a label and the inclusions run beside it as the
 * small print that justifies it.
 *
 * The recommended tier takes a red header band rather than a scaled-up box.
 * A card drawn at 1.04 renders its own type off the pixel grid, which is a
 * strange price to pay for emphasis a band of the brand colour carries
 * better — and the band gives the badge somewhere to be.
 *
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
        'group/card relative flex flex-col overflow-hidden rounded-df-xl transition-shadow duration-df-base ease-df-out [container-type:inline-size]',
        highlighted
          ? 'bg-df-surface-2 bg-df-surface-gradient-elevated shadow-df-accent'
          : 'bg-df-surface bg-df-surface-gradient shadow-df-md hover:shadow-df-lg',
        className
      )}
      {...props}
    >
      {/* The band. It is the red as a surface rather than as an edge, and it
          is what says "this one" from across the room. The unrecommended
          cards keep the same strip in a hairline, so the four cards share a
          silhouette and the eye compares them rather than sorting them. */}
      <div
        className={cn(
          'flex items-center justify-between gap-3 px-6 py-3 sm:px-8',
          highlighted
            ? 'bg-df-accent bg-df-accent-gradient text-df-on-accent'
            : 'border-b border-df-border text-df-text-faint'
        )}
      >
        <span className="text-[11px] font-700 uppercase tracking-[0.18em]">
          {highlighted ? badgeLabel : name}
        </span>
        {highlighted ? (
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-df-full bg-df-on-accent opacity-80"
          />
        ) : (
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-df-full bg-df-accent" />
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        {/* Past twenty-five rems of its own content width the card turns: the
            tier and its figure take a column on the left and the inclusions run
            beside them, so a two-across grid at desktop width sets the price
            large and keeps the list to a few lines rather than stacking both
            down a tall narrow column with the right half of the card empty. */}
        <div className="flex flex-1 flex-col [@container(min-width:25rem)]:grid [@container(min-width:25rem)]:grid-cols-[minmax(0,14rem)_1fr] [@container(min-width:25rem)]:gap-x-8">
          <div className="flex flex-col [@container(min-width:25rem)]:border-r [@container(min-width:25rem)]:border-df-border [@container(min-width:25rem)]:pr-8">
            <div className="flex flex-col items-start gap-3">
              {highlighted && (
                <Badge tone="accent" variant="soft" size="md">
                  {name}
                </Badge>
              )}
              {!highlighted && (
                <SplitHeading as="h3" size="card" text={name} className="text-df-text" />
              )}
            </div>

            <div className="mt-5 flex items-end gap-2">
              <span
                className={cn(
                  'font-400 font-display text-[clamp(3rem,32cqi,5.5rem)] tabular-nums leading-[0.8] tracking-[-0.03em] [@container(min-width:25rem)]:text-[4.75rem]',
                  highlighted ? 'text-df-text' : 'text-df-text'
                )}
              >
                {price}
              </span>
              {period && (
                <span className="shrink-0 pb-1.5 text-[13px] font-600 uppercase tracking-[0.1em] text-df-text-faint">
                  {period}
                </span>
              )}
            </div>

            {description && (
              <p className="mt-5 text-[15px] leading-relaxed text-df-text-muted">{description}</p>
            )}
          </div>

          <ul className="mt-6 flex flex-1 flex-col gap-3 border-t border-df-border pt-6 [@container(min-width:25rem)]:mt-0 [@container(min-width:25rem)]:border-t-0 [@container(min-width:25rem)]:pt-0">
            {includes.map(feature => (
              <li
                key={feature}
                className="flex items-start gap-3 text-[14px] leading-snug text-df-text-muted"
              >
                <span
                  className={cn(
                    'mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-df-full',
                    highlighted
                      ? 'bg-df-accent bg-df-accent-gradient text-df-on-accent'
                      : 'bg-df-accent-soft text-df-accent-bright'
                  )}
                >
                  <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button
          asChild
          variant={highlighted ? 'primary' : 'secondary'}
          size="lg"
          block
          className="mt-7"
        >
          {isInternal ? (
            <a href={ctaHref}>
              {ctaLabel}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-df-base ease-df-out group-hover/card:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          ) : (
            <a href={ctaHref} target="_blank" rel="noopener noreferrer">
              {ctaLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          )}
        </Button>
      </div>
    </div>
  )
})

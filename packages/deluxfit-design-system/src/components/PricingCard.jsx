import { forwardRef } from 'react'
import { Check } from 'lucide-react'
import { cn } from '../lib/cn'
import { Badge } from './Badge'
import { Button } from './Button'

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
        'relative flex flex-col rounded-df-xl border p-6 transition-transform duration-300 ease-df-out sm:p-9',
        highlighted
          ? 'border-df-accent bg-df-surface-2 shadow-df-glow lg:scale-[1.04]'
          : 'border-df-border bg-df-surface hover:border-df-border-strong',
        className
      )}
      {...props}
    >
      {highlighted && (
        <div className="absolute -top-3 left-6 sm:left-9">
          <Badge tone="accent" variant="solid" size="md" className="shadow-df-glow-soft">
            {badgeLabel}
          </Badge>
        </div>
      )}

      <h3 className="font-400 font-display text-xl uppercase tracking-[0.04em] text-df-text-muted">
        {name}
      </h3>

      <div className="mt-5 flex items-end gap-2 border-b border-df-border pb-6 sm:mt-6 sm:pb-7">
        <span className="font-400 font-display text-[clamp(3rem,12vw,5.5rem)] tabular-nums leading-[0.82] tracking-tight text-df-text">
          {price}
        </span>
        {period && <span className="pb-2 text-sm text-df-text-faint">{period}</span>}
      </div>

      {description && (
        <p className="mt-5 text-[15px] leading-relaxed text-df-text-muted">{description}</p>
      )}

      <ul className="mt-7 flex flex-1 flex-col gap-4">
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
        className="mt-9"
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

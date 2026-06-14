import { PricingCard, Reveal, Section } from '@deluxfit/ds'
import { pricing } from '@/content/site'

/**
 * Pricing — three coaching tiers with the middle "Most Popular" tier
 * highlighted. Each PricingCard CTA opens its Stripe Payment Link in a new tab.
 * Anchored at #pricing for the header/hero CTAs.
 */
export default function Pricing() {
  return (
    <Section
      id="pricing"
      eyebrow={pricing.eyebrow}
      heading={pricing.heading}
      subhead={pricing.subhead}
    >
      <div className="grid items-start gap-6 lg:grid-cols-3">
        {pricing.tiers.map((tier, index) => (
          <Reveal key={tier.id} delay={index * 0.08}>
            <PricingCard
              name={tier.name}
              price={tier.price}
              period={tier.period}
              description={tier.description}
              features={tier.features}
              ctaLabel={tier.ctaLabel}
              ctaHref={tier.ctaHref}
              highlighted={tier.highlighted}
              badgeLabel={tier.badgeLabel}
            />
          </Reveal>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-df-text-faint">{pricing.note}</p>
    </Section>
  )
}

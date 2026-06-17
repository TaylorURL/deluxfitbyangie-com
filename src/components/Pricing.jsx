import { PricingCard, Reveal, Section } from '@deluxfit/ds'
import { useContent } from '@/i18n'

/**
 * Pricing — three coaching tiers led by hero-scale price numerals, with the
 * middle "Most Popular" Transform tier carrying the crimson glow. Each
 * PricingCard CTA opens its Stripe Payment Link. Anchored at #pricing.
 */
export default function Pricing() {
  const { pricing } = useContent()
  return (
    <Section
      id="pricing"
      index="05"
      eyebrow={pricing.eyebrow}
      heading={pricing.heading}
      accent={pricing.accent}
      subhead={pricing.subhead}
    >
      <div className="grid items-stretch gap-6 lg:grid-cols-3">
        {pricing.tiers.map((tier, index) => (
          <Reveal key={tier.id} delay={index * 0.08} className="flex">
            <PricingCard
              className="w-full"
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

      <p className="mt-10 text-sm text-df-text-faint">{pricing.note}</p>
    </Section>
  )
}

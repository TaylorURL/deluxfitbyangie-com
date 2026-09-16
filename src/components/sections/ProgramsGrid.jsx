import { PricingCard, Reveal, Section } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import AnimatedBackdrop from '@/components/effects/AnimatedBackdrop'

export default function ProgramsGrid({ id = 'programs', highlightServiceId }) {
  const { programs, services } = useContent()
  const ordered = [
    services.membership,
    services.coaching,
    services.singleSession,
    services.liveProgram,
  ]
  const highlightId = highlightServiceId ?? 'coaching'

  return (
    <Section
      id={id}
      tone="dark"
      className="border-t border-df-border"
      heading={programs.heading}
      accent={programs.accent}
      subhead={programs.subhead}
    >
      <AnimatedBackdrop variant="particles" opacity={0.5} />

      {/* Two by two rather than four across. At four across inside the reading
          width each card is under three hundred pixels, which sets the price
          small and wraps every inclusion; at two across the card is wide enough
          to lay the figure beside the list, and four programs still fit one
          screen. */}
      <div className="grid items-stretch gap-5 sm:gap-6 lg:grid-cols-2">
        {ordered.map((service, index) => (
          <Reveal key={service.id} delay={index * 0.06} className="flex">
            <PricingCardLink
              className="w-full"
              service={service}
              highlighted={service.id === highlightId}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

/**
 * Feeds a service entry into PricingCard. The bullet list is `includes` on
 * most services and `perfectFor` on the single session, which describes what
 * the session suits rather than what it contains.
 */
function PricingCardLink({ service, highlighted, className }) {
  return (
    <PricingCard
      className={className}
      name={service.name}
      price={service.price}
      period={service.period}
      description={service.summary}
      includes={service.includes ?? service.perfectFor ?? []}
      ctaLabel={service.cardCta}
      ctaHref={service.href}
      highlighted={highlighted}
      badgeLabel={service.badgeLabel}
    />
  )
}

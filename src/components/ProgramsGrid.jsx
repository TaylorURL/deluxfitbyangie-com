import { Badge, PricingCard, Reveal, Section } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import AnimatedBackdrop from '@/components/AnimatedBackdrop'
import { SpotlightCard } from '@/components/reactbits'

export default function ProgramsGrid({ id = 'programs', highlightServiceId }) {
  const { programs, services, inPerson } = useContent()
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
      eyebrow={programs.eyebrow}
      heading={programs.heading}
      accent={programs.accent}
      subhead={programs.subhead}
    >
            <AnimatedBackdrop variant="particles" opacity={0.5} />

      <div className="grid items-stretch gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
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

      <Reveal delay={0.3} className="mt-8 sm:mt-10">
        <SpotlightCard
          spotlightColor="rgba(225,29,42,0.18)"
          className="flex flex-col gap-4 !rounded-df-xl !border-df-border !bg-df-surface !p-5 sm:flex-row sm:items-center sm:justify-between sm:!p-6"
        >
          <div className="flex flex-col gap-1.5">
            <span className="inline-flex w-fit items-center gap-2">
              <Badge tone="neutral" variant="outline" size="sm">
                {inPerson.eyebrow}
              </Badge>
              <span className="text-[11px] font-700 uppercase tracking-[0.2em] text-df-text-faint">
                {services.inPerson.status}
              </span>
            </span>
            <p className="font-display text-2xl font-400 uppercase tracking-[0.01em] text-df-text">
              {inPerson.title}
            </p>
            <p className="text-sm leading-relaxed text-df-text-muted">{inPerson.summary}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-400 leading-none tabular-nums text-df-text">
              {inPerson.price}
            </p>
            <p className="mt-2 text-[11px] font-700 uppercase tracking-[0.22em] text-df-text-faint">
              {inPerson.eyebrow}
            </p>
          </div>
        </SpotlightCard>
      </Reveal>
    </Section>
  )
}

const BADGE_LABEL = {
  coaching: 'Most Personalized',
  'single-session': 'Try It First',
  'live-program': 'Closest to In-Person',
}

/**
 * PricingCardLink — wraps PricingCard so the CTA navigates with the SPA's
 * global anchor interception (internal paths) instead of opening a new tab.
 * Feature lists come from `includes` (membership/coaching/program) or
 * `perfectFor` (single session).
 */
function PricingCardLink({ service, highlighted, className }) {
  return (
    <PricingCard
      className={className}
      name={service.name}
      price={service.price}
      period={service.period}
      description={service.summary}
      features={service.includes ?? service.perfectFor ?? []}
      ctaLabel={service.cardCta}
      ctaHref={service.href}
      highlighted={highlighted}
      badgeLabel={BADGE_LABEL[service.id] ?? 'Most Popular'}
    />
  )
}

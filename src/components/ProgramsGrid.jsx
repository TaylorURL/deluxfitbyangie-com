import { Badge, PricingCard, Reveal, Section } from '@deluxfit/ds'
import { Link } from '@/router'
import { useContent } from '@/i18n'

/**
 * ProgramsGrid — the three live services + the in-person "coming soon" teaser.
 * On the Home page this is the central comparison band; on individual service
 * pages it acts as the "compare programs" footer. Pricing strings come from
 * `services` in the i18n content tree and follow the client spec verbatim.
 */
export default function ProgramsGrid({ id = 'programs', highlightServiceId }) {
  const { programs, services, inPerson } = useContent()
  const ordered = [services.membership, services.coaching, services.oneOnOne]

  return (
    <Section
      id={id}
      eyebrow={programs.eyebrow}
      heading={programs.heading}
      accent={programs.accent}
      subhead={programs.subhead}
    >
      <div className="grid items-stretch gap-6 lg:grid-cols-3">
        {ordered.map((service, index) => (
          <Reveal key={service.id} delay={index * 0.08} className="flex">
            <PricingCardLink className="w-full" service={service} highlighted={service.id === (highlightServiceId ?? 'coaching')} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.3} className="mt-10">
        <div className="flex flex-col gap-4 rounded-df-xl border border-df-border bg-df-surface px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <span className="inline-flex w-fit items-center gap-2">
              <Badge tone="neutral" variant="outline" size="sm">
                {inPerson.eyebrow}
              </Badge>
              <span className="text-[11px] font-700 uppercase tracking-[0.2em] text-df-text-faint">
                {inPerson.sessionLength}
              </span>
            </span>
            <p className="font-display text-2xl font-400 uppercase tracking-[0.01em] text-df-text">
              {inPerson.title}
            </p>
            <p className="text-sm leading-relaxed text-df-text-muted">{inPerson.summary}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="font-display text-[clamp(2.25rem,4vw,3rem)] font-400 leading-none tabular-nums text-df-text">
              {inPerson.price}
            </p>
            <p className="mt-2 text-[11px] font-700 uppercase tracking-[0.22em] text-df-text-faint">
              {inPerson.eyebrow}
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}

/**
 * PricingCardLink — wraps PricingCard so the CTA navigates with the SPA Link
 * (path-based routes) instead of opening in a new tab. The DS PricingCard
 * defaults to a Stripe checkout link; here the destination is always an
 * internal page, so we render our own CTA via Link inside a styled card.
 */
function PricingCardLink({ service, highlighted, className }) {
  return (
    <PricingCard
      className={className}
      name={service.name}
      price={service.price}
      period={service.period}
      description={service.summary}
      features={service.includes}
      ctaLabel={service.cardCta}
      ctaHref={service.href}
      highlighted={highlighted}
      badgeLabel={service.id === 'coaching' ? 'Most Personalized' : undefined}
    />
  )
}

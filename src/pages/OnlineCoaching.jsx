import { ArrowRight, Check } from 'lucide-react'
import {
  Badge,
  Button,
  Container,
  Reveal,
  Section,
  SectionEyebrow,
  SectionIndex,
  SplitHeading,
} from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { Link } from '@/router'
import PageHero from '@/components/PageHero'
import PhotoBand from '@/components/PhotoBand'
import IncludesGrid from '@/components/IncludesGrid'
import ProgramsGrid from '@/components/ProgramsGrid'
import OnlineCoachingApplicationForm from '@/components/forms/OnlineCoachingApplicationForm'

/**
 * OnlineCoaching — the $150/month personalized online coaching page. Hero +
 * includes grid + client responsibilities + best-for + the application form.
 */
export default function OnlineCoaching() {
  const { coaching, services } = useContent()
  const service = services.coaching

  return (
    <>
      <PageHero
        eyebrow={coaching.hero.eyebrow}
        heading={coaching.hero.heading}
        accent={coaching.hero.accent}
        subhead={coaching.hero.subhead}
        primary={{
          label: coaching.hero.primaryCta,
          href: coaching.hero.primaryCtaHref,
        }}
        secondary={{
          label: coaching.hero.secondaryCta,
          href: coaching.hero.secondaryCtaHref,
        }}
        aside={<ServicePriceTile service={service} />}
      />

      <IncludesGrid
        eyebrow={coaching.includesEyebrow}
        heading={coaching.includesHeading}
        accent={coaching.includesAccent}
        items={coaching.includes}
      />

      <Section
        eyebrow={coaching.communication.eyebrow}
        heading={coaching.communication.heading}
        accent={coaching.communication.accent}
        index="02"
        containerSize="md"
      >
        <Reveal>
          <p className="text-base leading-relaxed text-df-text-muted sm:text-lg">
            {coaching.communication.body}
          </p>
        </Reveal>
        <ul className="mt-8 flex flex-col">
          {coaching.communication.points.map((item, index) => (
            <Reveal key={item} delay={index * 0.05} as="li">
              <div className="flex items-baseline gap-5 border-t border-df-border py-5">
                <span
                  aria-hidden="true"
                  className="font-display text-2xl font-400 leading-none tabular-nums text-df-accent-bright"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-[15px] leading-relaxed text-df-text sm:text-base">{item}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section
        eyebrow={coaching.bestFor.eyebrow}
        heading={coaching.bestFor.heading}
        accent={coaching.bestFor.accent}
        index="03"
        containerSize="md"
      >
        <Reveal>
          <p className="text-base leading-relaxed text-df-text-muted sm:text-lg">
            {coaching.bestFor.body}
          </p>
        </Reveal>
      </Section>

      <section
        id={coaching.applicationSection.id}
        className="relative overflow-hidden border-y border-df-border bg-df-bg-elevated py-20 sm:py-28"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_-10%,rgba(225,29,42,0.22),transparent_70%)]"
        />
        <Container size="md">
          <Reveal className="flex flex-col items-start">
            <div className="flex items-center gap-4">
              <SectionIndex>04</SectionIndex>
              <SectionEyebrow>{coaching.applicationSection.eyebrow}</SectionEyebrow>
            </div>
            <SplitHeading
              text={coaching.applicationSection.heading}
              accent={coaching.applicationSection.accent}
              className="mt-6 text-[clamp(2rem,5vw,3.5rem)] leading-[0.95]"
            />
            <p className="mt-6 max-w-xl text-base leading-relaxed text-df-text-muted sm:text-lg">
              {coaching.applicationSection.body}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-10">
            <OnlineCoachingApplicationForm />
          </Reveal>
        </Container>
      </section>

      <ProgramsGrid id="programs" highlightServiceId="coaching" />
    </>
  )
}

function ServicePriceTile({ service }) {
  return (
    <div className="relative overflow-hidden rounded-df-2xl border border-df-accent bg-df-surface/85 p-8 shadow-df-glow-soft backdrop-blur-xl">
      <Badge tone="accent" variant="solid" size="md" className="w-fit">
        {service.eyebrow}
      </Badge>
      <p className="mt-5 font-display text-xl font-400 uppercase tracking-[0.02em] text-df-text-muted">
        {service.name}
      </p>
      <div className="mt-4 flex items-end gap-2 border-b border-df-border pb-6">
        <span className="font-display text-[clamp(3rem,8vw,4.5rem)] font-400 leading-[0.82] tabular-nums text-df-text">
          {service.price}
        </span>
        <span className="pb-2 text-sm text-df-text-faint">{service.period}</span>
      </div>
      <ul className="mt-6 flex flex-col gap-3">
        {service.includes.slice(0, 6).map(feature => (
          <li key={feature} className="flex items-start gap-3 text-sm text-df-text-muted">
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-df-full bg-df-accent text-df-on-accent"
              aria-hidden="true"
            >
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button asChild size="lg" block className="mt-7">
        <Link href={service.ctaHref}>
          {service.ctaLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
    </div>
  )
}

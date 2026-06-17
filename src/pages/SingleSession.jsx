import { ArrowRight, Check } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
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
import ProgramsGrid from '@/components/ProgramsGrid'
import BookingCalendar from '@/components/BookingCalendar'

/**
 * SingleSession — Service 03: the one-time $75 Single Live Training Session.
 * Hero + "perfect for" grid + session details + the live booking calendar.
 */
export default function SingleSession() {
  const { session, services } = useContent()
  const service = services.singleSession

  return (
    <>
      <PageHero
        eyebrow={session.hero.eyebrow}
        heading={session.hero.heading}
        accent={session.hero.accent}
        subhead={session.hero.subhead}
        primary={{ label: session.hero.primaryCta, href: session.hero.primaryCtaHref }}
        secondary={{ label: session.hero.secondaryCta, href: session.hero.secondaryCtaHref }}
        aside={<ServicePriceTile service={service} />}
      />

      <Section
        eyebrow={session.perfectForEyebrow}
        heading={session.perfectForHeading}
        accent={session.perfectForAccent}
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {session.perfectFor.map(({ icon: Icon, title }, index) => (
            <Reveal key={title} delay={index * 0.05}>
              <Card variant="surface" className="flex h-full items-start gap-4">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-df-lg bg-df-accent-soft text-df-accent-bright"
                  aria-hidden="true"
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </span>
                <p className="pt-1.5 text-[15px] font-600 leading-snug text-df-text">{title}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <section
        id={session.bookSection.id}
        className="relative overflow-hidden border-y border-df-border bg-df-bg-elevated py-20 sm:py-28"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_-10%,rgba(225,29,42,0.22),transparent_70%)]"
        />
        <Container size="md">
          <Reveal className="flex flex-col items-start">
            <div className="flex items-center gap-4">
              <SectionIndex>02</SectionIndex>
              <SectionEyebrow>{session.bookSection.eyebrow}</SectionEyebrow>
            </div>
            <SplitHeading
              text={session.bookSection.heading}
              accent={session.bookSection.accent}
              className="mt-6 text-[clamp(2rem,5vw,3.5rem)] leading-[0.95]"
            />
            <p className="mt-6 max-w-xl text-base leading-relaxed text-df-text-muted sm:text-lg">
              {session.bookSection.body}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-10">
            <BookingCalendar service="single_session" />
          </Reveal>
        </Container>
      </section>

      <ProgramsGrid id="programs" highlightServiceId="single-session" />
    </>
  )
}

function ServicePriceTile({ service }) {
  return (
    <div className="relative overflow-hidden rounded-df-2xl border border-df-border bg-df-surface/85 p-8 shadow-df-xl backdrop-blur-xl">
      <Badge tone="accent" variant="soft" size="md" className="w-fit">
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
      <p className="mt-4 text-[11px] font-700 uppercase tracking-[0.22em] text-df-text-faint">
        {service.sessionLength}
      </p>
      <ul className="mt-6 flex flex-col gap-3">
        {service.perfectFor.map(feature => (
          <li key={feature} className="flex items-start gap-3 text-sm text-df-text-muted">
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-df-full bg-df-accent-soft text-df-accent-bright"
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

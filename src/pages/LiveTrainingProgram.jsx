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
  StatBlock,
} from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { Link } from '@/router'
import PageHero from '@/components/PageHero'
import PhotoBand from '@/components/PhotoBand'
import IncludesGrid from '@/components/IncludesGrid'
import ProgramsGrid from '@/components/ProgramsGrid'
import BookingCalendar from '@/components/BookingCalendar'

/**
 * LiveTrainingProgram — Service 04: the ongoing $50/session Live Online
 * Personal Training Program over Zoom. Hero + includes grid + frequency
 * recommendation + the live booking calendar.
 */
export default function LiveTrainingProgram() {
  const { training, services } = useContent()
  const service = services.liveProgram

  return (
    <>
      <PageHero
        eyebrow={training.hero.eyebrow}
        heading={training.hero.heading}
        accent={training.hero.accent}
        subhead={training.hero.subhead}
        primary={{ label: training.hero.primaryCta, href: training.hero.primaryCtaHref }}
        secondary={{ label: training.hero.secondaryCta, href: training.hero.secondaryCtaHref }}
        aside={<ServicePriceTile service={service} />}
      />

      <PhotoBand
        src="/brand/gym-battle-ropes.jpg"
        alt="Angie throwing battle ropes during a live training session"
        objectPosition="object-[50%_30%]"
        height="tall"
      />

      <IncludesGrid
        eyebrow={training.includesEyebrow}
        heading={training.includesHeading}
        accent={training.includesAccent}
        items={training.includes}
      />

      <Section
        eyebrow={training.recommendation.eyebrow}
        heading={training.recommendation.heading}
        accent={training.recommendation.accent}
        index="02"
        containerSize="md"
      >
        <Reveal>
          <div className="grid grid-cols-2 gap-x-10 gap-y-10 border-t border-df-border pt-10 lg:grid-cols-3">
            <StatBlock value={service.price} label="per session" size="giant" align="left" accent />
            <StatBlock value="3" label="sessions / week recommended" size="giant" align="left" />
            <StatBlock value="$150" label="per week at 3 sessions" size="giant" align="left" accent />
          </div>
          <p className="mt-10 max-w-2xl text-base leading-relaxed text-df-text-muted sm:text-lg">
            {training.recommendation.body}
          </p>
        </Reveal>
      </Section>

      <section
        id={training.bookSection.id}
        className="relative overflow-hidden border-y border-df-border bg-df-bg-elevated py-20 sm:py-28"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_-10%,rgba(225,29,42,0.22),transparent_70%)]"
        />
        <Container size="md">
          <Reveal className="flex flex-col items-start">
            <div className="flex items-center gap-4">
              <SectionIndex>03</SectionIndex>
              <SectionEyebrow>{training.bookSection.eyebrow}</SectionEyebrow>
            </div>
            <SplitHeading
              text={training.bookSection.heading}
              accent={training.bookSection.accent}
              className="mt-6 text-[clamp(2rem,5vw,3.5rem)] leading-[0.95]"
            />
            <p className="mt-6 max-w-xl text-base leading-relaxed text-df-text-muted sm:text-lg">
              {training.bookSection.body}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-10">
            <BookingCalendar service="live_program" />
          </Reveal>
        </Container>
      </section>

      <ProgramsGrid id="programs" highlightServiceId="live-program" />
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
        {service.recommendation}
      </p>
      <ul className="mt-6 flex flex-col gap-3">
        {service.includes.map(feature => (
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

import { Container, Reveal, Section, SplitHeading, StatBlock } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import PageHero from '@/components/PageHero'
import ServicePriceTile from '@/components/ServicePriceTile'
import PhotoBand from '@/components/PhotoBand'
import IncludesGrid from '@/components/IncludesGrid'
import ProgramsGrid from '@/components/ProgramsGrid'
import BookingCalendar from '@/components/BookingCalendar'
import ArtPlate from '@/components/ArtPlate'

/**
 * The weekly figure is multiplied out of the session price rather than written
 * beside it. The two were separate strings before, so moving the price left
 * the week's total behind, still quoting the old one.
 */
const weeklyTotal = (price, sessions) => {
  const [, symbol = '', amount] = String(price).match(/^(\D*)([\d.,]+)/) ?? []
  if (!amount) return null
  return `${symbol}${Number(amount.replace(/,/g, '')) * sessions}`
}

export default function LiveTrainingProgram() {
  const { training, services } = useContent()
  const service = services.liveProgram
  const { sessionsPerWeek } = training.recommendation
  const weekly = weeklyTotal(service.price, sessionsPerWeek)

  return (
    <>
      <PageHero
        eyebrow={training.hero.eyebrow}
        heading={training.hero.heading}
        accent={training.hero.accent}
        subhead={training.hero.subhead}
        primary={{ label: training.hero.primaryCta, href: training.hero.primaryCtaHref }}
        secondary={{ label: training.hero.secondaryCta, href: training.hero.secondaryCtaHref }}
        aside={
          <ServicePriceTile
            includes={service.includes}
            note={service.recommendation}
            service={service}
          />
        }
      />

      <PhotoBand
        src="/brand/gym-battle-ropes.webp"
        alt="Angie throwing battle ropes during a live training session"
        objectPosition="object-[50%_30%]"
        height="tall"
      />

      <IncludesGrid
        heading={training.includesHeading}
        accent={training.includesAccent}
        items={training.includes}
      />

      <Section
        heading={training.recommendation.heading}
        accent={training.recommendation.accent}
        containerSize="md"
      >
        <Reveal>
          <div className="grid grid-cols-1 gap-y-8 border-t border-df-border pt-8 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-10 sm:pt-10 lg:grid-cols-3">
            <StatBlock
              value={service.price}
              label={training.recommendation.perSessionLabel}
              size="giant"
              align="left"
              accent
            />
            <StatBlock
              value={sessionsPerWeek}
              label={training.recommendation.sessionsLabel}
              size="giant"
              align="left"
            />
            {weekly && (
              <StatBlock
                value={weekly}
                label={training.recommendation.weeklyLabel}
                size="giant"
                align="left"
                accent
              />
            )}
          </div>
          <div className="mt-8 grid items-center gap-8 sm:grid-cols-[1.2fr_1fr] sm:gap-10">
            <p className="text-base leading-relaxed text-df-text-muted sm:text-lg">
              {training.recommendation.body}
            </p>
            <ArtPlate
              src="/art/training-week.svg"
              alt="A training week: four training days and three rest days"
            />
          </div>
        </Reveal>
      </Section>

      <section
        id={training.bookSection.id}
        className="relative overflow-hidden border-y border-df-border bg-df-bg-elevated py-16 sm:py-28"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_-10%,var(--df-accent-wash-strong),transparent_70%)]"
        />
        <Container size="md">
          <Reveal className="flex flex-col items-start">
            <SplitHeading
              text={training.bookSection.heading}
              accent={training.bookSection.accent}
              className="mt-5 sm:mt-6"
            />
            <p className="mt-5 max-w-xl text-base leading-relaxed text-df-text-muted sm:mt-6 sm:text-lg">
              {training.bookSection.body}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8">
            <BookingCalendar service="live_program" />
          </Reveal>
        </Container>
      </section>

      <ProgramsGrid id="programs" highlightServiceId="live-program" />
    </>
  )
}

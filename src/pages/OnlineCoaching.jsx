import { Container, Reveal, Section, SplitHeading } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import PageHero from '@/components/sections/PageHero'
import ServicePriceTile from '@/components/sections/ServicePriceTile'
import PhotoBand from '@/components/media/PhotoBand'
import ArtPlate from '@/components/media/ArtPlate'
import IncludesGrid from '@/components/sections/IncludesGrid'
import ProgramsGrid from '@/components/sections/ProgramsGrid'
import OnlineCoachingApplicationForm from '@/components/forms/OnlineCoachingApplicationForm'

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
        aside={
          <ServicePriceTile includes={service.includes.slice(0, 6)} recommended service={service} />
        }
      />

      <PhotoBand
        src="/brand/gym-squat-rack-portrait.webp"
        alt="Angie at the squat rack in her training space"
        objectPosition="object-[55%_30%]"
      />

      <IncludesGrid
        heading={coaching.includesHeading}
        accent={coaching.includesAccent}
        items={coaching.includes}
      >
        <ArtPlate
          src="/art/training-week.svg"
          alt="A training week: four training days and three rest days"
        />
        <ArtPlate
          src="/art/progression-block.svg"
          alt="A twelve-week block: load rising in three waves, each starting above the last"
        />
      </IncludesGrid>

      <Section
        heading={coaching.communication.heading}
        accent={coaching.communication.accent}
        layout="split"
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
                  className="font-400 font-display text-2xl tabular-nums leading-none text-df-accent-bright"
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
        heading={coaching.bestFor.heading}
        accent={coaching.bestFor.accent}
        layout="split"
        space="md"
        className="border-t border-df-border"
      >
        <Reveal>
          <p className="max-w-[62ch] text-base leading-relaxed text-df-text-muted sm:text-lg">
            {coaching.bestFor.body}
          </p>
        </Reveal>
      </Section>

      <section
        id={coaching.applicationSection.id}
        className="relative overflow-hidden border-y border-df-border bg-df-bg-elevated py-16 sm:py-28"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_-10%,var(--df-accent-wash-strong),transparent_70%)]"
        />
        <Container size="md">
          <Reveal className="flex flex-col items-start">
            <SplitHeading
              text={coaching.applicationSection.heading}
              accent={coaching.applicationSection.accent}
              className="mt-5 sm:mt-6"
            />
            <p className="mt-5 max-w-xl text-base leading-relaxed text-df-text-muted sm:mt-6 sm:text-lg">
              {coaching.applicationSection.body}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8">
            <OnlineCoachingApplicationForm />
          </Reveal>
        </Container>
      </section>

      <ProgramsGrid id="programs" highlightServiceId="coaching" />
    </>
  )
}

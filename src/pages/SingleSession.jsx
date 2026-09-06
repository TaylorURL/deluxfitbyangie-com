import { Container, Reveal, Section, SplitHeading } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import PageHero from '@/components/PageHero'
import ServicePriceTile from '@/components/ServicePriceTile'
import PhotoBand from '@/components/PhotoBand'
import ProgramsGrid from '@/components/ProgramsGrid'
import BookingCalendar from '@/components/BookingCalendar'
import { SpotlightCard } from '@/components/reactbits'

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
        aside={
          <ServicePriceTile
            includes={service.perfectFor}
            note={service.sessionLength}
            service={service}
          />
        }
      />

      <PhotoBand
        src="/brand/studio-dumbbell-side-pose.webp"
        alt="Angie set up at a single-session studio drill with a dumbbell"
        objectPosition="object-[55%_25%]"
      />

      <Section heading={session.perfectForHeading} accent={session.perfectForAccent}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {session.perfectFor.map(({ icon: Icon, title }, index) => (
            <Reveal key={title} delay={index * 0.05} className="flex">
              <SpotlightCard
                spotlightColor="var(--df-accent-wash-soft)"
                className="flex h-full w-full items-start gap-4"
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-df-lg bg-df-accent-soft text-df-accent-bright"
                  aria-hidden="true"
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </span>
                <p className="pt-2 text-[15px] font-600 leading-snug text-df-text">{title}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </Section>

      <section
        id={session.bookSection.id}
        className="relative overflow-hidden border-y border-df-border bg-df-bg-elevated py-16 sm:py-28"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_-10%,var(--df-accent-wash-strong),transparent_70%)]"
        />
        <Container size="md">
          <Reveal className="flex flex-col items-start">
            <SplitHeading
              text={session.bookSection.heading}
              accent={session.bookSection.accent}
              className="mt-5 sm:mt-6"
            />
            <p className="mt-5 max-w-xl text-base leading-relaxed text-df-text-muted sm:mt-6 sm:text-lg">
              {session.bookSection.body}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8">
            <BookingCalendar service="single_session" />
          </Reveal>
        </Container>
      </section>

      <ProgramsGrid id="programs" highlightServiceId="single-session" />
    </>
  )
}

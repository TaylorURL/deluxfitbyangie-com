import { Info } from 'lucide-react'
import { Container, Reveal, Section, SplitHeading } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import PageHero from '@/components/sections/PageHero'
import ServicePriceTile from '@/components/sections/ServicePriceTile'
import PhotoBand from '@/components/media/PhotoBand'
import IncludesGrid from '@/components/sections/IncludesGrid'
import ProgramsGrid from '@/components/sections/ProgramsGrid'
import MembershipSignupForm from '@/components/forms/MembershipSignupForm'

export default function Membership() {
  const { membership, services } = useContent()
  const service = services.membership

  return (
    <>
      <PageHero
        eyebrow={membership.hero.eyebrow}
        heading={membership.hero.heading}
        accent={membership.hero.accent}
        subhead={membership.hero.subhead}
        primary={{
          label: membership.hero.primaryCta,
          href: membership.hero.primaryCtaHref,
        }}
        secondary={{
          label: membership.hero.secondaryCta,
          href: membership.hero.secondaryCtaHref,
        }}
        aside={<ServicePriceTile includes={service.includes.slice(0, 5)} service={service} />}
      />

      <PhotoBand
        src="/brand/studio-step-up-dumbbell.webp"
        alt="Angie mid step-up with a dumbbell in the studio"
        objectPosition="object-[45%_25%]"
      />

      <IncludesGrid
        heading={membership.includesHeading}
        accent={membership.includesAccent}
        items={membership.includes}
      />

      <Container size="md">
        <Reveal>
          <div className="flex items-start gap-3 rounded-df-md border border-df-border-strong bg-df-surface-2 px-5 py-4">
            <Info className="mt-1 h-5 w-5 shrink-0 text-df-accent-bright" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-df-text-muted">
              {membership.notPersonalizedCallout}
            </p>
          </div>
        </Reveal>
      </Container>

      <Section
        heading={membership.bestFor.heading}
        accent={membership.bestFor.accent}
        layout="split"
      >
        <Reveal>
          <p className="max-w-[62ch] text-base leading-relaxed text-df-text-muted sm:text-lg">
            {membership.bestFor.body}
          </p>
        </Reveal>
      </Section>

      <section
        id={membership.signupSection.id}
        className="relative overflow-hidden border-y border-df-border bg-df-bg-elevated py-16 sm:py-28"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_-10%,var(--df-accent-wash-strong),transparent_70%)]"
        />
        <Container size="md">
          <Reveal className="flex flex-col items-start">
            <SplitHeading
              text={membership.signupSection.heading}
              accent={membership.signupSection.accent}
              className="mt-5 sm:mt-6"
            />
            <p className="mt-5 max-w-xl text-base leading-relaxed text-df-text-muted sm:mt-6 sm:text-lg">
              {membership.signupSection.body}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8">
            <MembershipSignupForm />
          </Reveal>
        </Container>
      </section>

      <ProgramsGrid id="programs" highlightServiceId="membership" />
    </>
  )
}

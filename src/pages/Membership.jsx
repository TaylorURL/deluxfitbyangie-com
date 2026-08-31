import { ArrowRight, Check, Info } from 'lucide-react'
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
import MembershipSignupForm from '@/components/forms/MembershipSignupForm'
import AnimatedPrice from '@/components/AnimatedPrice'
import { SpotlightCard } from '@/components/reactbits'

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
        aside={<ServicePriceTile service={service} />}
      />

      <PhotoBand
        src="/brand/studio-step-up-dumbbell.webp"
        alt="Angie mid step-up with a dumbbell in the studio"
        objectPosition="object-[45%_25%]"
      />

      <IncludesGrid
        eyebrow={membership.includesEyebrow}
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
        eyebrow={membership.bestFor.eyebrow}
        heading={membership.bestFor.heading}
        accent={membership.bestFor.accent}
        index="02"
        containerSize="md"
      >
        <Reveal>
          <p className="text-base leading-relaxed text-df-text-muted sm:text-lg">
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
            <div className="flex items-center gap-3 sm:gap-4">
              <SectionIndex>03</SectionIndex>
              <SectionEyebrow>{membership.signupSection.eyebrow}</SectionEyebrow>
            </div>
            <SplitHeading
              text={membership.signupSection.heading}
              accent={membership.signupSection.accent}
              className="mt-5 text-[clamp(2rem,8vw,3.5rem)] leading-[0.95] sm:mt-6"
            />
            <p className="mt-5 max-w-xl text-base leading-relaxed text-df-text-muted sm:mt-6 sm:text-lg">
              {membership.signupSection.body}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 sm:mt-10">
            <MembershipSignupForm />
          </Reveal>
        </Container>
      </section>

      <ProgramsGrid id="programs" highlightServiceId="membership" />
    </>
  )
}

function ServicePriceTile({ service }) {
  return (
    <SpotlightCard
      spotlightColor="var(--df-accent-wash-soft)"
      className="!bg-df-surface/85 !rounded-df-2xl !border-df-border !p-6 shadow-df-xl backdrop-blur-xl sm:!p-8"
    >
      <Badge tone="accent" variant="soft" size="md" className="w-fit">
        {service.eyebrow}
      </Badge>
      <p className="font-400 mt-4 font-display text-xl uppercase tracking-[0.02em] text-df-text-muted sm:mt-5">
        {service.name}
      </p>
      <div className="mt-4 flex items-end gap-2 border-b border-df-border pb-5 sm:pb-6">
        <AnimatedPrice
          value={service.price}
          className="font-400 font-display text-[clamp(2.75rem,11vw,4.5rem)] tabular-nums leading-[0.82] text-df-text"
        />
        <span className="pb-2 text-sm text-df-text-faint">{service.period}</span>
      </div>
      <ul className="mt-6 flex flex-col gap-3">
        {service.includes.slice(0, 5).map(feature => (
          <li key={feature} className="flex items-start gap-3 text-sm text-df-text-muted">
            <span
              className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-df-full bg-df-accent-soft text-df-accent-bright"
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
    </SpotlightCard>
  )
}

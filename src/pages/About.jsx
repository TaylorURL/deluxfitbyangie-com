import { ArrowRight, Check } from 'lucide-react'
import {
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
import FramedPhoto from '@/components/FramedPhoto'
import PhotoBand from '@/components/PhotoBand'
import PhotoGallery from '@/components/PhotoGallery'
import AnimatedBackdrop from '@/components/AnimatedBackdrop'
import { ShinyText, DecryptedText, SpotlightCard } from '@/components/reactbits'

const ABOUT_GALLERY = [
  {
    src: '/brand/gym-squat-rack-portrait.jpg',
    alt: 'Angie leaning on the Force USA squat rack between sets',
    span: 'tall',
    objectPosition: 'object-[55%_30%]',
  },
  {
    src: '/brand/gym-lat-pulldown.jpg',
    alt: 'Angie pulling through a lat pulldown set',
    span: 'regular',
    objectPosition: 'object-[50%_30%]',
  },
  {
    src: '/brand/studio-back-pose.jpg',
    alt: 'Angie in a posed standing stretch, studio session',
    span: 'regular',
    objectPosition: 'object-[55%_30%]',
  },
  {
    src: '/brand/gym-barbell-squat.jpg',
    alt: 'Angie pinned at the bottom of a barbell squat',
    span: 'wide',
    objectPosition: 'object-[50%_40%]',
  },
]

export default function About() {
  const { about } = useContent()

  return (
    <>
      <section className="relative isolate overflow-hidden bg-df-bg pb-10 pt-24 sm:pb-12 sm:pt-40 lg:pt-48">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_85%_5%,rgba(225,29,42,0.16),transparent_60%)]"
        />
        {/* React Bits Aurora — ambient crimson drift behind Angie's story. */}
        <AnimatedBackdrop variant="aurora" opacity={0.4} />
        <Container size="xl">
          <div className="grid items-center gap-10 sm:gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
            <Reveal className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-4 -z-10 rounded-df-2xl bg-df-accent-soft blur-3xl"
              />
              <FramedPhoto
                src="/brand/studio-seated-portrait.jpg"
                alt={about.hero.imageAlt}
                aspect="aspect-[4/5]"
              />
            </Reveal>

            <Reveal delay={0.1} className="flex flex-col items-start">
              <SectionEyebrow>
                <ShinyText text={about.hero.eyebrow} color="#c81a27" shineColor="#ff8b95" speed={4} />
              </SectionEyebrow>
              <SplitHeading
                text={about.hero.heading}
                accent={about.hero.accent}
                className="mt-5 text-[clamp(2rem,8vw,4rem)] leading-[0.95] sm:mt-6"
              />
              <p className="mt-5 text-[11px] font-700 uppercase tracking-[0.22em] text-df-text-muted sm:mt-6">
                <DecryptedText
                  text={about.hero.tagline}
                  animateOn="view"
                  sequential
                  revealDirection="start"
                  speed={38}
                  useOriginalCharsOnly
                />
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-y border-df-border bg-df-bg-elevated py-12 sm:py-20">
        <Container size="md">
          <Reveal className="flex flex-col items-start">
            <SectionEyebrow>{about.mission.eyebrow}</SectionEyebrow>
            <SplitHeading
              text={about.mission.heading}
              accent={about.mission.accent}
              className="mt-4 text-[clamp(2rem,9vw,3.75rem)] leading-[0.92] sm:mt-5"
            />
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-df-text-muted sm:text-lg">
              {about.mission.body}
            </p>
          </Reveal>
        </Container>
      </section>

      <Section
        eyebrow={about.story.eyebrow}
        heading={about.story.heading}
        accent={about.story.accent}
        index="01"
        containerSize="md"
      >
        <div className="flex flex-col gap-5">
          {about.story.paragraphs.map(paragraph => (
            <Reveal key={paragraph}>
              <p className="text-base leading-relaxed text-df-text-muted sm:text-lg">{paragraph}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow={about.credentials.eyebrow}
        heading={about.credentials.heading}
        accent={about.credentials.accent}
        index="02"
      >
        <ul className="grid gap-x-8 sm:grid-cols-2">
          {about.credentials.items.map(item => (
            <Reveal key={item} as="li">
              <div className="flex items-start gap-3 border-t border-df-border py-5">
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-df-full bg-df-accent-soft text-df-accent-bright"
                  aria-hidden="true"
                >
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                <span className="text-[15px] leading-relaxed text-df-text">{item}</span>
              </div>
            </Reveal>
          ))}
        </ul>
        {about.credentials.note && (
          <p className="mt-8 text-xs leading-relaxed text-df-text-faint">{about.credentials.note}</p>
        )}
      </Section>

      <PhotoBand
        src="/brand/gym-back-squat-discipline.jpg"
        alt="Angie under the bar — discipline over excuses"
        objectPosition="object-[40%_30%]"
        height="short"
      />

      <Section
        eyebrow={about.philosophy.eyebrow}
        heading={about.philosophy.heading}
        accent={about.philosophy.accent}
        index="03"
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {about.philosophy.pillars.map(({ icon: Icon, title, description }, index) => (
            <Reveal key={title} delay={index * 0.06} className="flex">
              <SpotlightCard
                spotlightColor="rgba(225,29,42,0.15)"
                className="flex h-full w-full flex-col !rounded-df-lg !border-df-border !bg-df-surface !p-6 sm:!p-8"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-2 font-display text-6xl font-400 leading-none tabular-nums text-df-surface-3"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-df-lg bg-df-accent-soft text-df-accent-bright"
                  aria-hidden="true"
                >
                  <Icon className="h-6 w-6" strokeWidth={2} />
                </span>
                <h3 className="mt-6 font-display text-2xl font-400 uppercase tracking-[0.01em] text-df-text">
                  {title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-df-text-muted">{description}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="In session"
        heading="How she trains."
        accent="trains."
        index="04"
        containerSize="xl"
      >
        <Reveal>
          <PhotoGallery items={ABOUT_GALLERY} />
        </Reveal>
      </Section>

      <section className="relative isolate overflow-hidden border-y border-df-border bg-df-bg-elevated py-16 sm:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_70%_at_50%_120%,rgba(225,29,42,0.22),transparent_70%)]"
        />
        {/* React Bits Particles — a quiet crimson field under the closing CTA. */}
        <AnimatedBackdrop variant="particles" opacity={0.45} />
        <Container size="lg">
          <Reveal className="flex flex-col items-start">
            <div className="flex items-center gap-3 sm:gap-4">
              <SectionIndex>05</SectionIndex>
              <SectionEyebrow>
                <ShinyText text={about.hero.eyebrow} color="#c81a27" shineColor="#ff8b95" speed={4} />
              </SectionEyebrow>
            </div>
            <SplitHeading
              text={about.cta.heading}
              accent={about.cta.accent}
              className="mt-5 max-w-[18ch] text-[clamp(2rem,8vw,3.75rem)] leading-[0.95] sm:mt-6"
            />
            <p className="mt-5 max-w-xl text-base leading-relaxed text-df-text-muted sm:mt-6 sm:text-lg">
              {about.cta.subhead}
            </p>
            <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href={about.cta.primary.href}>
                  {about.cta.primary.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                <Link href={about.cta.secondary.href}>{about.cta.secondary.label}</Link>
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}

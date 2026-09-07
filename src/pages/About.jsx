import { ArrowRight, Check } from 'lucide-react'
import { Button, Container, Reveal, Section, SectionEyebrow, SplitHeading } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { Link } from '@/router'
import FramedPhoto from '@/components/media/FramedPhoto'
import PhotoBand from '@/components/media/PhotoBand'
import PhotoGallery from '@/components/media/PhotoGallery'
import AnimatedBackdrop from '@/components/effects/AnimatedBackdrop'
import { DecryptedText, SpotlightCard } from '@/components/reactbits'

const ABOUT_GALLERY = [
  {
    src: '/brand/gym-squat-rack-portrait.webp',
    alt: 'Angie leaning on the Force USA squat rack between sets',
    span: 'tall',
    objectPosition: 'object-[55%_30%]',
  },
  {
    src: '/brand/gym-lat-pulldown.webp',
    alt: 'Angie pulling through a lat pulldown set',
    span: 'regular',
    objectPosition: 'object-[50%_30%]',
  },
  {
    src: '/brand/studio-back-pose.webp',
    alt: 'Angie in a posed standing stretch, studio session',
    span: 'regular',
    objectPosition: 'object-[55%_30%]',
  },
  {
    src: '/brand/gym-barbell-squat.webp',
    alt: 'Angie pinned at the bottom of a barbell squat',
    span: 'wide',
    objectPosition: 'object-[50%_40%]',
  },
]

export default function About() {
  const { about } = useContent()

  return (
    <>
      <section className="relative isolate overflow-hidden bg-df-bg pb-10 pt-[calc(var(--df-header-height)+1.5rem)] sm:pb-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_85%_5%,var(--df-accent-wash-soft),transparent_60%)]"
        />
        <AnimatedBackdrop variant="aurora" opacity={0.4} />
        <Container size="lg">
          <div className="grid items-center gap-10 sm:gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
            <Reveal className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-4 -z-10 rounded-df-2xl bg-df-accent-soft blur-3xl"
              />
              <FramedPhoto
                src="/brand/studio-seated-portrait.webp"
                alt={about.hero.imageAlt}
                aspect="aspect-[4/5]"
                priority
              />
            </Reveal>

            <Reveal delay={0.1} className="flex flex-col items-start">
              <SectionEyebrow>{about.hero.eyebrow}</SectionEyebrow>
              <SplitHeading
                as="h1"
                size="page"
                text={about.hero.heading}
                accent={about.hero.accent}
                className="mt-5 sm:mt-6"
              />
              <p className="mt-6 max-w-xl text-base leading-relaxed text-df-text-muted sm:text-lg">
                <DecryptedText
                  text={about.hero.subhead}
                  animateOn="view"
                  sequential
                  revealDirection="start"
                  speed={14}
                  useOriginalCharsOnly
                />
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-y border-df-border bg-df-bg-elevated py-14 sm:py-20">
        <Container size="md">
          <Reveal className="flex flex-col items-start">
            <SplitHeading
              text={about.mission.heading}
              accent={about.mission.accent}
              className="mt-4 sm:mt-5"
            />
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-df-text-muted sm:text-lg">
              {about.mission.body}
            </p>
          </Reveal>
        </Container>
      </section>

      <Section heading={about.story.heading} accent={about.story.accent} containerSize="md">
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
      >
        <ul className="grid gap-x-8 sm:grid-cols-2">
          {about.credentials.items.map(item => (
            <Reveal key={item} as="li">
              <div className="flex items-start gap-3 border-t border-df-border py-5">
                <span
                  className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-df-full bg-df-accent-soft text-df-accent-bright"
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
          <p className="mt-8 text-xs leading-relaxed text-df-text-faint">
            {about.credentials.note}
          </p>
        )}
      </Section>

      <PhotoBand
        src="/brand/gym-back-squat-discipline.webp"
        alt="Angie under the bar, mid-set at the squat rack"
        objectPosition="object-[40%_30%]"
        height="short"
      />

      <Section heading={about.philosophy.heading} accent={about.philosophy.accent}>
        <div className="grid gap-5 lg:grid-cols-3">
          {about.philosophy.pillars.map(({ icon: Icon, title, description }, index) => (
            <Reveal key={title} delay={index * 0.06} className="flex">
              <SpotlightCard
                spotlightColor="var(--df-accent-wash-soft)"
                className="flex h-full w-full flex-col"
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-df-lg bg-df-accent-soft text-df-accent-bright"
                  aria-hidden="true"
                >
                  <Icon className="h-6 w-6" strokeWidth={2} />
                </span>
                <h3 className="font-400 mt-6 font-display text-2xl uppercase tracking-[0.01em] text-df-text">
                  {title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-df-text-muted">{description}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow="In session" heading="How she trains." accent="trains.">
        <Reveal>
          <PhotoGallery items={ABOUT_GALLERY} />
        </Reveal>
      </Section>

      <section className="relative isolate overflow-hidden border-y border-df-border bg-df-bg-elevated py-16 sm:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_70%_at_50%_120%,var(--df-accent-wash-strong),transparent_70%)]"
        />
        <AnimatedBackdrop variant="particles" opacity={0.45} />
        <Container size="lg">
          <Reveal className="flex flex-col items-start">
            <SplitHeading
              text={about.cta.heading}
              accent={about.cta.accent}
              className="mt-5 max-w-[18ch] sm:mt-6"
            />
            <p className="mt-5 max-w-xl text-base leading-relaxed text-df-text-muted sm:mt-6 sm:text-lg">
              {about.cta.subhead}
            </p>
            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
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

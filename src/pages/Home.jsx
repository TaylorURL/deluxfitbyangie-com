import { ArrowRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Button,
  Card,
  Container,
  Marquee,
  Reveal,
  SectionEyebrow,
  SectionIndex,
  SplitHeading,
  cn,
} from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { Link } from '@/router'
import FramedPhoto from '@/components/FramedPhoto'
import PhotoGallery from '@/components/PhotoGallery'
import ProgramsGrid from '@/components/ProgramsGrid'

const HOME_GALLERY = [
  {
    src: '/brand/gym-battle-ropes.jpg',
    alt: 'Angie driving battle ropes on the turf, pink kit, gym session',
    span: 'wide',
    objectPosition: 'object-[50%_30%]',
  },
  {
    src: '/brand/studio-red-mat-seated.jpg',
    alt: 'Angie seated on a crimson mat in a studio portrait',
    span: 'tall',
    objectPosition: 'object-[60%_35%]',
  },
  {
    src: '/brand/gym-back-squat-discipline.jpg',
    alt: 'Angie under the bar setting up a back squat in the rack',
    span: 'regular',
    objectPosition: 'object-[50%_45%]',
  },
  {
    src: '/brand/studio-dumbbell-side-pose.jpg',
    alt: 'Angie holding a dumbbell, step-up pose, studio lighting',
    span: 'regular',
    objectPosition: 'object-[55%_25%]',
  },
  {
    src: '/brand/gym-dumbbell-deadlift.jpg',
    alt: 'Angie mid-rep of a dumbbell Romanian deadlift in the gym',
    span: 'regular',
    objectPosition: 'object-[50%_30%]',
  },
  {
    src: '/brand/studio-cobra-stretch.jpg',
    alt: 'Angie in an upward stretch, studio session, dumbbells at her side',
    span: 'wide',
    objectPosition: 'object-[40%_40%]',
  },
  {
    src: '/brand/gym-leg-press.jpg',
    alt: 'Angie pressing through a heavy leg-press set',
    span: 'wide',
    objectPosition: 'object-[50%_35%]',
  },
]

const MotionH1 = motion.h1
const MotionSpan = motion.span
const MotionDiv = motion.div

const LINE = {
  hidden: { opacity: 0, y: '0.4em' },
  visible: { opacity: 1, y: 0 },
}

const LINE_STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const HOME_MARQUEE = [
  'Personalized programming',
  'Live 1-on-1 coaching',
  'Strength · Fat loss · Muscle gain',
  'Coaching from a certified trainer',
  'Home or gym',
]

/**
 * Home — the public landing page. The hero introduces Angie and the brand at
 * type-specimen scale, the intro humanizes her, the programs grid is the
 * primary conversion surface (linking out to the three service pages and
 * teasing the in-person coming-soon), and a closing CTA band routes to the
 * coaching application and 1-on-1 booking.
 */
export default function Home() {
  const { home } = useContent()
  const { hero, intro, transformationCallout, closing } = home
  const prefersReducedMotion = useReducedMotion()
  const lastIndex = hero.headline.length - 1

  return (
    <>
      {/* HERO — strongest brand moment, kept on the dark panel */}
      <section
        id="top"
        data-theme="dark"
        className="relative isolate overflow-hidden bg-df-bg text-df-text"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_80%_5%,rgba(225,29,42,0.16),transparent_60%)]"
        />

        <Container size="xl" className="pb-14 pt-24 sm:pb-20 sm:pt-40 lg:pb-24 lg:pt-48">
          <span className="inline-flex items-center gap-2.5 text-[11px] font-700 uppercase tracking-[0.22em] text-df-accent-bright">
            <span className="h-1.5 w-1.5 rounded-df-full bg-df-accent" aria-hidden="true" />
            {hero.badge}
          </span>

          <MotionH1
            className="mt-5 font-display text-[clamp(2.5rem,11vw,9rem)] font-400 uppercase leading-[0.86] tracking-[-0.01em] text-df-text sm:mt-7"
            variants={prefersReducedMotion ? undefined : LINE_STAGGER}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate={prefersReducedMotion ? undefined : 'visible'}
          >
            {hero.headline.map((line, index) => (
              <MotionSpan
                key={line}
                className={cn(
                  'block',
                  index === lastIndex &&
                    'pb-[0.08em] font-accent text-[0.92em] normal-case italic text-df-accent-bright'
                )}
                variants={prefersReducedMotion ? undefined : LINE}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {line}
              </MotionSpan>
            ))}
          </MotionH1>

          <div className="mt-10 grid items-end gap-10 border-t border-df-border pt-8 sm:mt-16 sm:pt-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="max-w-xl">
              <p className="text-base leading-relaxed text-df-text-muted sm:text-lg">
                {hero.subhead}
              </p>

              <div className="mt-7 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href={hero.primaryCtaHref}>
                    {hero.primaryCta}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                  <Link href={hero.secondaryCtaHref}>{hero.secondaryCta}</Link>
                </Button>
              </div>

              <div className="mt-8 flex items-center gap-3">
                <span className="h-px w-8 bg-df-accent" aria-hidden="true" />
                <span className="text-sm font-600 uppercase tracking-wide text-df-text">
                  {hero.trust.tagline}
                </span>
              </div>
            </div>

            <MotionDiv
              className="relative mx-auto w-full max-w-[18rem] sm:max-w-sm lg:mx-0 lg:justify-self-end"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
            >
              <FramedPhoto
                src="/brand/studio-portrait-dumbbells.jpg"
                alt={hero.imageAlt}
                aspect="aspect-[4/5]"
              />
              <div className="absolute -bottom-4 left-2 rounded-df-md border border-df-glass-border bg-df-glass-fill px-4 py-2.5 backdrop-blur-xl sm:-bottom-5 sm:-left-5 sm:px-5 sm:py-3">
                <div className="font-display text-[clamp(1.75rem,5vw,3rem)] font-400 leading-none tabular-nums text-df-accent-bright">
                  {hero.trust.pillarValue}
                </div>
                <div className="mt-1 text-[10px] font-600 uppercase tracking-[0.2em] text-df-text-muted">
                  {hero.trust.pillarLabel}
                </div>
              </div>
            </MotionDiv>
          </div>
        </Container>

        <div className="border-y border-df-border bg-df-bg-elevated py-5">
          <Marquee items={HOME_MARQUEE} />
        </div>
      </section>

      {/* MEET ANGIE — light editorial panel, anduril-style hard cut from the hero */}
      <section data-theme="light" className="overflow-hidden bg-df-bg py-16 text-df-text sm:py-28">
        <Container size="lg">
          <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <Reveal className="relative order-last lg:order-first">
              <div
                aria-hidden="true"
                className="absolute -inset-4 -z-10 rounded-df-2xl bg-df-accent-soft blur-3xl"
              />
              <FramedPhoto
                src="/brand/studio-kettlebell-portrait.jpg"
                alt={intro.imageAlt}
                aspect="aspect-[4/5]"
              />
            </Reveal>

            <Reveal delay={0.1} className="flex flex-col items-start">
              <div className="flex items-center gap-4">
                <SectionIndex>01</SectionIndex>
                <SectionEyebrow>{intro.eyebrow}</SectionEyebrow>
              </div>
              <SplitHeading
                text={intro.heading}
                accent={intro.accent}
                className="mt-5 text-[clamp(2rem,4.5vw,3.25rem)] leading-[0.95]"
              />
              <div className="mt-6 flex flex-col gap-4">
                {intro.body.map(paragraph => (
                  <p key={paragraph} className="text-base leading-relaxed text-df-text-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
              <Button asChild size="lg" variant="outline" className="mt-8">
                <Link href={intro.ctaHref}>
                  {intro.ctaLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* PROGRAMS — three services + coming-soon teaser */}
      <ProgramsGrid id="programs" highlightServiceId="coaching" />

      {/* WHAT IT LOOKS LIKE — light value panel between dark programs + dark gallery */}
      <section
        data-theme="light"
        className="overflow-hidden border-t border-df-border bg-df-bg-elevated py-16 text-df-text sm:py-28"
      >
        <Container size="lg">
          <Reveal className="flex flex-col items-start">
            <div className="flex items-center gap-4">
              <SectionIndex>03</SectionIndex>
              <SectionEyebrow>{transformationCallout.eyebrow}</SectionEyebrow>
            </div>
            <SplitHeading
              text={transformationCallout.heading}
              accent={transformationCallout.accent}
              className="mt-5 max-w-[20ch] text-[clamp(2rem,4.5vw,3.25rem)] leading-[0.95]"
            />
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-df-text-muted sm:text-lg">
              {transformationCallout.body}
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-3 sm:gap-5">
            {transformationCallout.pillars.map(({ icon: Icon, title, description }, index) => (
              <Reveal key={title} delay={index * 0.06}>
                <Card variant="surface" className="relative flex h-full flex-col overflow-hidden">
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
                  <p className="mt-3 text-[15px] leading-relaxed text-df-text-muted">
                    {description}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="mt-10 sm:mt-12">
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link href={transformationCallout.ctaHref}>
                {transformationCallout.ctaLabel}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </Reveal>
        </Container>
      </section>

      {/* SHOOT GALLERY — real brand photography */}
      <section className="overflow-hidden py-16 sm:py-28">
        <Container size="xl">
          <Reveal className="flex flex-col items-start">
            <div className="flex items-center gap-4">
              <SectionIndex>04</SectionIndex>
              <SectionEyebrow>In the gym</SectionEyebrow>
            </div>
            <SplitHeading
              text="Real reps. Real grit."
              accent="grit"
              className="mt-5 max-w-[20ch] text-[clamp(2rem,4.5vw,3.25rem)] leading-[0.95]"
            />
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-df-text-muted sm:text-lg">
              Studio portraits and gym sessions from the DeluxFit shoot — the same energy
              Angie brings to every program.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-10 sm:mt-12">
            <PhotoGallery items={HOME_GALLERY} />
          </Reveal>
        </Container>
      </section>

      {/* CLOSING CTA */}
      <section className="relative isolate overflow-hidden border-y border-df-border bg-df-bg py-20 sm:py-36">
        <img
          src="/brand/gym-back-squat-discipline.jpg"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-[35%_30%] opacity-40"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-df-bg via-df-bg/80 to-df-bg"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_70%_at_50%_120%,rgba(225,29,42,0.32),transparent_70%)]"
        />
        <Container size="lg">
          <Reveal className="flex flex-col items-start">
            <div className="flex items-center gap-4">
              <SectionIndex>05</SectionIndex>
              <SectionEyebrow>{closing.eyebrow}</SectionEyebrow>
            </div>
            <SplitHeading
              text={closing.heading}
              accent={closing.accent}
              className="mt-6 max-w-[20ch] text-[clamp(2.25rem,7vw,5.5rem)] leading-[0.92]"
            />
            <p className="mt-6 max-w-xl text-base leading-relaxed text-df-text-muted sm:mt-7 sm:text-lg">
              {closing.subhead}
            </p>
            <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href={closing.primaryCtaHref}>
                  {closing.primaryCta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                <Link href={closing.secondaryCtaHref}>{closing.secondaryCta}</Link>
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}

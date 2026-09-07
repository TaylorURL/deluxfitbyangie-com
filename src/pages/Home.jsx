import { Fragment } from 'react'
import { ArrowRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Button,
  Card,
  Container,
  Marquee,
  Reveal,
  SectionEyebrow,
  SplitHeading,
  cn,
} from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { Link } from '@/router'
import FramedPhoto from '@/components/media/FramedPhoto'
import { imageBox, imageSrcSet } from '@/lib/images'
import PhotoGallery from '@/components/media/PhotoGallery'
import ProgramsGrid from '@/components/sections/ProgramsGrid'
import AnimatedBackdrop from '@/components/effects/AnimatedBackdrop'

const HOME_GALLERY = [
  {
    src: '/brand/gym-battle-ropes.webp',
    alt: 'Angie driving battle ropes on the turf, pink kit, gym session',
    span: 'wide',
    objectPosition: 'object-[50%_30%]',
  },
  {
    src: '/brand/studio-red-mat-seated.webp',
    alt: 'Angie seated on a crimson mat in a studio portrait',
    span: 'tall',
    objectPosition: 'object-[60%_35%]',
  },
  {
    src: '/brand/gym-back-squat-discipline.webp',
    alt: 'Angie under the bar setting up a back squat in the rack',
    span: 'regular',
    objectPosition: 'object-[50%_45%]',
  },
  {
    src: '/brand/studio-dumbbell-side-pose.webp',
    alt: 'Angie holding a dumbbell, step-up pose, studio lighting',
    span: 'regular',
    objectPosition: 'object-[55%_25%]',
  },
  {
    src: '/brand/gym-dumbbell-deadlift.webp',
    alt: 'Angie mid-rep of a dumbbell Romanian deadlift in the gym',
    span: 'regular',
    objectPosition: 'object-[50%_30%]',
  },
  {
    src: '/brand/studio-cobra-stretch.webp',
    alt: 'Angie in an upward stretch, studio session, dumbbells at her side',
    span: 'wide',
    objectPosition: 'object-[40%_40%]',
  },
  {
    src: '/brand/gym-leg-press.webp',
    alt: 'Angie pressing through a heavy leg-press set',
    span: 'wide',
    objectPosition: 'object-[50%_35%]',
  },
]

const MotionH1 = motion.h1
const MotionSpan = motion.span
const MotionDiv = motion.div

// The lines rise without a fade: an element first painted at nothing is never
// reconsidered as the page's largest paint, so a headline that faded in was
// measured by whatever painted after it.
const LINE = {
  hidden: { y: '0.4em' },
  visible: { y: 0 },
}

const LINE_STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

export default function Home() {
  const { home, gallery } = useContent()
  const { hero, intro, transformationCallout, closing } = home
  const prefersReducedMotion = useReducedMotion()
  const lastIndex = hero.headline.length - 1

  return (
    <>
      <section
        id="top"
        data-theme="dark"
        className="relative isolate overflow-hidden bg-df-bg text-df-text"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_80%_5%,var(--df-accent-wash-soft),transparent_60%)]"
        />
        <AnimatedBackdrop variant="aurora" opacity={0.45} />

        <Container
          size="lg"
          className="pb-12 pt-[calc(var(--df-header-height)+1.5rem)] sm:pb-16 lg:pb-20"
        >
          <div className="grid items-end gap-10 lg:grid-cols-[1.45fr_1fr] lg:gap-14">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-3 text-[11px] font-700 uppercase tracking-[0.22em] text-df-accent-bright">
                <span className="h-px w-7 bg-df-accent" aria-hidden="true" />
                {hero.badge}
              </span>

              <MotionH1
                className="font-400 mt-6 pb-[0.14em] font-display text-[clamp(2.75rem,10vw,6.5rem)] uppercase leading-[0.86] tracking-[-0.015em] text-df-text sm:mt-8"
                variants={prefersReducedMotion ? undefined : LINE_STAGGER}
                initial={prefersReducedMotion ? false : 'hidden'}
                animate={prefersReducedMotion ? undefined : 'visible'}
              >
                {hero.headline.map((line, index) => (
                  // Each line is its own block, so the rendered text runs the
                  // lines together for anything reading textContent.
                  // Whitespace between block-level children collapses to
                  // nothing on screen, which is what separates the words
                  // without moving the break.
                  <Fragment key={line}>
                    {index > 0 ? ' ' : null}
                    <MotionSpan
                      className={cn('block', index === lastIndex && 'text-df-accent-bright')}
                      variants={prefersReducedMotion ? undefined : LINE}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {line}
                    </MotionSpan>
                  </Fragment>
                ))}
              </MotionH1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-df-text-muted sm:mt-8 sm:text-lg">
                {hero.subhead}
              </p>

              <div className="mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row">
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
            </div>

            <MotionDiv
              className="relative mx-auto w-full max-w-[15rem] sm:max-w-[18rem] lg:mx-0 lg:justify-self-end"
              initial={prefersReducedMotion ? false : { y: 20 }}
              animate={prefersReducedMotion ? undefined : { y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
            >
              <FramedPhoto
                src="/brand/studio-portrait-dumbbells.webp"
                alt={hero.imageAlt}
                aspect="aspect-[4/5]"
                priority
                // The frame this photograph fills is capped well short of the
                // column that holds it, and the default describes the column.
                // The head preloads this file against the same widths, so the
                // two have to name one candidate or the preload is spent on a
                // file the element then declines to use.
                sizes="(min-width: 640px) 18rem, 15rem"
              />
            </MotionDiv>
          </div>
        </Container>

        <div className="border-y border-df-border bg-df-bg-elevated py-5">
          <Marquee items={home.marquee} />
        </div>
      </section>

      <section className="overflow-hidden border-t border-df-border bg-df-bg py-16 text-df-text sm:py-28">
        <Container size="lg">
          <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <Reveal className="relative order-last lg:order-first">
              <div
                aria-hidden="true"
                className="absolute -inset-4 -z-10 rounded-df-2xl bg-df-accent-soft blur-3xl"
              />
              <FramedPhoto
                src="/brand/studio-kettlebell-portrait.webp"
                alt={intro.imageAlt}
                aspect="aspect-[4/5]"
              />
            </Reveal>

            <Reveal delay={0.1} className="flex flex-col items-start">
              <SplitHeading text={intro.heading} accent={intro.accent} className="mt-6" />
              <div className="mt-6 flex flex-col gap-4">
                {intro.body.map(paragraph => (
                  <p key={paragraph} className="text-base leading-relaxed text-df-text-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
              <Button asChild size="lg" variant="outline" className="mt-6">
                <Link href={intro.ctaHref}>
                  {intro.ctaLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </Reveal>
          </div>
        </Container>
      </section>

      <ProgramsGrid id="programs" highlightServiceId="coaching" />

      <section
        data-theme="light"
        className="overflow-hidden border-t border-df-border bg-df-bg-elevated py-16 text-df-text sm:py-28"
      >
        <Container size="lg">
          <Reveal className="flex flex-col items-start">
            <SectionEyebrow>{transformationCallout.eyebrow}</SectionEyebrow>
            <SplitHeading
              text={transformationCallout.heading}
              accent={transformationCallout.accent}
              className="mt-5 max-w-[20ch]"
            />
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-df-text-muted sm:text-lg">
              {transformationCallout.body}
            </p>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-4">
            {transformationCallout.pillars.map(({ icon: Icon, title, description }, index) => (
              <Reveal key={title} delay={index * 0.06}>
                <Card variant="surface" className="relative flex h-full flex-col overflow-hidden">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-df-lg bg-df-accent-soft text-df-accent-bright"
                    aria-hidden="true"
                  >
                    <Icon className="h-6 w-6" strokeWidth={2} />
                  </span>
                  <h3 className="font-400 mt-5 font-display text-2xl uppercase tracking-[0.01em] text-df-text">
                    {title}
                  </h3>
                  <p className="mt-5 text-[15px] leading-relaxed text-df-text-muted">
                    {description}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="mt-8 sm:mt-12">
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link href={transformationCallout.ctaHref}>
                {transformationCallout.ctaLabel}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </Reveal>
        </Container>
      </section>

      <section
        data-theme="dark"
        className="relative isolate overflow-hidden border-t border-df-border bg-df-bg py-16 text-df-text sm:py-28"
      >
        <AnimatedBackdrop variant="particles" opacity={0.5} />
        <Container size="lg">
          <Reveal className="flex flex-col items-start">
            <SplitHeading
              text={gallery.heading}
              accent={gallery.accent}
              className="mt-5 max-w-[20ch]"
            />
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-df-text-muted sm:text-lg">
              {gallery.subhead}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 sm:mt-12">
            <PhotoGallery items={HOME_GALLERY} />
          </Reveal>
        </Container>
      </section>

      <section className="relative isolate overflow-hidden border-y border-df-border bg-df-bg py-16 text-df-text sm:py-28">
        <img
          src="/brand/gym-back-squat-discipline.webp"
          srcSet={imageSrcSet('/brand/gym-back-squat-discipline.webp')}
          sizes="100vw"
          width={imageBox('/brand/gym-back-squat-discipline.webp')?.width}
          height={imageBox('/brand/gym-back-squat-discipline.webp')?.height}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-[35%_30%] opacity-15 [filter:grayscale(0.9)_contrast(1.05)]"
        />
        <div
          aria-hidden="true"
          className="via-df-bg/85 pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-df-bg to-df-bg"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_70%_at_50%_120%,var(--df-accent-wash-deep),transparent_70%)]"
        />
        <Container size="lg">
          <Reveal className="flex flex-col items-start">
            <SplitHeading
              size="page"
              text={closing.heading}
              accent={closing.accent}
              className="mt-6 max-w-[20ch]"
            />
            <p className="mt-6 max-w-xl text-base leading-relaxed text-df-text-muted sm:text-lg">
              {closing.subhead}
            </p>
            <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
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

import { Fragment } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Button, Container, Marquee, Reveal, SectionEyebrow, SplitHeading, cn } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { Link } from '@/router'
import FramedPhoto from '@/components/media/FramedPhoto'
import { imageBox, imageSrcSet, recoverImage } from '@/lib/images'
import PhotoGallery from '@/components/media/PhotoGallery'
import ProgramsGrid from '@/components/sections/ProgramsGrid'
import PillarGrid from '@/components/sections/PillarGrid'
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
  const { home, gallery, brand } = useContent()
  const { hero, intro, transformationCallout, closing } = home
  const prefersReducedMotion = useReducedMotion()
  const lastIndex = hero.headline.length - 1

  return (
    <>
      {/* The first screen is a poster: the headline at the largest size the
          site sets anything, the photograph beside it in the red frame, and
          the facts under a rule. The ground carries the dot grid and one
          crimson bloom off the top corner, so the brand is on the page before
          a word of it is read. */}
      <section
        id="top"
        data-theme="dark"
        className="df-grain relative isolate overflow-hidden bg-df-bg text-df-text"
      >
        <div
          aria-hidden="true"
          className="df-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(75%_65%_at_30%_0%,#000,transparent_85%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-48 right-[-12%] -z-10 h-[44rem] w-[44rem] rounded-df-full bg-[radial-gradient(closest-side,var(--df-accent-wash-strong),transparent)] blur-3xl"
        />
        <AnimatedBackdrop variant="aurora" opacity={0.4} />

        <Container
          size="lg"
          className="pb-14 pt-[calc(var(--df-header-height)+2rem)] sm:pb-20 sm:pt-[calc(var(--df-header-height)+3.5rem)]"
        >
          <div className="grid items-end gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
            <div className="min-w-0">
              <SectionEyebrow>{hero.badge}</SectionEyebrow>

              <MotionH1
                className="font-400 mt-7 pb-[0.1em] font-display text-[clamp(3.25rem,10vw,7.5rem)] uppercase leading-[0.84] tracking-[-0.025em] text-df-text sm:mt-9"
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

              <p className="mt-7 max-w-xl text-lg leading-relaxed text-df-text-muted sm:mt-9 sm:text-xl">
                {hero.subhead}
              </p>

              <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href={hero.primaryCtaHref}>
                    {hero.primaryCta}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                  <Link href={hero.secondaryCtaHref}>
                    {hero.secondaryCta}
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>

              {/* The three facts a visitor is weighing before they scroll: how
                  many ways in, what the cheapest one costs, and that the live
                  option is one-to-one. They sit under a rule rather than in a
                  row of chips, so they read as the small print of the headline
                  rather than as three more things asking to be clicked. */}
              <dl className="mt-12 grid max-w-2xl grid-cols-3 gap-4 border-t border-df-border pt-7 sm:mt-14 sm:gap-8">
                {hero.facts.map(({ value, label }) => (
                  <div key={label} className="flex flex-col gap-2">
                    <dd className="font-400 order-first font-display text-[clamp(1.75rem,4vw,2.75rem)] tabular-nums leading-none tracking-[-0.02em] text-df-text">
                      {value}
                    </dd>
                    <dt className="text-[11px] font-700 uppercase tracking-[0.16em] text-df-text-faint">
                      {label}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>

            <MotionDiv
              className="relative mx-auto w-full max-w-[18rem] sm:max-w-[24rem] lg:max-w-none lg:justify-self-stretch"
              initial={prefersReducedMotion ? false : { y: 20 }}
              animate={prefersReducedMotion ? undefined : { y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
            >
              <FramedPhoto
                src="/brand/studio-portrait-dumbbells.webp"
                alt={hero.imageAlt}
                aspect="aspect-[4/5]"
                priority
                caption={brand.fullName}
                // The frame this photograph fills is capped well short of the
                // column that holds it, and the default describes the column.
                // The head preloads this file against the same widths, so the
                // two have to name one candidate or the preload is spent on a
                // file the element then declines to use.
                sizes="(min-width: 1024px) 28rem, (min-width: 640px) 22rem, 16rem"
              />
            </MotionDiv>
          </div>
        </Container>
      </section>

      {/* The ticker: the brand red as a full band between the first screen and
          the second. It is the one place on the page the red is loud. */}
      <Marquee tone="accent" items={home.marquee} />

      <section className="overflow-hidden bg-df-bg py-16 text-df-text sm:py-32">
        <Container size="lg">
          <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <Reveal className="relative order-last mx-auto w-full max-w-md lg:order-first lg:max-w-none">
              <FramedPhoto
                src="/brand/studio-kettlebell-portrait.webp"
                alt={intro.imageAlt}
                aspect="aspect-[4/5]"
                offset="left"
              />
            </Reveal>

            <Reveal delay={0.1} className="flex flex-col items-start">
              <SectionEyebrow>{intro.eyebrow}</SectionEyebrow>
              <SplitHeading
                text={intro.heading}
                accent={intro.accent}
                className="mt-7 max-w-[16ch]"
              />
              <div className="mt-8 flex max-w-xl flex-col gap-5">
                {intro.body.map(paragraph => (
                  <p
                    key={paragraph}
                    className="text-base leading-relaxed text-df-text-muted sm:text-lg"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              <Button asChild size="lg" variant="secondary" className="mt-8">
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
        className="df-grain overflow-hidden bg-df-bg py-16 text-df-text sm:py-32"
      >
        <Container size="lg">
          <Reveal className="flex flex-col items-start">
            <SectionEyebrow>{transformationCallout.eyebrow}</SectionEyebrow>
            <SplitHeading
              text={transformationCallout.heading}
              accent={transformationCallout.accent}
              className="mt-7 max-w-[18ch]"
            />
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-df-text-muted sm:text-xl">
              {transformationCallout.body}
            </p>
          </Reveal>

          <PillarGrid items={transformationCallout.pillars} className="mt-12 sm:mt-16" />

          <Reveal delay={0.2} className="mt-10 sm:mt-12">
            <Button asChild size="lg" className="w-full sm:w-auto">
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
        className="relative isolate overflow-hidden bg-df-bg py-16 text-df-text sm:py-32"
      >
        <AnimatedBackdrop variant="particles" opacity={0.5} />
        <Container size="lg">
          <Reveal className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SplitHeading text={gallery.heading} accent={gallery.accent} className="max-w-[14ch]" />
            <p className="max-w-md text-base leading-relaxed text-df-text-muted sm:pb-2 sm:text-lg">
              {gallery.subhead}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-10 sm:mt-14">
            <PhotoGallery items={HOME_GALLERY} />
          </Reveal>
        </Container>
      </section>

      <section className="df-grain relative isolate overflow-hidden bg-df-bg py-24 text-df-text sm:py-40">
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
          onError={recoverImage}
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-[35%_30%] opacity-30 [filter:grayscale(0.85)_contrast(1.1)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,var(--df-bg)_0%,rgba(8,8,10,0.55)_45%,var(--df-bg)_100%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_70%_at_50%_120%,var(--df-accent-wash-deep),transparent_70%)]"
        />
        <Container size="lg">
          <Reveal className="flex flex-col items-center text-center">
            <SplitHeading
              size="hero"
              text={closing.heading}
              accent={closing.accent}
              className="max-w-[12ch]"
            />
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-df-text-muted sm:text-xl">
              {closing.subhead}
            </p>
            <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
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

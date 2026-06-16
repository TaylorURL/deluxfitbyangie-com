import { ArrowRight, Star } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Button, Container, Marquee, SplitHeading, cn } from '@deluxfit/ds'
import { hero, marqueeItems } from '@/content/site'
import PhotoPlaceholder from './PhotoPlaceholder'

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

/**
 * Hero — a type-specimen opening. The headline IS the graphic: a condensed
 * Anton display set at architectural scale that bleeds to the column edge (and
 * is clipped, never scrolled), with the closing line lifted into Fraunces italic
 * crimson. Copy, CTAs, and the marquee continue to flow from site.js.
 */
export default function Hero() {
  const prefersReducedMotion = useReducedMotion()
  const lastIndex = hero.headline.length - 1

  return (
    <section id="top" className="relative isolate overflow-hidden bg-df-bg">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_85%_8%,rgba(225,29,42,0.16),transparent_60%)]"
      />

      <Container size="xl" className="pb-16 pt-32 sm:pb-20 sm:pt-40 lg:pb-24 lg:pt-48">
        <div className="grid items-end gap-12 lg:grid-cols-[1.55fr_1fr] lg:gap-10">
          <div className="flex flex-col items-start">
            <span className="inline-flex items-center gap-2.5 text-[11px] font-700 uppercase tracking-[0.22em] text-df-accent-bright">
              <span className="h-1.5 w-1.5 rounded-df-full bg-df-accent" aria-hidden="true" />
              {hero.badge}
            </span>

            <MotionH1
              className="mt-7 font-display text-[clamp(1.75rem,8vw,9rem)] font-400 uppercase leading-[0.86] tracking-[-0.01em] text-df-text"
              variants={prefersReducedMotion ? undefined : LINE_STAGGER}
              initial={prefersReducedMotion ? false : 'hidden'}
              animate={prefersReducedMotion ? undefined : 'visible'}
            >
              {hero.headline.map((line, index) => (
                <span key={line} className="block overflow-hidden">
                  <MotionSpan
                    className={cn(
                      'block',
                      index === lastIndex &&
                        'font-accent text-[0.92em] normal-case italic text-df-accent-bright'
                    )}
                    variants={prefersReducedMotion ? undefined : LINE}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {line}
                  </MotionSpan>
                </span>
              ))}
            </MotionH1>
          </div>

          <MotionDiv
            className="relative w-full max-w-sm justify-self-start lg:justify-self-end"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <PhotoPlaceholder label={hero.imageAlt} alt={hero.imageAlt} aspect="aspect-[4/5]" />
            <div className="absolute -bottom-5 -left-3 rounded-df-md border border-df-border bg-df-bg/90 px-5 py-3 backdrop-blur sm:-left-5">
              <div className="font-display text-[clamp(2rem,5vw,3rem)] font-400 leading-none tabular-nums text-df-text">
                500
                <span className="text-df-accent-bright">+</span>
              </div>
              <div className="mt-1 text-[10px] font-600 uppercase tracking-[0.2em] text-df-text-muted">
                Clients transformed
              </div>
            </div>
          </MotionDiv>
        </div>

        <div className="mt-14 grid gap-10 border-t border-df-border pt-10 sm:mt-16 lg:grid-cols-[1.55fr_1fr] lg:gap-10">
          <div className="max-w-xl">
            <p className="text-base leading-relaxed text-df-text-muted sm:text-lg">{hero.subhead}</p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <a href="#pricing">
                  {hero.primaryCta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
              <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                <a href="#results">{hero.secondaryCta}</a>
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:items-end lg:text-right">
            <div className="flex items-center gap-2 lg:flex-row-reverse">
              <div className="flex" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-df-accent text-df-accent" />
                ))}
              </div>
              <span className="text-sm font-600 text-df-text">
                {hero.trust.rating}
                <span className="ml-1.5 font-400 text-df-text-faint">{hero.trust.ratingLabel}</span>
              </span>
            </div>
            <span className="text-sm font-600 text-df-text">{hero.trust.clients}</span>
          </div>
        </div>
      </Container>

      <div className="border-y border-df-border bg-df-bg-elevated py-5">
        <Marquee items={marqueeItems} />
      </div>
    </section>
  )
}

import { ArrowRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Button, Container, Marquee, cn } from '@deluxfit/ds'
import { hero, marqueeItems } from '@/content/site'
import FramedPhoto from './FramedPhoto'

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
 * Anton display set at architectural scale that bleeds toward the page edge (and
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
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_80%_5%,rgba(225,29,42,0.16),transparent_60%)]"
      />

      <Container size="xl" className="pb-16 pt-32 sm:pb-20 sm:pt-40 lg:pb-24 lg:pt-48">
        <span className="inline-flex items-center gap-2.5 text-[11px] font-700 uppercase tracking-[0.22em] text-df-accent-bright">
          <span className="h-1.5 w-1.5 rounded-df-full bg-df-accent" aria-hidden="true" />
          {hero.badge}
        </span>

        <MotionH1
          className="mt-7 font-display text-[clamp(1.75rem,9vw,9rem)] font-400 uppercase leading-[0.86] tracking-[-0.01em] text-df-text"
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

        <div className="mt-12 grid items-end gap-10 border-t border-df-border pt-10 sm:mt-16 lg:grid-cols-[1.4fr_1fr]">
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

            <div className="mt-8 flex items-center gap-3">
              <span className="h-px w-8 bg-df-accent" aria-hidden="true" />
              <span className="text-sm font-600 uppercase tracking-wide text-df-text">
                {hero.trust.clients}
              </span>
            </div>
          </div>

          <MotionDiv
            className="relative mx-auto w-full max-w-xs sm:max-w-sm lg:mx-0 lg:justify-self-end"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          >
            <FramedPhoto src="/angie-squat.png" alt={hero.imageAlt} aspect="aspect-[4/5]" />
            <div className="absolute -bottom-5 -left-3 rounded-df-md border border-df-glass-border bg-df-glass-fill px-5 py-3 backdrop-blur-xl sm:-left-5">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-[clamp(2rem,5vw,3rem)] font-400 leading-none tabular-nums text-df-text">
                  {hero.trust.rating}
                </span>
                <span className="flex" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-3.5 w-3.5 fill-df-accent text-df-accent" />
                  ))}
                </span>
              </div>
              <div className="mt-1 text-[10px] font-600 uppercase tracking-[0.2em] text-df-text-muted">
                {hero.trust.ratingLabel}
              </div>
            </div>
          </MotionDiv>
        </div>
      </Container>

      <div className="border-y border-df-border bg-df-bg-elevated py-5">
        <Marquee items={marqueeItems} />
      </div>
    </section>
  )
}

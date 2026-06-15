import { ArrowRight, Star } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Button, Marquee, cn } from '@deluxfit/ds'
import { hero, marqueeItems } from '@/content/site'

const MotionDiv = MotionDiv
const MotionH1 = motion.h1
const MotionSpan = motion.span
const MotionP = motion.p

/**
 * Hero — Cinematic #4: an anamorphic title-card opening. Full-bleed hero image
 * with a slow Ken-Burns push, fixed letterbox bars top and bottom carrying
 * scene-marker chrome and a featured-tag credit strip, vertical side rails, and
 * a center-stacked condensed display headline that reveals line by line.
 *
 * The chrome details (REEL 01 · SCENE IV, format markers, runtime) are pure
 * cinematic mise-en-scène — they evoke a trailer endplate without inventing any
 * new product claims; all real copy still routes through `site.js`.
 */
export default function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-black">
      <CinematicFrame />

      <div className="relative z-20 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-between px-5 pb-[12svh] pt-[18svh] sm:px-8 sm:pt-[20svh] lg:pt-[18svh]">
        <TitleCard />
        <BottomChrome />
      </div>

      <div className="relative z-20 border-y border-df-border bg-df-bg/85 py-5 backdrop-blur-sm">
        <Marquee items={marqueeItems} />
      </div>
    </section>
  )
}

/* -----------------------------------------------------------------------------
   Cinematic frame — Ken-Burns image, vignette, grain, letterbox bars, rails.
-------------------------------------------------------------------------------- */

function CinematicFrame() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <>
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <MotionDiv
          className="absolute inset-0 will-change-transform"
          initial={{ scale: 1.08, x: '-1%', y: '-1%' }}
          animate={
            prefersReducedMotion
              ? { scale: 1.08, x: '-1%', y: '-1%' }
              : { scale: [1.08, 1.18, 1.08], x: ['-1%', '1.5%', '-1%'], y: ['-1%', '1%', '-1%'] }
          }
          transition={{ duration: 28, ease: 'easeInOut', repeat: Infinity }}
        >
          <img
            src="/hero-placeholder.svg"
            alt={hero.imageAlt}
            className="absolute inset-0 h-full w-full object-cover object-[60%_30%]"
            loading="eager"
          />
        </MotionDiv>

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black via-black/55 to-black"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(70%_50%_at_70%_30%,rgba(225,29,42,0.28),transparent_60%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_50%,transparent_45%,rgba(0,0,0,0.85)_100%)]"
        />
        <FilmGrain />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-30 h-[12svh] bg-black sm:h-[10svh]"
      >
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-df-border-strong to-transparent" />
        <TopMarkerStrip />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[10svh] bg-black sm:h-[8svh]"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-df-border-strong to-transparent" />
      </div>

      <SideRails />
    </>
  )
}

function FilmGrain() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        backgroundSize: '160px 160px',
      }}
    />
  )
}

function TopMarkerStrip() {
  return (
    <div className="flex h-full items-end justify-between gap-4 px-5 pb-2 font-display text-[10px] font-500 uppercase tracking-[0.32em] text-white/55 sm:px-8 sm:text-[11px]">
      <div className="flex items-center gap-3">
        <span className="inline-block h-2 w-2 animate-df-glow-pulse rounded-df-full bg-df-accent" />
        <span>REC · REEL 01</span>
        <span className="hidden text-white/25 sm:inline">|</span>
        <span className="hidden sm:inline">Scene IV</span>
      </div>

      <div className="hidden text-white/75 md:block">
        DeluxFit Presents — Summer 2026
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:inline">2.39 : 1</span>
        <span className="hidden text-white/25 sm:inline">|</span>
        <span>24 FPS</span>
        <span className="hidden text-white/25 md:inline">|</span>
        <span className="hidden md:inline">DIR. ANGIE</span>
      </div>
    </div>
  )
}

function SideRails() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[12svh] left-3 top-[14svh] z-20 hidden items-center lg:flex"
      >
        <span className="origin-center -rotate-90 whitespace-nowrap font-display text-[10px] font-500 uppercase tracking-[0.45em] text-white/35">
          DeluxFit — A Transformation in Twelve Weeks
        </span>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[12svh] right-3 top-[14svh] z-20 hidden items-center lg:flex"
      >
        <span className="origin-center rotate-90 whitespace-nowrap font-display text-[10px] font-500 uppercase tracking-[0.45em] text-white/35">
          Now Coaching · Summer 2026
        </span>
      </div>
    </>
  )
}

/* -----------------------------------------------------------------------------
   Title card — eyebrow, line-staggered headline, subhead, CTAs, trust strip.
-------------------------------------------------------------------------------- */

const HEADLINE_LINE = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

const HEADLINE_STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.25 } },
}

function TitleCard() {
  const prefersReducedMotion = useReducedMotion()
  const lastIndex = hero.headline.length - 1

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
      <CinematicEyebrow>Now Showing</CinematicEyebrow>

      <motion.h1
        className="mt-7 font-display text-[3.25rem] font-700 uppercase leading-[0.9] tracking-[-0.01em] text-df-text sm:text-7xl md:text-8xl lg:text-[7.5rem]"
        style={{ textShadow: '0 6px 40px rgba(0,0,0,0.6)' }}
        variants={HEADLINE_STAGGER}
        initial={prefersReducedMotion ? false : 'hidden'}
        animate={prefersReducedMotion ? undefined : 'visible'}
      >
        {hero.headline.map((line, index) => (
          <motion.span
            key={line}
            className={cn(
              'block',
              index === lastIndex && 'italic text-df-accent-bright'
            )}
            variants={HEADLINE_LINE}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            {line}
          </motion.span>
        ))}
      </motion.h1>

      <motion.p
        className="mt-8 max-w-2xl text-base leading-relaxed text-df-text-muted sm:text-lg"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.95 }}
      >
        {hero.subhead}
      </motion.p>

      <MotionDiv
        className="mt-10 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 1.15 }}
      >
        <Button asChild size="lg" className="w-full sm:w-auto">
          <a href="#pricing">
            {hero.primaryCta}
            <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
        <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
          <a href="#results">{hero.secondaryCta}</a>
        </Button>
      </MotionDiv>

      <MotionDiv
        className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-6"
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <div className="flex items-center gap-2">
          <div className="flex" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-4 w-4 fill-df-accent text-df-accent" />
            ))}
          </div>
          <span className="text-sm font-600 text-df-text">
            {hero.trust.rating}
            <span className="ml-1.5 font-400 text-df-text-faint">
              {hero.trust.ratingLabel}
            </span>
          </span>
        </div>
        <span className="hidden h-4 w-px bg-df-border-strong sm:block" aria-hidden="true" />
        <span className="text-sm font-600 text-df-text">{hero.trust.clients}</span>
      </MotionDiv>
    </div>
  )
}

function CinematicEyebrow({ children }) {
  return (
    <span className="inline-flex items-center gap-3 font-display text-[11px] font-600 uppercase tracking-[0.4em] text-df-accent-bright">
      <span className="h-px w-10 bg-df-accent" aria-hidden="true" />
      <span className="inline-flex items-center gap-2">
        <span aria-hidden="true">[</span>
        {children}
        <span aria-hidden="true">]</span>
      </span>
      <span className="h-px w-10 bg-df-accent" aria-hidden="true" />
    </span>
  )
}

/* -----------------------------------------------------------------------------
   Bottom chrome — cinema-credit row with the live badge and runtime spec.
-------------------------------------------------------------------------------- */

function BottomChrome() {
  return (
    <div className="mt-12 flex flex-col items-center gap-3 font-display text-[10px] font-500 uppercase tracking-[0.32em] text-white/55 sm:flex-row sm:justify-between sm:text-[11px]">
      <div className="flex items-center gap-3">
        <span className="inline-block h-1.5 w-1.5 rounded-df-full bg-df-accent-bright" />
        <span>{hero.badge}</span>
      </div>
      <div className="hidden items-center gap-3 sm:flex">
        <span>Runtime — 12 Weeks</span>
        <span className="text-white/25">|</span>
        <span>Rated R for Results</span>
      </div>
    </div>
  )
}

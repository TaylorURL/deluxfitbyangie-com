import { ArrowRight, Star } from 'lucide-react'
import { Badge, Button, Container, Marquee, Reveal } from '@deluxfit/ds'
import { hero, marqueeItems } from '@/content/site'

/**
 * Hero — the funnel's opening promise: an aggressive transformation headline,
 * dual CTAs (to pricing and to results), a trust strip, and a styled image
 * block that references a swappable `/public` placeholder.
 */
export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 sm:pt-36">
      {/* Ambient red glow behind the hero — pure decoration. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_70%_0%,rgba(225,29,42,0.22),transparent_70%)]"
      />

      <Container size="xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-10">
          <Reveal className="flex flex-col items-start">
            <Badge tone="accent" variant="soft" size="lg">
              {hero.badge}
            </Badge>

            <h1 className="mt-6 font-display text-5xl font-700 uppercase leading-[0.95] tracking-tight text-df-text sm:text-6xl lg:text-7xl">
              {hero.headline.map((line, index) => (
                <span key={line} className="block">
                  {index === hero.headline.length - 1 ? (
                    <span className="text-df-accent-bright">{line}</span>
                  ) : (
                    line
                  )}
                </span>
              ))}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-df-text-muted">
              {hero.subhead}
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg">
                <a href="#pricing">
                  {hero.primaryCta}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <a href="#results">{hero.secondaryCta}</a>
              </Button>
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
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
            </div>
          </Reveal>

          <Reveal delay={0.15} className="relative">
            <HeroVisual />
          </Reveal>
        </div>
      </Container>

      <div className="mt-16 border-y border-df-border py-5 sm:mt-24">
        <Marquee items={marqueeItems} />
      </div>
    </section>
  )
}

/**
 * HeroVisual — a styled placeholder image frame. The <img> references a
 * `/public` SVG so Angie can drop in a real photo of the same name; the gradient
 * frame + glow keep it on-brand until then.
 */
function HeroVisual() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 -z-10 rounded-df-2xl bg-df-accent/20 blur-3xl" aria-hidden="true" />
      <div className="overflow-hidden rounded-df-2xl border border-df-border-strong bg-df-surface shadow-df-xl">
        <div className="relative aspect-[4/5] w-full bg-gradient-to-br from-df-surface-2 via-df-surface to-black">
          <img
            src="/hero-placeholder.svg"
            alt={hero.imageAlt}
            className="h-full w-full object-cover"
            loading="eager"
          />
        </div>
      </div>

      {/* Floating proof chip overlapping the frame for depth. */}
      <div className="absolute -bottom-5 -left-5 hidden rounded-df-lg border border-df-border-strong bg-df-bg-elevated px-5 py-3 shadow-df-lg sm:block">
        <div className="font-display text-3xl font-700 leading-none text-df-accent-bright">28 lbs</div>
        <div className="mt-1 text-xs font-500 uppercase tracking-wider text-df-text-muted">
          Avg. loss in 12 weeks
        </div>
      </div>
    </div>
  )
}

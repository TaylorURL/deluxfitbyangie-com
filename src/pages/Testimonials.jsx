import { ArrowRight, Info, Quote } from 'lucide-react'
import {
  Button,
  Container,
  Marquee,
  Reveal,
  Section,
  SplitHeading,
  Testimonial,
} from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { Link } from '@/router'
import PageHero from '@/components/PageHero'
import PhotoBand from '@/components/PhotoBand'
import AnimatedBackdrop from '@/components/AnimatedBackdrop'

export default function Testimonials() {
  const { testimonials } = useContent()

  return (
    <>
      <PageHero
        eyebrow={testimonials.hero.eyebrow}
        heading={testimonials.hero.heading}
        accent={testimonials.hero.accent}
        subhead={testimonials.hero.subhead}
      />

      <PhotoBand
        src="/brand/studio-red-mat-seated.webp"
        alt="Angie seated on a crimson studio mat in the DeluxFit studio"
        objectPosition="object-[55%_35%]"
      />

      <Container size="lg">
        <Reveal>
          <div className="flex items-start gap-3 rounded-df-md border border-df-border bg-df-surface-2 px-4 py-4">
            <Info className="mt-1 h-4 w-4 shrink-0 text-df-accent-bright" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-df-text-muted">{testimonials.storiesNote}</p>
          </div>
        </Reveal>
      </Container>

      <div className="mt-12 border-y border-df-border bg-df-bg-elevated py-5 sm:mt-16">
        <Marquee items={testimonials.marquee} />
      </div>

      <Section heading={testimonials.storiesHeading} accent={testimonials.storiesAccent}>
        {testimonials.items?.length ? (
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
            {testimonials.items.map(({ metric, quote, name, result, rating }, index) => (
              <Reveal key={`${name}-${index}`} delay={index * 0.06}>
                <Testimonial
                  metric={metric}
                  quote={quote}
                  name={name}
                  result={result}
                  rating={rating}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="flex flex-col items-start gap-4 rounded-df-lg border border-df-border-strong bg-df-surface-2 px-6 py-8 sm:px-8 sm:py-12">
              <Quote className="h-6 w-6 text-df-accent-bright" aria-hidden="true" />
              <h3 className="font-400 font-display text-2xl uppercase leading-tight sm:text-3xl">
                {testimonials.storiesEmpty.heading}
              </h3>
              <p className="max-w-xl text-sm leading-relaxed text-df-text-muted sm:text-base">
                {testimonials.storiesEmpty.body}
              </p>
              <Button asChild className="mt-2">
                <Link href={testimonials.storiesEmpty.ctaHref}>
                  {testimonials.storiesEmpty.ctaLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </Reveal>
        )}
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
              text={testimonials.cta.heading}
              accent={testimonials.cta.accent}
              className="mt-5 max-w-[20ch] sm:mt-6"
            />
            <p className="mt-5 max-w-xl text-base leading-relaxed text-df-text-muted sm:mt-6 sm:text-lg">
              {testimonials.cta.subhead}
            </p>
            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href={testimonials.cta.primary.href}>
                  {testimonials.cta.primary.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                <Link href={testimonials.cta.secondary.href}>
                  {testimonials.cta.secondary.label}
                </Link>
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}

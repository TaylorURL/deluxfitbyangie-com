import { ArrowRight, Info } from 'lucide-react'
import {
  Button,
  Container,
  Reveal,
  Section,
  SectionEyebrow,
  SectionIndex,
  SplitHeading,
  Testimonial,
} from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { Link } from '@/router'
import PageHero from '@/components/PageHero'
import PhotoBand from '@/components/PhotoBand'
import PhotoPlaceholder from '@/components/PhotoPlaceholder'

/**
 * Testimonials — client success stories and before/after photos. Real client
 * content lands here as Angie's clients complete their programs. Until then
 * every card is a clearly-labelled placeholder so the page never implies
 * results that haven't happened yet.
 */
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
        src="/brand/studio-red-mat-seated.jpg"
        alt="Angie seated on a crimson studio mat — the DeluxFit aesthetic"
        objectPosition="object-[55%_35%]"
      />

      <Container size="lg">
        <Reveal>
          <div className="flex items-start gap-3 rounded-df-md border border-df-border bg-df-surface-2/60 px-4 py-3.5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-df-accent-bright" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-df-text-muted">
              {testimonials.placeholderNote}
            </p>
          </div>
        </Reveal>
      </Container>

      <Section
        index="01"
        eyebrow="Client stories"
        heading="What clients will say."
        accent="will say"
      >
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
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
      </Section>

      <Section
        index="02"
        eyebrow={testimonials.galleryEyebrow}
        heading={testimonials.galleryHeading}
        accent={testimonials.galleryAccent}
      >
        <Reveal>
          <p className="text-[11px] font-700 uppercase tracking-[0.22em] text-df-text-faint">
            {testimonials.galleryNote}
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.gallery.map(({ label, alt }, index) => (
              <PhotoPlaceholder
                key={`${label}-${index}`}
                label={label}
                alt={alt}
                aspect="aspect-[4/3]"
              />
            ))}
          </div>
        </Reveal>
      </Section>

      <section className="relative overflow-hidden border-y border-df-border bg-df-bg-elevated py-20 sm:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_120%,rgba(225,29,42,0.22),transparent_70%)]"
        />
        <Container size="lg">
          <Reveal className="flex flex-col items-start">
            <div className="flex items-center gap-4">
              <SectionIndex>03</SectionIndex>
              <SectionEyebrow>{testimonials.hero.eyebrow}</SectionEyebrow>
            </div>
            <SplitHeading
              text={testimonials.cta.heading}
              accent={testimonials.cta.accent}
              className="mt-6 max-w-[20ch] text-[clamp(2rem,5vw,3.75rem)] leading-[0.95]"
            />
            <p className="mt-6 max-w-xl text-base leading-relaxed text-df-text-muted sm:text-lg">
              {testimonials.cta.subhead}
            </p>
            <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href={testimonials.cta.primary.href}>
                  {testimonials.cta.primary.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                <Link href={testimonials.cta.secondary.href}>{testimonials.cta.secondary.label}</Link>
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}

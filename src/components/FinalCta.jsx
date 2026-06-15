import { ArrowRight } from 'lucide-react'
import { Button, Container, Reveal, SectionEyebrow } from '@deluxfit/ds'
import { finalCta } from '@/content/site'

/**
 * Final CTA — a full-bleed red/black band that repeats the offer and drives the
 * last conversion. Primary CTA opens pricing; secondary links to the FAQ.
 */
export default function FinalCta() {
  return (
    <section className="relative overflow-hidden border-y border-df-border bg-df-bg-elevated py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_120%,rgba(225,29,42,0.28),transparent_70%)]"
      />
      <Container size="md">
        <Reveal className="flex flex-col items-center text-center">
          <SectionEyebrow>{finalCta.eyebrow}</SectionEyebrow>
          <h2 className="mt-5 font-display text-4xl font-700 uppercase leading-[1] tracking-tight text-df-text sm:text-5xl md:text-6xl">
            {finalCta.heading}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-df-text-muted sm:text-lg">
            {finalCta.subhead}
          </p>
          <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <a href="#pricing">
                {finalCta.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href="#faq">{finalCta.secondaryCta}</a>
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

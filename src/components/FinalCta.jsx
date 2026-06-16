import { ArrowRight } from 'lucide-react'
import { Button, Container, Reveal, SectionEyebrow, SectionIndex, SplitHeading } from '@deluxfit/ds'
import { finalCta } from '@/content/site'

/**
 * Final CTA — the closing statement at full type-specimen scale. The headline
 * bleeds across the band (clipped, never scrolled) with its last phrase in
 * couture italic; the primary CTA opens pricing, the secondary links to the FAQ.
 */
export default function FinalCta() {
  return (
    <section className="relative overflow-hidden border-y border-df-border bg-df-bg-elevated py-28 sm:py-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_120%,rgba(225,29,42,0.26),transparent_70%)]"
      />
      <Container size="lg">
        <Reveal className="flex flex-col items-start">
          <div className="flex items-center gap-4">
            <SectionIndex>09</SectionIndex>
            <SectionEyebrow>{finalCta.eyebrow}</SectionEyebrow>
          </div>
          <SplitHeading
            text={finalCta.heading}
            accent={finalCta.accent}
            className="mt-6 max-w-[16ch] text-[clamp(2.5rem,8vw,7rem)] leading-[0.88]"
          />
          <p className="mt-7 max-w-xl text-base leading-relaxed text-df-text-muted sm:text-lg">
            {finalCta.subhead}
          </p>
          <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href="#pricing">
                {finalCta.primaryCta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
              <a href="#faq">{finalCta.secondaryCta}</a>
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

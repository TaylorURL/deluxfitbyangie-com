import { Button, Container, Reveal, SectionEyebrow, SectionIndex, SplitHeading } from '@deluxfit/ds'
import { useContent } from '@/i18n'

/**
 * Guarantee / risk-reversal band — a crimson-glow surface that removes the last
 * objection before pricing. The "14" is rendered as a hero numeral so the
 * promise reads instantly; the CTA scrolls to pricing.
 */
export default function Guarantee() {
  const { guarantee } = useContent()
  const { icon: Icon } = guarantee

  return (
    <section className="overflow-hidden py-16 sm:py-24">
      <Container size="lg">
        <Reveal>
          <div className="relative overflow-hidden rounded-df-2xl border border-df-accent bg-df-surface px-6 py-12 shadow-df-glow-soft sm:px-12 sm:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_90%_at_15%_0%,rgba(225,29,42,0.22),transparent_70%)]"
            />
            <div className="relative grid items-center gap-10 lg:grid-cols-[auto_1fr] lg:gap-16">
              <div className="flex items-center gap-5 lg:flex-col lg:items-start lg:gap-3">
                <span
                  className="font-display text-[clamp(5rem,16vw,11rem)] font-400 leading-[0.78] tabular-nums text-df-accent-bright"
                  aria-hidden="true"
                >
                  14
                </span>
                <span className="flex items-center gap-2 text-xs font-700 uppercase tracking-[0.22em] text-df-text-muted">
                  <Icon className="h-4 w-4 text-df-accent-bright" strokeWidth={2} aria-hidden="true" />
                  {guarantee.dayBadge}
                </span>
              </div>

              <div className="flex flex-col items-start">
                <div className="flex items-center gap-4">
                  <SectionIndex>06</SectionIndex>
                  <SectionEyebrow>{guarantee.eyebrow}</SectionEyebrow>
                </div>
                <SplitHeading
                  text={guarantee.heading}
                  accent={guarantee.accent}
                  className="mt-5 text-[clamp(1.9rem,4.5vw,3.25rem)] leading-[0.95]"
                />
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-df-text-muted sm:text-lg">
                  {guarantee.body}
                </p>
                <Button asChild size="lg" className="mt-8">
                  <a href="#pricing">{guarantee.cta}</a>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

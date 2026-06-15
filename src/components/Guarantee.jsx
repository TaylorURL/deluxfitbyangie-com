import { Button, Container, Reveal, SectionEyebrow } from '@deluxfit/ds'
import { guarantee } from '@/content/site'

/**
 * Guarantee / risk-reversal band — a full-width red-glow surface that removes
 * the prospect's last objection before pricing converts. CTA scrolls to pricing.
 */
export default function Guarantee() {
  const { icon: Icon } = guarantee

  return (
    <section className="py-12 sm:py-16">
      <Container size="lg">
        <Reveal>
          <div className="relative overflow-hidden rounded-df-2xl border border-df-accent bg-df-surface px-6 py-12 text-center shadow-df-glow-soft sm:px-12 sm:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,rgba(225,29,42,0.22),transparent_70%)]"
            />
            <div className="relative mx-auto flex max-w-2xl flex-col items-center">
              <span
                className="flex h-14 w-14 items-center justify-center rounded-df-full bg-df-accent-soft text-df-accent-bright"
                aria-hidden="true"
              >
                <Icon className="h-7 w-7" strokeWidth={2} />
              </span>
              <SectionEyebrow className="mt-5">{guarantee.eyebrow}</SectionEyebrow>
              <h2 className="mt-4 font-display text-3xl font-700 uppercase leading-[1.05] tracking-tight text-df-text sm:text-4xl">
                {guarantee.heading}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-df-text-muted sm:text-lg">
                {guarantee.body}
              </p>
              <Button asChild size="lg" className="mt-8">
                <a href="#pricing">{guarantee.cta}</a>
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

import { X } from 'lucide-react'
import { Card, Reveal, Section } from '@deluxfit/ds'
import { pain } from '@/content/site'

/**
 * Pain / Agitation — names the frustrations the prospect arrives with so they
 * feel understood before the offer is made. Each "Tired of…" point is a card in
 * a responsive grid with a red dismissive icon.
 */
export default function Pain() {
  return (
    <Section id="pain" eyebrow={pain.eyebrow} heading={pain.heading} subhead={pain.subhead}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pain.points.map((point, index) => (
          <Reveal key={point} delay={index * 0.06}>
            <Card variant="surface" className="flex h-full items-start gap-4">
              <span
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-df-full bg-df-accent-soft text-df-accent-bright"
                aria-hidden="true"
              >
                <X className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <p className="text-[15px] leading-relaxed text-df-text-muted">{point}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

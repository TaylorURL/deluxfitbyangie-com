import { Card, Reveal, Section } from '@deluxfit/ds'
import { benefits } from '@/content/site'

/**
 * Benefits / What You Get — the offer reframed as one complete coaching system.
 * Each capability is a card carrying an oversized ghosted index numeral as type
 * furniture, a crimson icon, and a condensed display title.
 */
export default function Benefits() {
  return (
    <Section
      id="benefits"
      index="02"
      eyebrow={benefits.eyebrow}
      heading={benefits.heading}
      accent={benefits.accent}
      subhead={benefits.subhead}
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.items.map(({ icon: Icon, title, description }, index) => (
          <Reveal key={title} delay={index * 0.05}>
            <Card variant="surface" interactive className="relative flex h-full flex-col overflow-hidden">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-2 font-display text-6xl font-400 leading-none tabular-nums text-df-surface-3"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <span
                className="flex h-12 w-12 items-center justify-center rounded-df-lg bg-df-accent-soft text-df-accent-bright"
                aria-hidden="true"
              >
                <Icon className="h-6 w-6" strokeWidth={2} />
              </span>
              <h3 className="mt-6 font-display text-2xl font-400 uppercase tracking-[0.01em] text-df-text">
                {title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-df-text-muted">{description}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

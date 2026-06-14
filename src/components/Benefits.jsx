import { Card, Reveal, Section } from '@deluxfit/ds'
import { benefits } from '@/content/site'

/**
 * Transformation / What You Get — a benefit grid that reframes the offer as a
 * complete coaching system. Each item pairs a lucide icon with a title and
 * supporting copy pulled from site content.
 */
export default function Benefits() {
  return (
    <Section
      id="benefits"
      eyebrow={benefits.eyebrow}
      heading={benefits.heading}
      subhead={benefits.subhead}
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.items.map(({ icon: Icon, title, description }, index) => (
          <Reveal key={title} delay={index * 0.06}>
            <Card variant="elevated" interactive className="flex h-full flex-col">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-df-lg bg-df-accent-soft text-df-accent-bright"
                aria-hidden="true"
              >
                <Icon className="h-6 w-6" strokeWidth={2} />
              </span>
              <h3 className="mt-5 font-display text-xl font-600 uppercase tracking-wide text-df-text">
                {title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-df-text-muted">{description}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

import { Reveal, Section } from '@deluxfit/ds'
import { useContent } from '@/i18n'

/**
 * Pain / Agitation — names the frustrations the prospect arrives with as a
 * numbered editorial list. Oversized crimson indices carry the rhythm; the air
 * around each line keeps the section confident rather than crowded.
 */
export default function Pain() {
  const { pain } = useContent()
  return (
    <Section
      id="pain"
      index="01"
      eyebrow={pain.eyebrow}
      heading={pain.heading}
      accent={pain.accent}
      subhead={pain.subhead}
    >
      <ol className="grid gap-x-12 sm:grid-cols-2">
        {pain.points.map((point, index) => (
          <Reveal key={point} delay={index * 0.05} as="li">
            <div className="flex items-baseline gap-5 border-t border-df-border py-6">
              <span
                aria-hidden="true"
                className="font-display text-2xl font-400 leading-none tabular-nums text-df-accent-bright"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="text-[15px] leading-relaxed text-df-text-muted sm:text-base">{point}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}

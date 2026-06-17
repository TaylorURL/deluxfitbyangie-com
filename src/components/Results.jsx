import { Card, Reveal, Section } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import PhotoPlaceholder from './PhotoPlaceholder'

/**
 * Results / Social Proof — a pillars strip naming what every DeluxFit
 * transformation is built around, followed by a before/after placeholder gallery
 * with an honest "real photos coming soon" note. Real client testimonials will
 * land here once Angie collects them; until then the section avoids inventing
 * quotes, names, or metrics. Anchored at #results for the hero's "See Results"
 * CTA and the header nav.
 */
export default function Results() {
  const { results } = useContent()
  return (
    <Section
      id="results"
      index="04"
      eyebrow={results.eyebrow}
      heading={results.heading}
      accent={results.accent}
      subhead={results.subhead}
    >
      <div className="grid gap-5 sm:grid-cols-3">
        {results.pillars.map(({ title, description }, index) => (
          <Reveal key={title} delay={index * 0.06}>
            <Card variant="surface" className="relative flex h-full flex-col overflow-hidden">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-2 font-display text-6xl font-400 leading-none tabular-nums text-df-surface-3"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-2 font-display text-2xl font-400 uppercase tracking-[0.01em] text-df-text">
                {title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-df-text-muted">{description}</p>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <p className="mt-16 text-[11px] font-700 uppercase tracking-[0.22em] text-df-text-faint">
          {results.galleryNote}
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          {results.gallery.map(({ label, alt }, index) => (
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
  )
}

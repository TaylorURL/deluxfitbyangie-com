import { Reveal, Section, Testimonial } from '@deluxfit/ds'
import { results } from '@/content/site'
import PhotoPlaceholder from './PhotoPlaceholder'

/**
 * Results / Social Proof — client pull-quotes led by oversized result metrics,
 * followed by a before/after placeholder gallery. Anchored at #results for the
 * hero's "See Results" CTA and the header nav.
 */
export default function Results() {
  return (
    <Section
      id="results"
      index="04"
      eyebrow={results.eyebrow}
      heading={results.heading}
      accent={results.accent}
      subhead={results.subhead}
    >
      <div className="grid gap-5 md:grid-cols-2">
        {results.testimonials.map((testimonial, index) => (
          <Reveal key={testimonial.name} delay={index * 0.06}>
            <Testimonial {...testimonial} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          {results.gallery.map(({ label, alt }) => (
            <PhotoPlaceholder key={label} label={label} alt={alt} aspect="aspect-[4/3]" />
          ))}
        </div>
      </Reveal>
    </Section>
  )
}

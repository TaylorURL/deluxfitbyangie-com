import { Reveal, Section, Testimonial } from '@deluxfit/ds'
import { results } from '@/content/site'
import PhotoPlaceholder from './PhotoPlaceholder'

/**
 * Results / Social Proof — testimonial cards plus a before/after placeholder
 * gallery. Anchored at #results for the hero's "See Results" CTA and header nav.
 */
export default function Results() {
  return (
    <Section
      id="results"
      eyebrow={results.eyebrow}
      heading={results.heading}
      subhead={results.subhead}
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {results.testimonials.map((testimonial, index) => (
          <Reveal key={testimonial.name} delay={index * 0.06}>
            <Testimonial {...testimonial} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-10 grid gap-5 sm:grid-cols-3 sm:mt-14">
          {results.gallery.map(({ label, alt }) => (
            <PhotoPlaceholder key={label} label={label} alt={alt} aspect="aspect-[4/3]" />
          ))}
        </div>
      </Reveal>
    </Section>
  )
}

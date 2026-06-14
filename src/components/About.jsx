import { Check } from 'lucide-react'
import { Container, Reveal, SectionEyebrow } from '@deluxfit/ds'
import { about } from '@/content/site'
import PhotoPlaceholder from './PhotoPlaceholder'

/**
 * About Angie — founder bio, credentials, and a photo placeholder. A two-column
 * layout puts the human behind the program directly before the FAQ.
 */
export default function About() {
  return (
    <section id="about" className="py-20 sm:py-28">
      <Container size="lg">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative order-last lg:order-first">
            <div
              aria-hidden="true"
              className="absolute -inset-4 -z-10 rounded-df-2xl bg-df-accent/15 blur-3xl"
            />
            <PhotoPlaceholder
              label={`${about.name} · Coach`}
              alt={about.imageAlt}
              aspect="aspect-[4/5]"
            />
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col items-start">
            <SectionEyebrow>{about.eyebrow}</SectionEyebrow>
            <h2 className="mt-4 font-display text-3xl font-700 uppercase leading-[1.05] tracking-tight text-df-text sm:text-4xl">
              {about.heading}
            </h2>
            <div className="mt-5 flex flex-col gap-4">
              {about.bio.map(paragraph => (
                <p key={paragraph} className="text-base leading-relaxed text-df-text-muted">
                  {paragraph}
                </p>
              ))}
            </div>

            <ul className="mt-7 grid w-full gap-3 sm:grid-cols-2">
              {about.credentials.map(credential => (
                <li key={credential} className="flex items-start gap-3 text-sm text-df-text">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-df-full bg-df-accent-soft text-df-accent-bright"
                    aria-hidden="true"
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span>{credential}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

import { Check } from 'lucide-react'
import { Container, Reveal, SectionEyebrow, SectionIndex, SplitHeading } from '@deluxfit/ds'
import { about } from '@/content/site'
import PhotoPlaceholder from './PhotoPlaceholder'

/**
 * About Angie — the founder editorial. A framed portrait sits opposite a large
 * display heading (with the closing phrase in couture italic), the bio, and a
 * credential grid — the human proof directly before the FAQ.
 */
export default function About() {
  return (
    <section id="about" className="overflow-hidden py-24 sm:py-36">
      <Container size="lg">
        <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal className="relative order-last lg:order-first">
            <div
              aria-hidden="true"
              className="absolute -inset-4 -z-10 rounded-df-2xl bg-df-accent/10 blur-3xl"
            />
            <PhotoPlaceholder
              label={`${about.name} · Coach`}
              alt={about.imageAlt}
              aspect="aspect-[4/5]"
            />
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col items-start">
            <div className="flex items-center gap-4">
              <SectionIndex>07</SectionIndex>
              <SectionEyebrow>{about.eyebrow}</SectionEyebrow>
            </div>
            <SplitHeading
              text={about.heading}
              accent={about.accent}
              className="mt-5 text-[clamp(2rem,4.5vw,3.5rem)] leading-[0.95]"
            />
            <div className="mt-6 flex flex-col gap-4">
              {about.bio.map(paragraph => (
                <p key={paragraph} className="text-base leading-relaxed text-df-text-muted">
                  {paragraph}
                </p>
              ))}
            </div>

            <ul className="mt-8 grid w-full gap-x-8 sm:grid-cols-2">
              {about.credentials.map(credential => (
                <li
                  key={credential}
                  className="flex items-start gap-3 border-t border-df-border py-4 text-sm text-df-text"
                >
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

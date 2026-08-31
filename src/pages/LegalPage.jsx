import { ArrowRight } from 'lucide-react'
import { Button, Container, Reveal, Section } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { Link } from '@/router'
import PageHero from '@/components/PageHero'

/**
 * Renders the privacy policy and the terms of service. Both are a heading, a
 * standfirst, and a run of headed prose, so one component draws whichever
 * document its route hands it.
 *
 * @param {object} props
 * @param {'privacy'|'terms'} props.document - which document under `legal`
 */
export default function LegalPage({ document }) {
  const { legal, contact } = useContent()
  const doc = legal[document]

  return (
    <>
      <PageHero
        eyebrow={doc.eyebrow}
        heading={doc.heading}
        accent={doc.accent}
        subhead={doc.subhead}
      />

      <Section index="01" eyebrow={doc.eyebrow} heading={doc.heading} accent={doc.accent}>
        <div className="flex flex-col gap-10 sm:gap-12">
          {doc.sections.map(({ heading, body }, index) => (
            <Reveal key={heading} delay={index * 0.04}>
              <section className="max-w-[70ch]">
                <h3 className="font-400 font-display text-2xl uppercase tracking-[0.01em] text-df-text sm:text-3xl">
                  {heading}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-df-text-muted sm:text-base">
                  {body}
                </p>
              </section>
            </Reveal>
          ))}
        </div>
      </Section>

      <Container size="lg" className="flex flex-col gap-6 pb-16 sm:pb-20">
        <p className="text-[11px] font-700 uppercase tracking-[0.22em] text-df-text-faint">
          {legal.lastUpdatedLabel}: {legal.lastUpdated}
        </p>
        <Button asChild variant="secondary" className="w-full sm:w-auto sm:self-start">
          <Link href="/contact">
            {contact.hero.eyebrow}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </Container>
    </>
  )
}

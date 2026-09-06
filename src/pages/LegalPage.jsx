import { ArrowRight } from 'lucide-react'
import { Button, Container, MicroLabel, Reveal, Section, SplitHeading } from '@deluxfit/ds'
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
  const { legal } = useContent()
  const doc = legal[document]

  return (
    <>
      <PageHero
        eyebrow={doc.eyebrow}
        heading={doc.heading}
        accent={doc.accent}
        subhead={doc.subhead}
      />

      {/* No heading of its own: the hero above already states the document's
          title, and repeating it puts the same sentence in the h1 and the h2
          under it. */}
      <Section>
        <div className="flex flex-col gap-10 sm:gap-12">
          {doc.sections.map(({ heading, body }, index) => (
            <Reveal key={heading} delay={index * 0.04}>
              <section className="max-w-[70ch]">
                <SplitHeading size="sub" text={heading} />
                <p className="mt-4 text-sm leading-relaxed text-df-text-muted sm:text-base">
                  {body}
                </p>
              </section>
            </Reveal>
          ))}
        </div>
      </Section>

      <Container size="lg" className="flex flex-col gap-6 pb-16 sm:pb-20">
        <MicroLabel tone="faint">
          {legal.lastUpdatedLabel}: {legal.lastUpdated}
        </MicroLabel>
        <Button asChild variant="secondary" className="w-full sm:w-auto sm:self-start">
          <Link href="/contact">
            {legal.contactCta}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </Container>
    </>
  )
}

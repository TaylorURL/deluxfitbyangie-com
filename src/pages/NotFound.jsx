import { ArrowLeft } from 'lucide-react'
import { Button, Container, Reveal, SectionEyebrow, SplitHeading } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { Link } from '@/router'
import AnimatedBackdrop from '@/components/AnimatedBackdrop'
import { DecryptedText } from '@/components/reactbits'

export default function NotFound() {
  const { notFound } = useContent()

  return (
    <section className="relative isolate overflow-hidden bg-df-bg py-20 sm:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_-10%,var(--df-accent-wash-strong),transparent_65%)]"
      />
      <AnimatedBackdrop variant="aurora" opacity={0.4} />
      <Container size="md">
        <Reveal className="flex flex-col items-start">
          <SectionEyebrow>
            <DecryptedText
              text={notFound.eyebrow}
              animateOn="view"
              sequential
              revealDirection="start"
              speed={40}
              useOriginalCharsOnly
            />
          </SectionEyebrow>
          <SplitHeading
            as="h1"
            size="page"
            text={notFound.heading}
            accent={notFound.accent}
            className="mt-6"
          />
          <p className="mt-6 max-w-xl text-base leading-relaxed text-df-text-muted sm:text-lg">
            {notFound.body}
          </p>
          <Button asChild size="lg" className="mt-10">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {notFound.cta}
            </Link>
          </Button>
        </Reveal>
      </Container>
    </section>
  )
}

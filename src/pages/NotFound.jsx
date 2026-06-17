import { ArrowLeft } from 'lucide-react'
import { Button, Container, Reveal, SectionEyebrow, SplitHeading } from '@deluxfit/ds'
import { Link } from '@/router'

/**
 * NotFound — branded 404 view rendered when the SPA router can't match the
 * current pathname.
 */
export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden bg-df-bg py-32 sm:py-44">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_-10%,rgba(225,29,42,0.22),transparent_65%)]"
      />
      <Container size="md">
        <Reveal className="flex flex-col items-start">
          <SectionEyebrow>404</SectionEyebrow>
          <SplitHeading
            text="Page not found."
            accent="not found"
            className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.92]"
          />
          <p className="mt-6 max-w-xl text-base leading-relaxed text-df-text-muted sm:text-lg">
            The page you’re looking for doesn’t exist. Head back to the home page and try the
            navigation from there.
          </p>
          <Button asChild size="lg" className="mt-10">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to home
            </Link>
          </Button>
        </Reveal>
      </Container>
    </section>
  )
}

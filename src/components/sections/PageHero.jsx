import { ArrowRight } from 'lucide-react'
import { Button, Container, SectionEyebrow, SplitHeading } from '@deluxfit/ds'
import { Link } from '@/router'
import AnimatedBackdrop from '@/components/effects/AnimatedBackdrop'

/**
 * @param {object} props
 * @param {string} props.eyebrow
 * @param {string} props.heading - the page's h1; every route that renders this
 *   takes its top-level subject from it, so there is exactly one per page
 * @param {string} [props.accent]
 * @param {string} [props.subhead]
 * @param {{ label: string, href: string }} [props.primary]
 * @param {{ label: string, href: string }} [props.secondary]
 * @param {React.ReactNode} [props.aside] - optional decoration to the right
 */
export default function PageHero({ eyebrow, heading, accent, subhead, primary, secondary, aside }) {
  const hasAside = Boolean(aside)
  return (
    <section className="relative isolate overflow-hidden bg-df-bg pb-12 pt-[calc(var(--df-header-height)+1.5rem)] sm:pb-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_85%_5%,var(--df-accent-wash-soft),transparent_60%)]"
      />
      <AnimatedBackdrop variant="aurora" opacity={0.4} />
      <Container size="lg">
        <div
          className={
            hasAside
              ? 'grid items-end gap-10 sm:gap-12 lg:grid-cols-[1.35fr_1fr]'
              : 'flex flex-col items-start'
          }
        >
          <div className="flex max-w-3xl animate-df-rise flex-col items-start motion-reduce:animate-none">
            {eyebrow && <SectionEyebrow>{eyebrow}</SectionEyebrow>}
            {heading && (
              <SplitHeading
                as="h1"
                size="page"
                text={heading}
                accent={accent}
                className="mt-5 max-w-[17ch] sm:mt-6"
              />
            )}
            {subhead && (
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-df-text-muted sm:text-lg">
                {subhead}
              </p>
            )}
            {(primary || secondary) && (
              <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                {primary && (
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link href={primary.href}>
                      {primary.label}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                )}
                {secondary && (
                  <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                    <Link href={secondary.href}>{secondary.label}</Link>
                  </Button>
                )}
              </div>
            )}
          </div>

          {hasAside && (
            <div className="mx-auto w-full max-w-sm animate-df-rise [animation-delay:150ms] motion-reduce:animate-none lg:mx-0 lg:justify-self-end">
              {aside}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}

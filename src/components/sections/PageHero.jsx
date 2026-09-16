import { ArrowRight } from 'lucide-react'
import { Button, Container, SectionEyebrow, SplitHeading } from '@deluxfit/ds'
import { Link } from '@/router'
import AnimatedBackdrop from '@/components/effects/AnimatedBackdrop'

/**
 * The first screen of every inner page. The headline fills the column; behind
 * it the ground carries a dot grid and one large crimson bloom off the top
 * corner, so the page opens on the brand before a word is read. The grain on
 * top is what keeps the black from reading as an unloaded screen.
 *
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
    <section className="df-grain relative isolate overflow-hidden bg-df-bg pb-14 pt-[calc(var(--df-header-height)+2rem)] sm:pb-20 sm:pt-[calc(var(--df-header-height)+3.5rem)]">
      <div
        aria-hidden="true"
        className="df-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(70%_60%_at_50%_0%,#000,transparent_80%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-10%] -z-10 h-[38rem] w-[38rem] rounded-df-full bg-[radial-gradient(closest-side,var(--df-accent-wash-strong),transparent)] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-px bg-[linear-gradient(90deg,transparent,var(--df-accent),transparent)] opacity-60"
      />
      <AnimatedBackdrop variant="aurora" opacity={0.35} />
      <Container size="lg">
        <div
          className={
            hasAside
              ? 'grid items-end gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16'
              : 'flex flex-col items-start'
          }
        >
          <div className="flex max-w-4xl animate-df-rise flex-col items-start motion-reduce:animate-none">
            {eyebrow && <SectionEyebrow>{eyebrow}</SectionEyebrow>}
            {heading && (
              <SplitHeading
                as="h1"
                size="page"
                text={heading}
                accent={accent}
                className="mt-7 max-w-[15ch] sm:mt-8"
              />
            )}
            {subhead && (
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-df-text-muted sm:mt-8 sm:text-xl">
                {subhead}
              </p>
            )}
            {(primary || secondary) && (
              <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row">
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

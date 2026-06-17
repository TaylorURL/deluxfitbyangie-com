import { ArrowRight } from 'lucide-react'
import {
  Button,
  Container,
  Reveal,
  SectionEyebrow,
  SplitHeading,
} from '@deluxfit/ds'
import { Link } from '@/router'

/**
 * PageHero — the editorial top band reused by every routed page. A crimson
 * eyebrow, an oversized SplitHeading, an optional subhead, and up to two CTAs
 * presented as design-system Buttons routed through the SPA <Link>.
 *
 * @param {object} props
 * @param {string} props.eyebrow
 * @param {string} props.heading
 * @param {string} [props.accent]
 * @param {string} [props.subhead]
 * @param {{ label: string, href: string }} [props.primary]
 * @param {{ label: string, href: string }} [props.secondary]
 * @param {React.ReactNode} [props.aside] - optional decoration to the right
 */
export default function PageHero({
  eyebrow,
  heading,
  accent,
  subhead,
  primary,
  secondary,
  aside,
}) {
  const hasAside = Boolean(aside)
  return (
    <section className="relative isolate overflow-hidden bg-df-bg pb-16 pt-32 sm:pt-40 lg:pt-48">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_85%_5%,rgba(225,29,42,0.16),transparent_60%)]"
      />
      <Container size="xl">
        <div
          className={
            hasAside
              ? 'grid items-end gap-12 lg:grid-cols-[1.35fr_1fr]'
              : 'flex flex-col items-start'
          }
        >
          <Reveal className="flex max-w-3xl flex-col items-start">
            {eyebrow && <SectionEyebrow>{eyebrow}</SectionEyebrow>}
            {heading && (
              <SplitHeading
                text={heading}
                accent={accent}
                className="mt-6 text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.92]"
              />
            )}
            {subhead && (
              <p className="mt-7 max-w-2xl text-base leading-relaxed text-df-text-muted sm:text-lg">
                {subhead}
              </p>
            )}
            {(primary || secondary) && (
              <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
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
          </Reveal>

          {hasAside && (
            <Reveal delay={0.15} className="mx-auto w-full max-w-sm lg:mx-0 lg:justify-self-end">
              {aside}
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  )
}

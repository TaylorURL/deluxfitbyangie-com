import { ArrowRight } from 'lucide-react'
import {
  Button,
  Container,
  Reveal,
  SectionEyebrow,
  SplitHeading,
} from '@deluxfit/ds'
import { Link } from '@/router'
import AnimatedBackdrop from '@/components/AnimatedBackdrop'
import { ShinyText, BlurText } from '@/components/reactbits'

/**
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
    <section className="relative isolate overflow-hidden bg-df-bg pb-12 pt-24 sm:pb-16 sm:pt-40 lg:pt-48">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_85%_5%,rgba(225,29,42,0.16),transparent_60%)]"
      />
      <AnimatedBackdrop variant="aurora" opacity={0.4} />
      <Container size="xl">
        <div
          className={
            hasAside
              ? 'grid items-end gap-10 sm:gap-12 lg:grid-cols-[1.35fr_1fr]'
              : 'flex flex-col items-start'
          }
        >
          <Reveal className="flex max-w-3xl flex-col items-start">
            {eyebrow && (
              <SectionEyebrow>
                <ShinyText text={eyebrow} color="#c81a27" shineColor="#ff8b95" speed={4} />
              </SectionEyebrow>
            )}
            {heading && (
              <SplitHeading
                text={heading}
                accent={accent}
                className="mt-5 text-[clamp(2.25rem,9vw,5.5rem)] leading-[0.92] sm:mt-6"
              />
            )}
            {subhead && (
              <BlurText
                text={subhead}
                animateBy="words"
                delay={60}
                className="mt-6 max-w-2xl text-base leading-relaxed text-df-text-muted sm:mt-7 sm:text-lg"
              />
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

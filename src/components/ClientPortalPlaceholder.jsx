import { Fragment } from 'react'
import { ArrowLeft, LockKeyhole, Sparkles } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Container } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import LanguageSwitcher from './LanguageSwitcher'

const MotionDiv = motion.div

/**
 * ClientPortalPlaceholder — the temporary destination behind the navbar's
 * "Client Login" link. Visually complete and on-brand so the navbar entry
 * point reads as real, but explicitly stubbed: when the real member portal
 * lands, swap this view for the production sign-in / dashboard and the
 * surrounding wiring stays the same.
 */
export default function ClientPortalPlaceholder() {
  const { brand, portal } = useContent()
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-df-bg">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_-10%,rgba(225,29,42,0.22),transparent_65%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-df-accent/60 to-transparent"
      />

      <header className="border-b border-df-border">
        <Container size="xl">
          <div className="flex h-20 items-center justify-between sm:h-24">
            <a
              href="/"
              aria-label={brand.fullName}
              className="inline-flex items-center rounded-df-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-4 focus-visible:ring-offset-df-bg"
            >
              <img
                src="/deluxfit-logo.png"
                alt={brand.fullName}
                width="946"
                height="308"
                className="h-9 w-auto select-none [filter:invert(1)_hue-rotate(180deg)] sm:h-10"
                draggable="false"
              />
            </a>
            <div className="flex items-center gap-2.5">
              <LanguageSwitcher />
              <a
                href="/"
                className="group inline-flex items-center gap-2 rounded-df-sm border border-df-border-strong px-3.5 py-2.5 text-[11px] font-700 uppercase tracking-[0.2em] text-df-text-muted transition-colors hover:border-df-border-hover hover:bg-df-surface-2 hover:text-df-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-df-bg"
              >
                <ArrowLeft
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
                />
                {portal.backToSite}
              </a>
            </div>
          </div>
        </Container>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-16 sm:py-24">
        <MotionDiv
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md overflow-hidden rounded-df-2xl border border-df-border bg-df-surface/85 p-8 shadow-df-xl backdrop-blur-xl sm:p-10"
        >
          <span className="inline-flex items-center gap-2 rounded-df-full border border-df-border-strong bg-df-accent-soft px-3 py-1 text-[10px] font-700 uppercase tracking-[0.24em] text-df-accent-bright">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {portal.comingSoon}
          </span>

          <h1 className="mt-6 font-display text-[clamp(2.75rem,7vw,4rem)] font-400 uppercase leading-[0.9] tracking-tight text-df-text">
            {portal.headingLines.map((line, index) => (
              <Fragment key={line}>
                {line}
                {index < portal.headingLines.length - 1 && <br />}
                {index === portal.headingLines.length - 1 && (
                  <span className="text-df-accent">.</span>
                )}
              </Fragment>
            ))}
          </h1>

          <p className="mt-5 text-sm leading-relaxed text-df-text-muted sm:text-base">
            {portal.blurb}
          </p>

          <div className="mt-7 flex items-center gap-3 rounded-df-md border border-df-border bg-df-surface-2/60 px-4 py-3.5">
            <LockKeyhole className="h-4 w-4 shrink-0 text-df-accent-bright" aria-hidden="true" />
            <p className="text-[11px] font-600 uppercase tracking-[0.2em] text-df-text-muted">
              {portal.signInHint}
            </p>
          </div>

          <a
            href="/"
            className="group/cta mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-df-sm border border-df-accent bg-df-accent text-[12px] font-700 uppercase tracking-[0.18em] text-df-on-accent shadow-df-glow-soft transition-all duration-200 ease-df-out hover:bg-df-accent-bright hover:shadow-df-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-df-bg"
          >
            <ArrowLeft
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-200 group-hover/cta:-translate-x-0.5"
            />
            {portal.backToHome}
          </a>
        </MotionDiv>
      </main>

      <footer className="border-t border-df-border">
        <Container size="xl">
          <p className="py-6 text-[10px] font-600 uppercase tracking-[0.24em] text-df-text-faint">
            © {new Date().getFullYear()} {brand.fullName} · {brand.tagline}
          </p>
        </Container>
      </footer>
    </div>
  )
}

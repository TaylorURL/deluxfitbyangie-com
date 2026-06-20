import { ArrowLeft } from 'lucide-react'
import { Container } from '@deluxfit/ds'
import { Link } from '@/router'

/**
 * AuthShell — the chrome shared by /login, /signup, /reset-password, and
 * /update-password. Same red-glow header treatment as PortalShell but stripped
 * down: just a logo, a back-to-site link, and the centered auth card slot.
 */
export default function AuthShell({ children }) {
  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-df-bg">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_-10%,rgba(225,29,42,0.18),transparent_65%)]"
      />

      <header className="border-b border-df-border">
        <Container size="xl">
          <div className="flex h-16 items-center justify-between gap-3 sm:h-24">
            <Link
              href="/"
              aria-label="DeluxFit by Angie"
              className="inline-flex shrink-0 items-center rounded-df-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-4 focus-visible:ring-offset-df-bg"
            >
              <img
                src="/deluxfit-logo.png"
                alt="DeluxFit by Angie"
                width="946"
                height="308"
                className="h-7 w-auto select-none [filter:invert(1)_hue-rotate(180deg)] sm:h-10"
                draggable="false"
              />
            </Link>
            <Link
              href="/"
              className="group inline-flex h-11 items-center gap-2 rounded-df-sm border border-df-border-strong px-3 text-[11px] font-700 uppercase tracking-[0.18em] text-df-text-muted transition-colors hover:border-df-border-hover hover:bg-df-surface-2 hover:text-df-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-df-bg sm:px-3.5 sm:tracking-[0.2em]"
            >
              <ArrowLeft
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
              />
              <span className="hidden sm:inline">Back to site</span>
            </Link>
          </div>
        </Container>
      </header>

      <main className="flex flex-1 items-start px-5 py-10 sm:items-center sm:py-16">
        <div className="mx-auto w-full max-w-md">{children}</div>
      </main>

      <footer className="border-t border-df-border">
        <Container size="xl">
          <p className="py-6 text-[10px] font-600 uppercase tracking-[0.24em] text-df-text-faint">
            © {new Date().getFullYear()} DeluxFit by Angie · Train with intent.
          </p>
        </Container>
      </footer>
    </div>
  )
}

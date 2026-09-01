import { ArrowLeft } from 'lucide-react'
import { Container } from '@deluxfit/ds'
import SplitRail from '@taylorurl/split-rail'
import { Link } from '@/router'
import BrandLogo from '@/components/BrandLogo'
import { studioYear } from '@/lib/timezone'

export default function AuthShell({ children }) {
  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-df-bg">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_-10%,var(--df-accent-wash),transparent_65%)]"
      />

      <header className="border-b border-df-border">
        <Container size="xl">
          <div className="flex h-[var(--df-header-height)] items-center justify-between gap-3">
            <Link
              href="/"
              aria-label="DeluxFit by Angie"
              className="inline-flex shrink-0 items-center rounded-df-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-4 focus-visible:ring-offset-df-bg"
            >
              <BrandLogo alt="DeluxFit by Angie" className="h-7 sm:h-10" />
            </Link>
            <Link
              href="/"
              className="group inline-flex h-11 items-center gap-2 rounded-df-sm border border-df-border-strong px-3 text-[11px] font-700 uppercase tracking-[0.18em] text-df-text-muted transition-colors hover:border-df-border-hover hover:bg-df-surface-2 hover:text-df-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-df-bg sm:px-4 sm:tracking-[0.2em]"
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
            © {studioYear()} DeluxFit by Angie · Train with intent.
          </p>
        </Container>
        <SplitRail version={__BUILD_VERSION__} />
      </footer>
    </div>
  )
}

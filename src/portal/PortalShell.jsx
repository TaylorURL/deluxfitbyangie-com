import { ArrowLeft, LogOut } from 'lucide-react'
import { Container } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { useAuth } from '@/auth/useAuth'

/**
 * PortalShell — the standalone chrome for the client portal: branded header
 * with a back-to-site link (and sign-out when authenticated), the page body,
 * and a thin footer. Shared by the auth screen and the dashboard.
 */
export default function PortalShell({ children }) {
  const { brand, portal } = useContent()
  const { user, signOut } = useAuth()

  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-df-bg">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_-10%,rgba(225,29,42,0.18),transparent_65%)]"
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
              {user && (
                <button
                  type="button"
                  onClick={signOut}
                  className="group inline-flex items-center gap-2 rounded-df-sm border border-df-border-strong px-3.5 py-2.5 text-[11px] font-700 uppercase tracking-[0.2em] text-df-text-muted transition-colors hover:border-df-border-hover hover:bg-df-surface-2 hover:text-df-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-df-bg"
                >
                  <LogOut aria-hidden="true" className="h-4 w-4" />
                  {portal.auth.signOut}
                </button>
              )}
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

      <main className="flex-1 px-5 py-12 sm:py-16">{children}</main>

      <footer className="border-t border-df-border">
        <Container size="xl">
          <p className="py-6 text-[10px] font-600 uppercase tracking-[0.24em] text-df-text-faint">
            © {new Date().getFullYear()} {brand.fullName} · {brand.slogan}
          </p>
        </Container>
      </footer>
    </div>
  )
}

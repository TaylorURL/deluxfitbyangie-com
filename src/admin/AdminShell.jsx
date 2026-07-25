import { ArrowLeft, LogOut } from 'lucide-react'
import { Container, cn } from '@deluxfit/ds'
import { Link, useLocation } from '@/router'
import { useAuth } from '@/auth/useAuth'
import { ADMIN_ROUTES, matchAdminRoute } from './routes'

export default function AdminShell() {
  const { pathname } = useLocation()
  const { user, profile, signOut } = useAuth()
  const active = matchAdminRoute(pathname)
  const ActiveComponent = active.component
  const ActiveIcon = active.icon
  const identity = profile?.full_name || user?.email || 'Staff'

  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-df-bg">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_-10%,rgba(225,29,42,0.14),transparent_65%)]"
      />

      <header className="sticky top-0 z-sticky border-b border-df-border bg-df-bg/85 shadow-[0_1px_0_rgba(225,29,42,0.18)] [backdrop-filter:blur(20px)] [-webkit-backdrop-filter:blur(20px)]">
        <Container size="xl">
          <div className="flex h-16 items-center justify-between gap-3 sm:h-20">
            <Link
              href="/admin"
              aria-label="DeluxFit admin"
              className="inline-flex shrink-0 items-center gap-3 rounded-df-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-4 focus-visible:ring-offset-df-bg"
            >
              <img
                src="/deluxfit-logo.png"
                alt=""
                width="946"
                height="308"
                className="h-7 w-auto select-none [filter:invert(1)_hue-rotate(180deg)] sm:h-8"
                draggable="false"
              />
              <span className="hidden rounded-df-full border border-df-accent bg-df-accent-softer px-2.5 py-1 text-[9px] font-700 uppercase tracking-[0.24em] text-df-accent-bright sm:inline">
                Console
              </span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-2.5">
              <span className="hidden max-w-[12rem] truncate text-[11px] font-600 uppercase tracking-[0.18em] text-df-text-faint sm:inline">
                {identity}
              </span>
              <button
                type="button"
                onClick={signOut}
                aria-label="Sign out"
                className="group inline-flex h-11 items-center gap-2 rounded-df-sm border border-df-border-strong px-3 text-[11px] font-700 uppercase tracking-[0.18em] text-df-text-muted transition-colors hover:border-df-border-hover hover:bg-df-surface-2 hover:text-df-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-df-bg"
              >
                <LogOut aria-hidden="true" className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
              <Link
                href="/"
                aria-label="Back to site"
                className="group inline-flex h-11 items-center gap-2 rounded-df-sm border border-df-border-strong px-3 text-[11px] font-700 uppercase tracking-[0.18em] text-df-text-muted transition-colors hover:border-df-border-hover hover:bg-df-surface-2 hover:text-df-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-df-bg"
              >
                <ArrowLeft
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
                />
                <span className="hidden sm:inline">Site</span>
              </Link>
            </div>
          </div>
        </Container>
      </header>

      <Container size="xl">
        <div className="grid gap-8 py-10 lg:grid-cols-[248px_1fr] lg:py-14">
          <nav aria-label="Admin navigation" className="lg:sticky lg:top-28 lg:self-start">
            <p className="mb-3 hidden px-1 text-[10px] font-700 uppercase tracking-[0.28em] text-df-text-faint lg:block">
              Manage
            </p>
            <ul className="flex flex-wrap gap-2 lg:flex-col">
              {ADMIN_ROUTES.map(route => {
                const Icon = route.icon
                const isActive = route.path === active.path
                return (
                  <li key={route.path} className="lg:w-full">
                    <Link
                      href={route.path}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'group relative inline-flex w-full items-center gap-2.5 overflow-hidden rounded-df-sm border px-3.5 py-2.5 text-[12px] font-700 uppercase tracking-[0.14em] transition-colors duration-200 ease-df-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-df-bg',
                        isActive
                          ? 'border-df-accent bg-df-accent-soft text-df-accent-bright'
                          : 'border-transparent text-df-text-muted hover:bg-df-surface-2 hover:text-df-text'
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          'absolute inset-y-1.5 left-0 hidden w-[3px] rounded-df-full bg-df-accent transition-opacity duration-200 lg:block',
                          isActive ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0 transition-colors',
                          isActive ? 'text-df-accent-bright' : 'text-df-text-faint group-hover:text-df-text'
                        )}
                        aria-hidden="true"
                      />
                      {route.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <main className="min-w-0">
            <header className="mb-8 border-b border-df-border pb-6">
              <div className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-df-lg bg-df-accent-soft text-df-accent-bright sm:inline-flex"
                >
                  <ActiveIcon className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-700 uppercase tracking-[0.28em] text-df-accent">
                    DeluxFit Console
                  </p>
                  <h1 className="font-400 mt-2 font-display text-3xl uppercase leading-none tracking-tight text-df-text sm:text-4xl">
                    {active.label}
                    <span className="text-df-accent">.</span>
                  </h1>
                  {active.description && (
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-df-text-muted">
                      {active.description}
                    </p>
                  )}
                </div>
              </div>
            </header>
            <ActiveComponent />
          </main>
        </div>
      </Container>
    </div>
  )
}

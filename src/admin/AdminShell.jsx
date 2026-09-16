import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, LogOut } from 'lucide-react'
import { MicroLabel, cn } from '@deluxfit/ds'
import SplitRail from '@taylorurl/split-rail'
import { Link, useLocation } from '@/router'
import { useAuth } from '@/auth/useAuth'
import BrandLogo from '@/components/layout/BrandLogo'
import ShellAction from '@/components/layout/ShellAction'
import { ADMIN_ROUTES, matchAdminRoute } from './routes'

const MotionSpan = motion.span

/**
 * The console's map. On a laptop it is a column down the left edge of the
 * screen, the same object the client portal draws, so a coach moving between
 * the two sides of the application finds the frame where she left it. On a
 * phone ten destinations are too many for a bottom bar, so the rail turns
 * rather than folds: one scrolling row under the header.
 *
 * The marker travels between entries on a shared layout id in both, which is
 * a transform, so it never moves the rail it sits in.
 */
function AdminRail({ activePath, identity, onSignOut }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <aside className="border-b border-df-border bg-df-bg-elevated lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:border-b-0 lg:border-r">
      <div className="hidden h-[var(--df-header-height)] shrink-0 items-center gap-3 border-b border-df-border px-6 lg:flex">
        <Link
          href="/admin"
          aria-label="DeluxFit admin"
          className="inline-flex shrink-0 items-center rounded-df-sm transition-opacity duration-df-fast ease-df-out hover:opacity-80"
        >
          <BrandLogo alt="" className="h-7" />
        </Link>
        <span className="inline-flex h-6 items-center rounded-df-full border border-df-accent bg-df-accent-softer px-2.5 text-[9px] font-700 uppercase tracking-[0.2em] text-df-accent-bright">
          Console
        </span>
      </div>

      <nav aria-label="Admin Navigation" className="px-4 py-3 lg:flex-1 lg:overflow-y-auto lg:py-6">
        <MicroLabel size="xs" tone="faint" className="mb-3 hidden px-3 lg:block">
          Manage
        </MicroLabel>
        <ul
          className={cn(
            'flex snap-x gap-1 overflow-x-auto pb-1',
            '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            'lg:flex-col lg:overflow-visible lg:pb-0'
          )}
        >
          {ADMIN_ROUTES.map(route => {
            const Icon = route.icon
            const isActive = route.path === activePath
            return (
              <li key={route.path} className="shrink-0 snap-start lg:w-full">
                <Link
                  href={route.path}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'group relative isolate flex h-11 w-full items-center gap-3 whitespace-nowrap rounded-df-sm px-3 text-[13px] font-600 transition-colors duration-df-fast ease-df-out',
                    isActive ? 'text-df-text' : 'text-df-text-muted hover:text-df-text'
                  )}
                >
                  {isActive && (
                    <MotionSpan
                      aria-hidden="true"
                      layoutId="admin-rail-marker"
                      className="absolute inset-0 -z-10 overflow-hidden rounded-df-sm bg-df-surface-2 shadow-df-md"
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { type: 'tween', duration: 0.18, ease: [0.22, 1, 0.36, 1] }
                      }
                    >
                      <span className="absolute inset-y-2 left-0 w-0.5 rounded-df-full bg-df-accent" />
                    </MotionSpan>
                  )}
                  <span
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-df-sm transition-colors duration-df-fast ease-df-out',
                      isActive
                        ? 'bg-df-accent-soft text-df-accent-bright'
                        : 'text-df-text-faint group-hover:text-df-text-muted'
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {route.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="hidden shrink-0 border-t border-df-border p-4 lg:block">
        <div className="flex items-center gap-3 rounded-df-md bg-df-surface p-3 shadow-df-sm">
          <span
            aria-hidden="true"
            className="font-400 flex h-10 w-10 shrink-0 items-center justify-center rounded-df-full bg-df-accent bg-df-accent-gradient font-display text-lg leading-none text-df-on-accent"
          >
            {(identity.trim()[0] || '·').toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-600 text-df-text">{identity}</p>
            <p className="text-[11px] font-600 uppercase tracking-[0.12em] text-df-text-faint">
              Staff
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-0.5">
          <a
            href="/"
            className="flex h-10 items-center gap-3 rounded-df-sm px-3 text-[12px] font-600 text-df-text-muted transition-colors duration-df-fast ease-df-out hover:bg-df-surface-2 hover:text-df-text"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Site
          </a>
          <button
            type="button"
            onClick={onSignOut}
            className="flex h-10 items-center gap-3 rounded-df-sm px-3 text-left text-[12px] font-600 text-df-text-muted transition-colors duration-df-fast ease-df-out hover:bg-df-surface-2 hover:text-df-text"
          >
            <LogOut aria-hidden="true" className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  )
}

export default function AdminShell() {
  const { pathname } = useLocation()
  const { user, profile, signOut } = useAuth()
  const active = matchAdminRoute(pathname)
  const ActiveComponent = active.component
  const ActiveIcon = active.icon
  const identity = profile?.full_name || user?.email || 'Staff'

  return (
    <div className="relative isolate flex min-h-dvh flex-col bg-df-bg">
      <header className="border-b border-df-border bg-df-bg-elevated lg:hidden">
        <div className="flex h-[var(--df-header-height)] items-center justify-between gap-3 px-5">
          <Link
            href="/admin"
            aria-label="DeluxFit admin"
            className="inline-flex shrink-0 items-center gap-3 rounded-df-sm transition-opacity duration-df-fast ease-df-out hover:opacity-80"
          >
            <BrandLogo alt="" className="h-7" />
            <span className="inline-flex h-6 items-center rounded-df-full border border-df-accent bg-df-accent-softer px-2.5 text-[9px] font-700 uppercase tracking-[0.2em] text-df-accent-bright">
              Console
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <ShellAction onClick={signOut} icon={LogOut} label="Sign Out" />
            <ShellAction native href="/" icon={ArrowLeft} label="Site" />
          </div>
        </div>
      </header>

      <div className="flex-1 lg:grid lg:grid-cols-[16.5rem_minmax(0,1fr)]">
        <AdminRail activePath={active.path} identity={identity} onSignOut={signOut} />

        <main className="relative isolate min-w-0 px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
          <div
            aria-hidden="true"
            className="df-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(60%_40%_at_60%_0%,#000,transparent_85%)]"
          />
          <div className="mx-auto max-w-6xl">
            <header className="mb-8 border-b border-df-border pb-6">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-df-full bg-df-accent-soft text-df-accent-bright">
                  <ActiveIcon aria-hidden="true" className="h-4 w-4" />
                </span>
                <h1 className="font-400 min-w-0 font-display text-[clamp(2.25rem,6vw,4rem)] uppercase leading-[0.9] tracking-[-0.02em] text-df-text">
                  {active.label}
                  <span className="text-df-accent-bright">.</span>
                </h1>
              </div>
              {active.description && (
                <p className="mt-3 max-w-df-measure text-[15px] leading-relaxed text-df-text-muted">
                  {active.description}
                </p>
              )}
            </header>
            <ActiveComponent />
          </div>
        </main>
      </div>

      <footer className="lg:hidden">
        <SplitRail version={__BUILD_VERSION__} />
      </footer>
    </div>
  )
}

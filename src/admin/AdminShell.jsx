import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, LogOut } from 'lucide-react'
import { Container, MicroLabel, cn } from '@deluxfit/ds'
import SplitRail from '@taylorurl/split-rail'
import { Link, useLocation } from '@/router'
import { useAuth } from '@/auth/useAuth'
import BrandLogo from '@/components/layout/BrandLogo'
import ShellAction from '@/components/layout/ShellAction'
import { ADMIN_ROUTES, matchAdminRoute } from './routes'

const MotionSpan = motion.span

/**
 * Ten destinations is too many for a bottom bar and too many to wrap into a
 * ragged block on a phone, so the rail turns rather than folds: one scrolling
 * row under the header on a narrow screen, the sticky column on a wide one.
 * The marker travels between entries on a shared layout id in both, which is
 * a transform, so it never moves the rail it sits in.
 */
function AdminRail({ activePath }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <nav aria-label="Admin Navigation" className="lg:sticky lg:top-28 lg:self-start">
      <MicroLabel className="mb-3 hidden px-1 lg:block">Manage</MicroLabel>
      <ul
        className={cn(
          '-mx-4 flex snap-x gap-1 overflow-x-auto px-4 pb-1',
          '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          'lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0'
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
                  'group relative isolate inline-flex h-11 w-full items-center gap-2.5 whitespace-nowrap rounded-df-sm px-3.5 text-[12px] font-700 uppercase tracking-[0.14em] transition-colors duration-df-fast ease-df-out lg:gap-3 lg:px-4',
                  isActive ? 'text-df-accent-bright' : 'text-df-text-muted hover:text-df-text'
                )}
              >
                {isActive && (
                  <MotionSpan
                    aria-hidden="true"
                    layoutId="admin-rail-marker"
                    className="absolute inset-0 -z-10 rounded-df-sm border-l-2 border-df-accent bg-df-accent-soft"
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { type: 'tween', duration: 0.18, ease: [0.22, 1, 0.36, 1] }
                    }
                  />
                )}
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0 transition-colors duration-df-fast ease-df-out',
                    isActive
                      ? 'text-df-accent-bright'
                      : 'text-df-text-faint group-hover:text-df-text'
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
    <div className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-df-bg">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_-10%,var(--df-accent-wash-soft),transparent_65%)]"
      />

      <header className="bg-df-bg/85 sticky top-0 z-sticky border-b border-df-border [-webkit-backdrop-filter:blur(20px)] [backdrop-filter:blur(20px)]">
        <Container size="xl">
          <div className="flex h-[var(--df-header-height)] items-center justify-between gap-3">
            <Link
              href="/admin"
              aria-label="DeluxFit admin"
              className="inline-flex shrink-0 items-center gap-3 rounded-df-sm transition-opacity duration-df-fast ease-df-out hover:opacity-80"
            >
              <BrandLogo alt="" className="h-7 sm:h-8" />
              <span className="hidden rounded-df-full border border-df-accent bg-df-accent-softer px-3 py-1 text-[9px] font-700 uppercase tracking-[0.24em] text-df-accent-bright sm:inline">
                Console
              </span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <MicroLabel
                as="span"
                tone="faint"
                className="hidden max-w-[12rem] truncate sm:inline"
              >
                {identity}
              </MicroLabel>
              <ShellAction onClick={signOut} icon={LogOut} label="Sign Out" />
              <ShellAction native href="/" icon={ArrowLeft} label="Site" />
            </div>
          </div>
        </Container>
      </header>

      <Container size="xl">
        <div className="grid gap-8 py-10 lg:grid-cols-[248px_1fr] lg:py-14">
          <AdminRail activePath={active.path} />

          <main className="min-w-0">
            <header className="mb-8 border-b border-df-border pb-6">
              <div className="flex items-center gap-3">
                <ActiveIcon
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-df-accent-bright sm:h-6 sm:w-6"
                />
                <h1 className="font-400 min-w-0 font-display text-[clamp(1.75rem,5vw,2.5rem)] uppercase leading-[0.95] tracking-tight text-df-text">
                  {active.label}
                  <span className="text-df-accent">.</span>
                </h1>
              </div>
              {active.description && (
                <p className="mt-3 max-w-df-measure text-[15px] leading-relaxed text-df-text-muted">
                  {active.description}
                </p>
              )}
            </header>
            <ActiveComponent />
          </main>
        </div>
      </Container>

      <footer className="mt-auto">
        <SplitRail version={__BUILD_VERSION__} />
      </footer>
    </div>
  )
}

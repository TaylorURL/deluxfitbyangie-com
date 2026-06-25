import { useState } from 'react'
import {
  Apple,
  CalendarClock,
  LayoutDashboard,
  Library as LibraryIcon,
  LineChart,
  Loader2,
  MessageSquare,
  ClipboardList,
} from 'lucide-react'
import { Badge, Container, cn } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { useAuth } from '@/auth/useAuth'
import { usePortalData } from './usePortalData'
import OverviewPanel from './panels/OverviewPanel'
import PlanPanel from './panels/PlanPanel'
import ProgressPanel from './panels/ProgressPanel'
import BookingsPanel from './panels/BookingsPanel'
import MessagesPanel from './panels/MessagesPanel'
import LibraryPanel from './panels/LibraryPanel'
import NutritionPanel from './panels/NutritionPanel'

const TABS = [
  { id: 'overview', icon: LayoutDashboard },
  { id: 'plan', icon: ClipboardList },
  { id: 'progress', icon: LineChart },
  { id: 'nutrition', icon: Apple },
  { id: 'bookings', icon: CalendarClock },
  { id: 'messages', icon: MessageSquare },
  { id: 'library', icon: LibraryIcon },
]

/**
 * PortalDashboard — the authenticated client dashboard. Loads the member's data
 * once and renders the active tab. Each panel is responsible for its own
 * mutations (progress entries, messages) and reloads via the data hook.
 */
export default function PortalDashboard() {
  const { portal } = useContent()
  const { user } = useAuth()
  const data = usePortalData()
  const [active, setActive] = useState('overview')

  const sharedProps = {
    user,
    profile: data.profile,
    entitlements: data.entitlements,
    plans: data.plans,
    progress: data.progress,
    nutrition: data.nutrition,
    bookings: data.bookings,
    messages: data.messages,
    content: data.content,
    reloadProgress: data.reloadProgress,
    reloadMessages: data.reloadMessages,
  }

  const displayName = data.profile?.full_name || user?.email || ''
  const monogram = (displayName.trim()[0] || '·').toUpperCase()
  const { hasMembership, hasCoaching } = data.entitlements

  return (
    <Container size="xl">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-10">
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <div className="flex items-center gap-3.5 rounded-df-lg border border-df-border bg-df-surface px-4 py-4">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-df-md bg-df-accent-soft font-display text-xl font-400 leading-none text-df-accent-bright"
            >
              {monogram}
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-700 uppercase tracking-[0.2em] text-df-text-faint">
                {portal.brandLockup}
              </p>
              <p className="truncate font-display text-lg font-400 uppercase leading-tight tracking-tight text-df-text">
                {displayName}
              </p>
            </div>
          </div>

          {(hasMembership || hasCoaching) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {hasMembership && (
                <Badge tone="positive" variant="soft" size="sm">
                  {portal.overview.membershipStatus}
                </Badge>
              )}
              {hasCoaching && (
                <Badge tone="accent" variant="soft" size="sm">
                  {portal.overview.coachingStatus}
                </Badge>
              )}
            </div>
          )}

          <nav
            aria-label={portal.brandLockup}
            className="mt-5 flex flex-wrap gap-2 lg:mt-6 lg:flex-col lg:gap-1.5"
          >
            {TABS.map(({ id, icon: Icon }, index) => {
              const isActive = active === id
              return (
                <button
                  key={id}
                  type="button"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setActive(id)}
                  className={cn(
                    'group inline-flex min-h-11 items-center gap-3 rounded-df-sm border px-3.5 py-2.5 text-left text-[12px] font-700 uppercase tracking-[0.14em] transition-colors duration-200 ease-df-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-df-bg active:translate-y-px lg:w-full lg:border-l-2',
                    isActive
                      ? 'border-df-accent bg-df-accent-soft text-df-accent-bright lg:border-l-df-accent'
                      : 'border-transparent text-df-text-muted hover:bg-df-surface-2 hover:text-df-text lg:border-l-df-border'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'hidden font-display text-base font-400 leading-none tabular-nums transition-colors duration-200 ease-df-out lg:block',
                      isActive
                        ? 'text-df-accent-bright'
                        : 'text-transparent [-webkit-text-stroke:1px_var(--df-text-faint)] group-hover:[-webkit-text-stroke:1px_var(--df-accent)]'
                    )}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{portal.nav[id]}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        <div className="min-w-0">
          {data.loading ? (
            <div
              role="status"
              aria-live="polite"
              className="flex flex-col items-center justify-center gap-4 py-24 text-center"
            >
              <Loader2 className="h-6 w-6 animate-spin text-df-accent-bright" aria-hidden="true" />
              <p className="text-[11px] font-700 uppercase tracking-[0.2em] text-df-text-faint">
                {portal.loading}
              </p>
            </div>
          ) : (
            <div key={active} className="animate-df-fade-up">
              {active === 'overview' && <OverviewPanel {...sharedProps} />}
              {active === 'plan' && <PlanPanel {...sharedProps} />}
              {active === 'progress' && <ProgressPanel {...sharedProps} />}
              {active === 'nutrition' && <NutritionPanel {...sharedProps} />}
              {active === 'bookings' && <BookingsPanel {...sharedProps} />}
              {active === 'messages' && <MessagesPanel {...sharedProps} />}
              {active === 'library' && <LibraryPanel {...sharedProps} />}
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}

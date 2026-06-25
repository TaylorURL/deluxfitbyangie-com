import { useState } from 'react'
import {
  Apple,
  CalendarClock,
  LayoutDashboard,
  Library as LibraryIcon,
  LineChart,
  MessageSquare,
  ClipboardList,
} from 'lucide-react'
import { Container, cn } from '@deluxfit/ds'
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

  return (
    <Container size="xl">
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav aria-label={portal.brandLockup} className="flex flex-wrap gap-2 lg:flex-col">
          {TABS.map(({ id, icon: Icon }) => (
            <button
              key={id}
              type="button"
              aria-current={active === id ? 'page' : undefined}
              onClick={() => setActive(id)}
              className={cn(
                'inline-flex items-center gap-2.5 rounded-df-sm border px-3.5 py-2.5 text-[12px] font-700 uppercase tracking-[0.14em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright lg:w-full',
                active === id
                  ? 'border-df-accent bg-df-accent-soft text-df-accent-bright'
                  : 'border-transparent text-df-text-muted hover:bg-df-surface-2 hover:text-df-text'
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {portal.nav[id]}
            </button>
          ))}
        </nav>

        <div className="min-w-0">
          {data.loading ? (
            <p className="py-16 text-center text-sm text-df-text-faint">{portal.loading}</p>
          ) : (
            <>
              {active === 'overview' && <OverviewPanel {...sharedProps} />}
              {active === 'plan' && <PlanPanel {...sharedProps} />}
              {active === 'progress' && <ProgressPanel {...sharedProps} />}
              {active === 'nutrition' && <NutritionPanel {...sharedProps} />}
              {active === 'bookings' && <BookingsPanel {...sharedProps} />}
              {active === 'messages' && <MessagesPanel {...sharedProps} />}
              {active === 'library' && <LibraryPanel {...sharedProps} />}
            </>
          )}
        </div>
      </div>
    </Container>
  )
}

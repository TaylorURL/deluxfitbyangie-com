import { useEffect, useRef, useState } from 'react'
import {
  Apple,
  CalendarClock,
  LayoutDashboard,
  Library as LibraryIcon,
  LineChart,
  MessageSquare,
  ClipboardList,
} from 'lucide-react'
import { Container } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { useAuth } from '@/auth/useAuth'
import { usePortalData } from './usePortalData'
import PortalCommandBar from './PortalCommandBar'
import TodayHero from './TodayHero'
import OverviewPanel from './panels/OverviewPanel'
import PlanPanel from './panels/PlanPanel'
import ProgressPanel from './panels/ProgressPanel'
import BookingsPanel from './panels/BookingsPanel'
import MessagesPanel from './panels/MessagesPanel'
import LibraryPanel from './panels/LibraryPanel'
import NutritionPanel from './panels/NutritionPanel'

/** The seven dashboard regions, in scroll order. Each maps a nav chip to an
 * anchored <section> rendered below — the panels keep their own data + actions. */
const SECTIONS = [
  { id: 'overview', icon: LayoutDashboard, Panel: OverviewPanel },
  { id: 'plan', icon: ClipboardList, Panel: PlanPanel },
  { id: 'progress', icon: LineChart, Panel: ProgressPanel },
  { id: 'nutrition', icon: Apple, Panel: NutritionPanel },
  { id: 'bookings', icon: CalendarClock, Panel: BookingsPanel },
  { id: 'messages', icon: MessageSquare, Panel: MessagesPanel },
  { id: 'library', icon: LibraryIcon, Panel: LibraryPanel },
]

/** PortalLoadingSkeleton — a considered loading state that mirrors the dashboard
 * silhouette (identity bar, hero bento, first region) instead of a bare spinner. */
function PortalLoadingSkeleton({ label }) {
  return (
    <div role="status" aria-live="polite" className="animate-df-fade-up">
      <span className="sr-only">{label}</span>
      <div className="flex items-center gap-3.5 border-b border-df-border pb-6">
        <div className="h-12 w-12 shrink-0 animate-pulse rounded-df-md bg-df-surface-2" />
        <div className="flex flex-col gap-2">
          <div className="h-2.5 w-24 animate-pulse rounded-df-full bg-df-surface-2" />
          <div className="h-6 w-48 animate-pulse rounded-df-sm bg-df-surface-2" />
        </div>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        <div className="h-52 animate-pulse rounded-df-lg bg-df-surface-2 sm:col-span-2 lg:col-span-2 lg:row-span-2" />
        <div className="h-24 animate-pulse rounded-df-lg bg-df-surface sm:col-span-2" />
        <div className="h-32 animate-pulse rounded-df-lg bg-df-surface" />
        <div className="h-32 animate-pulse rounded-df-lg bg-df-surface" />
      </div>
      <div className="mt-14 h-64 animate-pulse rounded-df-lg bg-df-surface" />
    </div>
  )
}

/**
 * Each panel still owns its own data loading + mutations via the shared hook.
 */
export default function PortalDashboard() {
  const { portal } = useContent()
  const { user } = useAuth()
  const data = usePortalData()
  const [activeId, setActiveId] = useState(SECTIONS[0].id)
  const sectionRefs = useRef({})

  // Scrollspy — reflect the region nearest the top of the viewport in the nav.
  useEffect(() => {
    if (data.loading) return undefined
    const observer = new IntersectionObserver(
      entries => {
        const inView = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (inView[0]) setActiveId(inView[0].target.id)
      },
      { rootMargin: '-25% 0px -65% 0px', threshold: [0, 0.5, 1] }
    )
    Object.values(sectionRefs.current).forEach(node => node && observer.observe(node))
    return () => observer.disconnect()
  }, [data.loading])

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

  if (data.loading) {
    return (
      <Container size="xl">
        <PortalLoadingSkeleton label={portal.loading} />
      </Container>
    )
  }

  return (
    <Container size="xl">
      <PortalCommandBar
        sections={SECTIONS}
        activeId={activeId}
        displayName={displayName}
        monogram={monogram}
        entitlements={data.entitlements}
      />

      <TodayHero
        bookings={data.bookings}
        plans={data.plans}
        nutrition={data.nutrition}
        progress={data.progress}
        entitlements={data.entitlements}
      />

      <div className="mt-14 space-y-16 sm:mt-16 sm:space-y-24">
        {SECTIONS.map(({ id, Panel }) => (
          <section
            key={id}
            id={id}
            ref={node => (sectionRefs.current[id] = node)}
            aria-label={portal.nav[id]}
            className="scroll-mt-24"
          >
            <Panel {...sharedProps} />
          </section>
        ))}
      </div>
    </Container>
  )
}

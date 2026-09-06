import { useCallback, useEffect, useState } from 'react'
import {
  Apple,
  CalendarClock,
  ClipboardList,
  LayoutDashboard,
  Library as LibraryIcon,
  LineChart,
  MessageSquare,
} from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Container, Skeleton } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { useAuth } from '@/auth/useAuth'
import { usePortalData } from './usePortalData'
import { MoreSheet, PHONE_PRIMARY, Rail, TabBar } from './PortalNav'
import PortalIdentity from './PortalIdentity'
import TodayView from './TodayView'
import PlanPanel from './panels/PlanPanel'
import ProgressPanel from './panels/ProgressPanel'
import BookingsPanel from './panels/BookingsPanel'
import MessagesPanel from './panels/MessagesPanel'
import LibraryPanel from './panels/LibraryPanel'
import NutritionPanel from './panels/NutritionPanel'

const MotionDiv = motion.div

/**
 * The portal's sections, in the order the daily work happens. The first four
 * are the ones the phone's bottom bar carries, so the order is a decision
 * about reach as much as about hierarchy.
 */
const SECTIONS = [
  { id: 'overview', icon: LayoutDashboard, Panel: TodayView },
  { id: 'plan', icon: ClipboardList, Panel: PlanPanel },
  { id: 'progress', icon: LineChart, Panel: ProgressPanel },
  { id: 'messages', icon: MessageSquare, Panel: MessagesPanel },
  { id: 'nutrition', icon: Apple, Panel: NutritionPanel },
  { id: 'bookings', icon: CalendarClock, Panel: BookingsPanel },
  { id: 'library', icon: LibraryIcon, Panel: LibraryPanel },
]

const DEFAULT_ID = SECTIONS[0].id
const isKnown = id => SECTIONS.some(section => section.id === id)

/** The section named by the URL fragment, so a link into a panel opens on it
 *  and the back button walks the panels the reader actually visited. */
function readHash() {
  if (typeof window === 'undefined') return DEFAULT_ID
  const id = window.location.hash.replace('#', '')
  return isKnown(id) ? id : DEFAULT_ID
}

/**
 * Blocks laid out where the identity bar, the greeting and the first row of
 * tiles land, so what arrives replaces the placeholder rather than displacing
 * it.
 */
function PortalLoadingSkeleton({ label }) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <div className="flex items-center gap-4 border-b border-df-border pb-6">
        <Skeleton className="h-12 w-12 shrink-0" radius="md" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-2.5 w-24" radius="full" />
          <Skeleton className="h-6 w-48" />
        </div>
      </div>
      <div className="mt-8">
        <Skeleton className="h-9 w-64" />
        <div className="mt-3 flex gap-2">
          <Skeleton className="h-6 w-32" radius="full" />
          <Skeleton className="h-6 w-28" radius="full" />
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-64 sm:col-span-2 lg:col-span-2 lg:row-span-2" radius="md" />
        <Skeleton className="h-44" radius="md" />
        <Skeleton className="h-44" radius="md" />
        <Skeleton className="h-32 sm:col-span-2 lg:col-span-3" radius="md" />
      </div>
    </div>
  )
}

export default function PortalDashboard() {
  const { portal } = useContent()
  const { user } = useAuth()
  const data = usePortalData()
  const prefersReducedMotion = useReducedMotion()
  const [activeId, setActiveId] = useState(readHash)
  const [moreOpen, setMoreOpen] = useState(false)

  // The fragment is the source of truth, so the browser's own back and forward
  // walk the panels rather than leaving the portal entirely.
  useEffect(() => {
    const onHashChange = () => {
      setActiveId(readHash())
      // A back gesture that changes the section leaves the sheet standing over
      // the panel it was used to leave.
      setMoreOpen(false)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const select = useCallback(id => {
    if (!isKnown(id)) return
    setActiveId(id)
    window.history.pushState(null, '', `#${id}`)
    // A panel swapped in below a scrolled page would otherwise open halfway
    // down itself.
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  const active = SECTIONS.find(section => section.id === activeId) ?? SECTIONS[0]
  const Panel = active.Panel
  const overflow = SECTIONS.slice(PHONE_PRIMARY)

  const sharedProps = {
    user,
    profile: data.profile,
    entitlements: data.entitlements,
    plans: data.plans,
    progress: data.progress,
    nutrition: data.nutrition,
    nutritionError: data.nutritionError,
    bookings: data.bookings,
    messages: data.messages,
    content: data.content,
    reloadProgress: data.reloadProgress,
    reloadMessages: data.reloadMessages,
    onNavigate: select,
  }

  const displayName = data.profile?.full_name || user?.email || ''

  if (data.loading) {
    return (
      <Container size="xl">
        <PortalLoadingSkeleton label={portal.loading} />
      </Container>
    )
  }

  return (
    <Container size="xl">
      <PortalIdentity displayName={displayName} entitlements={data.entitlements} />

      {/* The tab bar is fixed to the bottom of the viewport, so the end of the
          page reserves its height as padding rather than as a spacer element:
          a spacer's own box still finishes underneath the bar. */}
      <div className="mt-8 gap-10 pb-[var(--df-tabbar-clearance)] lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:pb-0">
        <Rail
          sections={SECTIONS}
          activeId={activeId}
          onSelect={select}
          layoutId="portal-rail-marker"
          label={portal.sectionsLabel}
        />

        {/* The outgoing panel is unmounted at once and the incoming one rises
            into place. Waiting for an exit animation before swapping would put
            the whole navigation behind a frame loop, and a tab that is
            throttled or backgrounded mid-transition stops producing frames. */}
        <MotionDiv
          key={activeId}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <Panel {...sharedProps} />
        </MotionDiv>
      </div>

      <TabBar
        sections={SECTIONS}
        activeId={activeId}
        onSelect={select}
        onMore={() => setMoreOpen(true)}
        moreActive={overflow.some(section => section.id === activeId)}
        label={portal.sectionsLabel}
      />

      <MoreSheet
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        sections={overflow}
        activeId={activeId}
        onSelect={select}
      />
    </Container>
  )
}

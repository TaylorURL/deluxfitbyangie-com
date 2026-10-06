import { useCallback, useEffect, useState } from 'react'
import {
  Apple,
  ArrowRight,
  CalendarClock,
  ClipboardList,
  LayoutDashboard,
  Library as LibraryIcon,
  LineChart,
  MessageSquare,
  Plus,
} from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Button, Skeleton } from '@deluxfit/ds'
import { useContent, useLanguage } from '@/i18n'
import { Link } from '@/router'
import { useAuth } from '@/auth/useAuth'
import { usePortalData } from './usePortalData'
import { MoreSheet, PHONE_PRIMARY, Rail, TabBar } from './PortalNav'
import PortalIdentity from './PortalIdentity'
import PortalPreviewBar from './PortalPreviewBar'
import { previewHref, readPreviewLevel } from './preview'
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
 * Blocks laid out where the greeting and the first row of tiles land, so what
 * arrives replaces the placeholder rather than displacing it.
 */
function PortalLoadingSkeleton({ label }) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <Skeleton className="h-12 w-72" />
      <div className="mt-3 flex gap-2">
        <Skeleton className="h-6 w-32" radius="full" />
        <Skeleton className="h-6 w-28" radius="full" />
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-12">
        <Skeleton className="h-72 lg:col-span-7" radius="lg" />
        <Skeleton className="h-72 lg:col-span-5" radius="lg" />
        <Skeleton className="h-28 lg:col-span-12" radius="lg" />
      </div>
    </div>
  )
}

/**
 * The bar across the top of the work: which section this is, today's date,
 * and the two things a client does most — book and log — as keys that are
 * always in reach whichever panel is open.
 */
function Topbar({ section, onNavigate, dateLabel }) {
  const { portal } = useContent()
  const copy = portal.hero
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-df-border pb-5">
      <div className="flex min-w-0 items-center gap-3">
        <span className="text-[11px] font-700 uppercase tracking-[0.2em] text-df-text-faint">
          {portal.nav[section]}
        </span>
        <span aria-hidden="true" className="h-1 w-1 rounded-df-full bg-df-accent" />
        <span className="text-[13px] font-500 text-df-text-muted">{dateLabel}</span>
      </div>
      <div className="hidden items-center gap-2 sm:flex">
        <Button type="button" variant="secondary" size="sm" onClick={() => onNavigate('progress')}>
          <Plus aria-hidden="true" className="h-4 w-4" />
          {copy.logEntry}
        </Button>
        <Button asChild size="sm">
          <Link href="/single-session#book">
            {copy.book}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

/**
 * @param {object} props
 * @param {{ data: object, user: object }} [props.demo] - the filled-in account
 *   the development server shows in place of a signed-in one
 */
export default function PortalDashboard({ demo }) {
  const { portal } = useContent()
  const { locale } = useLanguage()
  const auth = useAuth()
  const user = demo?.user ?? auth.user
  const isStaff = demo ? false : auth.isStaff
  const [previewLevel, setPreviewLevel] = useState(readPreviewLevel)
  const live = usePortalData({ previewLevel })
  const data = demo?.data ?? live
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

  // The previewed level lives in the query rather than in state alone, so the
  // back button leaves the preview the same way it leaves a panel and the URL
  // reopens on the level it names.
  useEffect(() => {
    const onPopState = () => setPreviewLevel(readPreviewLevel())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const selectPreview = useCallback(level => {
    setPreviewLevel(level)
    window.history.pushState(null, '', previewHref(level))
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  const select = useCallback(id => {
    if (!isKnown(id)) return
    setActiveId(id)
    window.history.pushState(null, '', `${window.location.search}#${id}`)
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
  const dateLabel = new Date().toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="lg:grid lg:min-h-dvh lg:grid-cols-[16.5rem_minmax(0,1fr)]">
      <Rail
        sections={SECTIONS}
        activeId={activeId}
        onSelect={select}
        layoutId="portal-rail-marker"
        label={portal.sectionsLabel}
        displayName={displayName}
        entitlements={data.entitlements}
      />

      {/* The tab bar is fixed to the bottom of the viewport, so the end of the
          page reserves its height as padding rather than as a spacer element:
          a spacer's own box still finishes underneath the bar. */}
      <div className="relative isolate min-w-0 px-5 pb-[var(--df-tabbar-clearance)] pt-6 sm:px-8 lg:px-12 lg:pb-16 lg:pt-8">
        <div
          aria-hidden="true"
          className="df-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(60%_40%_at_60%_0%,#000,transparent_85%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 right-[-10%] -z-10 h-[30rem] w-[30rem] rounded-df-full bg-[radial-gradient(closest-side,var(--df-accent-wash-soft),transparent)] blur-3xl"
        />

        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          {data.loading ? (
            <PortalLoadingSkeleton label={portal.loading} />
          ) : (
            <>
              <PortalIdentity displayName={displayName} entitlements={data.entitlements} />
              <Topbar section={activeId} onNavigate={select} dateLabel={dateLabel} />

              {isStaff && <PortalPreviewBar level={data.previewLevel} onChange={selectPreview} />}

              {/* The outgoing panel is unmounted at once and the incoming one
                  rises into place. Waiting for an exit animation before
                  swapping would put the whole navigation behind a frame loop,
                  and a tab that is throttled or backgrounded mid-transition
                  stops producing frames. */}
              <MotionDiv
                key={activeId}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <Panel {...sharedProps} />
              </MotionDiv>
            </>
          )}
        </div>
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
    </div>
  )
}

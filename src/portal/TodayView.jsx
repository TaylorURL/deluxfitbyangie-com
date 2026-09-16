import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  ClipboardList,
  Dumbbell,
  FileText,
  Flame,
  LineChart,
  MessageSquare,
  PlayCircle,
  ShieldCheck,
} from 'lucide-react'
import { Badge, Button, Card, Meter, MicroLabel, Stat, cn } from '@deluxfit/ds'
import { useContent, useLanguage } from '@/i18n'
import { Link } from '@/router'
import { formatDateTime } from '@/lib/datetime'
import CountUp from '@/components/reactbits/CountUp'
import { EmptyState } from './panels/PanelPrimitives'
import Sparkline from '@/components/ui/Sparkline'

const SERVICE_LABEL = {
  single_session: 'Single Live Session',
  live_program: 'Live Training Program',
}

const MEDIA_ICON = { video: PlayCircle, article: BookOpen, pdf: FileText }

const DAY = 86400000

const formatSlot = iso =>
  formatDateTime(iso, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

/** How many whole days from now until the given moment, floored at zero. */
const daysUntil = iso => {
  const ms = new Date(iso).getTime() - Date.now()
  return Math.max(0, Math.ceil(ms / DAY))
}

const startOfDay = date => {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

/** The seven days of the current week, Monday first, each carrying whether a
 *  session is booked on it and whether it is today. */
function weekDays(bookings, locale) {
  const today = startOfDay(new Date())
  const weekday = (today.getDay() + 6) % 7
  const monday = new Date(today.getTime() - weekday * DAY)
  const booked = new Set(
    bookings
      .filter(b => b.status !== 'canceled')
      .map(b => startOfDay(new Date(b.slot_start)).getTime())
  )
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday.getTime() + index * DAY)
    return {
      key: date.toISOString(),
      label: date.toLocaleDateString(locale, { weekday: 'short' }),
      day: date.getDate(),
      booked: booked.has(date.getTime()),
      today: date.getTime() === today.getTime(),
      past: date.getTime() < today.getTime(),
    }
  })
}

function TileLink({ onNavigate, view, children }) {
  return (
    <button
      type="button"
      onClick={() => onNavigate(view)}
      className="mt-auto inline-flex items-center gap-1.5 self-start rounded-df-xs pt-5 text-[12px] font-700 uppercase tracking-[0.12em] text-df-text-muted transition-colors duration-df-fast ease-df-out hover:text-df-accent-bright"
    >
      {children}
      <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
    </button>
  )
}

function TileLabel({ icon: Icon, children }) {
  return (
    <MicroLabel className="flex items-center gap-2">
      <Icon aria-hidden="true" className="h-3.5 w-3.5 text-df-accent-bright" />
      {children}
    </MicroLabel>
  )
}

/**
 * The first screen: what is happening next, how the week is laid out, what is
 * being followed, what was eaten against, where the weight is going, what the
 * coach last said, and what to watch next. Seven questions, one screen, in
 * the order a person actually asks them.
 *
 * The next session is the one thing on the screen set in the brand red. It is
 * the only item here with a time on it, and the time is what a client opens
 * the portal to check.
 *
 * The figures count up from zero on arrival rather than appearing. It is the
 * one place on the site where a number moving is worth the frame: it says the
 * figure was read out of an account rather than printed on a page, and the
 * eye lands on it without being pointed at.
 */
export default function TodayView({
  bookings,
  plans,
  nutrition,
  progress,
  messages,
  content,
  entitlements,
  profile,
  user,
  onNavigate,
}) {
  const { portal } = useContent()
  const { locale } = useLanguage()
  const copy = portal.hero
  const { hasCoaching, hasMembership } = entitlements
  const dateLocale = locale === 'es' ? 'es-ES' : 'en-US'

  const now = Date.now()
  const upcoming = bookings
    .filter(b => new Date(b.slot_start).getTime() >= now && b.status !== 'canceled')
    .sort((a, b) => new Date(a.slot_start).getTime() - new Date(b.slot_start).getTime())
  const nextSession = upcoming[0]
  const week = weekDays(bookings, dateLocale)

  const plan = plans[0]
  const planWeeks = Array.isArray(plan?.content?.weeks) ? plan.content.weeks.length : 0
  const planAge = plan?.created_at
    ? Math.floor((now - new Date(plan.created_at).getTime()) / DAY)
    : 0
  const planWeek = planWeeks > 0 ? Math.min(planWeeks, Math.floor(planAge / 7) + 1) : 0

  const weights = progress.filter(entry => entry.weight != null).map(entry => Number(entry.weight))
  const trend = [...weights].reverse()
  const latestWeight = weights[0]
  // The delta is against the entry before this one, which is the comparison a
  // person logging weekly is making in their head anyway.
  const previousWeight = weights[1]
  const weightDelta =
    latestWeight != null && previousWeight != null
      ? Number((latestWeight - previousWeight).toFixed(1))
      : null
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)
  const entriesThisMonth = progress.filter(
    entry => new Date(`${entry.entry_date}T00:00:00`).getTime() >= monthStart.getTime()
  ).length

  const macros = nutrition
    ? [
        { label: portal.nutrition.proteinLabel, value: nutrition.protein_g },
        { label: portal.nutrition.carbsLabel, value: nutrition.carbs_g },
        { label: portal.nutrition.fatLabel, value: nutrition.fat_g },
      ].filter(macro => macro.value != null)
    : []
  // Each macro is drawn against the largest of them, so the three bars compare
  // with one another rather than each filling its own track to the same width.
  const macroCeiling = macros.reduce((max, macro) => Math.max(max, Number(macro.value)), 0)

  const lastMessage = messages[messages.length - 1]
  const recentContent = content.slice(0, 3)

  const displayName = profile?.full_name?.trim().split(' ')[0] || user?.email || ''

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-400 font-display text-[clamp(2.5rem,7vw,4.5rem)] uppercase leading-[0.88] tracking-[-0.02em] text-df-text">
            {portal.overview.greeting}
            {displayName ? `, ${displayName}` : ''}
            <span className="text-df-accent-bright">.</span>
          </h2>
          <p className="mt-3 text-[15px] text-df-text-muted">{portal.overview.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={hasMembership ? 'positive' : 'neutral'} variant="soft" size="md">
            <ShieldCheck aria-hidden="true" className="h-3 w-3" />
            {portal.overview.membershipStatus}:{' '}
            {hasMembership ? portal.overview.active : portal.overview.inactive}
          </Badge>
          <Badge tone={hasCoaching ? 'accent' : 'neutral'} variant="soft" size="md">
            <Dumbbell aria-hidden="true" className="h-3 w-3" />
            {portal.overview.coachingStatus}:{' '}
            {hasCoaching ? portal.overview.active : portal.overview.inactive}
          </Badge>
        </div>
      </header>

      {!hasMembership && !hasCoaching && (
        <EmptyState
          body={portal.overview.noEntitlements}
          ctaLabel={portal.overview.explorePrograms}
          ctaHref="/#programs"
        />
      )}

      <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
        {/* The focus card. */}
        <div className="df-grain relative flex flex-col overflow-hidden rounded-df-xl bg-df-accent bg-df-accent-gradient p-6 text-df-on-accent shadow-df-accent sm:p-8 lg:col-span-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-df-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.22),transparent)]"
          />
          <span
            aria-hidden="true"
            className="font-400 pointer-events-none absolute -bottom-6 -right-2 select-none font-display text-[9rem] leading-none tracking-[-0.03em] text-white opacity-[0.08]"
          >
            {nextSession ? String(daysUntil(nextSession.slot_start)).padStart(2, '0') : '00'}
          </span>

          <div className="relative flex items-start justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-[11px] font-700 uppercase tracking-[0.18em] opacity-90">
              <CalendarClock aria-hidden="true" className="h-3.5 w-3.5" />
              {copy.nextSession}
            </span>
            {nextSession && (
              <span className="inline-flex h-6 items-center rounded-df-full bg-white/15 px-2.5 text-[10px] font-700 uppercase tracking-[0.14em] backdrop-blur-sm">
                {portal.bookings.status[nextSession.status] ?? nextSession.status}
              </span>
            )}
          </div>

          {nextSession ? (
            <div className="relative mt-8 flex-1">
              <p className="font-400 font-display text-[clamp(2rem,5vw,3.5rem)] uppercase leading-[0.9] tracking-[-0.02em]">
                {formatSlot(nextSession.slot_start)}
              </p>
              <p className="mt-4 text-[15px] font-500 opacity-90">
                {SERVICE_LABEL[nextSession.service] ?? nextSession.service}
                {nextSession.training_focus ? ` · ${nextSession.training_focus}` : ''}
              </p>
              <p className="mt-2 text-[13px] font-600 uppercase tabular-nums tracking-[0.12em] opacity-80">
                <CountUp to={daysUntil(nextSession.slot_start)} duration={0.8} /> {copy.daysAway}
              </p>
            </div>
          ) : (
            <p className="relative mt-8 flex-1 text-lg leading-relaxed opacity-90">
              {copy.noUpcoming}
            </p>
          )}

          <div className="relative mt-8 flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="md"
              className="border-white/30 bg-white bg-none text-df-accent-deep shadow-none hover:bg-white/90 hover:bg-none hover:shadow-none"
            >
              <Link href="/single-session#book">
                {copy.book}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Button>
            {nextSession && (
              <Button
                type="button"
                variant="ghost"
                size="md"
                className="text-white hover:bg-white/10 hover:text-white"
                onClick={() => onNavigate('bookings')}
              >
                {copy.allSessions}
              </Button>
            )}
          </div>
        </div>

        {/* Weight and fuel, stacked beside the focus. */}
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:gap-5">
          <Card className="flex flex-col">
            <Stat
              icon={LineChart}
              label={copy.latestWeight}
              unit={latestWeight != null ? 'lb' : undefined}
              value={latestWeight != null ? <CountUp to={latestWeight} duration={0.9} /> : '—'}
              delta={weightDelta}
              deltaLabel={weightDelta != null ? copy.sinceLast : undefined}
              goodDirection="down"
            />
            {trend.length >= 2 ? (
              <div className="mt-4">
                <Sparkline values={trend} height={44} />
              </div>
            ) : (
              <p className="mt-4 text-[13px] text-df-text-faint">
                {progress.length} {copy.entries}
              </p>
            )}
            <TileLink onNavigate={onNavigate} view="progress">
              {latestWeight != null ? copy.viewProgress : copy.startTracking}
            </TileLink>
          </Card>

          <Card className="flex flex-col">
            <Stat
              icon={Flame}
              label={copy.todaysFuel}
              unit={nutrition?.calorie_target != null ? copy.kcal : undefined}
              value={
                nutrition?.calorie_target != null ? (
                  <CountUp to={nutrition.calorie_target} duration={0.9} />
                ) : (
                  '—'
                )
              }
            />
            {macros.length > 0 ? (
              <div className="mt-4 flex flex-col gap-2.5">
                {macros.map(macro => (
                  <Meter
                    key={macro.label}
                    value={Number(macro.value)}
                    max={macroCeiling}
                    label={macro.label}
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[11px] font-700 uppercase tracking-[0.12em] text-df-text-faint">
                        {macro.label}
                      </span>
                      <span className="text-[13px] font-600 tabular-nums text-df-text">
                        {macro.value}
                        {portal.nutrition.grams}
                      </span>
                    </div>
                  </Meter>
                ))}
              </div>
            ) : (
              <p className="mt-4 flex-1 text-[15px] leading-relaxed text-df-text-muted">
                {hasCoaching ? copy.noFuel : copy.planLocked}
              </p>
            )}
            {nutrition && (
              <TileLink onNavigate={onNavigate} view="nutrition">
                {copy.viewNutrition}
              </TileLink>
            )}
          </Card>
        </div>

        {/* The week. */}
        <Card className="lg:col-span-12" padded={false}>
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-center gap-6">
              <TileLabel icon={CalendarClock}>{copy.thisWeek}</TileLabel>
              <span className="hidden text-[13px] text-df-text-muted sm:inline">
                {upcoming.length} {portal.bookings.upcoming.toLowerCase()}
              </span>
            </div>
            <ol className="grid grid-cols-7 gap-1.5 sm:w-auto sm:gap-2">
              {week.map(day => (
                <li
                  key={day.key}
                  aria-current={day.today ? 'date' : undefined}
                  className={cn(
                    'flex h-16 w-full flex-col items-center justify-center gap-1 rounded-df-md text-center transition-colors duration-df-fast ease-df-out sm:w-14',
                    day.today
                      ? 'bg-df-accent bg-df-accent-gradient text-df-on-accent shadow-df-key'
                      : day.booked
                        ? 'bg-df-accent-soft text-df-text'
                        : 'bg-df-surface-2 text-df-text-muted',
                    day.past && !day.today && 'opacity-60'
                  )}
                >
                  <span className="text-[10px] font-700 uppercase tracking-[0.12em]">
                    {day.label}
                  </span>
                  <span className="font-400 font-display text-xl leading-none">{day.day}</span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      'h-1 w-1 rounded-df-full',
                      day.booked
                        ? day.today
                          ? 'bg-df-on-accent'
                          : 'bg-df-accent-bright'
                        : 'bg-transparent'
                    )}
                  />
                  <span className="sr-only">{day.booked ? copy.bookedLabel : copy.restLabel}</span>
                </li>
              ))}
            </ol>
          </div>
        </Card>

        {/* The plan. */}
        <Card className="flex flex-col lg:col-span-7">
          <div className="flex items-start justify-between gap-3">
            <TileLabel icon={ClipboardList}>{copy.currentPlan}</TileLabel>
            {planWeeks > 0 && (
              <span className="text-[12px] font-600 tabular-nums text-df-accent-bright">
                {planWeek} / {planWeeks} {copy.weeks}
              </span>
            )}
          </div>
          {plan ? (
            <div className="mt-5">
              <p className="font-400 font-display text-[clamp(1.75rem,3.5vw,2.5rem)] uppercase leading-[0.95] tracking-[-0.015em] text-df-text">
                {plan.title}
              </p>
              {plan.summary && (
                <p className="mt-3 max-w-df-measure text-[15px] leading-relaxed text-df-text-muted">
                  {plan.summary}
                </p>
              )}
              {planWeeks > 0 && (
                <div className="mt-6">
                  <Meter value={planWeek} max={planWeeks} label={copy.currentPlan}>
                    <div className="flex items-baseline justify-between gap-3 text-[11px] font-700 uppercase tracking-[0.12em] text-df-text-faint">
                      <span>
                        {portal.library.weekLabel} {planWeek}
                      </span>
                      <span className="tabular-nums">
                        {Math.round((planWeek / planWeeks) * 100)}% {copy.planProgress}
                      </span>
                    </div>
                  </Meter>
                </div>
              )}
            </div>
          ) : (
            <p className="mt-5 text-[15px] leading-relaxed text-df-text-muted">
              {hasCoaching ? copy.noPlan : copy.planLocked}
            </p>
          )}
          {plan && (
            <TileLink onNavigate={onNavigate} view="plan">
              {copy.viewPlan}
            </TileLink>
          )}
        </Card>

        {/* The coach's last word. */}
        <Card className="flex flex-col lg:col-span-5">
          <TileLabel icon={MessageSquare}>{copy.messagesTitle}</TileLabel>
          {hasCoaching ? (
            lastMessage ? (
              <div className="mt-5 flex flex-1 flex-col">
                <p className="text-[11px] font-700 uppercase tracking-[0.14em] text-df-text-faint">
                  {lastMessage.sender === 'client' ? portal.messages.youName : copy.latestFromCoach}
                  {' · '}
                  {formatDateTime(lastMessage.created_at)}
                </p>
                <blockquote className="mt-3 line-clamp-4 font-accent text-lg italic leading-relaxed text-df-text">
                  “{lastMessage.body}”
                </blockquote>
              </div>
            ) : (
              <p className="mt-5 flex-1 text-[15px] leading-relaxed text-df-text-muted">
                {copy.noMessages}
              </p>
            )
          ) : (
            <p className="mt-5 flex-1 text-[15px] leading-relaxed text-df-text-muted">
              {copy.messagesLocked}
            </p>
          )}
          {hasCoaching && (
            <TileLink onNavigate={onNavigate} view="messages">
              {copy.openMessages}
            </TileLink>
          )}
        </Card>

        {/* What to watch next. */}
        <Card className="flex flex-col lg:col-span-12">
          <div className="flex items-center justify-between gap-3">
            <TileLabel icon={PlayCircle}>{copy.libraryTitle}</TileLabel>
            {(hasMembership || hasCoaching) && (
              <button
                type="button"
                onClick={() => onNavigate('library')}
                className="inline-flex items-center gap-1.5 text-[12px] font-700 uppercase tracking-[0.12em] text-df-text-muted transition-colors duration-df-fast ease-df-out hover:text-df-accent-bright"
              >
                {copy.openLibrary}
                <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          {hasMembership || hasCoaching ? (
            recentContent.length > 0 ? (
              <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                {recentContent.map(item => {
                  const Icon = MEDIA_ICON[item.media_type] ?? PlayCircle
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => onNavigate('library')}
                        className="group flex h-full w-full items-start gap-3 rounded-df-md bg-df-surface-2 p-4 text-left shadow-df-sm transition-shadow duration-df-base ease-df-out hover:shadow-df-md"
                      >
                        <span
                          aria-hidden="true"
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-df-full bg-df-accent-soft text-df-accent-bright transition-colors duration-df-fast ease-df-out group-hover:bg-df-accent group-hover:text-df-on-accent"
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[14px] font-600 text-df-text">
                            {item.title}
                          </span>
                          {item.program && (
                            <span className="mt-0.5 block text-[12px] text-df-text-faint">
                              {item.program}
                              {item.week != null
                                ? ` · ${portal.library.weekLabel} ${item.week}`
                                : ''}
                            </span>
                          )}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="mt-5 text-[15px] leading-relaxed text-df-text-muted">
                {portal.library.empty}
              </p>
            )
          ) : (
            <p className="mt-5 text-[15px] leading-relaxed text-df-text-muted">
              {copy.libraryLocked}
            </p>
          )}
        </Card>
      </div>

      <p className="text-[12px] text-df-text-faint">
        {entriesThisMonth} {copy.streak.toLowerCase()}
      </p>
    </div>
  )
}

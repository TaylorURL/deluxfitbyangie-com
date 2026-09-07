import {
  ArrowRight,
  CalendarClock,
  ClipboardList,
  Dumbbell,
  Flame,
  LineChart,
  ShieldCheck,
} from 'lucide-react'
import { Badge, Button, Card, Meter, MicroLabel, Stat, cn } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { Link } from '@/router'
import { formatDateTime } from '@/lib/datetime'
import CountUp from '@/components/reactbits/CountUp'
import { EmptyState } from './panels/PanelPrimitives'
import Sparkline from '@/components/ui/Sparkline'

const SERVICE_LABEL = {
  single_session: 'Single Live Session',
  live_program: 'Live Training Program',
}

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
  return Math.max(0, Math.ceil(ms / 86400000))
}

function TileLink({ onNavigate, view, children }) {
  return (
    <button
      type="button"
      onClick={() => onNavigate(view)}
      className="mt-5 inline-flex items-center gap-1.5 self-start rounded-df-xs text-[12px] font-700 uppercase tracking-[0.12em] text-df-text-muted transition-colors duration-df-fast ease-df-out hover:text-df-accent-bright"
    >
      {children}
      <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
    </button>
  )
}

/**
 * The first screen: what is happening next, what is being followed, what was
 * eaten against, and where the weight is going. Four questions, four tiles, in
 * the order a person actually asks them.
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
  entitlements,
  profile,
  user,
  onNavigate,
}) {
  const { portal } = useContent()
  const copy = portal.hero
  const { hasCoaching, hasMembership } = entitlements

  const now = Date.now()
  const nextSession = bookings
    .filter(b => new Date(b.slot_start).getTime() >= now && b.status !== 'canceled')
    .sort((a, b) => new Date(a.slot_start).getTime() - new Date(b.slot_start).getTime())[0]

  const plan = plans[0]
  const planWeeks = Array.isArray(plan?.content?.weeks) ? plan.content.weeks.length : 0

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

  const displayName = profile?.full_name?.trim().split(' ')[0] || user?.email || ''

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="font-400 font-display text-[clamp(1.75rem,5vw,2.5rem)] uppercase leading-[0.95] tracking-tight text-df-text">
          {portal.overview.greeting}
          {displayName ? `, ${displayName}` : ''}
          <span className="text-df-accent">.</span>
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-2">
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card variant="elevated" className="flex flex-col sm:col-span-2 lg:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <MicroLabel className="flex items-center gap-2">
              <CalendarClock aria-hidden="true" className="h-3.5 w-3.5 text-df-accent-bright" />
              {copy.nextSession}
            </MicroLabel>
            {nextSession && (
              <Badge tone="accent" variant="outline" size="sm">
                {nextSession.status}
              </Badge>
            )}
          </div>

          {nextSession ? (
            <div className="mt-5 flex-1">
              <p className="font-400 font-display text-[clamp(1.5rem,3.5vw,2.5rem)] uppercase leading-[0.95] tracking-tight text-df-text">
                {formatSlot(nextSession.slot_start)}
              </p>
              <p className="mt-3 text-[15px] text-df-text-muted">
                {SERVICE_LABEL[nextSession.service] ?? nextSession.service}
              </p>
              {nextSession.training_focus && (
                <p className="mt-1 text-[15px] text-df-text-muted">{nextSession.training_focus}</p>
              )}
              <p className="mt-4 text-[13px] font-600 tabular-nums text-df-accent-bright">
                <CountUp to={daysUntil(nextSession.slot_start)} duration={0.8} /> {copy.daysAway}
              </p>
            </div>
          ) : (
            <p className="mt-5 flex-1 text-[15px] leading-relaxed text-df-text-muted">
              {copy.noUpcoming}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button asChild size="md">
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
                onClick={() => onNavigate('bookings')}
              >
                {copy.allSessions}
              </Button>
            )}
          </div>
        </Card>

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
            <div className="mt-5">
              <Sparkline values={trend} height={40} />
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
            <div className="mt-5 flex flex-col gap-3">
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

        <Card className={cn('flex flex-col sm:col-span-2 lg:col-span-2')}>
          <MicroLabel className="flex items-center gap-2">
            <ClipboardList aria-hidden="true" className="h-3.5 w-3.5 text-df-accent-bright" />
            {copy.currentPlan}
          </MicroLabel>
          {plan ? (
            <div className="mt-4 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
              <div className="min-w-0">
                <p className="font-400 font-display text-2xl uppercase leading-tight tracking-[0.01em] text-df-text">
                  {plan.title}
                </p>
                {plan.summary && (
                  <p className="mt-2 max-w-df-measure text-[15px] leading-relaxed text-df-text-muted">
                    {plan.summary}
                  </p>
                )}
              </div>
              {planWeeks > 0 && (
                <p className="shrink-0 text-[13px] font-600 tabular-nums text-df-accent-bright">
                  {planWeeks} {copy.weeks}
                </p>
              )}
            </div>
          ) : (
            <p className="mt-4 text-[15px] leading-relaxed text-df-text-muted">
              {hasCoaching ? copy.noPlan : copy.planLocked}
            </p>
          )}
          {plan && (
            <TileLink onNavigate={onNavigate} view="plan">
              {copy.viewPlan}
            </TileLink>
          )}
        </Card>
      </div>
    </div>
  )
}

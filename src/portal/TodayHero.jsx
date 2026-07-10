import { ArrowRight, ArrowUpRight, Calendar, ClipboardList, Flame, LineChart } from 'lucide-react'
import { Badge, Button, cn } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { Link } from '@/router'
import { formatDateTime } from '@/lib/datetime'
import Sparkline from './panels/Sparkline'

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

/** TileLabel — the small crimson-marked caption that opens every hero tile,
 * echoing the marketing eyebrow motif at panel scale. */
function TileLabel({ icon: Icon, children }) {
  return (
    <p className="inline-flex items-center gap-2 text-[11px] font-700 uppercase tracking-[0.18em] text-df-text-muted">
      <Icon className="h-3.5 w-3.5 text-df-accent-bright" aria-hidden="true" />
      {children}
    </p>
  )
}

/** JumpLink — an in-page anchor to the matching deep section below the hero. */
function JumpLink({ href, children }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-1.5 rounded-df-xs text-[11px] font-700 uppercase tracking-[0.16em] text-df-text-muted transition-colors duration-150 ease-df-out hover:text-df-accent-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-df-bg"
    >
      {children}
      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
    </a>
  )
}

/** Tile — shared hero cell shell so spacing/border rhythm stays consistent and
 * the dominant cell can opt into a heavier treatment. */
function Tile({ className, dominant = false, children }) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col rounded-df-lg border p-5 sm:p-6',
        dominant
          ? 'border-df-border-strong bg-df-surface-2 shadow-df-lg'
          : 'border-df-border bg-df-surface',
        className
      )}
    >
      {children}
    </div>
  )
}

/**
 * TodayHero — the always-live "at a glance" strip that opens the dashboard. It
 * is a presentational composition over data the portal already loads: the next
 * booked session (the page's hero CTA is booking), the current plan, today's
 * nutrition target, and the latest progress reading. No data is fetched here and
 * no mutations fire — deep detail lives in the anchored sections below.
 */
export default function TodayHero({ bookings, plans, nutrition, progress, entitlements }) {
  const { portal } = useContent()
  const copy = portal.hero
  const { hasCoaching } = entitlements

  const now = Date.now()
  const nextSession = bookings
    .filter(b => new Date(b.slot_start).getTime() >= now && b.status !== 'canceled')
    .sort((a, b) => new Date(a.slot_start).getTime() - new Date(b.slot_start).getTime())[0]

  const plan = plans[0]
  const planWeeks = Array.isArray(plan?.content?.weeks) ? plan.content.weeks.length : 0

  const trend = progress
    .filter(entry => entry.weight != null)
    .map(entry => Number(entry.weight))
    .reverse()
  const latestWeight = progress.find(entry => entry.weight != null)?.weight

  const macros = nutrition
    ? [
        { label: portal.nutrition.proteinLabel, value: nutrition.protein_g },
        { label: portal.nutrition.carbsLabel, value: nutrition.carbs_g },
        { label: portal.nutrition.fatLabel, value: nutrition.fat_g },
      ]
    : []

  return (
    <section aria-label={copy.eyebrow} className="animate-df-fade-up">
      <p className="mb-5 inline-flex items-center gap-2.5 text-[11px] font-700 uppercase tracking-[0.22em] text-df-accent-bright">
        <span className="h-px w-7 bg-df-accent" aria-hidden="true" />
        {copy.eyebrow}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {/* Next session — the dominant cell; booking is the primary action. */}
        <Tile dominant className="sm:col-span-2 lg:col-span-2 lg:row-span-2">
          <div className="flex items-center justify-between gap-3">
            <TileLabel icon={Calendar}>{copy.nextSession}</TileLabel>
            {nextSession && (
              <Badge
                tone={nextSession.status === 'canceled' ? 'neutral' : 'accent'}
                variant="outline"
                size="sm"
              >
                {nextSession.status}
              </Badge>
            )}
          </div>

          {nextSession ? (
            <div className="mt-5 flex-1">
              <p className="font-400 font-display text-[clamp(1.75rem,3.5vw,2.75rem)] uppercase leading-[0.95] tracking-tight text-df-text">
                {formatSlot(nextSession.slot_start)}
              </p>
              <p className="mt-3 text-sm text-df-text-muted">
                {SERVICE_LABEL[nextSession.service] ?? nextSession.service}
                {nextSession.training_focus ? ` · ${nextSession.training_focus}` : ''}
              </p>
            </div>
          ) : (
            <p className="mt-5 flex-1 text-[15px] leading-relaxed text-df-text-muted">
              {copy.noUpcoming}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Button asChild size="lg">
              <Link href="/single-session#book">
                {copy.book}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            {nextSession && <JumpLink href="#bookings">{copy.allSessions}</JumpLink>}
          </div>
        </Tile>

        {/* Current plan */}
        <Tile className="sm:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <TileLabel icon={ClipboardList}>{copy.currentPlan}</TileLabel>
            {plan && <JumpLink href="#plan">{copy.viewPlan}</JumpLink>}
          </div>
          {plan ? (
            <div className="mt-4 flex-1">
              <p className="font-400 font-display text-xl uppercase leading-tight tracking-[0.01em] text-df-text">
                {plan.title}
              </p>
              {planWeeks > 0 && (
                <p className="mt-2 text-[11px] font-700 uppercase tracking-[0.16em] text-df-accent-bright">
                  {planWeeks} {copy.weeks}
                </p>
              )}
              {plan.summary && (
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-df-text-muted">
                  {plan.summary}
                </p>
              )}
            </div>
          ) : (
            <p className="mt-4 flex-1 text-sm leading-relaxed text-df-text-muted">
              {hasCoaching ? copy.noPlan : copy.planLocked}
            </p>
          )}
        </Tile>

        {/* Today's fuel — nutrition target */}
        <Tile>
          <TileLabel icon={Flame}>{copy.todaysFuel}</TileLabel>
          {nutrition ? (
            <>
              <div className="mt-4 flex-1">
                <p className="font-400 font-display text-3xl leading-none tracking-tight text-df-text">
                  {nutrition.calorie_target ?? '—'}
                </p>
                <p className="mt-1.5 text-[10px] font-700 uppercase tracking-[0.16em] text-df-text-faint">
                  {copy.kcal}
                </p>
                {macros.some(macro => macro.value != null) && (
                  <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-df-border pt-3">
                    {macros.map(macro => (
                      <div key={macro.label} className="flex items-baseline gap-1">
                        <dt className="text-[10px] font-700 uppercase tracking-[0.12em] text-df-text-faint">
                          {macro.label}
                        </dt>
                        <dd className="text-sm font-600 tabular-nums text-df-text">
                          {macro.value ?? '—'}
                          {macro.value != null ? portal.nutrition.grams : ''}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
              <div className="mt-4">
                <JumpLink href="#nutrition">{copy.viewNutrition}</JumpLink>
              </div>
            </>
          ) : (
            <p className="mt-4 flex-1 text-sm leading-relaxed text-df-text-muted">
              {hasCoaching ? copy.noFuel : copy.planLocked}
            </p>
          )}
        </Tile>

        {/* Latest progress */}
        <Tile>
          <TileLabel icon={LineChart}>{copy.latestWeight}</TileLabel>
          {latestWeight != null ? (
            <>
              <div className="mt-4 flex-1">
                <p className="font-400 font-display text-3xl leading-none tracking-tight text-df-text">
                  {latestWeight}
                  <span className="ml-1 text-sm text-df-text-muted">lb</span>
                </p>
                {trend.length >= 2 ? (
                  <div className="mt-4">
                    <Sparkline values={trend} height={36} />
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-df-text-faint">
                    {progress.length} {copy.entries}
                  </p>
                )}
              </div>
              <div className="mt-4">
                <JumpLink href="#progress">{copy.viewProgress}</JumpLink>
              </div>
            </>
          ) : (
            <div className="mt-4 flex-1">
              <p className="text-sm leading-relaxed text-df-text-muted">{copy.noProgress}</p>
              <div className="mt-4">
                <JumpLink href="#progress">{copy.startTracking}</JumpLink>
              </div>
            </div>
          )}
        </Tile>
      </div>
    </section>
  )
}

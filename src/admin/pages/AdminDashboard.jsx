import { ArrowUpRight, CalendarClock, CreditCard, Dumbbell, Users } from 'lucide-react'
import { Card } from '@deluxfit/ds'
import { Link } from '@/router'
import { useAuth } from '@/auth/useAuth'
import { listClients, listAllMemberships, listAllBookings } from '@/lib/adminApi'
import { FormError } from '@/components/forms/FormFeedback'
import { SectionCard, AdminLoading, MetricTile, useAsyncData } from '../components/AdminPrimitives'
import { ADMIN_ROUTES } from '../routes'

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

const loadMetrics = async () => {
  const [clients, memberships, bookings] = await Promise.all([
    listClients(),
    listAllMemberships(),
    listAllBookings(),
  ])

  const now = Date.now()
  const weekEnd = now + WEEK_MS

  return {
    clients: clients.length,
    coachingSeats: memberships.filter(m => m.product === 'coaching' && m.status === 'active')
      .length,
    activeMemberships: memberships.filter(m => m.product === 'membership' && m.status === 'active')
      .length,
    upcomingBookings: bookings.filter(b => {
      const start = new Date(b.slot_start).getTime()
      return start >= now && start <= weekEnd && b.status !== 'canceled'
    }).length,
  }
}

const TILES = [
  { key: 'clients', label: 'Total clients', icon: Users, hint: 'Everyone with an account' },
  { key: 'coachingSeats', label: 'Active coaching', icon: Dumbbell, hint: 'Live coaching seats' },
  {
    key: 'activeMemberships',
    label: 'Active memberships',
    icon: CreditCard,
    hint: 'Recurring subscribers',
  },
  {
    key: 'upcomingBookings',
    label: 'Bookings this week',
    icon: CalendarClock,
    hint: 'Next 7 days, excl. canceled',
  },
]

/** Routes surfaced as quick-jump cards — every entry except the dashboard itself. */
const QUICK_LINKS = ADMIN_ROUTES.filter(route => route.path !== '/admin')

/**
 * AdminDashboard — the landing page after a staff sign-in: a welcome banner,
 * at-a-glance business metrics computed live from the admin reads, and quick
 * jumps into every management surface.
 */
export default function AdminDashboard() {
  const { profile, user } = useAuth()
  const greetingName = profile?.full_name || user?.email || 'Coach'
  const { data, loading, error } = useAsyncData(loadMetrics, [], null)

  return (
    <div className="grid gap-8">
      <Card variant="elevated" padded className="relative overflow-hidden">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-df-full bg-df-accent-softer blur-3xl"
        />
        <p className="text-[10px] font-700 uppercase tracking-[0.28em] text-df-accent">Welcome back</p>
        <p className="font-400 mt-3 font-display text-2xl uppercase leading-tight tracking-tight text-df-text sm:text-3xl">
          Hi, {greetingName}.
        </p>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-df-text-muted">
          Here's how the business looks right now. Use the metrics below, or jump straight into a
          management surface.
        </p>
      </Card>

      <section className="grid gap-4">
        <p className="text-[10px] font-700 uppercase tracking-[0.28em] text-df-text-faint">
          At a glance
        </p>
        {loading ? (
          <SectionCard>
            <AdminLoading label="Loading metrics…" />
          </SectionCard>
        ) : error ? (
          <SectionCard>
            <FormError body={error} />
          </SectionCard>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {TILES.map(({ key, label, icon, hint }) => (
              <MetricTile key={key} label={label} value={data?.[key] ?? 0} icon={icon} hint={hint} />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-4">
        <p className="text-[10px] font-700 uppercase tracking-[0.28em] text-df-text-faint">
          Quick jump
        </p>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {QUICK_LINKS.map(route => {
            const Icon = route.icon
            return (
              <Link
                key={route.path}
                href={route.path}
                className="group flex items-start gap-3.5 rounded-df-lg border border-df-border bg-df-surface-2 p-5 transition-colors duration-200 ease-df-out hover:border-df-border-hover hover:bg-df-surface-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-df-bg"
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-df-md bg-df-accent-soft text-df-accent-bright"
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-400 font-display text-base uppercase tracking-tight text-df-text">
                      {route.label}
                    </p>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-df-text-faint transition-all duration-200 ease-df-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-df-accent-bright"
                    />
                  </div>
                  {route.description && (
                    <p className="mt-1 text-xs leading-relaxed text-df-text-muted">
                      {route.description}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}

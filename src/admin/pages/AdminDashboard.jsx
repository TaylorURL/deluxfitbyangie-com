import { ArrowUpRight, CalendarClock, CreditCard, Dumbbell, Users } from 'lucide-react'
import { MicroLabel, Panel } from '@deluxfit/ds'
import { Link } from '@/router'
import { useAuth } from '@/auth/useAuth'
import { listClients, listAllMemberships, listAllBookings } from '@/lib/api/adminApi'
import { FormError } from '@/components/forms/FormFeedback'
import { SectionCard, AdminLoading, MetricTile, useAsyncData } from '../AdminPrimitives'
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
  { key: 'clients', label: 'Total Clients', icon: Users, hint: 'Everyone with an account' },
  { key: 'coachingSeats', label: 'Active Coaching', icon: Dumbbell, hint: 'Live coaching seats' },
  {
    key: 'activeMemberships',
    label: 'Active Memberships',
    icon: CreditCard,
    hint: 'Recurring subscribers',
  },
  {
    key: 'upcomingBookings',
    label: 'Bookings This Week',
    icon: CalendarClock,
    hint: 'Next 7 days, excl. canceled',
  },
]

export default function AdminDashboard() {
  const { profile, user } = useAuth()
  const greetingName = profile?.full_name || user?.email || 'Coach'
  const { data, loading, error } = useAsyncData(loadMetrics, [], null)

  // routes.js imports this component and this component reads routes.js, so a
  // module-scope read of ADMIN_ROUTES lands in the temporal dead zone. Reading
  // it here happens after both modules have finished evaluating.
  const quickLinks = ADMIN_ROUTES.filter(route => route.path !== '/admin')

  return (
    <div className="grid gap-8">
      <Panel>
        <h1 className="font-400 font-display text-[clamp(1.75rem,5vw,2.5rem)] uppercase leading-[0.95] tracking-tight text-df-text">
          Hi, {greetingName}
          <span className="text-df-accent">.</span>
        </h1>
        <p className="mt-3 max-w-df-measure text-[15px] leading-relaxed text-df-text-muted">
          Here's how the business looks right now. Use the metrics below, or jump straight into a
          management surface.
        </p>
      </Panel>

      <section className="grid gap-4">
        <MicroLabel>At a Glance</MicroLabel>
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
              <MetricTile
                key={key}
                label={label}
                value={data?.[key] ?? 0}
                icon={icon}
                hint={hint}
              />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-4">
        <MicroLabel>Quick Jump</MicroLabel>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map(route => {
            const Icon = route.icon
            return (
              <Link
                key={route.path}
                href={route.path}
                className="group flex items-start gap-4 rounded-df-md bg-df-surface p-5 shadow-df-sm transition-shadow duration-df-base ease-df-out hover:shadow-df-md"
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
                      className="h-4 w-4 shrink-0 text-df-text-faint transition-[transform,color] duration-df-base ease-df-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-df-accent-bright"
                    />
                  </div>
                  {route.description && (
                    <p className="mt-1 text-[13px] leading-relaxed text-df-text-muted">
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

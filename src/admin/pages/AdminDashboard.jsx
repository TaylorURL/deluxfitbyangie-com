import { CalendarClock, CreditCard, Dumbbell, Users } from 'lucide-react'
import { Card } from '@deluxfit/ds'
import { useAuth } from '@/auth/useAuth'
import { listClients, listAllMemberships, listAllBookings } from '@/lib/adminApi'
import { FormError } from '@/components/forms/FormFeedback'
import { SectionCard, AdminLoading, useAsyncData } from '../components/AdminPrimitives'

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
    coachingSeats: memberships.filter(m => m.product === 'coaching' && m.status === 'active').length,
    activeMemberships: memberships.filter(m => m.product === 'membership' && m.status === 'active').length,
    upcomingBookings: bookings.filter(b => {
      const start = new Date(b.slot_start).getTime()
      return start >= now && start <= weekEnd && b.status !== 'canceled'
    }).length,
  }
}

const TILES = [
  { key: 'clients', label: 'Total clients', icon: Users },
  { key: 'coachingSeats', label: 'Active coaching seats', icon: Dumbbell },
  { key: 'activeMemberships', label: 'Active memberships', icon: CreditCard },
  { key: 'upcomingBookings', label: 'Bookings this week', icon: CalendarClock },
]

/**
 * AdminDashboard — the landing page after a staff sign-in: a welcome card plus
 * at-a-glance business metrics computed live from the admin reads.
 */
export default function AdminDashboard() {
  const { profile, user } = useAuth()
  const greetingName = profile?.full_name || user?.email || 'Coach'
  const { data, loading, error } = useAsyncData(loadMetrics, [], null)

  return (
    <div className="grid gap-6">
      <Card variant="elevated" padded>
        <p className="text-[10px] font-700 uppercase tracking-[0.28em] text-df-accent">Welcome</p>
        <p className="mt-3 font-display text-2xl font-400 uppercase leading-tight tracking-tight text-df-text sm:text-3xl">
          Hi, {greetingName}.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-df-text-muted">
          You're signed in as staff. Use the sidebar to manage clients, bookings, plans, and
          content.
        </p>
      </Card>

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
          {TILES.map(({ key, label, icon: Icon }) => (
            <Card key={key} variant="elevated" padded>
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-700 uppercase tracking-[0.28em] text-df-text-faint">
                  {label}
                </p>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-df-full bg-df-accent-soft text-df-accent">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
              <p className="mt-4 font-display text-4xl font-400 leading-none text-df-text">
                {data?.[key] ?? 0}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

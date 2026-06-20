import { Card } from '@deluxfit/ds'
import { useAuth } from '@/auth/useAuth'
import PlaceholderPanel from '../components/PlaceholderPanel'

/**
 * AdminDashboard — the landing page after a staff sign-in. Foundation pass:
 * a welcome card + a placeholder for the metrics tiles that will land in the
 * next iteration (active clients, this-week bookings, MRR, open conversations).
 */
export default function AdminDashboard() {
  const { profile, user } = useAuth()
  const greetingName = profile?.full_name || user?.email || 'Coach'

  return (
    <div className="grid gap-6">
      <Card variant="elevated" padded>
        <p className="text-[10px] font-700 uppercase tracking-[0.28em] text-df-accent">Welcome</p>
        <p className="mt-3 font-display text-2xl font-400 uppercase leading-tight tracking-tight text-df-text sm:text-3xl">
          Hi, {greetingName}.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-df-text-muted">
          You're signed in as staff. Use the sidebar to manage clients, bookings, plans, and
          content. The backend is wired — pages will fill in as the work lands.
        </p>
      </Card>

      <PlaceholderPanel
        eyebrow="Coming soon"
        description="At-a-glance metrics for the business at large."
        comingSoon={[
          'Active members and coaching seats',
          'This week\'s bookings and revenue',
          'Open client conversations',
          'New progress entries since you last signed in',
        ]}
      />
    </div>
  )
}

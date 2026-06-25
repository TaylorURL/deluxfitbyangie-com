import { Badge } from '@deluxfit/ds'
import {
  getClientAssignments,
  getClientBookings,
  getClientMemberships,
  getClientMessages,
  getClientNutrition,
  getClientPlans,
  getClientProfile,
  getClientProgress,
} from '@/lib/adminApi'
import {
  AdminEmpty,
  AdminLoading,
  SectionCard,
  StatusBadge,
  clientLabel,
  fmtDate,
  fmtDateTime,
  useAsyncData,
} from '../components/AdminPrimitives'
import { FormError } from '@/components/forms/FormFeedback'
import ProgressReview from './ProgressReview'
import CoachThread from './CoachThread'
import PlanQuickEditor from './PlanQuickEditor'
import NutritionQuickEditor from './NutritionQuickEditor'

const SERVICE_LABEL = {
  single_session: 'Single session',
  live_program: 'Live program',
}

/** A small titled wrapper so each section card reads consistently. */
function Section({ title, intro, children }) {
  return (
    <SectionCard>
      <div className="mb-5">
        <h3 className="font-400 font-display text-lg uppercase tracking-tight text-df-text">
          {title}
        </h3>
        {intro && <p className="mt-1.5 text-sm leading-relaxed text-df-text-muted">{intro}</p>}
      </div>
      {children}
    </SectionCard>
  )
}

function MembershipSummary({ memberships }) {
  const list = memberships ?? []
  if (list.length === 0) return <AdminEmpty body="No memberships on file." />
  return (
    <div className="grid gap-2">
      {list.map(m => (
        <div
          key={m.id}
          className="bg-df-surface/60 flex flex-wrap items-center justify-between gap-2 rounded-df-lg border border-df-border px-4 py-3"
        >
          <div className="flex items-center gap-2">
            <Badge tone="accent" variant="soft" size="sm">
              {m.product === 'coaching' ? 'Coaching' : 'Membership'}
            </Badge>
            <StatusBadge status={m.status} />
          </div>
          {m.current_period_end && (
            <span className="text-xs text-df-text-faint">
              Renews {fmtDate(m.current_period_end)}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

function BookingsList({ bookings }) {
  const list = bookings ?? []
  if (list.length === 0) return <AdminEmpty body="No bookings yet." />
  return (
    <div className="overflow-x-auto rounded-df-lg border border-df-border">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-df-border bg-df-surface-2 text-[11px] font-700 uppercase tracking-[0.16em] text-df-text-muted">
            <th className="px-4 py-3">Service</th>
            <th className="px-4 py-3">Slot</th>
            <th className="px-4 py-3">Focus</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {list.map(b => (
            <tr key={b.id} className="border-b border-df-border text-df-text-muted last:border-0">
              <td className="px-4 py-3 text-df-text">{SERVICE_LABEL[b.service] ?? b.service}</td>
              <td className="px-4 py-3">{fmtDateTime(b.slot_start)}</td>
              <td className="px-4 py-3">{b.training_focus ?? '—'}</td>
              <td className="px-4 py-3">
                <StatusBadge status={b.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * ClientDetail — the rich per-client coaching surface, reused by the Clients
 * hub (emphasis="manage") and the Monthly Review (emphasis="review"). One
 * loader fetches everything in parallel so a single reload refreshes the whole
 * view after any write. The emphasis only changes section ordering — the coach
 * can both review and update the program from either entry point.
 */
export default function ClientDetail({ clientId, emphasis = 'manage' }) {
  const { data, loading, error, reload } = useAsyncData(
    () =>
      clientId
        ? Promise.all([
            getClientProfile(clientId),
            getClientMemberships(clientId),
            getClientPlans(clientId),
            getClientNutrition(clientId),
            getClientProgress(clientId),
            getClientBookings(clientId),
            getClientMessages(clientId),
            getClientAssignments(clientId),
          ]).then(
            ([
              profile,
              memberships,
              plans,
              nutrition,
              progress,
              bookings,
              messages,
              assignments,
            ]) => ({
              profile,
              memberships,
              plans,
              nutrition,
              progress,
              bookings,
              messages,
              assignments,
            })
          )
        : Promise.resolve(null),
    [clientId]
  )

  if (!clientId) {
    return <AdminEmpty body="Select a client to view their coaching hub." />
  }
  if (loading) {
    return <AdminLoading label="Loading client…" />
  }
  if (error) {
    return <FormError body={error} />
  }
  if (!data?.profile) {
    return <AdminEmpty body="This client could not be found." />
  }

  const { profile, memberships, plans, nutrition, progress, bookings, messages } = data

  const header = (
    <SectionCard>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-400 font-display text-2xl uppercase leading-tight tracking-tight text-df-text sm:text-3xl">
            {clientLabel(profile)}
          </h2>
          {profile.email && <p className="mt-1 text-sm text-df-text-muted">{profile.email}</p>}
          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-df-text-faint">
            Member since {fmtDate(profile.created_at)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(memberships ?? []).map(m => (
            <div key={m.id} className="flex items-center gap-1.5">
              <Badge tone="accent" variant="soft" size="sm">
                {m.product === 'coaching' ? 'Coaching' : 'Membership'}
              </Badge>
              <StatusBadge status={m.status} />
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  )

  const progressSection = (
    <Section
      title="Progress review"
      intro="Weight trend, recent entries, measurements, and photos."
    >
      <ProgressReview progress={progress} />
    </Section>
  )

  const threadSection = (
    <Section title="Messages" intro="In-platform two-way messaging with your client.">
      <CoachThread clientId={clientId} messages={messages} reload={reload} />
    </Section>
  )

  const planSection = (
    <Section title="Training plan" intro="Create or update the client's training program.">
      <PlanQuickEditor clientId={clientId} plans={plans} reload={reload} />
    </Section>
  )

  const nutritionSection = (
    <Section title="Nutrition" intro="Macros, meal structure, resources, and notes.">
      <NutritionQuickEditor clientId={clientId} nutrition={nutrition} reload={reload} />
    </Section>
  )

  const bookingsSection = (
    <Section title="Bookings">
      <BookingsList bookings={bookings} />
    </Section>
  )

  const membershipsSection = (
    <Section title="Memberships">
      <MembershipSummary memberships={memberships} />
    </Section>
  )

  // emphasis="review" leads with what to review (progress + messages), then the
  // program editors. emphasis="manage" leads with the program editors.
  const ordered =
    emphasis === 'review'
      ? [
          progressSection,
          threadSection,
          planSection,
          nutritionSection,
          bookingsSection,
          membershipsSection,
        ]
      : [
          planSection,
          nutritionSection,
          progressSection,
          threadSection,
          bookingsSection,
          membershipsSection,
        ]

  return (
    <div className="grid gap-6">
      {header}
      {ordered.map((section, i) => (
        <div key={i}>{section}</div>
      ))}
    </div>
  )
}

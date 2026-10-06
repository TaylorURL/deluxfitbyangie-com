import { Badge, Card, DataTable, MicroLabel, SplitHeading } from '@deluxfit/ds'
import {
  getClientAssignments,
  getClientBookings,
  getClientMacroIntakes,
  getClientMemberships,
  getClientMessages,
  getClientNutrition,
  getClientPlans,
  getClientProfile,
  getClientProgress,
} from '@/lib/api/adminApi'
import {
  AdminEmpty,
  AdminLoading,
  SectionCard,
  SectionHeading,
  StatusBadge,
  clientLabel,
  fmtDate,
  fmtDateTime,
  useAsyncData,
} from '../AdminPrimitives'
import { FormError } from '@/components/forms/FormFeedback'
import ProgressReview from './ProgressReview'
import CoachThread from './CoachThread'
import PlanQuickEditor from './PlanQuickEditor'
import NutritionQuickEditor from './NutritionQuickEditor'
import MacroIntakeReview from './MacroIntakeReview'

const SERVICE_LABEL = {
  single_session: 'Single session',
  live_program: 'Live program',
}

/* The same header every other panel on the site uses, rather than this file's
   own smaller one: the coach moves between these blocks all day, and a heading
   that changes shape per block makes each read as a different application. */
function Section({ title, intro, children }) {
  return (
    <SectionCard>
      <SectionHeading title={title} intro={intro} />
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
        <Card
          key={m.id}
          variant="inset"
          padded={false}
          className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
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
        </Card>
      ))}
    </div>
  )
}

/* The system's table rather than this file's own: the hand-rolled one had no
   card fallback, so on a phone four columns became a sideways scroll nobody
   finds. */
const BOOKING_COLUMNS = [
  {
    key: 'service',
    header: 'Service',
    primary: true,
    render: booking => SERVICE_LABEL[booking.service] ?? booking.service,
  },
  { key: 'slot', header: 'Slot', render: booking => fmtDateTime(booking.slot_start) },
  { key: 'focus', header: 'Focus', render: booking => booking.training_focus ?? '—' },
  {
    key: 'status',
    header: 'Status',
    render: booking => <StatusBadge status={booking.status} />,
  },
]

function BookingsList({ bookings }) {
  return (
    <DataTable
      caption="Sessions this client has booked"
      columns={BOOKING_COLUMNS}
      rows={bookings ?? []}
      getRowKey={booking => booking.id}
      empty={<AdminEmpty body="No bookings yet." />}
    />
  )
}

/**
 * The hub reads nine sources, one per section. Settling them separately is
 * what keeps a section's failure inside that section: gathered under a single
 * Promise.all, one unreachable table replaces the whole hub with its error
 * message and the eight readable sections go with it.
 */
const settle = result =>
  result.status === 'fulfilled'
    ? { value: result.value, error: null }
    : { value: null, error: result.reason?.message || 'Could not load.' }

async function loadClient(clientId) {
  const [
    profile,
    memberships,
    plans,
    nutrition,
    progress,
    bookings,
    messages,
    assignments,
    macroIntakes,
  ] = await Promise.allSettled([
    getClientProfile(clientId),
    getClientMemberships(clientId),
    getClientPlans(clientId),
    getClientNutrition(clientId),
    getClientProgress(clientId),
    getClientBookings(clientId),
    getClientMessages(clientId),
    getClientAssignments(clientId),
    getClientMacroIntakes(clientId),
  ])
  return {
    profile: settle(profile),
    memberships: settle(memberships),
    plans: settle(plans),
    nutrition: settle(nutrition),
    progress: settle(progress),
    bookings: settle(bookings),
    messages: settle(messages),
    assignments: settle(assignments),
    macroIntakes: settle(macroIntakes),
  }
}

/** Render a section's data, or the reason it is not there. */
function SectionResult({ result, children }) {
  if (result.error) return <FormError body={result.error} />
  return children(result.value)
}

export default function ClientDetail({ clientId, emphasis = 'manage' }) {
  const { data, loading, error, reload } = useAsyncData(
    () => (clientId ? loadClient(clientId) : Promise.resolve(null)),
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
  if (data?.profile.error) {
    return <FormError body={data.profile.error} />
  }
  if (!data?.profile.value) {
    return <AdminEmpty body="This client could not be found." />
  }

  const { memberships, plans, nutrition, progress, bookings, messages, macroIntakes } = data
  const pendingIntake = (macroIntakes.value ?? []).find(row => row.status === 'pending')
  const profile = data.profile.value

  const header = (
    <SectionCard>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <SplitHeading size="sub" text={clientLabel(profile)} />
          {profile.email && <p className="text-sm text-df-text-muted">{profile.email}</p>}
          <MicroLabel tone="faint">Member since {fmtDate(profile.created_at)}</MicroLabel>
        </div>
        <div className="flex flex-wrap gap-2">
          {(memberships.value ?? []).map(m => (
            <div key={m.id} className="flex items-center gap-2">
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
      <SectionResult result={progress}>{rows => <ProgressReview progress={rows} />}</SectionResult>
    </Section>
  )

  const threadSection = (
    <Section title="Messages" intro="In-platform two-way messaging with your client.">
      <SectionResult result={messages}>
        {rows => <CoachThread clientId={clientId} messages={rows} reload={reload} />}
      </SectionResult>
    </Section>
  )

  const planSection = (
    <Section title="Training plan" intro="Create or update the client's training program.">
      <SectionResult result={plans}>
        {rows => <PlanQuickEditor clientId={clientId} plans={rows} reload={reload} />}
      </SectionResult>
    </Section>
  )

  const nutritionSection = (
    <Section title="Nutrition" intro="Macros, meal structure, resources, and notes.">
      <SectionResult result={nutrition}>
        {rows => (
          <div className="grid gap-4">
            {pendingIntake && (
              <MacroIntakeReview
                key={`${pendingIntake.id}-${pendingIntake.updated_at}`}
                clientId={clientId}
                intake={pendingIntake}
                currentPlan={(rows ?? []).find(plan => plan.status === 'active') ?? null}
                reload={reload}
              />
            )}
            <NutritionQuickEditor clientId={clientId} nutrition={rows} reload={reload} />
          </div>
        )}
      </SectionResult>
    </Section>
  )

  const bookingsSection = (
    <Section title="Bookings">
      <SectionResult result={bookings}>{rows => <BookingsList bookings={rows} />}</SectionResult>
    </Section>
  )

  const membershipsSection = (
    <Section title="Memberships">
      <SectionResult result={memberships}>
        {rows => <MembershipSummary memberships={rows} />}
      </SectionResult>
    </Section>
  )

  // emphasis="review" leads with what to review (progress + messages), then the
  // program editors. emphasis="manage" leads with the program editors.
  const ordered =
    emphasis === 'review'
      ? [progressSection, threadSection, planSection, nutritionSection]
      : [planSection, nutritionSection, progressSection, threadSection]

  return (
    <div className="grid gap-6">
      {header}
      {ordered.map((section, i) => (
        <div key={i}>{section}</div>
      ))}
      {/* Bookings and memberships are short reference lists rather than things
          to work in, so they share a row instead of taking a full-width panel
          each and pushing the editors above them further off the screen. */}
      <div className="grid gap-6 xl:grid-cols-2">
        {bookingsSection}
        {membershipsSection}
      </div>
    </div>
  )
}

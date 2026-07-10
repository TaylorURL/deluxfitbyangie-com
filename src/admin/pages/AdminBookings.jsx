import { useMemo, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button, Card } from '@deluxfit/ds'
import { listAllBookings, listClients, updateBookingStatus } from '@/lib/adminApi'
import { FormError } from '@/components/forms/FormFeedback'
import {
  SectionCard,
  SectionHeading,
  AdminEmpty,
  AdminLoading,
  StatusBadge,
  clientLabel,
  fmtDateTime,
  mapById,
  useAsyncData,
} from '../components/AdminPrimitives'

const SERVICE_LABEL = {
  single_session: 'Single Live Session',
  live_program: 'Live Training Program',
}

const loadBookings = () => Promise.all([listAllBookings(), listClients()])

/**
 * AdminBookings — every booking across all clients, split into upcoming and
 * past by slot_start, with Confirm / Cancel actions brokered through the
 * staff-only `update-booking` edge function.
 */
export default function AdminBookings() {
  const { data, loading, error, reload } = useAsyncData(loadBookings, [], [[], []])
  const [bookings, clients] = data ?? [[], []]
  const [busyId, setBusyId] = useState(null)
  const [writeError, setWriteError] = useState(null)

  const clientMap = useMemo(() => mapById(clients), [clients])

  const { upcoming, past } = useMemo(() => {
    const now = Date.now()
    const up = []
    const old = []
    for (const booking of bookings) {
      const start = new Date(booking.slot_start).getTime()
      if (start >= now && booking.status !== 'canceled') up.push(booking)
      else old.push(booking)
    }
    up.sort((a, b) => new Date(a.slot_start) - new Date(b.slot_start))
    return { upcoming: up, past: old }
  }, [bookings])

  const handleStatus = async (id, status) => {
    setBusyId(`${id}:${status}`)
    setWriteError(null)
    try {
      await updateBookingStatus(id, status)
      await reload()
    } catch (err) {
      setWriteError(err?.message || 'Could not update the booking.')
    } finally {
      setBusyId(null)
    }
  }

  const nameFor = booking =>
    booking.user_id
      ? clientLabel(clientMap.get(booking.user_id))
      : booking.guest_name || booking.guest_email || 'Guest'

  const renderCard = booking => {
    const confirming = busyId === `${booking.id}:confirmed`
    const canceling = busyId === `${booking.id}:canceled`
    const busy = confirming || canceling
    return (
      <Card
        key={booking.id}
        variant="surface"
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div className="min-w-0">
          <p className="font-600 text-df-text">{nameFor(booking)}</p>
          <p className="mt-1 text-sm text-df-text-muted">
            {SERVICE_LABEL[booking.service] ?? booking.service} · {fmtDateTime(booking.slot_start)}
            {booking.training_focus ? ` · ${booking.training_focus}` : ''}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={booking.status} />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleStatus(booking.id, 'confirmed')}
            disabled={busy || booking.status === 'confirmed'}
          >
            {confirming ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Confirming…
              </>
            ) : (
              'Confirm'
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatus(booking.id, 'canceled')}
            disabled={busy || booking.status === 'canceled'}
          >
            {canceling ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Canceling…
              </>
            ) : (
              'Cancel'
            )}
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <SectionCard>
      <SectionHeading
        eyebrow="Bookings"
        title="All live sessions."
        intro="Every single session and live program booking across all clients. Confirm or cancel below."
      />

      {writeError && (
        <div className="mt-5">
          <FormError body={writeError} />
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <AdminLoading label="Loading bookings…" />
        ) : error ? (
          <FormError body={error} />
        ) : bookings.length === 0 ? (
          <AdminEmpty body="No bookings yet." />
        ) : (
          [
            { label: 'Upcoming', rows: upcoming },
            { label: 'Past', rows: past },
          ]
            .filter(group => group.rows.length > 0)
            .map(group => (
              <div key={group.label} className="mb-8 last:mb-0">
                <p className="mb-3 text-[11px] font-700 uppercase tracking-[0.18em] text-df-text-faint">
                  {group.label}
                </p>
                <div className="flex flex-col gap-3">{group.rows.map(renderCard)}</div>
              </div>
            ))
        )}
      </div>
    </SectionCard>
  )
}

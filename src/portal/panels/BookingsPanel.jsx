import { Badge, Card } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { formatDateTime } from '@/lib/datetime'
import { EmptyState, PanelHeading } from './PanelPrimitives'

const SERVICE_LABEL = {
  single_session: 'Single Live Session',
  live_program: 'Live Training Program',
}

const formatSlot = iso =>
  formatDateTime(iso, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

/**
 * BookingsPanel — the client's booked live sessions, split into upcoming and
 * past, with a link back to booking when empty.
 */
export default function BookingsPanel({ bookings }) {
  const { portal } = useContent()
  const copy = portal.bookings
  const now = Date.now()
  const upcoming = bookings.filter(
    b => new Date(b.slot_start).getTime() >= now && b.status !== 'canceled'
  )
  const past = bookings.filter(
    b => new Date(b.slot_start).getTime() < now || b.status === 'canceled'
  )

  if (bookings.length === 0) {
    return (
      <section>
        <PanelHeading eyebrow={portal.nav.bookings} title={copy.title} />
        <EmptyState body={copy.empty} ctaLabel={copy.bookCta} ctaHref="/single-session#book" />
      </section>
    )
  }

  return (
    <section>
      <PanelHeading title={copy.title} />
      {[
        { label: copy.upcoming, rows: upcoming },
        { label: copy.past, rows: past },
      ]
        .filter(group => group.rows.length > 0)
        .map(group => (
          <div key={group.label} className="mb-8">
            <p className="mb-4 inline-flex items-center gap-2.5 text-[11px] font-700 uppercase tracking-[0.18em] text-df-text-muted">
              <span aria-hidden="true" className="h-px w-6 bg-df-accent" />
              {group.label}
            </p>
            <div className="flex flex-col gap-3">
              {group.rows.map(booking => (
                <Card
                  key={booking.id}
                  variant="surface"
                  className="flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-600 text-df-text">{formatSlot(booking.slot_start)}</p>
                    <p className="mt-1 text-sm text-df-text-muted">
                      {SERVICE_LABEL[booking.service] ?? booking.service}
                      {booking.training_focus ? ` · ${booking.training_focus}` : ''}
                    </p>
                  </div>
                  <Badge
                    tone={booking.status === 'canceled' ? 'neutral' : 'accent'}
                    variant="outline"
                    size="sm"
                  >
                    {booking.status}
                  </Badge>
                </Card>
              ))}
            </div>
          </div>
        ))}
    </section>
  )
}

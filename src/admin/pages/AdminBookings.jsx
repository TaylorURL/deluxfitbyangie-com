import PlaceholderPanel from '../components/PlaceholderPanel'

export default function AdminBookings() {
  return (
    <PlaceholderPanel
      eyebrow="Coming soon"
      description="See every upcoming booking, reschedule on behalf of a client, and block off availability."
      comingSoon={[
        'Calendar view of single sessions and live program bookings',
        'Reschedule / cancel with notification',
        'Block off recurring availability windows',
      ]}
    />
  )
}

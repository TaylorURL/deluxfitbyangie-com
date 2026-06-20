import PlaceholderPanel from '../components/PlaceholderPanel'

export default function AdminClients() {
  return (
    <PlaceholderPanel
      eyebrow="Coming soon"
      description="Browse every client, drill into one, and manage their plan and bookings."
      comingSoon={[
        'Searchable list of all client profiles',
        'Per-client detail view with bookings, plan, progress, and messages',
        'Quick actions: reset password, suspend, archive',
      ]}
    />
  )
}

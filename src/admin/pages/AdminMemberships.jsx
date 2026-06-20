import PlaceholderPanel from '../components/PlaceholderPanel'

export default function AdminMemberships() {
  return (
    <PlaceholderPanel
      eyebrow="Coming soon"
      description="See active subscriptions, status changes, and revenue from Stripe."
      comingSoon={[
        'Active memberships (membership + coaching tiers)',
        'Recent status changes (canceled / past_due)',
        'Direct link out to the Stripe customer record',
      ]}
    />
  )
}

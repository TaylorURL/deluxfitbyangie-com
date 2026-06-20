import PlaceholderPanel from '../components/PlaceholderPanel'

export default function AdminPlans() {
  return (
    <PlaceholderPanel
      eyebrow="Coming soon"
      description="Build and assign personalized coaching plans to specific clients."
      comingSoon={[
        'Plan templates with reusable blocks',
        'Assign plans to one client or a cohort',
        'Track plan status and adherence',
      ]}
    />
  )
}

import PlaceholderPanel from '../components/PlaceholderPanel'

export default function AdminContent() {
  return (
    <PlaceholderPanel
      eyebrow="Coming soon"
      description="Manage the content library — workouts, nutrition guides, and education videos — including locale and access level."
      comingSoon={[
        'Create / edit / archive content items',
        'Gate by access level (public, membership, coaching)',
        'Upload thumbnails and assets to storage',
      ]}
    />
  )
}

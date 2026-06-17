import { Card } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { EmptyState, PanelHeading, StatusPill } from './PanelPrimitives'

/**
 * OverviewPanel — the dashboard landing tab: a greeting plus entitlement status
 * for the membership and coaching products.
 */
export default function OverviewPanel({ profile, entitlements, user }) {
  const { portal } = useContent()
  const copy = portal.overview
  const name = profile?.full_name || user?.email || ''

  return (
    <section>
      <PanelHeading title={`${copy.greeting}${name ? `, ${name}` : ''}`} intro={copy.subtitle} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Card variant="elevated" className="flex items-center justify-between">
          <span className="text-sm font-600 uppercase tracking-[0.16em] text-df-text-muted">
            {copy.membershipStatus}
          </span>
          <StatusPill
            active={entitlements.hasMembership}
            activeLabel={copy.active}
            inactiveLabel={copy.inactive}
          />
        </Card>
        <Card variant="elevated" className="flex items-center justify-between">
          <span className="text-sm font-600 uppercase tracking-[0.16em] text-df-text-muted">
            {copy.coachingStatus}
          </span>
          <StatusPill
            active={entitlements.hasCoaching}
            activeLabel={copy.active}
            inactiveLabel={copy.inactive}
          />
        </Card>
      </div>

      {!entitlements.hasMembership && !entitlements.hasCoaching && (
        <div className="mt-6">
          <EmptyState
            body={copy.noEntitlements}
            ctaLabel={copy.explorePrograms}
            ctaHref="/#programs"
          />
        </div>
      )}
    </section>
  )
}

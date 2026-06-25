import { Dumbbell, ShieldCheck } from 'lucide-react'
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

  const products = [
    { icon: ShieldCheck, label: copy.membershipStatus, active: entitlements.hasMembership },
    { icon: Dumbbell, label: copy.coachingStatus, active: entitlements.hasCoaching },
  ]

  return (
    <section>
      <PanelHeading
        eyebrow={portal.nav.overview}
        title={`${copy.greeting}${name ? `, ${name}` : ''}`}
        intro={copy.subtitle}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {products.map(({ icon: Icon, label, active }) => (
          <Card key={label} variant="elevated" className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-df-lg bg-df-accent-soft text-df-accent-bright"
            >
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-700 uppercase tracking-[0.16em] text-df-text-muted">
                {label}
              </p>
              <div className="mt-2">
                <StatusPill active={active} activeLabel={copy.active} inactiveLabel={copy.inactive} />
              </div>
            </div>
          </Card>
        ))}
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

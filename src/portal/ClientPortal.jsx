import { lazy, Suspense } from 'react'
import ProtectedRoute from '@/auth/ProtectedRoute'
import { useContent } from '@/i18n'
import PortalShell from './PortalShell'
import PortalDashboard from './PortalDashboard'

/**
 * The filled-in account, on the development server alone. The check is a
 * build-time constant, so the fixture and this branch are compiled out of the
 * production bundle rather than gated at run time.
 */
const DemoDashboard = import.meta.env.DEV
  ? lazy(() =>
      import('./demo').then(({ DEMO_DATA, DEMO_USER }) => ({
        default: () => <PortalDashboard demo={{ data: DEMO_DATA, user: DEMO_USER }} />,
      }))
    )
  : null

const wantsDemo = () =>
  import.meta.env.DEV &&
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('demo') === '1'

export default function ClientPortal() {
  const { portal } = useContent()

  if (DemoDashboard && wantsDemo()) {
    return (
      <PortalShell>
        <Suspense fallback={null}>
          <DemoDashboard />
        </Suspense>
      </PortalShell>
    )
  }

  return (
    <ProtectedRoute
      fallback={
        <PortalShell>
          <p className="py-24 text-center text-sm text-df-text-faint">{portal.loading}</p>
        </PortalShell>
      }
    >
      <PortalShell>
        <PortalDashboard />
      </PortalShell>
    </ProtectedRoute>
  )
}

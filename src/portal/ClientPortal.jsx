import ProtectedRoute from '@/auth/ProtectedRoute'
import { useContent } from '@/i18n'
import PortalShell from './PortalShell'
import PortalDashboard from './PortalDashboard'

/**
 * ClientPortal — the standalone member portal mounted at `/portal`. Gated by
 * ProtectedRoute: unauthenticated visitors are bounced to `/login?next=/portal`
 * so they return here after signing in. Sign-up + sign-in moved to the
 * dedicated `/signup` and `/login` surfaces; this page is dashboard-only now.
 */
export default function ClientPortal() {
  const { portal } = useContent()
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

import ProtectedRoute from '@/auth/ProtectedRoute'
import { useContent } from '@/i18n'
import PortalShell from './PortalShell'
import PortalDashboard from './PortalDashboard'

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

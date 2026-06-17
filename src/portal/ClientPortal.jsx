import { useContent } from '@/i18n'
import { useAuth } from '@/auth/useAuth'
import PortalShell from './PortalShell'
import PortalAuth from './PortalAuth'
import PortalDashboard from './PortalDashboard'

/**
 * ClientPortal — the standalone member portal mounted at `/portal`. Gates on
 * the Supabase Auth session: a spinner while hydrating, the auth screen when
 * signed out, and the dashboard when signed in.
 */
export default function ClientPortal() {
  const { portal } = useContent()
  const { user, loading } = useAuth()

  return (
    <PortalShell>
      {loading ? (
        <p className="py-24 text-center text-sm text-df-text-faint">{portal.loading}</p>
      ) : user ? (
        <PortalDashboard />
      ) : (
        <PortalAuth />
      )}
    </PortalShell>
  )
}

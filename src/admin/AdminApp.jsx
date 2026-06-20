import ProtectedRoute from '@/auth/ProtectedRoute'
import AdminShell from './AdminShell'

/**
 * AdminApp — the standalone /admin entry point. Wraps the shell in a
 * role-gated ProtectedRoute so only callers with profiles.role='staff' may
 * mount it. Unauthenticated users get sent to /login (with a ?next= back
 * here); clients get bounced to /portal.
 */
export default function AdminApp() {
  return (
    <ProtectedRoute allow={['staff']}>
      <AdminShell />
    </ProtectedRoute>
  )
}

import { useEffect } from 'react'
import { useLocation } from '@/router'
import { useAuth } from './useAuth'
import { roleLandingPath } from './roles'

/**
 * @param {object} props
 * @param {React.ReactNode} props.children - rendered when access is allowed
 * @param {Array<'staff' | 'client'>} [props.allow] - roles that may enter.
 *        Omit to allow any authenticated user.
 * @param {string} [props.redirectTo='/login'] - where to send unauthenticated
 *        callers.
 * @param {React.ReactNode} [props.fallback] - shown while auth/profile are
 *        still hydrating (defaults to a quiet loading line).
 */
export default function ProtectedRoute({
  children,
  allow,
  redirectTo = '/login',
  fallback,
}) {
  const { user, role, loading, profileLoading } = useAuth()
  const { pathname, navigate } = useLocation()

  const authReady = !loading && (!user || !profileLoading)
  const allowed = allow ? user && role && allow.includes(role) : Boolean(user)
  const shouldRedirectUnauthed = authReady && !user
  const shouldBounceByRole = authReady && user && allow && role && !allow.includes(role)

  useEffect(() => {
    if (shouldRedirectUnauthed) {
      const next = pathname && pathname !== redirectTo ? `?next=${encodeURIComponent(pathname)}` : ''
      navigate(`${redirectTo}${next}`, { replace: true })
    } else if (shouldBounceByRole) {
      navigate(roleLandingPath(role), { replace: true })
    }
  }, [shouldRedirectUnauthed, shouldBounceByRole, navigate, pathname, redirectTo, role])

  if (!authReady || shouldRedirectUnauthed || shouldBounceByRole || !allowed) {
    return (
      fallback ?? (
        <div className="grid min-h-screen place-items-center bg-df-bg text-sm text-df-text-faint">
          Loading…
        </div>
      )
    )
  }

  return children
}

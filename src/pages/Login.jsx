import { useEffect, useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button, Field, Input } from '@deluxfit/ds'
import { useAuth } from '@/auth/useAuth'
import AuthShell from '@/auth/AuthShell'
import AuthCard from '@/auth/AuthCard'
import { roleLandingPath } from '@/auth/roles'
import { useLocation } from '@/router'
import { FormError } from '@/components/forms/FormFeedback'

export default function Login() {
  const { signIn, user, role, profileLoading } = useAuth()
  const { navigate } = useLocation()
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [errorBody, setErrorBody] = useState(null)

  // Once authed AND profile is loaded, route by role (honouring ?next when safe).
  useEffect(() => {
    if (!user || profileLoading || !role) return
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
    const next = params?.get('next')
    const landing = roleLandingPath(role)
    if (next && nextIsAllowedForRole(next, role)) {
      navigate(next, { replace: true })
    } else {
      navigate(landing, { replace: true })
    }
  }, [user, role, profileLoading, navigate])

  const handleChange = key => event => {
    setValues(prev => ({ ...prev, [key]: event.target.value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    const next = {}
    if (!values.email.trim()) next.email = 'Required'
    else if (!values.email.includes('@')) next.email = 'Enter a valid email'
    if (!values.password) next.password = 'Required'
    setErrors(next)
    if (Object.keys(next).length) return

    setStatus('working')
    setErrorBody(null)
    try {
      await signIn({ email: values.email, password: values.password })
      // The auth listener + role-loading effect navigates from here.
    } catch (error) {
      setStatus('error')
      setErrorBody(error?.message || 'Could not sign in.')
    }
  }

  return (
    <AuthShell>
      <AuthCard
        title="Sign in"
        subtitle="Welcome back. Pick up right where you left off."
        footerLinks={[
          { href: '/signup', label: 'Create an account' },
          { href: '/reset-password', label: 'Forgot password?' },
        ]}
      >
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Field label="Email" error={errors.email}>
            <Input
              type="email"
              value={values.email}
              onChange={handleChange('email')}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </Field>
          <Field label="Password" error={errors.password}>
            <Input
              type="password"
              value={values.password}
              onChange={handleChange('password')}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </Field>

          <Button type="submit" size="lg" block disabled={status === 'working'}>
            {status === 'working' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              <>
                Sign in
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </Button>

          <FormError body={status === 'error' ? errorBody : undefined} />
        </form>
      </AuthCard>
    </AuthShell>
  )
}

/**
 * Allow ?next= only when it points inside the surface the role can use.
 * Prevents bouncing a client into /admin via a crafted login link.
 */
function nextIsAllowedForRole(next, role) {
  if (typeof next !== 'string' || !next.startsWith('/')) return false
  if (next.startsWith('/admin')) return role === 'staff'
  if (next.startsWith('/portal')) return role === 'client' || role === 'staff'
  return true
}

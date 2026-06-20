import { useEffect, useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button, Field, Input } from '@deluxfit/ds'
import { useAuth } from '@/auth/useAuth'
import AuthShell from '@/auth/AuthShell'
import AuthCard from '@/auth/AuthCard'
import { useLocation } from '@/router'
import { FormError, FormSuccess } from '@/components/forms/FormFeedback'

/**
 * Signup — public client sign-up. Always provisions a `client` role; staff
 * provisioning is invite-only via the `invite-user` edge function. After
 * signup, the auth listener picks up the new session and the redirect effect
 * sends them to /portal.
 */
export default function Signup() {
  const { signUp, user, role, profileLoading } = useAuth()
  const { navigate } = useLocation()
  const [values, setValues] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [errorBody, setErrorBody] = useState(null)

  useEffect(() => {
    if (status === 'confirm') return
    if (user && !profileLoading && role) {
      navigate('/portal', { replace: true })
    }
  }, [user, role, profileLoading, status, navigate])

  const handleChange = key => event => {
    setValues(prev => ({ ...prev, [key]: event.target.value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    const next = {}
    if (!values.name.trim()) next.name = 'Required'
    if (!values.email.trim()) next.email = 'Required'
    else if (!values.email.includes('@')) next.email = 'Enter a valid email'
    if (!values.password) next.password = 'Required'
    else if (values.password.length < 8) next.password = 'At least 8 characters'
    setErrors(next)
    if (Object.keys(next).length) return

    setStatus('working')
    setErrorBody(null)
    try {
      const { needsConfirmation } = await signUp({
        email: values.email,
        password: values.password,
        fullName: values.name,
      })
      if (needsConfirmation) {
        setStatus('confirm')
      }
      // Otherwise the auth listener + redirect effect take it from here.
    } catch (error) {
      setStatus('error')
      setErrorBody(error?.message || 'Could not create your account.')
    }
  }

  if (status === 'confirm') {
    return (
      <AuthShell>
        <FormSuccess
          heading="Check your email"
          body="We sent you a confirmation link. Click it to finish setting up your account."
        />
      </AuthShell>
    )
  }

  return (
    <AuthShell>
      <AuthCard
        title="Create account"
        subtitle="Join the DeluxFit community. Members get the full library and one-on-one coaching."
        footerLinks={[{ href: '/login', label: 'Already a member? Sign in' }]}
      >
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Field label="Full name" error={errors.name}>
            <Input
              value={values.name}
              onChange={handleChange('name')}
              placeholder="Jane Doe"
              autoComplete="name"
            />
          </Field>
          <Field label="Email" error={errors.email}>
            <Input
              type="email"
              value={values.email}
              onChange={handleChange('email')}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </Field>
          <Field label="Password" helper="At least 8 characters" error={errors.password}>
            <Input
              type="password"
              value={values.password}
              onChange={handleChange('password')}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </Field>

          <Button type="submit" size="lg" block disabled={status === 'working'}>
            {status === 'working' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Creating account…
              </>
            ) : (
              <>
                Create account
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

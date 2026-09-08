import { useEffect, useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button, Field, Input } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { useAuth } from '@/auth/useAuth'
import AuthShell from '@/auth/AuthShell'
import AuthCard from '@/auth/AuthCard'
import { nextIsAllowedForRole, roleLandingPath } from '@/auth/roles'
import { useLocation } from '@/router'
import { FormError } from '@/components/forms/FormFeedback'

export default function Login() {
  const { auth, forms } = useContent()
  const copy = auth.login
  const { signIn, user, role, profileLoading } = useAuth()
  const { navigate } = useLocation()
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [errorBody, setErrorBody] = useState(null)

  // Once authed AND profile is loaded, route by role (honouring ?next when safe).
  useEffect(() => {
    if (!user || profileLoading || !role) return
    const params =
      typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
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
    if (!values.email.trim()) next.email = forms.required
    else if (!values.email.includes('@')) next.email = forms.invalidEmail
    if (!values.password) next.password = forms.required
    setErrors(next)
    if (Object.keys(next).length) return

    setStatus('working')
    setErrorBody(null)
    try {
      await signIn({ email: values.email, password: values.password })
      // The auth listener + role-loading effect navigates from here.
    } catch {
      // Supabase says which of the two was wrong; the form does not, because
      // telling an attacker that the address exists is the whole of the answer.
      setStatus('error')
      setErrorBody(copy.failed)
    }
  }

  return (
    <AuthShell>
      <AuthCard
        title={copy.title}
        subtitle={copy.subtitle}
        footerLinks={[
          { href: '/signup', label: copy.createAccount },
          { href: '/reset-password', label: copy.forgotPassword },
        ]}
      >
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Field label={auth.emailLabel} error={errors.email}>
            <Input
              type="email"
              value={values.email}
              onChange={handleChange('email')}
              placeholder={auth.emailPlaceholder}
              autoComplete="email"
            />
          </Field>
          <Field label={auth.passwordLabel} error={errors.password}>
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
                {copy.submitting}
              </>
            ) : (
              <>
                {copy.submit}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </Button>

          <FormError className="mt-4" body={status === 'error' ? errorBody : undefined} />
        </form>
      </AuthCard>
    </AuthShell>
  )
}

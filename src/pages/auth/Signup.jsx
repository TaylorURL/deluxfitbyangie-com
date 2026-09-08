import { useEffect, useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button, Field, Input } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { useAuth } from '@/auth/useAuth'
import AuthShell from '@/auth/AuthShell'
import AuthCard from '@/auth/AuthCard'
import { nextIsAllowedForRole } from '@/auth/roles'
import { useLocation } from '@/router'
import { FormError, FormSuccess } from '@/components/forms/FormFeedback'

export default function Signup() {
  const { auth, forms } = useContent()
  const copy = auth.signup
  const { signUp, user, role, profileLoading } = useAuth()
  const { navigate } = useLocation()
  const [values, setValues] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [errorBody, setErrorBody] = useState(null)

  useEffect(() => {
    if (status === 'confirm') return
    if (user && !profileLoading && role) {
      // A visitor sent here to create an account before checking out goes back
      // to the page that sent them, now signed in, rather than being dropped
      // in an empty portal to find their way back.
      const params =
        typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
      const next = params?.get('next')
      navigate(next && nextIsAllowedForRole(next, role) ? next : '/portal', { replace: true })
    }
  }, [user, role, profileLoading, status, navigate])

  const handleChange = key => event => {
    setValues(prev => ({ ...prev, [key]: event.target.value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    const next = {}
    if (!values.name.trim()) next.name = forms.required
    if (!values.email.trim()) next.email = forms.required
    else if (!values.email.includes('@')) next.email = forms.invalidEmail
    if (!values.password) next.password = forms.required
    else if (values.password.length < 8) next.password = auth.passwordHelper
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
    } catch {
      // Supabase's own message names whether the address is already taken,
      // which is an account's existence handed to whoever asked.
      setStatus('error')
      setErrorBody(copy.failed)
    }
  }

  if (status === 'confirm') {
    return (
      <AuthShell>
        <FormSuccess heading={copy.sentHeading} body={copy.sentBody} />
      </AuthShell>
    )
  }

  return (
    <AuthShell>
      <AuthCard
        title={copy.title}
        subtitle={copy.subtitle}
        footerLinks={[{ href: '/login', label: copy.haveAccount }]}
      >
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Field label={auth.nameLabel} error={errors.name}>
            <Input
              value={values.name}
              onChange={handleChange('name')}
              placeholder={auth.namePlaceholder}
              autoComplete="name"
            />
          </Field>
          <Field label={auth.emailLabel} error={errors.email}>
            <Input
              type="email"
              value={values.email}
              onChange={handleChange('email')}
              placeholder={auth.emailPlaceholder}
              autoComplete="email"
            />
          </Field>
          <Field label={auth.passwordLabel} helper={auth.passwordHelper} error={errors.password}>
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

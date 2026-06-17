import { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button, Field, Input } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { useAuth } from '@/auth/useAuth'
import { FormError, FormSuccess } from '@/components/forms/FormFeedback'

/**
 * PortalAuth — the sign-in / sign-up screen for the client portal, backed by
 * Supabase Auth (email + password). Toggles between modes; surfaces the
 * "check your email" state when email confirmation is required.
 */
export default function PortalAuth() {
  const { portal } = useContent()
  const copy = portal.auth
  const { signIn, signUp } = useAuth()

  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [values, setValues] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | working | confirm | error
  const [errorBody, setErrorBody] = useState(null)
  const isSignUp = mode === 'signup'

  const handleChange = key => event => {
    setValues(prev => ({ ...prev, [key]: event.target.value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const switchMode = next => {
    setMode(next)
    setErrors({})
    setStatus('idle')
    setErrorBody(null)
  }

  const handleSubmit = async event => {
    event.preventDefault()
    const next = {}
    if (isSignUp && !values.name.trim()) next.name = 'Required'
    if (!values.email.trim()) next.email = 'Required'
    else if (!values.email.includes('@')) next.email = 'Enter a valid email'
    if (!values.password) next.password = 'Required'
    else if (values.password.length < 8) next.password = 'At least 8 characters'
    setErrors(next)
    if (Object.keys(next).length) return

    setStatus('working')
    setErrorBody(null)
    try {
      if (isSignUp) {
        const { needsConfirmation } = await signUp({
          email: values.email,
          password: values.password,
          fullName: values.name,
        })
        if (needsConfirmation) {
          setStatus('confirm')
          return
        }
      } else {
        await signIn({ email: values.email, password: values.password })
      }
      // On success the auth listener swaps this screen for the dashboard.
    } catch (error) {
      setStatus('error')
      setErrorBody(error?.message || copy.genericError)
    }
  }

  if (status === 'confirm') {
    return (
      <div className="mx-auto w-full max-w-md">
        <FormSuccess heading={copy.signUpTitle} body={copy.checkEmail} />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-df-2xl border border-df-border bg-df-surface/85 p-8 shadow-df-xl backdrop-blur-xl sm:p-10">
        <h1 className="font-display text-[clamp(2rem,6vw,2.75rem)] font-400 uppercase leading-[0.95] tracking-tight text-df-text">
          {isSignUp ? copy.signUpTitle : copy.signInTitle}
          <span className="text-df-accent">.</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-df-text-muted">
          {isSignUp ? copy.signUpSubtitle : copy.signInSubtitle}
        </p>

        <form noValidate onSubmit={handleSubmit} className="mt-7 flex flex-col gap-5">
          {isSignUp && (
            <Field label={copy.nameLabel} error={errors.name}>
              <Input
                value={values.name}
                onChange={handleChange('name')}
                placeholder={copy.namePlaceholder}
                autoComplete="name"
              />
            </Field>
          )}
          <Field label={copy.emailLabel} error={errors.email}>
            <Input
              type="email"
              value={values.email}
              onChange={handleChange('email')}
              placeholder={copy.emailPlaceholder}
              autoComplete="email"
            />
          </Field>
          <Field label={copy.passwordLabel} error={errors.password}>
            <Input
              type="password"
              value={values.password}
              onChange={handleChange('password')}
              placeholder={copy.passwordPlaceholder}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />
          </Field>

          <Button type="submit" size="lg" block disabled={status === 'working'}>
            {status === 'working' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                {isSignUp ? copy.signingUp : copy.signingIn}
              </>
            ) : (
              <>
                {isSignUp ? copy.signUpCta : copy.signInCta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </Button>

          <FormError body={status === 'error' ? errorBody : undefined} />
        </form>

        <button
          type="button"
          onClick={() => switchMode(isSignUp ? 'signin' : 'signup')}
          className="mt-6 text-xs font-600 uppercase tracking-[0.16em] text-df-text-muted transition-colors hover:text-df-accent-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright"
        >
          {isSignUp ? copy.toSignIn : copy.toSignUp}
        </button>
      </div>
    </div>
  )
}

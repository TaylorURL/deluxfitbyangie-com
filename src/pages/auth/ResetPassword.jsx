import { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button, Field, Input } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { useAuth } from '@/auth/useAuth'
import AuthShell from '@/auth/AuthShell'
import AuthCard from '@/auth/AuthCard'
import { FormError, FormSuccess } from '@/components/forms/FormFeedback'

export default function ResetPassword() {
  const { auth, forms } = useContent()
  const copy = auth.reset
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState(undefined)
  const [status, setStatus] = useState('idle')
  const [errorBody, setErrorBody] = useState(null)

  const handleSubmit = async event => {
    event.preventDefault()
    if (!email.trim()) {
      setEmailError(forms.required)
      return
    }
    if (!email.includes('@')) {
      setEmailError(forms.invalidEmail)
      return
    }
    setEmailError(undefined)
    setStatus('working')
    setErrorBody(null)
    try {
      await requestPasswordReset({ email })
      setStatus('sent')
    } catch {
      setStatus('error')
      setErrorBody(copy.failed)
    }
  }

  if (status === 'sent') {
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
        footerLinks={[{ href: '/login', label: copy.backToSignIn }]}
      >
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Field label={auth.emailLabel} error={emailError}>
            <Input
              type="email"
              value={email}
              onChange={event => {
                setEmail(event.target.value)
                if (emailError) setEmailError(undefined)
              }}
              placeholder={auth.emailPlaceholder}
              autoComplete="email"
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

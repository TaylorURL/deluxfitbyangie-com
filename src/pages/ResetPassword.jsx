import { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button, Field, Input } from '@deluxfit/ds'
import { useAuth } from '@/auth/useAuth'
import AuthShell from '@/auth/AuthShell'
import AuthCard from '@/auth/AuthCard'
import { FormError, FormSuccess } from '@/components/forms/FormFeedback'

/**
 * ResetPassword — request a password-reset email. Supabase mails a link that
 * lands the user on /update-password where they set a new password using the
 * recovery session it creates.
 */
export default function ResetPassword() {
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState(undefined)
  const [status, setStatus] = useState('idle')
  const [errorBody, setErrorBody] = useState(null)

  const handleSubmit = async event => {
    event.preventDefault()
    if (!email.trim()) {
      setEmailError('Required')
      return
    }
    if (!email.includes('@')) {
      setEmailError('Enter a valid email')
      return
    }
    setEmailError(undefined)
    setStatus('working')
    setErrorBody(null)
    try {
      await requestPasswordReset({ email })
      setStatus('sent')
    } catch (error) {
      setStatus('error')
      setErrorBody(error?.message || 'Could not send the reset email.')
    }
  }

  if (status === 'sent') {
    return (
      <AuthShell>
        <FormSuccess
          heading="Check your email"
          body="If an account exists for that address, you'll get a reset link in a minute."
        />
      </AuthShell>
    )
  }

  return (
    <AuthShell>
      <AuthCard
        title="Reset password"
        subtitle="Enter the email on your account and we'll send you a reset link."
        footerLinks={[{ href: '/login', label: 'Back to sign in' }]}
      >
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Field label="Email" error={emailError}>
            <Input
              type="email"
              value={email}
              onChange={event => {
                setEmail(event.target.value)
                if (emailError) setEmailError(undefined)
              }}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </Field>

          <Button type="submit" size="lg" block disabled={status === 'working'}>
            {status === 'working' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Sending…
              </>
            ) : (
              <>
                Send reset link
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

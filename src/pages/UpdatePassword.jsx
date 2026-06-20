import { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button, Field, Input } from '@deluxfit/ds'
import { useAuth } from '@/auth/useAuth'
import AuthShell from '@/auth/AuthShell'
import AuthCard from '@/auth/AuthCard'
import { useLocation } from '@/router'
import { roleLandingPath } from '@/auth/ProtectedRoute'
import { FormError, FormSuccess } from '@/components/forms/FormFeedback'

/**
 * UpdatePassword — set a new password. Used by both the password-reset flow
 * and the staff-invite flow: Supabase puts the user in a temporary session
 * the moment they click the magic link, so we can just call updateUser({
 * password }) from a normal authenticated context.
 */
export default function UpdatePassword() {
  const { updatePassword, role } = useAuth()
  const { navigate } = useLocation()
  const [values, setValues] = useState({ password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [errorBody, setErrorBody] = useState(null)

  const handleChange = key => event => {
    setValues(prev => ({ ...prev, [key]: event.target.value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    const next = {}
    if (!values.password) next.password = 'Required'
    else if (values.password.length < 8) next.password = 'At least 8 characters'
    if (!values.confirm) next.confirm = 'Required'
    else if (values.confirm !== values.password) next.confirm = 'Passwords do not match'
    setErrors(next)
    if (Object.keys(next).length) return

    setStatus('working')
    setErrorBody(null)
    try {
      await updatePassword({ password: values.password })
      setStatus('done')
    } catch (error) {
      setStatus('error')
      setErrorBody(error?.message || 'Could not update your password.')
    }
  }

  if (status === 'done') {
    return (
      <AuthShell>
        <FormSuccess heading="Password updated" body="You're signed in. Heading to your dashboard…" />
        <div className="mt-6">
          <Button onClick={() => navigate(roleLandingPath(role))} size="lg" block>
            Continue
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell>
      <AuthCard
        title="Set new password"
        subtitle="Pick something strong. You'll use it the next time you sign in."
      >
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Field label="New password" helper="At least 8 characters" error={errors.password}>
            <Input
              type="password"
              value={values.password}
              onChange={handleChange('password')}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </Field>
          <Field label="Confirm password" error={errors.confirm}>
            <Input
              type="password"
              value={values.confirm}
              onChange={handleChange('confirm')}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </Field>

          <Button type="submit" size="lg" block disabled={status === 'working'}>
            {status === 'working' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Updating…
              </>
            ) : (
              <>
                Update password
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

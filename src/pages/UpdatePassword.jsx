import { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button, Field, Input } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { useAuth } from '@/auth/useAuth'
import AuthShell from '@/auth/AuthShell'
import AuthCard from '@/auth/AuthCard'
import { useLocation } from '@/router'
import { roleLandingPath } from '@/auth/roles'
import { FormError, FormSuccess } from '@/components/forms/FormFeedback'

export default function UpdatePassword() {
  const { auth, forms } = useContent()
  const copy = auth.update
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
    if (!values.password) next.password = forms.required
    else if (values.password.length < 8) next.password = auth.passwordHelper
    if (!values.confirm) next.confirm = forms.required
    else if (values.confirm !== values.password) next.confirm = copy.mismatch
    setErrors(next)
    if (Object.keys(next).length) return

    setStatus('working')
    setErrorBody(null)
    try {
      await updatePassword({ password: values.password })
      setStatus('done')
    } catch {
      setStatus('error')
      setErrorBody(copy.failed)
    }
  }

  if (status === 'done') {
    return (
      <AuthShell>
        <FormSuccess heading={copy.doneHeading} body={copy.doneBody} />
        <div className="mt-6">
          <Button onClick={() => navigate(roleLandingPath(role))} size="lg" block>
            {copy.continueLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell>
      <AuthCard title={copy.title} subtitle={copy.subtitle}>
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Field label={copy.newLabel} helper={auth.passwordHelper} error={errors.password}>
            <Input
              type="password"
              value={values.password}
              onChange={handleChange('password')}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </Field>
          <Field label={copy.confirmLabel} error={errors.confirm}>
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

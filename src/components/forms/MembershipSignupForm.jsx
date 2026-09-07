import { useState } from 'react'
import { ArrowRight, Loader2, Mail, User } from 'lucide-react'
import { Button, Field, Input, Panel, Textarea } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { submitForm } from '@/lib/api/formSubmission'
import { startCheckout } from '@/lib/api/payments'
import { FormError, FormSuccess } from './FormFeedback'

const STATUS = { idle: 'idle', working: 'working', success: 'success', error: 'error' }

/**
 * Captures the basics, then sends the visitor to Stripe Checkout for the
 * recurring subscription. When Stripe is not configured the intent is recorded
 * instead and a plain "payments coming online" notice is shown — never a fake
 * charge.
 */
export default function MembershipSignupForm() {
  const { membership, forms } = useContent()
  const copy = membership.signupForm

  const [values, setValues] = useState({ name: '', email: '', notes: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(STATUS.idle)
  const [notice, setNotice] = useState(null)
  const [errorBody, setErrorBody] = useState(null)

  const handleChange = key => event => {
    setValues(prev => ({ ...prev, [key]: event.target.value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    const nextErrors = {}
    if (!values.name.trim()) nextErrors.name = copy.required
    if (!values.email.trim()) nextErrors.email = copy.required
    else if (!values.email.includes('@')) nextErrors.email = copy.invalidEmail
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setStatus(STATUS.working)
    setErrorBody(null)
    try {
      const result = await startCheckout('membership')
      if (result.status === 'redirecting') return // browser is navigating to Stripe
      // No redirect means Stripe is not configured, so record the interest and
      // say so rather than confirming a subscription that does not exist.
      await submitForm('membership-signup', values)
      setNotice(result.message)
      setStatus(STATUS.success)
    } catch (error) {
      setErrorBody(error?.message || copy.errorBody)
      setStatus(STATUS.error)
    }
  }

  if (status === STATUS.success) {
    return (
      <FormSuccess
        heading={copy.successHeading}
        body={notice ? `${notice} ${copy.followUp}` : copy.successBody}
      />
    )
  }

  return (
    <Panel as="form" noValidate onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={copy.nameLabel} error={errors.name}>
          <Input
            icon={User}
            value={values.name}
            onChange={handleChange('name')}
            placeholder={copy.namePlaceholder}
            autoComplete="name"
            required
          />
        </Field>
        <Field label={copy.emailLabel} error={errors.email}>
          <Input
            icon={Mail}
            type="email"
            inputMode="email"
            value={values.email}
            onChange={handleChange('email')}
            placeholder={copy.emailPlaceholder}
            autoComplete="email"
            required
          />
        </Field>
      </div>

      <Field
        label={copy.notesLabel}
        helper={copy.notesHelper}
        optional
        optionalLabel={forms.optional}
        className="mt-5"
      >
        <Textarea
          autoGrow
          rows={2}
          value={values.notes}
          onChange={handleChange('notes')}
          placeholder={copy.notesPlaceholder}
        />
      </Field>

      <Button
        type="submit"
        size="lg"
        disabled={status === STATUS.working}
        className="mt-7 w-full sm:w-auto"
      >
        {status === STATUS.working ? (
          <>
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
            {copy.submittingLabel}
          </>
        ) : (
          <>
            {copy.submitLabel}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </>
        )}
      </Button>

      <FormError className="mt-4" body={status === STATUS.error ? errorBody : undefined} />
    </Panel>
  )
}

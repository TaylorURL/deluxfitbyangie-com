import { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button, Field, Input } from '@deluxfit/ds'
import { submitForm } from '@/lib/formSubmission'
import { startCheckout } from '@/lib/payments'
import { FormError, FormSuccess } from './FormFeedback'

const STATUS = { idle: 'idle', working: 'working', success: 'success', error: 'error' }

/**
 * MembershipSignupForm — the $14.99/month membership signup on /membership.
 * Captures the basics, then sends the visitor to Stripe Checkout for the
 * recurring subscription. If Stripe isn't configured yet, the intent is
 * recorded and a clear "payments coming online" notice is shown — never a fake
 * charge.
 */
export default function MembershipSignupForm() {
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
    if (!values.name.trim()) nextErrors.name = 'Required'
    if (!values.email.trim()) nextErrors.email = 'Required'
    else if (!values.email.includes('@')) nextErrors.email = 'Enter a valid email'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setStatus(STATUS.working)
    setErrorBody(null)
    try {
      const result = await startCheckout('membership')
      if (result.status === 'redirecting') return // browser is navigating to Stripe
      // Stripe not configured yet — record interest and confirm honestly.
      await submitForm('membership-signup', values)
      setNotice(result.message)
      setStatus(STATUS.success)
    } catch (error) {
      setErrorBody(error?.message || 'Please try again in a moment.')
      setStatus(STATUS.error)
    }
  }

  if (status === STATUS.success) {
    return (
      <FormSuccess
        heading="You’re on the list."
        body={
          notice
            ? `${notice} Angie will follow up with your access details.`
            : 'Thanks for signing up — Angie will send your access details and onboarding info by email.'
        }
      />
    )
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="rounded-df-2xl border border-df-border bg-df-surface p-5 shadow-df-lg sm:px-8 sm:py-9"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" error={errors.name}>
          <Input
            value={values.name}
            onChange={handleChange('name')}
            placeholder="Your name"
            autoComplete="name"
            required
          />
        </Field>
        <Field label="Email" error={errors.email}>
          <Input
            type="email"
            value={values.email}
            onChange={handleChange('email')}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </Field>
      </div>

      <Field
        label="Anything Angie should know? (optional)"
        helper="Goals, schedule, equipment access — totally optional."
        className="mt-5"
      >
        <Input value={values.notes} onChange={handleChange('notes')} placeholder="Optional notes" />
      </Field>

      <Button type="submit" size="lg" disabled={status === STATUS.working} className="mt-7">
        {status === STATUS.working ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Starting checkout…
          </>
        ) : (
          <>
            Sign up — $14.99 / month
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </Button>

      <FormError body={status === STATUS.error ? errorBody : undefined} />
    </form>
  )
}

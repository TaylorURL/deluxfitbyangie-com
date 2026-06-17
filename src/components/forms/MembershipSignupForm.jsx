import { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button, Field, Input } from '@deluxfit/ds'
import { useFormSubmission } from './useFormSubmission'
import { FormError, FormSuccess } from './FormFeedback'

/**
 * MembershipSignupForm — the small intake form on /membership. Captures the
 * basics so Angie can send access details for the $14.99/month membership.
 * No payment is taken here; the production endpoint is wired up via
 * `src/lib/formSubmission.js`.
 */
export default function MembershipSignupForm() {
  const [values, setValues] = useState({ name: '', email: '', notes: '' })
  const [errors, setErrors] = useState({})
  const { submit, isSubmitting, isSuccess, errorMessage } = useFormSubmission(
    'membership-signup'
  )

  const handleChange = key => event => {
    setValues(prev => ({ ...prev, [key]: event.target.value }))
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: undefined }))
    }
  }

  const handleSubmit = async event => {
    event.preventDefault()
    const nextErrors = {}
    if (!values.name.trim()) nextErrors.name = 'Required'
    if (!values.email.trim()) nextErrors.email = 'Required'
    else if (!values.email.includes('@')) nextErrors.email = 'Enter a valid email'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    try {
      await submit(values)
    } catch {
      /* error surfaced via hook */
    }
  }

  if (isSuccess) {
    return (
      <FormSuccess
        heading="Welcome to DeluxFit."
        body="Thanks for signing up — Angie will send your access details and onboarding info by email."
      />
    )
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="rounded-df-2xl border border-df-border bg-df-surface px-6 py-7 shadow-df-lg sm:px-8 sm:py-9"
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
        <Input
          value={values.notes}
          onChange={handleChange('notes')}
          placeholder="Optional notes"
        />
      </Field>

      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-7">
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Signing you up…
          </>
        ) : (
          <>
            Sign up — $14.99 / month
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </Button>

      <FormError
        body={errorMessage ? `${errorMessage}. Please try again.` : undefined}
      />
    </form>
  )
}

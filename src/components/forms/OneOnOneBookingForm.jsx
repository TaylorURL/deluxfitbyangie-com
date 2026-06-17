import { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button, Field, Input, Textarea } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { useFormSubmission } from './useFormSubmission'
import { FormError, FormSuccess } from './FormFeedback'

const INITIAL_VALUES = {
  name: '',
  email: '',
  phone: '',
  timezone: '',
  availability: '',
  goal: '',
  equipment: '',
  notes: '',
}

/**
 * OneOnOneBookingForm — the session-request form on /training. Captures
 * a few preferred times and the basics so Angie can confirm a session and
 * send the secure video link. No live calendar integration yet — the
 * submission TODO is documented in `src/lib/formSubmission.js`.
 */
export default function OneOnOneBookingForm() {
  const { training } = useContent()
  const fields = training.booking.fields
  const copy = training.booking

  const [values, setValues] = useState(INITIAL_VALUES)
  const [errors, setErrors] = useState({})
  const { submit, isSubmitting, isSuccess, errorMessage } = useFormSubmission(
    'one-on-one-booking'
  )

  const handleChange = key => event => {
    setValues(prev => ({ ...prev, [key]: event.target.value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    const next = {}
    if (!values.name.trim()) next.name = 'Required'
    if (!values.email.trim()) next.email = 'Required'
    else if (!values.email.includes('@')) next.email = 'Enter a valid email'
    if (!values.timezone.trim()) next.timezone = 'Required'
    if (!values.availability.trim()) next.availability = 'Required'
    if (!values.goal.trim()) next.goal = 'Required'
    setErrors(next)
    if (Object.keys(next).length) return
    try {
      await submit(values)
    } catch {
      /* surfaced via hook */
    }
  }

  if (isSuccess) {
    return <FormSuccess heading={copy.successHeading} body={copy.successBody} />
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="rounded-df-2xl border border-df-border bg-df-surface px-6 py-7 shadow-df-lg sm:px-8 sm:py-9"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={fields.name.label} error={errors.name}>
          <Input
            value={values.name}
            onChange={handleChange('name')}
            placeholder={fields.name.placeholder}
            autoComplete="name"
            required
          />
        </Field>
        <Field label={fields.email.label} error={errors.email}>
          <Input
            type="email"
            value={values.email}
            onChange={handleChange('email')}
            placeholder={fields.email.placeholder}
            autoComplete="email"
            required
          />
        </Field>
        <Field label={fields.phone.label}>
          <Input
            type="tel"
            value={values.phone}
            onChange={handleChange('phone')}
            placeholder={fields.phone.placeholder}
            autoComplete="tel"
          />
        </Field>
        <Field label={fields.timezone.label} error={errors.timezone}>
          <Input
            value={values.timezone}
            onChange={handleChange('timezone')}
            placeholder={fields.timezone.placeholder}
            required
          />
        </Field>
        <Field
          label={fields.availability.label}
          error={errors.availability}
          className="sm:col-span-2"
        >
          <Textarea
            value={values.availability}
            onChange={handleChange('availability')}
            placeholder={fields.availability.placeholder}
            rows={3}
            required
          />
        </Field>
        <Field label={fields.goal.label} error={errors.goal} className="sm:col-span-2">
          <Textarea
            value={values.goal}
            onChange={handleChange('goal')}
            placeholder={fields.goal.placeholder}
            rows={3}
            required
          />
        </Field>
        <Field label={fields.equipment.label} className="sm:col-span-2">
          <Input
            value={values.equipment}
            onChange={handleChange('equipment')}
            placeholder={fields.equipment.placeholder}
          />
        </Field>
        <Field label={fields.notes.label} className="sm:col-span-2">
          <Textarea
            value={values.notes}
            onChange={handleChange('notes')}
            placeholder={fields.notes.placeholder}
            rows={3}
          />
        </Field>
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-7">
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            {copy.submittingLabel}
          </>
        ) : (
          <>
            {copy.submitLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </Button>

      <FormError body={errorMessage ? `${copy.errorBody}` : undefined} />
    </form>
  )
}

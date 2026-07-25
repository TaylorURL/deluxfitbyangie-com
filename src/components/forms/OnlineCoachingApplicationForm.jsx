import { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button, Field, Input, Select, Textarea } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { useFormSubmission } from './useFormSubmission'
import { FormError, FormSuccess } from './FormFeedback'

const INITIAL_VALUES = {
  name: '',
  email: '',
  phone: '',
  age: '',
  location: '',
  goal: '',
  experience: '',
  equipment: '',
  availability: '',
  notes: '',
  consent: false,
}

export default function OnlineCoachingApplicationForm() {
  const { coaching } = useContent()
  const fields = coaching.application.fields
  const copy = coaching.application

  const [values, setValues] = useState(INITIAL_VALUES)
  const [errors, setErrors] = useState({})
  const { submit, isSubmitting, isSuccess, errorMessage } = useFormSubmission(
    'online-coaching-application'
  )

  const handleChange = key => event => {
    const next =
      event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setValues(prev => ({ ...prev, [key]: next }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    const next = {}
    if (!values.name.trim()) next.name = 'Required'
    if (!values.email.trim()) next.email = 'Required'
    else if (!values.email.includes('@')) next.email = 'Enter a valid email'
    if (!values.age.trim()) next.age = 'Required'
    if (!values.goal) next.goal = 'Pick a goal'
    if (!values.experience) next.experience = 'Pick your experience level'
    if (!values.equipment.trim()) next.equipment = 'Required'
    if (!values.availability.trim()) next.availability = 'Required'
    if (!values.consent) next.consent = 'Please confirm to continue'
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
      className="rounded-df-2xl border border-df-border bg-df-surface p-5 shadow-df-lg sm:px-8 sm:py-9"
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
        <Field label={fields.age.label} error={errors.age}>
          <Input
            type="number"
            inputMode="numeric"
            min="14"
            max="99"
            value={values.age}
            onChange={handleChange('age')}
            placeholder={fields.age.placeholder}
            required
          />
        </Field>
        <Field label={fields.location.label} className="sm:col-span-2">
          <Input
            value={values.location}
            onChange={handleChange('location')}
            placeholder={fields.location.placeholder}
            autoComplete="address-level2"
          />
        </Field>
        <Field label={fields.goal.label} error={errors.goal}>
          <Select
            value={values.goal}
            onChange={handleChange('goal')}
            placeholder={fields.goal.placeholder}
            options={fields.goal.options}
            required
          />
        </Field>
        <Field label={fields.experience.label} error={errors.experience}>
          <Select
            value={values.experience}
            onChange={handleChange('experience')}
            placeholder={fields.experience.placeholder}
            options={fields.experience.options}
            required
          />
        </Field>
        <Field label={fields.equipment.label} error={errors.equipment} className="sm:col-span-2">
          <Input
            value={values.equipment}
            onChange={handleChange('equipment')}
            placeholder={fields.equipment.placeholder}
            required
          />
        </Field>
        <Field
          label={fields.availability.label}
          error={errors.availability}
          className="sm:col-span-2"
        >
          <Input
            value={values.availability}
            onChange={handleChange('availability')}
            placeholder={fields.availability.placeholder}
            required
          />
        </Field>
        <Field label={fields.notes.label} className="sm:col-span-2">
          <Textarea
            value={values.notes}
            onChange={handleChange('notes')}
            placeholder={fields.notes.placeholder}
            rows={5}
          />
        </Field>
      </div>

      <label className="mt-7 flex items-start gap-3 text-sm leading-relaxed text-df-text-muted">
        <input
          type="checkbox"
          checked={values.consent}
          onChange={handleChange('consent')}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-df-accent-bright"
          required
        />
        <span>
          {fields.consent.label}
          {errors.consent && (
            <span className="ml-2 text-xs text-df-danger">{errors.consent}</span>
          )}
        </span>
      </label>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="mt-7 w-full sm:w-auto"
      >
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

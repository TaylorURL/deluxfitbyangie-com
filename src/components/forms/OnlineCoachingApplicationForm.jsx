import { useState } from 'react'
import { ArrowRight, Loader2, Mail, MapPin, Phone, User } from 'lucide-react'
import {
  Button,
  Field,
  FieldMessage,
  Input,
  Panel,
  SegmentedControl,
  Select,
  Switch,
  Textarea,
} from '@deluxfit/ds'
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
  const { coaching, forms } = useContent()
  const fields = coaching.application.fields
  const copy = coaching.application

  const [values, setValues] = useState(INITIAL_VALUES)
  const [errors, setErrors] = useState({})
  const { submit, isSubmitting, isSuccess, errorMessage } = useFormSubmission(
    'online-coaching-application'
  )

  const clearError = key => {
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const setValue = (key, value) => {
    setValues(prev => ({ ...prev, [key]: value }))
    clearError(key)
  }

  const handleChange = key => event => {
    setValue(key, event.target.type === 'checkbox' ? event.target.checked : event.target.value)
  }

  const handleSubmit = async event => {
    event.preventDefault()
    const next = {}
    if (!values.name.trim()) next.name = forms.required
    if (!values.email.trim()) next.email = forms.required
    else if (!values.email.includes('@')) next.email = forms.invalidEmail
    if (!values.age.trim()) next.age = forms.required
    if (!values.goal) next.goal = forms.pickOne
    if (!values.experience) next.experience = forms.pickOne
    if (!values.equipment.trim()) next.equipment = forms.required
    if (!values.availability) next.availability = forms.pickOne
    if (!values.consent) next.consent = forms.confirm
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
    <Panel as="form" noValidate onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={fields.name.label} error={errors.name}>
          <Input
            icon={User}
            value={values.name}
            onChange={handleChange('name')}
            placeholder={fields.name.placeholder}
            autoComplete="name"
            required
          />
        </Field>
        <Field label={fields.email.label} error={errors.email}>
          <Input
            icon={Mail}
            type="email"
            value={values.email}
            onChange={handleChange('email')}
            placeholder={fields.email.placeholder}
            autoComplete="email"
            required
          />
        </Field>
        <Field label={fields.phone.label} optional optionalLabel={forms.optional}>
          <Input
            icon={Phone}
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
        <Field
          label={fields.location.label}
          optional
          optionalLabel={forms.optional}
          className="sm:col-span-2"
        >
          <Input
            icon={MapPin}
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
        <Field
          label={fields.availability.label}
          error={errors.availability}
          helper={fields.availability.unit}
          className="sm:col-span-2"
        >
          <SegmentedControl
            label={fields.availability.label}
            value={values.availability}
            onChange={next => setValue('availability', next)}
            options={fields.availability.options.map(option => ({
              value: option,
              label: option,
            }))}
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
          label={fields.notes.label}
          optional
          optionalLabel={forms.optional}
          className="sm:col-span-2"
        >
          <Textarea
            autoGrow
            value={values.notes}
            onChange={handleChange('notes')}
            placeholder={fields.notes.placeholder}
            rows={4}
            maxRows={14}
          />
        </Field>
      </div>

      <div className="mt-7 flex flex-col gap-2 border-t border-df-border pt-6">
        <Switch
          checked={values.consent}
          onChange={handleChange('consent')}
          label={fields.consent.label}
        />
        {errors.consent && <FieldMessage error text={errors.consent} />}
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-6 w-full sm:w-auto">
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

      <FormError className="mt-4" body={errorMessage ? `${copy.errorBody}` : undefined} />
    </Panel>
  )
}

import { useState } from 'react'
import { ArrowRight, Loader2, Mail, User } from 'lucide-react'
import { Button, Field, Input, Panel, Select, Textarea } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { useFormSubmission } from './useFormSubmission'
import { FormError, FormSuccess } from './FormFeedback'

const INITIAL_VALUES = { name: '', email: '', topic: '', message: '' }

export default function ContactForm() {
  const { contact, forms } = useContent()
  const fields = contact.form.fields
  const copy = contact.form

  const [values, setValues] = useState(INITIAL_VALUES)
  const [errors, setErrors] = useState({})
  const { submit, isSubmitting, isSuccess, errorMessage } = useFormSubmission('contact')

  const handleChange = key => event => {
    setValues(prev => ({ ...prev, [key]: event.target.value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    const next = {}
    if (!values.name.trim()) next.name = forms.required
    if (!values.email.trim()) next.email = forms.required
    else if (!values.email.includes('@')) next.email = forms.invalidEmail
    if (!values.topic) next.topic = forms.pickOne
    if (!values.message.trim()) next.message = forms.required
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
        <Field label={fields.topic.label} error={errors.topic} className="sm:col-span-2">
          <Select
            value={values.topic}
            onChange={handleChange('topic')}
            placeholder={fields.topic.placeholder}
            options={fields.topic.options}
            required
          />
        </Field>
        <Field label={fields.message.label} error={errors.message} className="sm:col-span-2">
          <Textarea
            autoGrow
            value={values.message}
            onChange={handleChange('message')}
            placeholder={fields.message.placeholder}
            rows={5}
            maxRows={14}
            required
          />
        </Field>
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-7 w-full sm:w-auto">
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

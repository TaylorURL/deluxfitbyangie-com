import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import {
  Button,
  Field,
  Input,
  Panel,
  SegmentedControl,
  Select,
  SplitHeading,
  Textarea,
} from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { submitMacroIntake } from '@/lib/api/portalApi'
import { feetInchesToCm, poundsToKg } from '@/lib/macroCalculator'
import { FormError } from '@/components/forms/FormFeedback'
import { EmptyState } from './PanelPrimitives'

const ACTIVITIES = ['sedentary', 'light', 'moderate', 'very_active']
const GOALS = ['fat_loss', 'maintenance', 'muscle_gain']

const blank = {
  sex: '',
  age: '',
  weightLb: '',
  heightFt: '',
  heightIn: '',
  activity: '',
  goal: '',
  pregnant: 'no',
  medical: '',
}

const whole = value => {
  const n = Number(value)
  return value !== '' && Number.isFinite(n) ? n : null
}

/**
 * The questions the macro calculator works from. The answers go to Angie, not
 * back to the client: the numbers they produce appear in the Nutrition tab
 * only once she has checked them and published a plan.
 */
function IntakeForm({ onSent, onCancel }) {
  const { portal } = useContent()
  const copy = portal.nutrition.intake
  const [values, setValues] = useState(blank)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)

  const set = key => value => setValues(prev => ({ ...prev, [key]: value }))
  const fromEvent = key => event => set(key)(event.target.value)

  const handleSubmit = async event => {
    event.preventDefault()
    const age = whole(values.age)
    const pounds = whole(values.weightLb)
    const feet = whole(values.heightFt)
    const inches = whole(values.heightIn) ?? 0
    if (!values.sex || !values.activity || !values.goal || !age || !pounds || !feet) {
      setError(copy.incomplete)
      return
    }
    setSending(true)
    setError(null)
    try {
      await submitMacroIntake({
        sex: values.sex,
        age: Math.round(age),
        weightKg: poundsToKg(pounds),
        heightCm: feetInchesToCm(feet, inches),
        activity: values.activity,
        goal: values.goal,
        pregnantOrBreastfeeding: values.sex === 'female' && values.pregnant === 'yes',
        medicalConditions: values.medical.trim(),
      })
      await onSent()
    } catch (sendError) {
      setError(sendError?.message || copy.failed)
    } finally {
      setSending(false)
    }
  }

  return (
    <Panel as="form" onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <SplitHeading as="h3" size="sub" text={copy.title} />
        <p className="text-[15px] leading-relaxed text-df-text-muted">{copy.body}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={copy.sexLabel}>
          <SegmentedControl
            label={copy.sexLabel}
            value={values.sex}
            onChange={set('sex')}
            options={[
              { value: 'female', label: copy.female },
              { value: 'male', label: copy.male },
            ]}
          />
        </Field>
        <Field label={copy.ageLabel}>
          <Input
            type="number"
            inputMode="numeric"
            min={10}
            max={100}
            value={values.age}
            onChange={fromEvent('age')}
          />
        </Field>
        <Field label={copy.weightLabel}>
          <Input
            type="number"
            inputMode="decimal"
            min={50}
            max={770}
            step="0.1"
            value={values.weightLb}
            onChange={fromEvent('weightLb')}
          />
        </Field>
        <Field label={copy.heightLabel}>
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              inputMode="numeric"
              min={3}
              max={8}
              value={values.heightFt}
              onChange={fromEvent('heightFt')}
              aria-label={copy.feet}
              placeholder={copy.feet}
            />
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              max={11}
              value={values.heightIn}
              onChange={fromEvent('heightIn')}
              aria-label={copy.inches}
              placeholder={copy.inches}
            />
          </div>
        </Field>
        <Field label={copy.activityLabel}>
          <Select
            value={values.activity}
            onChange={fromEvent('activity')}
            placeholder={copy.choose}
            options={ACTIVITIES.map(value => ({ value, label: copy.activities[value] }))}
          />
        </Field>
        <Field label={copy.goalLabel}>
          <Select
            value={values.goal}
            onChange={fromEvent('goal')}
            placeholder={copy.choose}
            options={GOALS.map(value => ({ value, label: copy.goals[value] }))}
          />
        </Field>
        {values.sex === 'female' && (
          <Field label={copy.pregnantLabel}>
            <SegmentedControl
              label={copy.pregnantLabel}
              value={values.pregnant}
              onChange={set('pregnant')}
              options={[
                { value: 'no', label: copy.no },
                { value: 'yes', label: copy.yes },
              ]}
            />
          </Field>
        )}
      </div>

      <Field
        label={copy.medicalLabel}
        helper={copy.medicalHelper}
        optional
        optionalLabel={portal.optional}
      >
        <Textarea
          autoGrow
          rows={3}
          maxLength={2000}
          value={values.medical}
          onChange={fromEvent('medical')}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="md" disabled={sending}>
          {sending ? (
            <>
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
              {copy.sending}
            </>
          ) : (
            copy.submit
          )}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" size="md" onClick={onCancel}>
            {copy.cancel}
          </Button>
        )}
      </div>
      <FormError body={error} />
    </Panel>
  )
}

/**
 * What a coaching client without a published plan sees: the questions, or,
 * once they are sent, word that Angie has them.
 */
export default function MacroIntake({ intake, reloadNutrition }) {
  const { portal } = useContent()
  const copy = portal.nutrition.intake
  const [editing, setEditing] = useState(false)

  const sent = async () => {
    setEditing(false)
    await reloadNutrition?.()
  }

  if (intake?.status === 'pending' && !editing) {
    return (
      <div className="flex flex-col items-center gap-4">
        <EmptyState title={copy.pendingTitle} body={copy.pendingBody} className="w-full" />
        <Button type="button" variant="ghost" size="md" onClick={() => setEditing(true)}>
          {copy.edit}
        </Button>
      </div>
    )
  }

  return <IntakeForm onSent={sent} onCancel={editing ? () => setEditing(false) : null} />
}

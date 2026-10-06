import { useState } from 'react'
import { Loader2, TriangleAlert } from 'lucide-react'
import { Badge, Button, Card, Field, Input, MicroLabel } from '@deluxfit/ds'
import { resolveMacroIntake, saveNutrition } from '@/lib/api/adminApi'
import { FormError } from '@/components/forms/FormFeedback'
import { fmtDateTime } from '../AdminPrimitives'
import {
  ACTIVITY_MULTIPLIERS,
  GOAL_FACTORS,
  calculateMacros,
  cmToFeetInches,
  intakeFromRow,
  kgToPounds,
} from '@/lib/macroCalculator'

const ACTIVITY_LABEL = {
  sedentary: 'Sedentary',
  light: 'Light, 1-2 workouts a week',
  moderate: 'Moderate, 3-5 workouts a week',
  very_active: 'Very active, 6-7 workouts a week',
}

const GOAL_LABEL = {
  fat_loss: 'Fat loss',
  maintenance: 'Maintenance or recomposition',
  muscle_gain: 'Muscle gain',
}

const REASON_LABEL = {
  pregnancy: 'Pregnant or breastfeeding',
  minor: 'Under 18',
  lowBmi: 'BMI under 18.5',
  medical: 'Listed a medical condition',
}

const whole = value => Math.round(Number(value)).toLocaleString('en-US')

const toNumber = value => {
  const trimmed = String(value ?? '').trim()
  if (!trimmed) return undefined
  const n = Number(trimmed)
  return Number.isFinite(n) ? n : undefined
}

function Answer({ label, children }) {
  return (
    <div className="flex flex-col gap-0.5">
      <MicroLabel tone="faint">{label}</MicroLabel>
      <span className="text-sm text-df-text">{children}</span>
    </div>
  )
}

/**
 * A client's macro calculator answers, waiting on the coach. The formula's
 * proposal fills the four targets, she keeps or changes any of them, and
 * publishing writes them to the client's nutrition plan - which is the first
 * moment the client sees a number. Answers on the review list get no proposal,
 * so those targets start empty and come from her.
 */
export default function MacroIntakeReview({ clientId, intake, currentPlan, reload }) {
  const result = calculateMacros(intakeFromRow(intake))
  const flagged = result.reasons.length > 0
  const proposal = result.targets

  const [form, setForm] = useState(() => ({
    calorieTarget: proposal ? String(proposal.calories) : '',
    proteinG: proposal ? String(proposal.proteinG) : '',
    carbsG: proposal ? String(proposal.carbsG) : '',
    fatG: proposal ? String(proposal.fatG) : '',
  }))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const set = key => event => setForm(prev => ({ ...prev, [key]: event.target.value }))

  const height = cmToFeetInches(intake.height_cm)
  const complete = ['calorieTarget', 'proteinG', 'carbsG', 'fatG'].every(
    key => toNumber(form[key]) != null
  )

  const handlePublish = async event => {
    event.preventDefault()
    if (!complete) {
      setError('Fill in all four targets before publishing.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      // Publishing onto the plan the client already has keeps its meals,
      // resources and notes; the edge function replaces whatever it is not
      // sent, so they travel with the new numbers.
      await saveNutrition({
        id: currentPlan?.id,
        userId: clientId,
        title: currentPlan?.title,
        calorieTarget: toNumber(form.calorieTarget),
        proteinG: toNumber(form.proteinG),
        carbsG: toNumber(form.carbsG),
        fatG: toNumber(form.fatG),
        mealStructure: currentPlan?.meal_structure,
        resources: currentPlan?.resources,
        notes: currentPlan?.notes ?? undefined,
        status: 'active',
      })
      await resolveMacroIntake(intake.id)
      await reload()
    } catch (publishError) {
      setError(publishError?.message || 'Could not publish these numbers.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card variant="inset" padded={false} className="grid gap-5 px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-600 text-df-text">Macro Calculator Answers</span>
          <Badge tone={flagged ? 'warning' : 'accent'} variant="soft" size="sm">
            {flagged ? 'Needs Your Numbers' : 'Ready to Review'}
          </Badge>
        </div>
        <span className="text-xs text-df-text-faint">
          Sent {fmtDateTime(intake.updated_at ?? intake.created_at)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Answer label="Sex">{intake.sex === 'male' ? 'Male' : 'Female'}</Answer>
        <Answer label="Age">{intake.age}</Answer>
        <Answer label="Weight">
          {whole(kgToPounds(intake.weight_kg))} lb ({Number(intake.weight_kg)} kg)
        </Answer>
        <Answer label="Height">
          {height.feet} ft {height.inches} in ({Number(intake.height_cm)} cm)
        </Answer>
        <Answer label="Activity">
          {ACTIVITY_LABEL[intake.activity]} (x{ACTIVITY_MULTIPLIERS[intake.activity]})
        </Answer>
        <Answer label="Goal">
          {GOAL_LABEL[intake.goal]} (x{GOAL_FACTORS[intake.goal].toFixed(2)})
        </Answer>
        {intake.sex === 'female' && (
          <Answer label="Pregnant or Breastfeeding">
            {intake.pregnant_or_breastfeeding ? 'Yes' : 'No'}
          </Answer>
        )}
        <Answer label="BMI">{result.bmi != null ? result.bmi.toFixed(1) : '—'}</Answer>
        <Answer label="BMR / TDEE">
          {whole(result.bmr)} / {whole(result.tdee)} kcal
        </Answer>
      </div>

      {intake.medical_conditions && (
        <Answer label="Medical Conditions">
          <span className="whitespace-pre-line">{intake.medical_conditions}</span>
        </Answer>
      )}

      {flagged && (
        <div className="border-df-warning/50 flex items-start gap-3 rounded-df-md border bg-df-warning-soft px-3 py-3 text-sm text-df-text">
          <TriangleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-df-warning" />
          <div className="grid gap-1">
            <span className="font-600">The calculator gave no numbers for this client.</span>
            <span className="text-df-text-muted">
              {result.reasons.map(reason => REASON_LABEL[reason]).join(' · ')}. Enter the targets
              yourself before publishing.
            </span>
          </div>
        </div>
      )}

      <form onSubmit={handlePublish} className="grid gap-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field label="Calories">
            <Input
              type="number"
              inputMode="numeric"
              value={form.calorieTarget}
              onChange={set('calorieTarget')}
            />
          </Field>
          <Field label="Protein (g)">
            <Input
              type="number"
              inputMode="numeric"
              value={form.proteinG}
              onChange={set('proteinG')}
            />
          </Field>
          <Field label="Carbs (g)">
            <Input type="number" inputMode="numeric" value={form.carbsG} onChange={set('carbsG')} />
          </Field>
          <Field label="Fat (g)">
            <Input type="number" inputMode="numeric" value={form.fatG} onChange={set('fatG')} />
          </Field>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" size="md" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Publishing…
              </>
            ) : (
              'Approve and Publish'
            )}
          </Button>
          <span className="text-xs text-df-text-faint">
            The client sees these numbers once you publish.
          </span>
        </div>
        <FormError body={error} />
      </form>
    </Card>
  )
}

import { useState } from 'react'
import { Loader2, Pencil, Plus, Trash2, X } from 'lucide-react'
import { Badge, Button, Card, Field, Input, Select, Textarea } from '@deluxfit/ds'
import { deleteNutrition, saveNutrition } from '@/lib/adminApi'
import { FormError, FormSuccess } from '@/components/forms/FormFeedback'
import { AdminEmpty, StatusBadge, fmtDate } from '../components/AdminPrimitives'

const emptyForm = () => ({
  id: null,
  title: '',
  calorieTarget: '',
  proteinG: '',
  carbsG: '',
  fatG: '',
  notes: '',
  status: 'active',
  mealStructure: [{ meal: '', suggestion: '' }],
  resources: [{ label: '', url: '' }],
})

const toRows = (arr, keys) =>
  Array.isArray(arr) && arr.length
    ? arr.map(item => ({ [keys[0]]: item?.[keys[0]] ?? '', [keys[1]]: item?.[keys[1]] ?? '' }))
    : [{ [keys[0]]: '', [keys[1]]: '' }]

const numOrUndef = value => {
  if (value === '' || value == null) return undefined
  const n = Number(value)
  return Number.isFinite(n) ? n : undefined
}

/**
 * NutritionQuickEditor — shows the client's current nutrition plan (macros,
 * meal structure, resources, notes) and an inline form to create or update one
 * via saveNutrition. Meal structure and resources are repeatable rows. Writes
 * route through the edge function; the parent reloads afterwards.
 */
export default function NutritionQuickEditor({ clientId, nutrition, reload }) {
  const list = nutrition ?? []
  const current = list[0] ?? null

  const [form, setForm] = useState(emptyForm)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const set = key => event => setForm(prev => ({ ...prev, [key]: event.target.value }))

  const setRow = (collection, index, key) => event =>
    setForm(prev => ({
      ...prev,
      [collection]: prev[collection].map((row, i) =>
        i === index ? { ...row, [key]: event.target.value } : row
      ),
    }))

  const addRow = (collection, blank) => () =>
    setForm(prev => ({ ...prev, [collection]: [...prev[collection], blank] }))

  const removeRow = (collection, index) => () =>
    setForm(prev => ({
      ...prev,
      [collection]: prev[collection].filter((_, i) => i !== index),
    }))

  const startCreate = () => {
    setForm(emptyForm())
    setError(null)
    setSuccess(null)
    setOpen(true)
  }

  const startEdit = plan => {
    setForm({
      id: plan.id,
      title: plan.title ?? '',
      calorieTarget: plan.calorie_target ?? '',
      proteinG: plan.protein_g ?? '',
      carbsG: plan.carbs_g ?? '',
      fatG: plan.fat_g ?? '',
      notes: plan.notes ?? '',
      status: plan.status ?? 'active',
      mealStructure: toRows(plan.meal_structure, ['meal', 'suggestion']),
      resources: toRows(plan.resources, ['label', 'url']),
    })
    setError(null)
    setSuccess(null)
    setOpen(true)
  }

  const closeForm = () => {
    setOpen(false)
    setForm(emptyForm())
  }

  const handleSave = async event => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const mealStructure = form.mealStructure.filter(r => r.meal.trim() || r.suggestion.trim())
      const resources = form.resources.filter(r => r.label.trim() || r.url.trim())
      await saveNutrition({
        id: form.id || undefined,
        userId: clientId,
        title: form.title.trim() || undefined,
        calorieTarget: numOrUndef(form.calorieTarget),
        proteinG: numOrUndef(form.proteinG),
        carbsG: numOrUndef(form.carbsG),
        fatG: numOrUndef(form.fatG),
        mealStructure: mealStructure.length ? mealStructure : undefined,
        resources: resources.length ? resources : undefined,
        notes: form.notes.trim() || undefined,
        status: form.status,
      })
      setSuccess(form.id ? 'Nutrition plan updated.' : 'Nutrition plan created.')
      setOpen(false)
      setForm(emptyForm())
      await reload()
    } catch (saveError) {
      setError(saveError?.message || 'Could not save the nutrition plan.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async id => {
    setDeleting(true)
    setError(null)
    setSuccess(null)
    try {
      await deleteNutrition(id)
      await reload()
    } catch (deleteError) {
      setError(deleteError?.message || 'Could not delete the nutrition plan.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-700 uppercase tracking-[0.16em] text-df-text-muted">
          Current nutrition
        </p>
        {!open && (
          <Button type="button" variant="outline" size="sm" onClick={startCreate}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            New plan
          </Button>
        )}
      </div>

      {!current ? (
        <AdminEmpty body="No nutrition plan yet for this client." />
      ) : (
        <div className="bg-df-surface/60 rounded-df-lg border border-df-border px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-600 text-df-text">
                {current.title || 'Nutrition plan'}
              </span>
              <StatusBadge status={current.status} />
            </div>
            <div className="flex shrink-0 gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => startEdit(current)}
                aria-label="Edit nutrition plan"
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(current.id)}
                disabled={deleting}
                aria-label="Delete nutrition plan"
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {current.calorie_target != null && (
              <Badge tone="accent" variant="soft" size="sm">
                {current.calorie_target} kcal
              </Badge>
            )}
            {current.protein_g != null && (
              <Badge tone="neutral" variant="outline" size="sm">
                P {current.protein_g}g
              </Badge>
            )}
            {current.carbs_g != null && (
              <Badge tone="neutral" variant="outline" size="sm">
                C {current.carbs_g}g
              </Badge>
            )}
            {current.fat_g != null && (
              <Badge tone="neutral" variant="outline" size="sm">
                F {current.fat_g}g
              </Badge>
            )}
          </div>

          {Array.isArray(current.meal_structure) && current.meal_structure.length > 0 && (
            <ul className="mt-3 grid gap-1.5 text-sm text-df-text-muted">
              {current.meal_structure.map((row, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-600 text-df-text">{row.meal}</span>
                  <span>{row.suggestion}</span>
                </li>
              ))}
            </ul>
          )}

          {Array.isArray(current.resources) && current.resources.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {current.resources.map((row, i) => (
                <a
                  key={i}
                  href={row.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-df-accent underline hover:text-df-accent-bright"
                >
                  {row.label || row.url}
                </a>
              ))}
            </div>
          )}

          {current.notes && (
            <p className="mt-3 text-sm leading-relaxed text-df-text-muted">{current.notes}</p>
          )}
          <p className="mt-2 text-xs text-df-text-faint">{fmtDate(current.created_at)}</p>
        </div>
      )}

      {open && (
        <Card variant="surface">
          <form onSubmit={handleSave} className="grid gap-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-600 text-df-text">
                {form.id ? 'Edit nutrition plan' : 'New nutrition plan'}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={closeForm}
                aria-label="Close form"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>

            <Field label="Title">
              <Input value={form.title} onChange={set('title')} placeholder="Cutting phase" />
            </Field>

            <div className="grid gap-5 sm:grid-cols-4">
              <Field label="Calories">
                <Input
                  type="number"
                  inputMode="numeric"
                  value={form.calorieTarget}
                  onChange={set('calorieTarget')}
                  placeholder="2200"
                />
              </Field>
              <Field label="Protein (g)">
                <Input
                  type="number"
                  inputMode="numeric"
                  value={form.proteinG}
                  onChange={set('proteinG')}
                  placeholder="180"
                />
              </Field>
              <Field label="Carbs (g)">
                <Input
                  type="number"
                  inputMode="numeric"
                  value={form.carbsG}
                  onChange={set('carbsG')}
                  placeholder="220"
                />
              </Field>
              <Field label="Fat (g)">
                <Input
                  type="number"
                  inputMode="numeric"
                  value={form.fatG}
                  onChange={set('fatG')}
                  placeholder="60"
                />
              </Field>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-700 uppercase tracking-[0.16em] text-df-text-muted">
                  Meal structure
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addRow('mealStructure', { meal: '', suggestion: '' })}
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Add meal
                </Button>
              </div>
              {form.mealStructure.map((row, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={row.meal}
                    onChange={setRow('mealStructure', i, 'meal')}
                    placeholder="Breakfast"
                    className="sm:max-w-[10rem]"
                  />
                  <Input
                    value={row.suggestion}
                    onChange={setRow('mealStructure', i, 'suggestion')}
                    placeholder="Oats + whey + berries"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeRow('mealStructure', i)}
                    aria-label="Remove meal"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-700 uppercase tracking-[0.16em] text-df-text-muted">
                  Resources
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addRow('resources', { label: '', url: '' })}
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Add resource
                </Button>
              </div>
              {form.resources.map((row, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={row.label}
                    onChange={setRow('resources', i, 'label')}
                    placeholder="Grocery list"
                    className="sm:max-w-[10rem]"
                  />
                  <Input
                    type="url"
                    value={row.url}
                    onChange={setRow('resources', i, 'url')}
                    placeholder="https://…"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeRow('resources', i)}
                    aria-label="Remove resource"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              ))}
            </div>

            <Field label="Notes">
              <Textarea value={form.notes} onChange={set('notes')} rows={3} />
            </Field>

            <Field label="Status">
              <Select value={form.status} onChange={set('status')}>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </Select>
            </Field>

            <div className="flex gap-3">
              <Button type="submit" size="md" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Saving…
                  </>
                ) : form.id ? (
                  'Save plan'
                ) : (
                  'Create plan'
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <FormError body={error} />
      {success && <FormSuccess heading="Done" body={success} />}
    </div>
  )
}

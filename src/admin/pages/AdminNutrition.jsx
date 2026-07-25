import { useCallback, useState } from 'react'
import { Loader2, Plus, Save, X } from 'lucide-react'
import { Button, Field, Input, Select, Textarea } from '@deluxfit/ds'
import { deleteNutrition, getClientNutrition, listClients, saveNutrition } from '@/lib/adminApi'
import { FormError, FormSuccess } from '@/components/forms/FormFeedback'
import {
  AdminEmpty,
  AdminLoading,
  ClientSelect,
  SectionCard,
  SectionHeading,
  clientLabel,
  useAsyncData,
} from '../components/AdminPrimitives'
import RepeatableSection from '../authoring/RepeatableSection'
import NutritionRow from '../authoring/NutritionRow'

/**
 * Every write goes through the staff-only `upsert-nutrition` edge function via
 * the adminApi helpers; the frontend never touches Supabase tables directly.
 */

const emptyDraft = () => ({
  id: null,
  title: '',
  calorieTarget: '',
  proteinG: '',
  carbsG: '',
  fatG: '',
  notes: '',
  status: 'active',
  meals: [{ meal: '', suggestion: '' }],
  resources: [{ label: '', url: '' }],
})

const draftFromPlan = plan => ({
  id: plan.id,
  title: plan.title ?? '',
  calorieTarget: plan.calorie_target != null ? String(plan.calorie_target) : '',
  proteinG: plan.protein_g != null ? String(plan.protein_g) : '',
  carbsG: plan.carbs_g != null ? String(plan.carbs_g) : '',
  fatG: plan.fat_g != null ? String(plan.fat_g) : '',
  notes: plan.notes ?? '',
  status: plan.status ?? 'active',
  meals:
    Array.isArray(plan.meal_structure) && plan.meal_structure.length
      ? plan.meal_structure.map(row => ({
          meal: row?.meal ?? '',
          suggestion: row?.suggestion ?? '',
        }))
      : [{ meal: '', suggestion: '' }],
  resources:
    Array.isArray(plan.resources) && plan.resources.length
      ? plan.resources.map(row => ({ label: row?.label ?? '', url: row?.url ?? '' }))
      : [{ label: '', url: '' }],
})

const toNumberOrUndefined = value => {
  const trimmed = String(value).trim()
  if (!trimmed) return undefined
  const num = Number(trimmed)
  return Number.isFinite(num) ? num : undefined
}

export default function AdminNutrition() {
  const {
    data: clients,
    loading: clientsLoading,
    error: clientsError,
  } = useAsyncData(listClients, [], [])

  const [clientId, setClientId] = useState('')
  const {
    data: plans,
    loading,
    error,
    reload,
  } = useAsyncData(
    () => (clientId ? getClientNutrition(clientId) : Promise.resolve([])),
    [clientId],
    []
  )

  const [draft, setDraft] = useState(null)
  const [status, setStatus] = useState('idle') // idle | saving | error
  const [formError, setFormError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [busyId, setBusyId] = useState(null)

  const isEditing = Boolean(draft?.id)
  const isWorking = status === 'saving'
  const selectedClient = (clients ?? []).find(client => client.id === clientId)

  const resetForm = useCallback(() => {
    setDraft(null)
    setStatus('idle')
    setFormError(null)
  }, [])

  const handleClientChange = value => {
    setClientId(value)
    setDraft(null)
    setStatus('idle')
    setFormError(null)
    setSuccess(null)
  }

  const openCreate = () => {
    setSuccess(null)
    setFormError(null)
    setStatus('idle')
    setDraft(emptyDraft())
  }

  const openEdit = plan => {
    setSuccess(null)
    setFormError(null)
    setStatus('idle')
    setDraft(draftFromPlan(plan))
  }

  const setField = key => event => {
    const value = event.target.value
    setDraft(prev => ({ ...prev, [key]: value }))
  }

  const setRow = (key, index, field) => event => {
    const value = event.target.value
    setDraft(prev => ({
      ...prev,
      [key]: prev[key].map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    }))
  }

  const addRow = (key, blank) => () => {
    setDraft(prev => ({ ...prev, [key]: [...prev[key], blank] }))
  }

  const removeRow = (key, index) => () => {
    setDraft(prev => {
      const next = prev[key].filter((_, i) => i !== index)
      return { ...prev, [key]: next.length ? next : prev[key] }
    })
  }

  const handleSubmit = async event => {
    event.preventDefault()
    if (!draft) return
    if (!clientId) {
      setFormError('Pick a client first.')
      return
    }
    if (!draft.title.trim()) {
      setFormError('A plan title is required.')
      return
    }

    setStatus('saving')
    setFormError(null)
    setSuccess(null)
    try {
      const mealStructure = draft.meals
        .map(row => ({ meal: row.meal.trim(), suggestion: row.suggestion.trim() }))
        .filter(row => row.meal || row.suggestion)
      const resources = draft.resources
        .map(row => ({ label: row.label.trim(), url: row.url.trim() }))
        .filter(row => row.label || row.url)

      const saved = await saveNutrition({
        id: draft.id ?? undefined,
        userId: clientId,
        title: draft.title.trim(),
        calorieTarget: toNumberOrUndefined(draft.calorieTarget),
        proteinG: toNumberOrUndefined(draft.proteinG),
        carbsG: toNumberOrUndefined(draft.carbsG),
        fatG: toNumberOrUndefined(draft.fatG),
        mealStructure,
        resources,
        notes: draft.notes.trim() || undefined,
        status: draft.status,
      })
      setSuccess(`“${saved?.title || draft.title.trim()}” ${isEditing ? 'updated' : 'created'}.`)
      resetForm()
      reload()
    } catch (saveError) {
      setStatus('error')
      setFormError(saveError?.message || 'Could not save the nutrition plan.')
    }
  }

  const handleDelete = async plan => {
    if (!window.confirm(`Delete “${plan.title || 'this plan'}”? This cannot be undone.`)) return
    setBusyId(plan.id)
    setFormError(null)
    setSuccess(null)
    try {
      await deleteNutrition(plan.id)
      setSuccess(`“${plan.title || 'Plan'}” deleted.`)
      if (draft?.id === plan.id) resetForm()
      reload()
    } catch (deleteError) {
      setFormError(deleteError?.message || 'Could not delete the nutrition plan.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="grid gap-6">
      <SectionCard>
        <SectionHeading
          eyebrow="Nutrition"
          title="Nutrition plans."
          intro="Pick a client, then author their macro targets, meal structure, and resources."
        />
        <div className="mt-6 max-w-md">
          <Field label="Client" helper="Plans below are scoped to this client.">
            {clientsLoading ? (
              <AdminLoading label="Loading clients…" />
            ) : (
              <ClientSelect
                clients={clients ?? []}
                value={clientId}
                onChange={handleClientChange}
                placeholder="Select a client…"
                id="nutrition-client"
              />
            )}
          </Field>
          {clientsError && <FormError body={clientsError} />}
        </div>
      </SectionCard>

      {clientId && (
        <SectionCard>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <SectionHeading
              eyebrow={selectedClient ? clientLabel(selectedClient) : 'Client'}
              title="Plans."
            />
            {!draft && (
              <Button onClick={openCreate} className="shrink-0">
                <Plus className="h-4 w-4" aria-hidden="true" />
                New plan
              </Button>
            )}
          </div>

          {success && (
            <div className="mt-5">
              <FormSuccess heading="Saved" body={success} />
            </div>
          )}

          {draft && (
            <form noValidate onSubmit={handleSubmit} className="mt-6 grid gap-5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-700 uppercase tracking-[0.2em] text-df-accent">
                  {isEditing ? 'Edit plan' : 'New plan'}
                </p>
                <Button variant="ghost" size="sm" onClick={resetForm} disabled={isWorking}>
                  <X className="h-4 w-4" aria-hidden="true" />
                  Cancel
                </Button>
              </div>

              <Field label="Title">
                <Input
                  value={draft.title}
                  onChange={setField('title')}
                  placeholder="Cutting — 1,900 kcal"
                  autoComplete="off"
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-4">
                <Field label="Calories (kcal)">
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={draft.calorieTarget}
                    onChange={setField('calorieTarget')}
                    placeholder="1900"
                  />
                </Field>
                <Field label="Protein (g)">
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={draft.proteinG}
                    onChange={setField('proteinG')}
                    placeholder="160"
                  />
                </Field>
                <Field label="Carbs (g)">
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={draft.carbsG}
                    onChange={setField('carbsG')}
                    placeholder="180"
                  />
                </Field>
                <Field label="Fat (g)">
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={draft.fatG}
                    onChange={setField('fatG')}
                    placeholder="55"
                  />
                </Field>
              </div>

              <RepeatableSection
                title="Meal structure"
                helper="Each row is a meal and what to eat. Add as many as you need."
                rows={draft.meals}
                onAdd={addRow('meals', { meal: '', suggestion: '' })}
                addLabel="Add meal"
                renderRow={(row, index) => (
                  <>
                    <Field label="Meal">
                      <Input
                        value={row.meal}
                        onChange={setRow('meals', index, 'meal')}
                        placeholder="Breakfast"
                        autoComplete="off"
                      />
                    </Field>
                    <Field label="Suggestion" className="sm:col-span-2">
                      <Input
                        value={row.suggestion}
                        onChange={setRow('meals', index, 'suggestion')}
                        placeholder="Greek yogurt, berries, oats — ~40g protein"
                        autoComplete="off"
                      />
                    </Field>
                  </>
                )}
                onRemove={index => removeRow('meals', index)()}
                canRemove={draft.meals.length > 1}
                disabled={isWorking}
              />

              <RepeatableSection
                title="Resources"
                helper="Optional links — grocery lists, recipes, supplement guides."
                rows={draft.resources}
                onAdd={addRow('resources', { label: '', url: '' })}
                addLabel="Add resource"
                renderRow={(row, index) => (
                  <>
                    <Field label="Label">
                      <Input
                        value={row.label}
                        onChange={setRow('resources', index, 'label')}
                        placeholder="Grocery list"
                        autoComplete="off"
                      />
                    </Field>
                    <Field label="URL" className="sm:col-span-2">
                      <Input
                        type="url"
                        value={row.url}
                        onChange={setRow('resources', index, 'url')}
                        placeholder="https://…"
                        autoComplete="off"
                      />
                    </Field>
                  </>
                )}
                onRemove={index => removeRow('resources', index)()}
                canRemove={draft.resources.length > 1}
                disabled={isWorking}
              />

              <Field label="Notes (optional)">
                <Textarea
                  rows={3}
                  value={draft.notes}
                  onChange={setField('notes')}
                  placeholder="Hydration, timing, flexibility on rest days…"
                />
              </Field>

              <Field label="Status" className="sm:max-w-[12rem]">
                <Select value={draft.status} onChange={setField('status')}>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </Select>
              </Field>

              <FormError body={formError} />

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="ghost" onClick={resetForm} disabled={isWorking}>
                  Cancel
                </Button>
                <Button type="submit" size="lg" disabled={isWorking}>
                  {isWorking ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Saving…
                    </>
                  ) : isEditing ? (
                    <>
                      <Save className="h-4 w-4" aria-hidden="true" />
                      Save changes
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" aria-hidden="true" />
                      Create plan
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6">
            {loading ? (
              <AdminLoading label="Loading nutrition plans…" />
            ) : error ? (
              <FormError body={error} />
            ) : (plans ?? []).length === 0 ? (
              <AdminEmpty body="No nutrition plans yet. Create this client's first plan above." />
            ) : (
              <ul className="grid gap-3">
                {plans.map(plan => (
                  <NutritionRow
                    key={plan.id}
                    plan={plan}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    busy={busyId === plan.id}
                  />
                ))}
              </ul>
            )}
          </div>
        </SectionCard>
      )}
    </div>
  )
}

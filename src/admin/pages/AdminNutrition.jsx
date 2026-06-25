import { useCallback, useState } from 'react'
import { Loader2, Pencil, Plus, Save, Trash2, Utensils, X } from 'lucide-react'
import { Badge, Button, Field, Input, Select, Textarea, cn } from '@deluxfit/ds'
import {
  deleteNutrition,
  getClientNutrition,
  listClients,
  saveNutrition,
} from '@/lib/adminApi'
import { FormError, FormSuccess } from '@/components/forms/FormFeedback'
import {
  AdminEmpty,
  AdminLoading,
  ClientSelect,
  SectionCard,
  SectionHeading,
  StatusBadge,
  clientLabel,
  fmtDate,
  useAsyncData,
} from '../components/AdminPrimitives'

/**
 * AdminNutrition — nutrition authoring. The coach picks a client, then reads
 * and authors that client's nutrition plans: macro targets, a repeatable meal
 * structure, helpful resource links, and notes.
 *
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
  const { data: clients, loading: clientsLoading, error: clientsError } = useAsyncData(
    listClients,
    [],
    []
  )

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
    // eslint-disable-next-line no-alert
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

/** A labelled block of repeatable {field} rows with add / remove controls. */
function RepeatableSection({
  title,
  helper,
  rows,
  renderRow,
  onAdd,
  addLabel,
  onRemove,
  canRemove,
  disabled,
}) {
  return (
    <div className="grid gap-3 rounded-df-md border border-df-border bg-df-surface-2/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-700 uppercase tracking-[0.18em] text-df-text-muted">
          {title}
        </p>
        <Button type="button" variant="outline" size="sm" onClick={onAdd} disabled={disabled}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          {addLabel}
        </Button>
      </div>
      {helper && <p className="text-xs text-df-text-faint">{helper}</p>}
      <div className="grid gap-4">
        {rows.map((row, index) => (
          <div
            key={index}
            className="grid gap-4 rounded-df-sm border border-df-border bg-df-surface/40 p-3 sm:grid-cols-3"
          >
            {renderRow(row, index)}
            <div className="sm:col-span-3 sm:flex sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
                disabled={disabled || !canRemove}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** A single nutrition plan rendered as a row; active plans are highlighted. */
function NutritionRow({ plan, onEdit, onDelete, busy }) {
  const isActive = plan.status === 'active'
  const macros = [
    plan.calorie_target != null ? `${plan.calorie_target} kcal` : null,
    plan.protein_g != null ? `${plan.protein_g}P` : null,
    plan.carbs_g != null ? `${plan.carbs_g}C` : null,
    plan.fat_g != null ? `${plan.fat_g}F` : null,
  ].filter(Boolean)
  const meals = Array.isArray(plan.meal_structure) ? plan.meal_structure : []
  const resources = Array.isArray(plan.resources) ? plan.resources : []

  return (
    <li
      className={cn(
        'flex flex-col gap-4 rounded-df-md border p-4',
        isActive
          ? 'border-df-accent/40 bg-df-accent-soft/40'
          : 'border-df-border bg-df-surface-2/50'
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-df-lg bg-df-accent-soft text-df-accent-bright"
          >
            <Utensils className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-display text-base font-400 uppercase tracking-[0.01em] text-df-text">
                {plan.title || 'Untitled plan'}
              </p>
              <StatusBadge status={plan.status} />
            </div>
            {macros.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {macros.map(macro => (
                  <Badge key={macro} tone="neutral" variant="outline" size="sm">
                    {macro}
                  </Badge>
                ))}
              </div>
            )}
            <p className="mt-2 text-[11px] font-600 uppercase tracking-[0.16em] text-df-text-faint">
              {meals.length} {meals.length === 1 ? 'meal' : 'meals'}
              <span aria-hidden="true"> · </span>
              Created {fmtDate(plan.created_at)}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(plan)} disabled={busy}>
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(plan)} disabled={busy}>
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Delete
          </Button>
        </div>
      </div>

      {meals.length > 0 && (
        <ul className="grid gap-2 border-t border-df-border pt-3">
          {meals.map((row, index) => (
            <li key={index} className="flex flex-col gap-0.5 text-sm sm:flex-row sm:gap-3">
              <span className="shrink-0 font-600 text-df-text sm:w-32">{row?.meal}</span>
              <span className="text-df-text-muted">{row?.suggestion}</span>
            </li>
          ))}
        </ul>
      )}

      {plan.notes ? (
        <p className="border-t border-df-border pt-3 text-sm leading-relaxed text-df-text-muted">
          {plan.notes}
        </p>
      ) : null}

      {resources.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-df-border pt-3">
          {resources.map((row, index) =>
            row?.url ? (
              <a
                key={index}
                href={row.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-df-sm border border-df-border bg-df-surface px-3 py-1.5 text-[11px] font-600 uppercase tracking-[0.16em] text-df-text-muted transition-colors hover:border-df-border-strong hover:text-df-accent-bright"
              >
                {row.label || row.url}
              </a>
            ) : (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 rounded-df-sm border border-df-border bg-df-surface px-3 py-1.5 text-[11px] font-600 uppercase tracking-[0.16em] text-df-text-muted"
              >
                {row?.label}
              </span>
            )
          )}
        </div>
      )}
    </li>
  )
}

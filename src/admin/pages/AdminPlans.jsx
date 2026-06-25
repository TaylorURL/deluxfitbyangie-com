import { useCallback, useState } from 'react'
import { Dumbbell, Loader2, Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import { Button, Field, Input, Select, Textarea } from '@deluxfit/ds'
import { deletePlan, getClientPlans, listClients, savePlan } from '@/lib/adminApi'
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
 * AdminPlans — workout program authoring. The coach picks a client, then
 * reads and authors that client's personalized training plans. Program types
 * (Weight Loss, Muscle Gain, Glute Growth, Strength, Beginner…) are NOT
 * hardcoded — they're whatever the coach types as the plan title; the common
 * ones are offered only as datalist suggestions.
 *
 * Every write goes through the staff-only `upsert-plan` edge function via the
 * adminApi helpers; the frontend never touches Supabase tables directly.
 */

const PROGRAM_SUGGESTIONS = [
  'Weight Loss',
  'Muscle Gain',
  'Glute Growth',
  'Strength',
  'Beginner',
]

const emptyDraft = () => ({
  id: null,
  title: '',
  summary: '',
  status: 'active',
  schedule: '',
})

const draftFromPlan = plan => ({
  id: plan.id,
  title: plan.title ?? '',
  summary: plan.summary ?? '',
  status: plan.status ?? 'active',
  schedule: Array.isArray(plan.content?.weeks)
    ? plan.content.weeks.map(week => week?.title ?? week ?? '').join('\n')
    : '',
})

/** Split the textarea into one content.weeks entry per non-empty line. */
const weeksFromSchedule = schedule =>
  schedule
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(title => ({ title }))

export default function AdminPlans() {
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
    () => (clientId ? getClientPlans(clientId) : Promise.resolve([])),
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

  const handleSubmit = async event => {
    event.preventDefault()
    if (!draft) return
    if (!clientId) {
      setFormError('Pick a client first.')
      return
    }
    if (!draft.title.trim()) {
      setFormError('A program title is required.')
      return
    }

    setStatus('saving')
    setFormError(null)
    setSuccess(null)
    try {
      const saved = await savePlan({
        id: draft.id ?? undefined,
        userId: clientId,
        title: draft.title.trim(),
        summary: draft.summary.trim() || undefined,
        status: draft.status,
        content: { weeks: weeksFromSchedule(draft.schedule) },
      })
      setSuccess(`“${saved?.title || draft.title.trim()}” ${isEditing ? 'updated' : 'created'}.`)
      resetForm()
      reload()
    } catch (saveError) {
      setStatus('error')
      setFormError(saveError?.message || 'Could not save the program.')
    }
  }

  const handleDelete = async plan => {
    // eslint-disable-next-line no-alert
    if (!window.confirm(`Delete “${plan.title}”? This cannot be undone.`)) return
    setBusyId(plan.id)
    setFormError(null)
    setSuccess(null)
    try {
      await deletePlan(plan.id)
      setSuccess(`“${plan.title}” deleted.`)
      if (draft?.id === plan.id) resetForm()
      reload()
    } catch (deleteError) {
      setFormError(deleteError?.message || 'Could not delete the program.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="grid gap-6">
      <SectionCard>
        <SectionHeading
          eyebrow="Programs"
          title="Workout programs."
          intro="Pick a client, then author their personalized training programs. Program type is set by the title you choose — common ones are suggested as you type."
        />
        <div className="mt-6 max-w-md">
          <Field label="Client" helper="Programs below are scoped to this client.">
            {clientsLoading ? (
              <AdminLoading label="Loading clients…" />
            ) : (
              <ClientSelect
                clients={clients ?? []}
                value={clientId}
                onChange={handleClientChange}
                placeholder="Select a client…"
                id="plan-client"
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
              title="Programs."
            />
            {!draft && (
              <Button onClick={openCreate} className="shrink-0">
                <Plus className="h-4 w-4" aria-hidden="true" />
                New program
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
                  {isEditing ? 'Edit program' : 'New program'}
                </p>
                <Button variant="ghost" size="sm" onClick={resetForm} disabled={isWorking}>
                  <X className="h-4 w-4" aria-hidden="true" />
                  Cancel
                </Button>
              </div>

              <Field label="Program title" helper="e.g. Glute Growth — 8-week block">
                <Input
                  value={draft.title}
                  onChange={setField('title')}
                  placeholder="Glute Growth"
                  list="program-suggestions"
                  autoComplete="off"
                />
              </Field>
              <datalist id="program-suggestions">
                {PROGRAM_SUGGESTIONS.map(option => (
                  <option key={option} value={option} />
                ))}
              </datalist>

              <Field label="Summary (optional)">
                <Textarea
                  rows={3}
                  value={draft.summary}
                  onChange={setField('summary')}
                  placeholder="Goal, focus, and how to run this block…"
                />
              </Field>

              <Field
                label="Weekly schedule"
                helper="One week per line. Each non-empty line becomes a week in the client's plan."
              >
                <Textarea
                  rows={6}
                  value={draft.schedule}
                  onChange={setField('schedule')}
                  placeholder={
                    'Week 1 — Foundation: full-body, 3 sessions\nWeek 2 — Build: add volume on lower body\nWeek 3 — Push: progressive overload'
                  }
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
                      Create program
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6">
            {loading ? (
              <AdminLoading label="Loading programs…" />
            ) : error ? (
              <FormError body={error} />
            ) : (plans ?? []).length === 0 ? (
              <AdminEmpty body="No programs yet. Create this client's first program above." />
            ) : (
              <ul className="grid gap-3">
                {plans.map(plan => (
                  <PlanRow
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

/** A single training program rendered as a row with its weeks and actions. */
function PlanRow({ plan, onEdit, onDelete, busy }) {
  const weeks = Array.isArray(plan.content?.weeks) ? plan.content.weeks : []

  return (
    <li className="flex flex-col gap-4 rounded-df-md border border-df-border bg-df-surface-2/50 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-df-lg bg-df-accent-soft text-df-accent-bright"
          >
            <Dumbbell className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-display text-base font-400 uppercase tracking-[0.01em] text-df-text">
                {plan.title}
              </p>
              <StatusBadge status={plan.status} />
            </div>
            {plan.summary ? (
              <p className="mt-1.5 text-sm leading-relaxed text-df-text-muted">{plan.summary}</p>
            ) : null}
            <p className="mt-2 text-[11px] font-600 uppercase tracking-[0.16em] text-df-text-faint">
              {weeks.length} {weeks.length === 1 ? 'week' : 'weeks'}
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

      {weeks.length > 0 && (
        <ul className="grid gap-2 border-t border-df-border pt-3">
          {weeks.map((week, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-sm text-df-text-muted"
            >
              <span className="font-display text-base text-df-accent-bright">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>{week?.title ?? week}</span>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

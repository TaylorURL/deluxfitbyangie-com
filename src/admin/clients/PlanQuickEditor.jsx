import { useState } from 'react'
import { Loader2, Pencil, Plus, Trash2, X } from 'lucide-react'
import { Button, Card, Field, Input, Select, Textarea } from '@deluxfit/ds'
import { deletePlan, savePlan } from '@/lib/adminApi'
import { FormError, FormSuccess } from '@/components/forms/FormFeedback'
import { AdminEmpty, StatusBadge, fmtDate } from '../components/AdminPrimitives'

const emptyForm = () => ({ id: null, title: '', summary: '', status: 'draft', weeks: '' })

const weeksToText = content => {
  const weeks = content?.weeks
  if (!Array.isArray(weeks)) return ''
  return weeks.map(week => week?.title ?? '').join('\n')
}

const textToWeeks = text =>
  text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(title => ({ title }))

/**
 * Each line in the "weeks" textarea becomes a content.weeks entry { title }.
 * Writes go through savePlan / deletePlan, then the parent reloads.
 */
export default function PlanQuickEditor({ clientId, plans, reload }) {
  const list = plans ?? []
  const [form, setForm] = useState(emptyForm)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const set = key => event => setForm(prev => ({ ...prev, [key]: event.target.value }))

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
      summary: plan.summary ?? '',
      status: plan.status ?? 'draft',
      weeks: weeksToText(plan.content),
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
    if (!form.title.trim()) {
      setError('A plan title is required.')
      return
    }
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const weeks = textToWeeks(form.weeks)
      await savePlan({
        id: form.id || undefined,
        userId: clientId,
        title: form.title.trim(),
        summary: form.summary.trim() || undefined,
        status: form.status,
        content: weeks.length ? { weeks } : undefined,
      })
      setSuccess(form.id ? 'Plan updated.' : 'Plan created.')
      setOpen(false)
      setForm(emptyForm())
      await reload()
    } catch (saveError) {
      setError(saveError?.message || 'Could not save the plan.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async id => {
    setDeletingId(id)
    setError(null)
    setSuccess(null)
    try {
      await deletePlan(id)
      await reload()
    } catch (deleteError) {
      setError(deleteError?.message || 'Could not delete the plan.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-700 uppercase tracking-[0.16em] text-df-text-muted">
          {list.length} plan{list.length === 1 ? '' : 's'}
        </p>
        {!open && (
          <Button type="button" variant="outline" size="sm" onClick={startCreate}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            New plan
          </Button>
        )}
      </div>

      {list.length === 0 ? (
        <AdminEmpty body="No training plans yet for this client." />
      ) : (
        <div className="grid gap-2">
          {list.map(plan => (
            <div
              key={plan.id}
              className="bg-df-surface/60 flex items-start justify-between gap-3 rounded-df-lg border border-df-border px-4 py-3"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-600 text-df-text">{plan.title}</span>
                  <StatusBadge status={plan.status} />
                </div>
                {plan.summary && (
                  <p className="mt-1 text-sm leading-relaxed text-df-text-muted">{plan.summary}</p>
                )}
                <p className="mt-1 text-xs text-df-text-faint">
                  {Array.isArray(plan.content?.weeks)
                    ? `${plan.content.weeks.length} weeks · `
                    : ''}
                  {fmtDate(plan.created_at)}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => startEdit(plan)}
                  aria-label={`Edit ${plan.title}`}
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(plan.id)}
                  disabled={deletingId === plan.id}
                  aria-label={`Delete ${plan.title}`}
                >
                  {deletingId === plan.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && (
        <Card variant="surface">
          <form onSubmit={handleSave} className="grid gap-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-600 text-df-text">{form.id ? 'Edit plan' : 'New plan'}</p>
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
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Title" className="sm:col-span-2">
                <Input
                  value={form.title}
                  onChange={set('title')}
                  placeholder="12-Week Strength Block"
                />
              </Field>
              <Field label="Status">
                <Select value={form.status} onChange={set('status')}>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </Select>
              </Field>
            </div>
            <Field label="Summary" helper="A short description shown to the client.">
              <Textarea value={form.summary} onChange={set('summary')} rows={2} />
            </Field>
            <Field label="Weeks" helper="One week per line — each line becomes a week title.">
              <Textarea
                value={form.weeks}
                onChange={set('weeks')}
                rows={5}
                placeholder={'Week 1 — Foundation\nWeek 2 — Build\nWeek 3 — Peak'}
              />
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

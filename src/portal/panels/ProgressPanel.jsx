import { useState } from 'react'
import { Loader2, Plus } from 'lucide-react'
import { Button, Card, Field, Input, Textarea } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { logProgress } from '@/lib/portalApi'
import { toDateKey } from '@/lib/booking'
import { FormError } from '@/components/forms/FormFeedback'
import { EmptyState, PanelHeading } from './PanelPrimitives'

const emptyEntry = () => ({ entryDate: toDateKey(new Date()), weight: '', bodyFat: '', notes: '' })

/**
 * ProgressPanel — log and review progress entries. New entries are written by
 * the `log-progress` edge function (never a direct table write), then the list
 * reloads.
 */
export default function ProgressPanel({ progress, reloadProgress }) {
  const { portal } = useContent()
  const copy = portal.progress

  const [open, setOpen] = useState(false)
  const [values, setValues] = useState(emptyEntry)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = key => event => setValues(prev => ({ ...prev, [key]: event.target.value }))

  const handleSave = async event => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await logProgress({
        entryDate: values.entryDate,
        weight: values.weight ? Number(values.weight) : null,
        bodyFat: values.bodyFat ? Number(values.bodyFat) : null,
        notes: values.notes || null,
      })
      setValues(emptyEntry())
      setOpen(false)
      await reloadProgress()
    } catch (saveError) {
      setError(saveError?.message || 'Could not save your entry.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section>
      <div className="mb-7 flex items-end justify-between gap-4">
        <PanelHeading title={copy.title} />
        <Button type="button" variant="outline" size="md" onClick={() => setOpen(o => !o)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          {copy.addEntry}
        </Button>
      </div>

      {open && (
        <Card variant="elevated" className="mb-6">
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label={copy.dateLabel}>
                <Input type="date" value={values.entryDate} onChange={handleChange('entryDate')} />
              </Field>
              <Field label={copy.weightLabel}>
                <Input
                  type="number"
                  inputMode="decimal"
                  value={values.weight}
                  onChange={handleChange('weight')}
                  placeholder="0"
                />
              </Field>
              <Field label={copy.bodyFatLabel}>
                <Input
                  type="number"
                  inputMode="decimal"
                  value={values.bodyFat}
                  onChange={handleChange('bodyFat')}
                  placeholder="0"
                />
              </Field>
            </div>
            <Field label={copy.notesLabel}>
              <Textarea
                value={values.notes}
                onChange={handleChange('notes')}
                placeholder={copy.notesPlaceholder}
                rows={3}
              />
            </Field>
            <Button type="submit" size="md" disabled={saving} className="self-start">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  {copy.saving}
                </>
              ) : (
                copy.saveEntry
              )}
            </Button>
            <FormError body={error} />
          </form>
        </Card>
      )}

      {progress.length === 0 ? (
        <EmptyState body={copy.empty} />
      ) : (
        <div className="overflow-x-auto rounded-df-lg border border-df-border">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-df-border bg-df-surface-2 text-[11px] font-700 uppercase tracking-[0.16em] text-df-text-muted">
                <th className="px-4 py-3">{copy.colDate}</th>
                <th className="px-4 py-3">{copy.colWeight}</th>
                <th className="px-4 py-3">{copy.colBodyFat}</th>
                <th className="px-4 py-3">{copy.colNotes}</th>
              </tr>
            </thead>
            <tbody>
              {progress.map(entry => (
                <tr key={entry.id} className="border-b border-df-border last:border-0 text-df-text-muted">
                  <td className="px-4 py-3 text-df-text">{entry.entry_date}</td>
                  <td className="px-4 py-3">{entry.weight ?? '—'}</td>
                  <td className="px-4 py-3">{entry.body_fat ?? '—'}</td>
                  <td className="px-4 py-3">{entry.notes ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

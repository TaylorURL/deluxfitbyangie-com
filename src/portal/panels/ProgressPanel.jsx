import { useRef, useState } from 'react'
import { ImageIcon, Loader2, Plus } from 'lucide-react'
import { Button, Card, Field, Input, Textarea } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { useAuth } from '@/auth/useAuth'
import { getSignedUrl, logProgress, uploadProgressPhoto } from '@/lib/portalApi'
import { toDateKey } from '@/lib/booking'
import { FormError } from '@/components/forms/FormFeedback'
import { EmptyState, PanelHeading } from './PanelPrimitives'
import Sparkline from './Sparkline'

const MEASUREMENT_KEYS = ['waist', 'hips', 'chest', 'arms', 'thighs']

const emptyEntry = () => ({
  entryDate: toDateKey(new Date()),
  weight: '',
  bodyFat: '',
  notes: '',
  waist: '',
  hips: '',
  chest: '',
  arms: '',
  thighs: '',
})

/**
 * ProgressPanel — log and review progress entries. New entries (with optional
 * body measurements and a progress photo) are written by the `log-progress`
 * edge function (never a direct table write), then the list reloads.
 */
export default function ProgressPanel({ progress, reloadProgress }) {
  const { portal } = useContent()
  const copy = portal.progress
  const { user } = useAuth()
  const fileInputRef = useRef(null)

  const [open, setOpen] = useState(false)
  const [values, setValues] = useState(emptyEntry)
  const [file, setFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = key => event => setValues(prev => ({ ...prev, [key]: event.target.value }))

  const handleSave = async event => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const measurements = MEASUREMENT_KEYS.reduce((acc, key) => {
        const raw = values[key]
        if (raw !== '' && !Number.isNaN(Number(raw))) {
          acc[copy[`${key}Label`]] = Number(raw)
        }
        return acc
      }, {})

      let photoPath
      if (file) photoPath = await uploadProgressPhoto(user.id, file)

      await logProgress({
        entryDate: values.entryDate,
        weight: values.weight ? Number(values.weight) : null,
        bodyFat: values.bodyFat ? Number(values.bodyFat) : null,
        notes: values.notes || null,
        photoPath,
        measurements: Object.keys(measurements).length ? measurements : null,
      })
      setValues(emptyEntry())
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      setOpen(false)
      await reloadProgress()
    } catch (saveError) {
      setError(saveError?.message || 'Could not save your entry.')
    } finally {
      setSaving(false)
    }
  }

  const handleViewPhoto = async path => {
    const url = await getSignedUrl('progress-photos', path)
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  }

  const trend = progress
    .filter(entry => entry.weight != null)
    .map(entry => Number(entry.weight))
    .reverse()

  return (
    <section>
      <PanelHeading
        eyebrow={portal.nav.progress}
        title={copy.title}
        actions={
          <Button type="button" variant="outline" size="md" onClick={() => setOpen(o => !o)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            {copy.addEntry}
          </Button>
        }
      />

      {trend.length >= 2 && (
        <Card variant="surface" className="mb-6">
          <p className="text-[11px] font-700 uppercase tracking-[0.16em] text-df-text-muted">
            {copy.trendTitle}
          </p>
          <div className="mt-3">
            <Sparkline values={trend} />
          </div>
        </Card>
      )}

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

            <fieldset>
              <legend className="mb-3 text-[11px] font-700 uppercase tracking-[0.16em] text-df-text-muted">
                {copy.measurementsLabel}
              </legend>
              <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-5">
                {MEASUREMENT_KEYS.map(key => (
                  <Field key={key} label={copy[`${key}Label`]}>
                    <Input
                      type="number"
                      inputMode="decimal"
                      value={values[key]}
                      onChange={handleChange(key)}
                      placeholder="0"
                    />
                  </Field>
                ))}
              </div>
            </fieldset>

            <Field label={copy.notesLabel}>
              <Textarea
                value={values.notes}
                onChange={handleChange('notes')}
                placeholder={copy.notesPlaceholder}
                rows={3}
              />
            </Field>

            <Field label={copy.photoLabel}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={event => setFile(event.target.files?.[0] ?? null)}
                className="block w-full text-sm text-df-text-muted file:mr-4 file:rounded-df-sm file:border-0 file:bg-df-accent-soft file:px-4 file:py-2 file:text-[11px] file:font-700 file:uppercase file:tracking-[0.14em] file:text-df-accent-bright hover:file:bg-df-surface-3"
              />
              <p className="mt-1.5 text-xs text-df-text-faint">{copy.photoHelper}</p>
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
                <th className="px-4 py-3">{copy.photo}</th>
              </tr>
            </thead>
            <tbody>
              {progress.map(entry => (
                <tr
                  key={entry.id}
                  className="border-b border-df-border text-df-text-muted last:border-0"
                >
                  <td className="px-4 py-3 text-df-text">{entry.entry_date}</td>
                  <td className="px-4 py-3">{entry.weight ?? '—'}</td>
                  <td className="px-4 py-3">{entry.body_fat ?? '—'}</td>
                  <td className="px-4 py-3">{entry.notes ?? '—'}</td>
                  <td className="px-4 py-3">
                    {entry.photo_path ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewPhoto(entry.photo_path)}
                      >
                        <ImageIcon className="h-4 w-4" aria-hidden="true" />
                        {copy.viewPhoto}
                      </Button>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

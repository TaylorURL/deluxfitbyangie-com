import { useState } from 'react'
import { ImageIcon, Loader2, Plus, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  Button,
  DataTable,
  DateField,
  Field,
  FileDrop,
  MicroLabel,
  NumberField,
  Panel,
  Stat,
  Textarea,
} from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { useAuth } from '@/auth/useAuth'
import { getSignedUrl, logProgress, uploadProgressPhoto } from '@/lib/api/portalApi'
import { toDateKey } from '@/lib/api/booking'
import { FormError } from '@/components/forms/FormFeedback'
import { EmptyState, PanelHeading } from './PanelPrimitives'
import Sparkline from '@/components/ui/Sparkline'

const MotionDiv = motion.div

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
 * Logging is the one thing a client does in here every week, so it is the one
 * screen worth making fast. Every number is a stepper rather than a keypad —
 * a weight moves half a pound from last week and a measurement moves a
 * quarter inch, and both are a thumb tap rather than a keyboard that covers
 * the form. The date defaults to today and offers yesterday, which between
 * them are almost every entry ever made.
 */
export default function ProgressPanel({ progress, reloadProgress }) {
  const { portal } = useContent()
  const copy = portal.progress
  const { user } = useAuth()
  const prefersReducedMotion = useReducedMotion()

  const [open, setOpen] = useState(false)
  const [values, setValues] = useState(emptyEntry)
  const [file, setFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const set = key => value => setValues(prev => ({ ...prev, [key]: value }))

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

  const weights = progress.filter(entry => entry.weight != null).map(entry => Number(entry.weight))
  const trend = [...weights].reverse()
  const delta = weights.length >= 2 ? Number((weights[0] - weights[1]).toFixed(1)) : null

  // What was logged last time, so an empty field shows it as a ghost and the
  // first nudge lands beside it rather than at zero. A placeholder rather than
  // a value: a form that arrives pre-filled invites a save that records last
  // week's numbers again.
  const previous = progress[0]
  const lastLogged = key => {
    if (key === 'weight') return previous?.weight
    if (key === 'bodyFat') return previous?.body_fat
    return previous?.measurements?.[copy[`${key}Label`]]
  }

  const stepper = (key, { suffix, step, max }) => {
    const last = lastLogged(key)
    return (
      <NumberField
        value={values[key]}
        onValueChange={set(key)}
        step={step}
        min={0}
        max={max}
        suffix={suffix}
        startFrom={last}
        placeholder={last != null ? String(last) : undefined}
        decrementLabel={copy.decrease}
        incrementLabel={copy.increase}
        aria-label={copy[`${key}Label`]}
      />
    )
  }

  return (
    <section>
      <PanelHeading
        title={copy.title}
        count={progress.length || undefined}
        actions={
          <Button
            type="button"
            variant={open ? 'ghost' : 'primary'}
            size="md"
            onClick={() => setOpen(value => !value)}
          >
            {open ? (
              <>
                <X aria-hidden="true" className="h-4 w-4" />
                {copy.cancel}
              </>
            ) : (
              <>
                <Plus aria-hidden="true" className="h-4 w-4" />
                {copy.addEntry}
              </>
            )}
          </Button>
        }
      />

      <AnimatePresence initial={false}>
        {open && (
          <MotionDiv
            key="log-entry"
            initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6"
          >
            <Panel as="form" onSubmit={handleSave} className="flex flex-col gap-6">
              <div className="grid gap-5 sm:grid-cols-3">
                <Field label={copy.dateLabel}>
                  <DateField
                    value={values.entryDate}
                    onValueChange={set('entryDate')}
                    shortcuts={[
                      { label: copy.today, offset: 0 },
                      { label: copy.yesterday, offset: -1 },
                    ]}
                  />
                </Field>
                <Field label={copy.weightLabel} optional optionalLabel={portal.optional}>
                  {stepper('weight', { suffix: 'lb', step: 0.5, max: 999 })}
                </Field>
                <Field label={copy.bodyFatLabel} optional optionalLabel={portal.optional}>
                  {stepper('bodyFat', { suffix: '%', step: 0.5, max: 100 })}
                </Field>
              </div>

              <fieldset className="min-w-0">
                <MicroLabel as="legend" className="mb-3">
                  {copy.measurementsLabel}
                </MicroLabel>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {MEASUREMENT_KEYS.map(key => (
                    <Field key={key} label={copy[`${key}Label`]}>
                      {stepper(key, { suffix: 'in', step: 0.25, max: 200 })}
                    </Field>
                  ))}
                </div>
              </fieldset>

              <Field label={copy.notesLabel} optional optionalLabel={portal.optional}>
                <Textarea
                  autoGrow
                  rows={3}
                  value={values.notes}
                  onChange={event => set('notes')(event.target.value)}
                  placeholder={copy.notesPlaceholder}
                />
              </Field>

              <Field label={copy.photoLabel} helper={copy.photoHelper}>
                <FileDrop
                  file={file}
                  onFileChange={setFile}
                  label={copy.photoDrop}
                  clearLabel={copy.removePhoto}
                />
              </Field>

              <div className="flex flex-wrap items-center gap-3">
                <Button type="submit" size="md" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                      {copy.saving}
                    </>
                  ) : (
                    copy.saveEntry
                  )}
                </Button>
                <Button type="button" variant="ghost" size="md" onClick={() => setOpen(false)}>
                  {copy.cancel}
                </Button>
              </div>
              <FormError className="mt-4" body={error} />
            </Panel>
          </MotionDiv>
        )}
      </AnimatePresence>

      {trend.length >= 2 && (
        <Panel elevation="flat" className="mb-6">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <Stat
              label={copy.trendTitle}
              value={weights[0]}
              unit="lb"
              delta={delta}
              deltaLabel={copy.sinceLast}
              goodDirection="down"
            />
            <p className="text-[13px] tabular-nums text-df-text-faint">
              {progress.length} {copy.entriesLogged}
            </p>
          </div>
          <div className="mt-5">
            <Sparkline values={trend} height={72} />
          </div>
        </Panel>
      )}

      <DataTable
        caption={copy.tableCaption}
        rows={progress}
        getRowKey={entry => entry.id}
        empty={<EmptyState body={copy.empty} />}
        columns={[
          { key: 'entry_date', header: copy.colDate, primary: true },
          {
            key: 'weight',
            header: copy.colWeight,
            numeric: true,
            render: entry => entry.weight ?? '—',
          },
          {
            key: 'body_fat',
            header: copy.colBodyFat,
            numeric: true,
            render: entry => entry.body_fat ?? '—',
          },
          { key: 'notes', header: copy.colNotes, render: entry => entry.notes ?? '—' },
          {
            key: 'photo',
            header: copy.photo,
            align: 'right',
            render: entry =>
              entry.photo_path ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewPhoto(entry.photo_path)}
                >
                  <ImageIcon aria-hidden="true" className="h-4 w-4" />
                  {copy.viewPhoto}
                </Button>
              ) : (
                '—'
              ),
          },
        ]}
      />
    </section>
  )
}

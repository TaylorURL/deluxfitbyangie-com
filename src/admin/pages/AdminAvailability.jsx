import { useEffect, useMemo, useState } from 'react'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { Button, Card, Field, Input, cn } from '@deluxfit/ds'
import {
  getStandingAvailability,
  listAvailabilityOverrides,
  removeAvailabilityOverride,
  saveAvailabilityOverride,
  saveStandingAvailability,
} from '@/lib/adminApi'
import { FormError, FormSuccess } from '@/components/forms/FormFeedback'
import {
  SectionCard,
  SectionHeading,
  AdminEmpty,
  AdminLoading,
  useAsyncData,
} from '../components/AdminPrimitives'

const WEEKDAYS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
]

/** The hours offered in the grid. Sessions run 45-60 minutes, so one per hour. */
const HOURS = Array.from({ length: 17 }, (_, index) => index + 5) // 5am - 9pm

const hourLabel = hour => {
  const suffix = hour < 12 ? 'am' : 'pm'
  const twelve = hour % 12 === 0 ? 12 : hour % 12
  return `${twelve}${suffix}`
}

const todayKey = () => new Date().toISOString().slice(0, 10)

/** Read a YYYY-MM-DD as a local date, so the label never lands a day early. */
const readableDate = key => {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

const loadAvailability = () => Promise.all([getStandingAvailability(), listAvailabilityOverrides()])

/**
 * Availability — the hours a client can book, owned by the coach.
 *
 * Two things on one page because they answer two different questions. The grid
 * is what a normal week looks like and rarely changes. The exceptions are what
 * one date does instead, and they are the part that moves week to week: a
 * closed day, or a day worked at different hours. An exception replaces that
 * date's hours rather than adding to them, so what is ticked here is exactly
 * what the booking calendar offers.
 */
export default function AdminAvailability() {
  const { data, loading, error, reload } = useAsyncData(loadAvailability, [], [null, []])
  const [loadedStanding, overrides] = data ?? [null, []]

  const [grid, setGrid] = useState(null)
  const [savingGrid, setSavingGrid] = useState(false)
  const [gridSaved, setGridSaved] = useState(false)
  const [writeError, setWriteError] = useState(null)

  const [draft, setDraft] = useState({ date: '', closed: true, hours: [], note: '' })
  const [savingDraft, setSavingDraft] = useState(false)
  const [busyDate, setBusyDate] = useState(null)

  // The grid is edited locally and saved as a whole, so it seeds from the load
  // and then belongs to the form until the next reload.
  useEffect(() => {
    if (loadedStanding) setGrid(loadedStanding)
  }, [loadedStanding])

  const totalHours = useMemo(
    () => (grid ? Object.values(grid).reduce((sum, hours) => sum + hours.length, 0) : 0),
    [grid]
  )

  const toggleHour = (weekday, hour) => {
    setGridSaved(false)
    setGrid(prev => {
      const current = prev[weekday] ?? []
      const next = current.includes(hour)
        ? current.filter(entry => entry !== hour)
        : [...current, hour].sort((a, b) => a - b)
      return { ...prev, [weekday]: next }
    })
  }

  const toggleDraftHour = hour => {
    setDraft(prev => ({
      ...prev,
      hours: prev.hours.includes(hour)
        ? prev.hours.filter(entry => entry !== hour)
        : [...prev.hours, hour].sort((a, b) => a - b),
    }))
  }

  const handleSaveGrid = async () => {
    setSavingGrid(true)
    setWriteError(null)
    setGridSaved(false)
    try {
      await saveStandingAvailability(grid)
      setGridSaved(true)
      await reload()
    } catch (err) {
      setWriteError(err?.message || 'Could not save your weekly hours.')
    } finally {
      setSavingGrid(false)
    }
  }

  const handleAddOverride = async event => {
    event.preventDefault()
    if (!draft.date) {
      setWriteError('Pick a date first.')
      return
    }
    if (!draft.closed && draft.hours.length === 0) {
      setWriteError('Tick at least one hour, or mark the day closed.')
      return
    }
    setSavingDraft(true)
    setWriteError(null)
    try {
      await saveAvailabilityOverride({
        date: draft.date,
        closed: draft.closed,
        hours: draft.closed ? [] : draft.hours,
        note: draft.note,
      })
      setDraft({ date: '', closed: true, hours: [], note: '' })
      await reload()
    } catch (err) {
      setWriteError(err?.message || 'Could not save that date.')
    } finally {
      setSavingDraft(false)
    }
  }

  const handleRemoveOverride = async date => {
    setBusyDate(date)
    setWriteError(null)
    try {
      await removeAvailabilityOverride(date)
      await reload()
    } catch (err) {
      setWriteError(err?.message || 'Could not remove that date.')
    } finally {
      setBusyDate(null)
    }
  }

  if (loading || !grid) return <AdminLoading label="Loading your availability…" />
  if (error) return <FormError body={error} />

  return (
    <div className="flex flex-col gap-8">
      <SectionCard>
        <SectionHeading
          eyebrow="Availability"
          title="Your Weekly Hours"
          intro="Tick the times you are open to take a live session. This is your normal week — clients only ever see the hours ticked here, minus anything already booked."
        />

        <div className="mt-6 flex flex-col gap-3">
          {WEEKDAYS.map(day => (
            <div
              key={day.value}
              className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4"
            >
              <span className="w-24 shrink-0 pt-2 text-sm font-600 text-df-text">{day.label}</span>
              <div className="flex flex-wrap gap-2">
                {HOURS.map(hour => {
                  const on = (grid[day.value] ?? []).includes(hour)
                  return (
                    <button
                      key={hour}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleHour(day.value, hour)}
                      className={cn(
                        'min-h-[2.25rem] rounded-df-md border px-2.5 py-1 text-xs font-600 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright',
                        on
                          ? 'border-df-accent bg-df-accent text-df-on-accent'
                          : 'border-df-border-input text-df-text-faint hover:border-df-border-hover hover:text-df-text'
                      )}
                    >
                      {hourLabel(hour)}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button type="button" onClick={handleSaveGrid} disabled={savingGrid}>
            {savingGrid && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
            Save Weekly Hours
          </Button>
          <span className="text-sm text-df-text-faint">
            {totalHours} {totalHours === 1 ? 'slot' : 'slots'} open each week
          </span>
        </div>
        {gridSaved && (
          <FormSuccess heading="Saved" body="Your weekly hours are live on the booking calendar." />
        )}
      </SectionCard>

      <SectionCard>
        <SectionHeading
          eyebrow="Availability"
          title="Specific Dates"
          intro="For a week that does not look like the others. Close a date you are away, or give it different hours. A date listed here replaces your weekly hours for that day."
        />

        <form onSubmit={handleAddOverride} className="mt-6 flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date">
              <Input
                type="date"
                min={todayKey()}
                value={draft.date}
                onChange={event => setDraft(prev => ({ ...prev, date: event.target.value }))}
              />
            </Field>
            <Field label="Note (optional)">
              <Input
                type="text"
                value={draft.note}
                placeholder="Travelling, family, holiday…"
                onChange={event => setDraft(prev => ({ ...prev, note: event.target.value }))}
              />
            </Field>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={draft.closed}
              onClick={() => setDraft(prev => ({ ...prev, closed: true, hours: [] }))}
              className={cn(
                'min-h-[2.5rem] rounded-df-md border px-4 py-2 text-sm font-600 transition-colors duration-150',
                draft.closed
                  ? 'border-df-accent bg-df-accent text-df-on-accent'
                  : 'border-df-border-input text-df-text-muted hover:border-df-border-hover'
              )}
            >
              Closed All Day
            </button>
            <button
              type="button"
              aria-pressed={!draft.closed}
              onClick={() => setDraft(prev => ({ ...prev, closed: false }))}
              className={cn(
                'min-h-[2.5rem] rounded-df-md border px-4 py-2 text-sm font-600 transition-colors duration-150',
                !draft.closed
                  ? 'border-df-accent bg-df-accent text-df-on-accent'
                  : 'border-df-border-input text-df-text-muted hover:border-df-border-hover'
              )}
            >
              Different Hours
            </button>
          </div>

          {!draft.closed && (
            <div className="flex flex-wrap gap-2">
              {HOURS.map(hour => {
                const on = draft.hours.includes(hour)
                return (
                  <button
                    key={hour}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleDraftHour(hour)}
                    className={cn(
                      'min-h-[2.25rem] rounded-df-md border px-2.5 py-1 text-xs font-600 transition-colors duration-150',
                      on
                        ? 'border-df-accent bg-df-accent text-df-on-accent'
                        : 'border-df-border-input text-df-text-faint hover:border-df-border-hover hover:text-df-text'
                    )}
                  >
                    {hourLabel(hour)}
                  </button>
                )
              })}
            </div>
          )}

          <div>
            <Button type="submit" variant="secondary" disabled={savingDraft}>
              {savingDraft ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              )}
              Save This Date
            </Button>
          </div>
        </form>

        <div className="mt-6">
          {overrides.length === 0 ? (
            <AdminEmpty
              title="No exceptions"
              body="Every upcoming date follows your weekly hours."
            />
          ) : (
            <ul className="flex flex-col gap-2">
              {overrides.map(override => (
                <li key={override.override_date}>
                  <Card
                    variant="surface"
                    className="flex flex-wrap items-center justify-between gap-3 p-4"
                  >
                    <div>
                      <p className="text-sm font-600 text-df-text">
                        {readableDate(override.override_date)}
                      </p>
                      <p className="text-sm text-df-text-muted">
                        {override.closed
                          ? 'Closed all day'
                          : (override.hours ?? []).map(hourLabel).join(', ')}
                        {override.note ? ` · ${override.note}` : ''}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleRemoveOverride(override.override_date)}
                      disabled={busyDate === override.override_date}
                    >
                      {busyDate === override.override_date ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      )}
                      <span className="ml-2">Remove</span>
                    </Button>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </div>
      </SectionCard>

      {writeError && <FormError body={writeError} />}
    </div>
  )
}

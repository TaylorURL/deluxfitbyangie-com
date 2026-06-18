import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, CalendarDays, Clock, Loader2 } from 'lucide-react'
import { Button, Field, Input, Select, cn } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { useAuth } from '@/auth/useAuth'
import {
  createBooking,
  fetchTakenSlots,
  getBookableDates,
  getCandidateSlots,
  toDateKey,
} from '@/lib/booking'
import { FormError, FormSuccess } from './forms/FormFeedback'

const WEEKDAY = { weekday: 'short' }
const MONTH_DAY = { month: 'short', day: 'numeric' }

/**
 * BookingCalendar — the live booking surface for the Single Session ($75) and
 * the Live Online Personal Training Program ($50). The client picks a date, a
 * time, a training focus, and a fitness goal; the booking is written by the
 * `create-booking` edge function and the database enforces single-occupancy, so
 * a double-book attempt fails closed.
 *
 * @param {object} props
 * @param {'single_session'|'live_program'} props.service
 */
export default function BookingCalendar({ service }) {
  const { booking } = useContent()
  const { user } = useAuth()

  const dates = useMemo(() => getBookableDates(), [])
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [takenSlots, setTakenSlots] = useState(() => new Set())
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [values, setValues] = useState({ focus: '', goal: '', name: '', email: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error | unconfigured
  const [errorBody, setErrorBody] = useState(null)

  // Load taken slots whenever the selected date changes.
  useEffect(() => {
    if (!selectedDate) return
    let active = true
    const dayStart = new Date(selectedDate)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(selectedDate)
    dayEnd.setHours(23, 59, 59, 999)
    setLoadingSlots(true)
    fetchTakenSlots(dayStart, dayEnd).then(taken => {
      if (!active) return
      setTakenSlots(taken)
      setLoadingSlots(false)
    })
    return () => {
      active = false
    }
  }, [selectedDate])

  const candidateSlots = useMemo(
    () => (selectedDate ? getCandidateSlots(selectedDate) : []),
    [selectedDate]
  )

  const handleField = key => event => {
    setValues(prev => ({ ...prev, [key]: event.target.value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const isGuest = !user

  const validate = () => {
    const next = {}
    if (!selectedSlot) next.slot = booking.pickDateFirst
    if (!values.focus) next.focus = 'Required'
    if (!values.goal) next.goal = 'Required'
    if (isGuest) {
      if (!values.name.trim()) next.name = 'Required'
      if (!values.email.trim()) next.email = 'Required'
      else if (!values.email.includes('@')) next.email = 'Enter a valid email'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async event => {
    event.preventDefault()
    if (!validate()) return
    setStatus('submitting')
    setErrorBody(null)
    try {
      const result = await createBooking({
        service,
        slotStart: selectedSlot,
        trainingFocus: values.focus,
        fitnessGoal: values.goal,
        guestName: isGuest ? values.name : undefined,
        guestEmail: isGuest ? values.email : undefined,
      })
      if (result.status === 'booked') {
        setStatus('success')
      } else if (result.status === 'slot_taken') {
        setStatus('error')
        setErrorBody(booking.slotTakenError)
        setTakenSlots(prev => new Set(prev).add(selectedSlot.toISOString()))
        setSelectedSlot(null)
      } else {
        // Edge function not deployed yet — degrade honestly, don't fake a booking.
        setStatus('unconfigured')
      }
    } catch (error) {
      setStatus('error')
      setErrorBody(error?.message ? `${booking.errorBody}` : booking.errorBody)
    }
  }

  if (status === 'success') {
    return <FormSuccess heading={booking.successHeading} body={booking.successBody} />
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="rounded-df-2xl border border-df-border bg-df-surface p-5 shadow-df-lg sm:px-8 sm:py-9"
    >
      {/* DATE */}
      <fieldset>
        <legend className="flex items-center gap-2 text-xs font-600 uppercase tracking-wider text-df-text-muted">
          <CalendarDays className="h-4 w-4 text-df-accent-bright" aria-hidden="true" />
          {booking.selectDateLabel}
        </legend>
        <div className="-mx-5 mt-3 flex gap-2.5 overflow-x-auto px-5 pb-2 [-webkit-overflow-scrolling:touch] sm:mx-0 sm:px-0">
          {dates.map(date => {
            const key = toDateKey(date)
            const active = selectedDate && toDateKey(selectedDate) === key
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setSelectedDate(date)
                  setSelectedSlot(null)
                  if (errors.slot) setErrors(prev => ({ ...prev, slot: undefined }))
                }}
                className={cn(
                  'flex min-h-[3.25rem] min-w-[3.75rem] shrink-0 flex-col items-center justify-center rounded-df-md border px-3.5 py-2.5 transition-colors duration-150 ease-df-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-df-surface',
                  active
                    ? 'border-df-accent bg-df-accent text-df-on-accent'
                    : 'border-df-border-input text-df-text-muted hover:border-df-border-hover hover:text-df-text'
                )}
              >
                <span className="text-[10px] font-700 uppercase tracking-[0.16em]">
                  {date.toLocaleDateString([], WEEKDAY)}
                </span>
                <span className="mt-0.5 text-sm font-600">
                  {date.toLocaleDateString([], MONTH_DAY)}
                </span>
              </button>
            )
          })}
        </div>
      </fieldset>

      {/* TIME */}
      <fieldset className="mt-6">
        <legend className="flex items-center gap-2 text-xs font-600 uppercase tracking-wider text-df-text-muted">
          <Clock className="h-4 w-4 text-df-accent-bright" aria-hidden="true" />
          {booking.selectTimeLabel}
        </legend>
        <div className="mt-3 min-h-[3rem]">
          {!selectedDate ? (
            <p className="text-sm text-df-text-faint">{booking.pickDateFirst}</p>
          ) : loadingSlots ? (
            <p className="flex items-center gap-2 text-sm text-df-text-faint">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {booking.loadingSlots}
            </p>
          ) : candidateSlots.length === 0 ? (
            <p className="text-sm text-df-text-faint">{booking.noSlots}</p>
          ) : (
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
              {candidateSlots.map(slot => {
                const iso = slot.start.toISOString()
                const taken = takenSlots.has(iso)
                const active = selectedSlot && selectedSlot.toISOString() === iso
                return (
                  <button
                    key={iso}
                    type="button"
                    disabled={taken}
                    aria-pressed={active}
                    onClick={() => {
                      setSelectedSlot(slot.start)
                      if (errors.slot) setErrors(prev => ({ ...prev, slot: undefined }))
                    }}
                    className={cn(
                      'rounded-df-sm border px-2 py-2.5 text-sm font-600 transition-colors duration-150 ease-df-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-df-surface',
                      taken && 'cursor-not-allowed border-df-border bg-df-surface-2 text-df-text-faint line-through',
                      !taken && active && 'border-df-accent bg-df-accent text-df-on-accent',
                      !taken && !active && 'border-df-border-input text-df-text hover:border-df-border-hover'
                    )}
                  >
                    {taken ? booking.slotTaken : slot.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>
        {errors.slot && <p className="mt-2 text-xs text-df-danger">{errors.slot}</p>}
      </fieldset>

      {/* FOCUS + GOAL */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label={booking.trainingFocusLabel} error={errors.focus}>
          <Select
            value={values.focus}
            onChange={handleField('focus')}
            placeholder={booking.trainingFocusPlaceholder}
            options={booking.trainingFocusOptions}
          />
        </Field>
        <Field label={booking.fitnessGoalLabel} error={errors.goal}>
          <Select
            value={values.goal}
            onChange={handleField('goal')}
            placeholder={booking.fitnessGoalPlaceholder}
            options={booking.fitnessGoalOptions}
          />
        </Field>
      </div>

      {/* GUEST DETAILS */}
      {isGuest && (
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field label={booking.nameLabel} error={errors.name}>
            <Input
              value={values.name}
              onChange={handleField('name')}
              placeholder={booking.namePlaceholder}
              autoComplete="name"
            />
          </Field>
          <Field label={booking.emailLabel} error={errors.email}>
            <Input
              type="email"
              value={values.email}
              onChange={handleField('email')}
              placeholder={booking.emailPlaceholder}
              autoComplete="email"
            />
          </Field>
        </div>
      )}

      <Button type="submit" size="lg" disabled={status === 'submitting'} className="mt-7">
        {status === 'submitting' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            {booking.submittingLabel}
          </>
        ) : (
          <>
            {booking.submitLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </Button>

      {status === 'unconfigured' && (
        <div
          role="status"
          className="mt-4 rounded-df-sm border border-df-warning/50 bg-df-warning-soft px-3 py-2.5 text-sm text-df-warning"
        >
          {booking.notConfiguredNotice}
        </div>
      )}
      {status === 'error' && <FormError body={errorBody ?? booking.errorBody} />}
    </form>
  )
}

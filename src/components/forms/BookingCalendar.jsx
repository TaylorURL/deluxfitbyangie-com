import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, CalendarDays, Clock, Loader2, Mail, User } from 'lucide-react'
import { Button, Field, FieldMessage, Input, MicroLabel, Panel, Select, cn } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { useAuth } from '@/auth/useAuth'
import {
  createBooking,
  fetchSchedule,
  fetchTakenSlots,
  getBookableDates,
  getCandidateSlots,
  toDateKey,
} from '@/lib/api/booking'
import { FormError, FormSuccess } from './FormFeedback'
import { dayAfter, dayKey, instantAt, ZONE } from '@/lib/timezone'

const WEEKDAY = { timeZone: ZONE, weekday: 'short' }
const MONTH_DAY = { timeZone: ZONE, month: 'short', day: 'numeric' }

/**
 * @param {object} props
 * @param {'single_session'|'live_program'} props.service
 */
export default function BookingCalendar({ service }) {
  const { booking, forms } = useContent()
  const { user } = useAuth()

  // Angie's published availability, which she edits in the coach panel. Held
  // in state rather than read per render because every open date and every
  // slot chip on the page is derived from this one answer.
  const [schedule, setSchedule] = useState(null)
  const dates = useMemo(() => (schedule ? getBookableDates(schedule) : []), [schedule])
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [takenSlots, setTakenSlots] = useState(() => new Set())
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [values, setValues] = useState({ focus: '', goal: '', name: '', email: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error | unconfigured
  const [errorBody, setErrorBody] = useState(null)

  useEffect(() => {
    let active = true
    fetchSchedule().then(next => {
      if (active) setSchedule(next)
    })
    return () => {
      active = false
    }
  }, [])

  // A date she has since closed should not stay selected underneath the form.
  useEffect(() => {
    if (!selectedDate || !schedule) return
    const stillOpen = dates.some(date => toDateKey(date) === toDateKey(selectedDate))
    if (!stillOpen) {
      setSelectedDate(null)
      setSelectedSlot(null)
    }
  }, [dates, schedule, selectedDate])

  useEffect(() => {
    if (!selectedDate) return
    let active = true
    // The studio's day rather than the visitor's, so the slots greyed out are
    // the slots taken on the day the chip names.
    const key = dayKey(selectedDate)
    const dayStart = instantAt(key, 0)
    const dayEnd = new Date(instantAt(dayAfter(key), 0).getTime() - 1)
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
    () => (selectedDate && schedule ? getCandidateSlots(selectedDate, schedule) : []),
    [selectedDate, schedule]
  )

  const handleField = key => event => {
    setValues(prev => ({ ...prev, [key]: event.target.value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const isGuest = !user

  const validate = () => {
    const next = {}
    if (!selectedSlot) next.slot = booking.pickDateFirst
    if (!values.focus) next.focus = forms.pickOne
    if (!values.goal) next.goal = forms.pickOne
    if (isGuest) {
      if (!values.name.trim()) next.name = forms.required
      if (!values.email.trim()) next.email = forms.required
      else if (!values.email.includes('@')) next.email = forms.invalidEmail
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
        // The create-booking function answered 404, so there is nothing behind
        // the form. Say so rather than showing a booking that never happened.
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
    <Panel as="form" noValidate onSubmit={handleSubmit}>
      {/* min-w-0: a fieldset's default min-inline-size is min-content, so the
          scrolling date strip inside it widens the whole form to the width of
          every date rather than scrolling within the page. */}
      <fieldset className="min-w-0">
        <MicroLabel as="legend" className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-df-accent-bright" aria-hidden="true" />
          {booking.selectDateLabel}
        </MicroLabel>
        <div className="-mx-1 mt-3 flex min-h-[3.25rem] snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:gap-3 sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
          {!schedule ? (
            <p className="flex items-center gap-2 text-sm text-df-text-faint">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {booking.loadingSlots}
            </p>
          ) : dates.length === 0 ? (
            <p className="text-sm text-df-text-faint">{booking.noSlots}</p>
          ) : (
            dates.map(date => {
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
                    'flex h-[3.25rem] min-w-[4.25rem] shrink-0 snap-start flex-col items-center justify-center rounded-df-md px-3 transition-[background-color,color,box-shadow] duration-df-fast ease-df-out',
                    active
                      ? 'bg-df-accent text-df-on-accent shadow-df-key'
                      : 'bg-df-field text-df-text-muted shadow-df-sm hover:text-df-text hover:shadow-df-md'
                  )}
                >
                  <span className="text-[10px] font-700 uppercase tracking-[0.16em]">
                    {date.toLocaleDateString('en-US', WEEKDAY)}
                  </span>
                  <span className="mt-1 text-sm font-600">
                    {date.toLocaleDateString('en-US', MONTH_DAY)}
                  </span>
                </button>
              )
            })
          )}
        </div>
      </fieldset>

      <fieldset className="mt-6 min-w-0">
        <MicroLabel as="legend" className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-df-accent-bright" aria-hidden="true" />
          {booking.selectTimeLabel}
        </MicroLabel>
        {/* The control and its refusal share one stack, so the message's space
            belongs to the stack rather than to the message. */}
        <div className="mt-3 flex flex-col gap-2">
          <div className="min-h-[3rem]">
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
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3">
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
                        'flex h-11 items-center justify-center rounded-df-sm px-2 text-sm font-600 tabular-nums transition-[background-color,color,box-shadow] duration-df-fast ease-df-out',
                        taken &&
                          'cursor-not-allowed bg-df-surface-2 text-df-text-faint line-through',
                        !taken && active && 'bg-df-accent text-df-on-accent shadow-df-key',
                        !taken &&
                          !active &&
                          'bg-df-field text-df-text shadow-df-sm hover:shadow-df-md'
                      )}
                    >
                      {taken ? booking.slotTaken : slot.label}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
          {errors.slot && <FieldMessage error text={errors.slot} />}
        </div>
      </fieldset>

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

      {isGuest && (
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field label={booking.nameLabel} error={errors.name}>
            <Input
              icon={User}
              value={values.name}
              onChange={handleField('name')}
              placeholder={booking.namePlaceholder}
              autoComplete="name"
            />
          </Field>
          <Field label={booking.emailLabel} error={errors.email}>
            <Input
              icon={Mail}
              type="email"
              value={values.email}
              onChange={handleField('email')}
              placeholder={booking.emailPlaceholder}
              autoComplete="email"
            />
          </Field>
        </div>
      )}

      {/* Submit and whatever came back from it are one stack. Both answers are
          conditional, and a margin on either would hold its space open on the
          submissions that never produce one. */}
      <div className="mt-7 flex flex-col gap-4">
        <Button
          type="submit"
          size="lg"
          disabled={status === 'submitting'}
          className="w-full sm:w-auto sm:self-start"
        >
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
            className="border-df-warning/50 rounded-df-sm border bg-df-warning-soft px-3 py-3 text-sm text-df-warning"
          >
            {booking.notConfiguredNotice}
          </div>
        )}
        {status === 'error' && <FormError body={errorBody ?? booking.errorBody} />}
      </div>
    </Panel>
  )
}

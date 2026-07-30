import { supabase } from '@/config/supabase'

/**
 * Candidate slots are generated client-side from Angie's standing business
 * hours (cheap, no round-trip). Already-booked slots are read from the
 * `booking_slots_taken` view (start times only, no PII) so taken times can be
 * greyed out. The actual booking is written by the `create-booking` edge
 * function, and the database enforces single-occupancy via a partial unique
 * index — so a race that slips past the greyed-out UI still fails closed (409).
 */

/** Standing weekly availability: weekday (0=Sun) → list of 24h start hours. */
const BUSINESS_HOURS = {
  0: [], // Sunday — closed
  1: [6, 7, 8, 9, 16, 17, 18, 19],
  2: [6, 7, 8, 9, 16, 17, 18, 19],
  3: [6, 7, 8, 9, 16, 17, 18, 19],
  4: [6, 7, 8, 9, 16, 17, 18, 19],
  5: [6, 7, 8, 9, 16, 17],
  6: [8, 9, 10, 11], // Saturday — morning only
}

/** Number of days ahead (from today) that are open for booking. */
const BOOKING_WINDOW_DAYS = 28

/** Format a Date as a local `YYYY-MM-DD` key (no timezone drift). */
export function toDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** The bookable dates: today through the booking window, excluding closed days. */
export function getBookableDates() {
  const dates = []
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  for (let offset = 0; offset <= BOOKING_WINDOW_DAYS; offset += 1) {
    const date = new Date(start)
    date.setDate(start.getDate() + offset)
    if ((BUSINESS_HOURS[date.getDay()] ?? []).length > 0) dates.push(date)
  }
  return dates
}

/**
 * The candidate slots for a given date as `{ start: Date, label: string }`.
 * Past times (for today) are excluded.
 */
export function getCandidateSlots(date) {
  const hours = BUSINESS_HOURS[date.getDay()] ?? []
  const now = new Date()
  return hours
    .map(hour => {
      const start = new Date(date)
      start.setHours(hour, 0, 0, 0)
      return start
    })
    .filter(start => start.getTime() > now.getTime())
    .map(start => ({
      start,
      label: start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    }))
}

/**
 * Fetch the set of taken slot-start ISO strings within a date range, so the UI
 * can disable them. Returns an empty set when the view is unreachable — the
 * partial unique index still enforces no double-booking on submit.
 *
 * @returns {Promise<Set<string>>} set of ISO timestamps already booked
 */
export async function fetchTakenSlots(fromDate, toDate) {
  try {
    const { data, error } = await supabase
      .from('booking_slots_taken')
      .select('slot_start')
      .gte('slot_start', fromDate.toISOString())
      .lte('slot_start', toDate.toISOString())
    if (error) throw error
    return new Set((data ?? []).map(row => new Date(row.slot_start).toISOString()))
  } catch {
    return new Set()
  }
}

/**
 * @param {{ service: 'single_session'|'live_program', slotStart: Date,
 *   trainingFocus: string, fitnessGoal: string, guestName?: string,
 *   guestEmail?: string }} input
 * @returns {Promise<{ status: 'booked', booking: object }
 *   | { status: 'slot_taken' } | { status: 'unconfigured' }>}
 * @throws {Error} on unexpected transport/server failures
 */
export async function createBooking(input) {
  const { data, error } = await supabase.functions.invoke('create-booking', {
    body: {
      service: input.service,
      slotStart: input.slotStart.toISOString(),
      trainingFocus: input.trainingFocus,
      fitnessGoal: input.fitnessGoal,
      guestName: input.guestName,
      guestEmail: input.guestEmail,
    },
  })

  // supabase-js surfaces non-2xx as an error; inspect for the 409 conflict.
  if (error) {
    const context = error.context
    if (context?.status === 409) return { status: 'slot_taken' }
    // A 404 means the function is not there at all; report that instead of
    // failing hard, so the caller can say so rather than showing an error.
    if (context?.status === 404) return { status: 'unconfigured' }
    throw new Error(error.message || 'Booking failed.')
  }
  if (data?.ok === false && data?.code === 'slot_taken') return { status: 'slot_taken' }
  if (data?.ok) return { status: 'booked', booking: data.booking }
  throw new Error(data?.error || 'Booking failed.')
}

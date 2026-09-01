/**
 * DATE/TIME FORMATTING — formatters shared by the admin panel and the member
 * portal. Both guard null/empty input with an em dash so callers can pass raw
 * row values straight through. Pass an `options` object to vary the parts shown
 * (e.g. add a weekday).
 *
 * A stored timestamp is an instant, and the hour a person reads off it belongs
 * to the studio. Angie and a member in another zone otherwise read two
 * different times off one booking.
 */
import { ZONE } from '@/lib/timezone'

const DATE_OPTIONS = { timeZone: ZONE, year: 'numeric', month: 'short', day: 'numeric' }
const DATE_TIME_OPTIONS = {
  timeZone: ZONE,
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
}
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/

/**
 * A date like "Jan 5, 2026". Returns "—" for null/empty input.
 *
 * A bare `YYYY-MM-DD` is a square on a calendar rather than a moment, so it is
 * read and written out of UTC and lands on the square it came from. Moved into
 * a zone instead, it renders as the day before.
 */
export function formatDate(value, options = DATE_OPTIONS) {
  if (!value) return '—'
  if (DATE_ONLY.test(String(value))) {
    return new Date(`${value}T00:00:00Z`).toLocaleDateString('en-US', {
      ...options,
      timeZone: 'UTC',
    })
  }
  return new Date(value).toLocaleDateString('en-US', options)
}

/** A date + time like "Jan 5, 3:30 PM". Returns "—" for null/empty input. */
export function formatDateTime(value, options = DATE_TIME_OPTIONS) {
  return value ? new Date(value).toLocaleString('en-US', options) : '—'
}

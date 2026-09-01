/**
 * The studio's clock.
 *
 * A booking is a promise about an hour, and the hour belongs to the room the
 * session happens in. A slot built from the browser's own clock is 6 AM
 * wherever the client is sitting, so a member booking from Los Angeles asks
 * for six and is written down for eight, and the panel then reads that back in
 * Angie's zone and shows a third answer. One named zone settles all three.
 *
 * Named rather than offset: the offset moves twice a year, and a fixed -06:00
 * is wrong for two thirds of the calendar.
 */
export const ZONE = 'America/Chicago'

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/

/** The calendar date an instant falls on here, as `YYYY-MM-DD`. */
export function dayKey(value = new Date()) {
  const at = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(at.getTime())) return ''
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(at)
}

/** The day of the week a date falls on here, as `Intl` numbers it from Sunday. */
export function weekdayOf(value) {
  const at = value instanceof Date ? value : new Date(value)
  const name = new Intl.DateTimeFormat('en-US', { timeZone: ZONE, weekday: 'short' }).format(at)
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(name)
}

function offsetAt(instant) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(instant)
  const read = type => Number(parts.find(part => part.type === type)?.value ?? 0)
  const reading = Date.UTC(
    read('year'),
    read('month') - 1,
    read('day'),
    read('hour') % 24,
    read('minute'),
    read('second')
  )
  return reading - instant.getTime()
}

/**
 * The instant an hour on a given day happens at here.
 *
 * Read twice. The offset has to be read at an instant, and the only instant
 * available to read it at is the answer being solved for, so the first pass is
 * a guess and the second lands on the right side of a daylight saving boundary
 * the guess may have fallen the wrong side of.
 *
 * @param {string} date A `YYYY-MM-DD` day here.
 * @param {number} [hour] The hour on that day, 0 to 23.
 * @returns {Date | null}
 */
export function instantAt(date, hour = 0) {
  if (!DATE_ONLY.test(String(date ?? ''))) return null
  const wall = new Date(`${date}T${String(hour).padStart(2, '0')}:00:00Z`).getTime()
  if (Number.isNaN(wall)) return null
  const first = new Date(wall - offsetAt(new Date(wall)))
  return new Date(wall - offsetAt(first))
}

/** The day after a `YYYY-MM-DD`, still as a calendar date here. */
export function dayAfter(date) {
  const noon = instantAt(date, 12)
  return noon ? dayKey(new Date(noon.getTime() + 24 * 60 * 60 * 1000)) : ''
}

/**
 * The year here.
 *
 * The line a copyright notice sits on names a business in Texas, and east of
 * Texas the reader's year turns over hours before that business's does.
 */
export function studioYear() {
  return Number(dayKey().slice(0, 4))
}

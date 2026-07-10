/**
 * DATE/TIME FORMATTING — locale-aware formatters shared by the admin panel and
 * the member portal. Both guard null/empty input with an em dash so callers can
 * pass raw row values straight through. Pass an `options` object to vary the
 * parts shown (e.g. add a weekday).
 */

const DATE_OPTIONS = { year: 'numeric', month: 'short', day: 'numeric' }
const DATE_TIME_OPTIONS = { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }

/** A date like "Jan 5, 2026". Returns "—" for null/empty input. */
export function formatDate(value, options = DATE_OPTIONS) {
  return value ? new Date(value).toLocaleDateString([], options) : '—'
}

/** A date + time like "Jan 5, 3:30 PM". Returns "—" for null/empty input. */
export function formatDateTime(value, options = DATE_TIME_OPTIONS) {
  return value ? new Date(value).toLocaleString([], options) : '—'
}

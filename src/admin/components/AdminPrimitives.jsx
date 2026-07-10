/* eslint-disable react-refresh/only-export-components --
 * This is the admin primitives module: it intentionally co-locates a few tiny
 * formatters (fmtDate/fmtDateTime/clientLabel) and the useAsyncData hook with
 * the primitive components that use them. The react-refresh rule only affects
 * HMR ergonomics in dev, not correctness, and splitting four one-liners into a
 * separate module would hurt cohesion for no real benefit. */
import { useCallback, useEffect, useState } from 'react'
import { Inbox, Loader2 } from 'lucide-react'
import { Badge, Card, Select, cn } from '@deluxfit/ds'
import { formatDate, formatDateTime } from '@/lib/datetime'

/**
 * Shared building blocks for the admin pages — keeps every CRUD surface visually
 * and behaviourally consistent (loading, empty, status, client picker) so the
 * pages stay focused on their own data flow.
 */

/** A bordered section card matching the admin form/list surfaces. */
export function SectionCard({ children, className }) {
  return (
    <Card variant="elevated" padded className={className}>
      {children}
    </Card>
  )
}

/** Eyebrow + title block used at the top of an admin section card. */
export function SectionHeading({ eyebrow, title, intro }) {
  return (
    <div>
      {eyebrow && (
        <p className="inline-flex items-center gap-2 text-[10px] font-700 uppercase tracking-[0.28em] text-df-accent">
          <span aria-hidden="true" className="h-1 w-6 rounded-df-full bg-df-accent" />
          {eyebrow}
        </p>
      )}
      <h2 className="font-400 mt-3 font-display text-2xl uppercase leading-tight tracking-tight text-df-text sm:text-3xl">
        {title}
      </h2>
      {intro && (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-df-text-muted">{intro}</p>
      )}
    </div>
  )
}

/**
 * A considered empty state: a tinted icon medallion, an optional headline, and
 * supporting copy on a dashed surface. Used across every admin list/detail slot.
 */
export function AdminEmpty({ body, title, icon: Icon = Inbox }) {
  return (
    <div className="bg-df-surface/60 flex flex-col items-center gap-4 rounded-df-lg border border-dashed border-df-border-strong px-6 py-12 text-center">
      <span
        aria-hidden="true"
        className="inline-flex h-12 w-12 items-center justify-center rounded-df-full bg-df-accent-soft text-df-accent-bright"
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="max-w-sm">
        {title && (
          <p className="font-400 font-display text-lg uppercase tracking-tight text-df-text">
            {title}
          </p>
        )}
        <p className={cn('text-sm leading-relaxed text-df-text-muted', title && 'mt-1.5')}>
          {body}
        </p>
      </div>
    </div>
  )
}

/** Inline loading line with a brand spinner. */
export function AdminLoading({ label = 'Loading…' }) {
  return (
    <p className="flex items-center justify-center gap-2.5 py-10 text-[11px] font-700 uppercase tracking-[0.18em] text-df-text-faint">
      <Loader2 className="h-4 w-4 animate-spin text-df-accent-bright" aria-hidden="true" />
      {label}
    </p>
  )
}

/**
 * MetricTile — a single at-a-glance stat: a label, an icon medallion, the
 * headline figure, and an optional supporting line. The visual anchor of the
 * dashboard; kept here so the treatment stays identical everywhere it's reused.
 */
export function MetricTile({ label, value, icon: Icon, hint }) {
  return (
    <Card
      variant="elevated"
      padded
      className="group relative overflow-hidden transition-colors duration-200 ease-df-out hover:border-df-border-hover"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-df-full bg-df-accent-softer opacity-0 blur-2xl transition-opacity duration-300 ease-df-out group-hover:opacity-100"
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-700 uppercase tracking-[0.28em] text-df-text-faint">
          {label}
        </p>
        {Icon && (
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-df-full bg-df-accent-soft text-df-accent-bright">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
      </div>
      <p className="font-400 mt-4 font-display text-4xl tabular-nums leading-none text-df-text">
        {value}
      </p>
      {hint && <p className="mt-2 text-xs text-df-text-muted">{hint}</p>}
    </Card>
  )
}

const STATUS_TONE = {
  active: 'positive',
  confirmed: 'positive',
  past_due: 'warning',
  pending: 'warning',
  incomplete: 'neutral',
  canceled: 'neutral',
  archived: 'neutral',
}

/** A status chip whose colour reflects the membership/booking status. */
export function StatusBadge({ status }) {
  if (!status) return null
  return (
    <Badge tone={STATUS_TONE[status] ?? 'neutral'} variant="soft" size="sm">
      {String(status).replace(/_/g, ' ')}
    </Badge>
  )
}

/** Human label for a client profile row. */
export const clientLabel = client =>
  client?.full_name || client?.email || client?.id?.slice(0, 8) || 'Client'

/** A native-styled client picker built on the DS Select. */
export function ClientSelect({ clients, value, onChange, placeholder = 'Select a client…', id }) {
  return (
    <Select id={id} value={value ?? ''} onChange={event => onChange(event.target.value)}>
      <option value="" disabled>
        {placeholder}
      </option>
      {clients.map(client => (
        <option key={client.id} value={client.id}>
          {clientLabel(client)}
          {client.email ? ` · ${client.email}` : ''}
        </option>
      ))}
    </Select>
  )
}

export const fmtDate = formatDate
export const fmtDateTime = formatDateTime

/** Index an array of `{ id }` records into a Map keyed by id, for O(1) lookups. */
export const mapById = items => new Map((items ?? []).map(item => [item.id, item]))

/**
 * useAsyncData — run an async loader and expose { data, loading, error, reload }.
 * Re-runs when any dependency changes; ignores stale resolutions on unmount.
 *
 * @template T
 * @param {() => Promise<T>} loader
 * @param {unknown[]} deps
 * @param {T} initial
 */
export function useAsyncData(loader, deps, initial = null) {
  const [state, setState] = useState({ data: initial, loading: true, error: null })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(loader, deps)

  const load = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const data = await run()
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({ data: initial, loading: false, error: error?.message || 'Failed to load.' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run])

  useEffect(() => {
    let active = true
    setState(prev => ({ ...prev, loading: true, error: null }))
    run()
      .then(data => active && setState({ data, loading: false, error: null }))
      .catch(
        error =>
          active &&
          setState({ data: initial, loading: false, error: error?.message || 'Failed to load.' })
      )
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run])

  return { ...state, reload: load }
}

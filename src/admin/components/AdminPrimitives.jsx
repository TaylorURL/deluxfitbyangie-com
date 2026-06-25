/* eslint-disable react-refresh/only-export-components --
 * This is the admin primitives module: it intentionally co-locates a few tiny
 * formatters (fmtDate/fmtDateTime/clientLabel) and the useAsyncData hook with
 * the primitive components that use them. The react-refresh rule only affects
 * HMR ergonomics in dev, not correctness, and splitting four one-liners into a
 * separate module would hurt cohesion for no real benefit. */
import { useCallback, useEffect, useState } from 'react'
import { Inbox, Loader2 } from 'lucide-react'
import { Badge, Card, Select, cn } from '@deluxfit/ds'

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
        <p className="text-[10px] font-700 uppercase tracking-[0.28em] text-df-accent">{eyebrow}</p>
      )}
      <h2 className="font-400 mt-3 font-display text-2xl uppercase leading-tight tracking-tight text-df-text sm:text-3xl">
        {title}
      </h2>
      {intro && <p className="mt-3 text-sm leading-relaxed text-df-text-muted">{intro}</p>}
    </div>
  )
}

/** A dashed empty-state row for lists with no rows yet. */
export function AdminEmpty({ body }) {
  return (
    <div className="bg-df-surface/60 rounded-df-lg border border-dashed border-df-border-strong px-5 py-10 text-center text-sm text-df-text-muted">
      {body}
    </div>
  )
}

/** Inline loading line. */
export function AdminLoading({ label = 'Loading…' }) {
  return <p className="py-8 text-center text-sm text-df-text-faint">{label}</p>
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

export const fmtDate = value =>
  value
    ? new Date(value).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })
    : '—'

export const fmtDateTime = value =>
  value
    ? new Date(value).toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : '—'

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

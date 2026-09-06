/* eslint-disable react-refresh/only-export-components --
 * This module co-locates the admin formatters (clientLabel, fmtDate,
 * fmtDateTime, mapById) and the useAsyncData hook with the primitive
 * components that use them. The react-refresh rule only affects HMR
 * ergonomics in dev, not correctness, and splitting the helpers into a
 * separate module would trade cohesion for nothing. */
import { useCallback, useEffect, useState } from 'react'
import {
  Badge,
  EmptyState,
  Panel,
  PanelHeading,
  Select,
  Skeleton,
  SkeletonText,
  Stat,
} from '@deluxfit/ds'
import { formatDate, formatDateTime } from '@/lib/datetime'

export function SectionCard({ children, className }) {
  return <Panel className={className}>{children}</Panel>
}

/**
 * The coach panel's header and empty state are the client portal's, not a
 * matching pair beside them. Both come from the design system now; these are
 * the names the admin pages already call them by.
 */
export { PanelHeading as SectionHeading, EmptyState as AdminEmpty }

/**
 * Loading drawn as the shape of the answer rather than as a spinner over a
 * blank. A row count is a guess, but a guess in the right shape keeps the page
 * from jumping when the real rows land.
 */
export function AdminLoading({ label = 'Loading…', rows = 4 }) {
  return (
    <div role="status" aria-busy="true" className="space-y-3 py-2">
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 shrink-0 rounded-df-full" />
          <SkeletonText className="flex-1" lines={2} />
        </div>
      ))}
    </div>
  )
}

export function MetricTile({ label, value, icon: Icon, hint }) {
  return (
    <Panel
      elevation="flat"
      className="transition-shadow duration-df-base ease-df-out hover:shadow-df-md"
    >
      <Stat label={label} value={value} icon={Icon}>
        {hint && <p className="text-[13px] text-df-text-muted">{hint}</p>}
      </Stat>
    </Panel>
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

export function StatusBadge({ status }) {
  if (!status) return null
  return (
    <Badge tone={STATUS_TONE[status] ?? 'neutral'} variant="soft" size="sm">
      {String(status)
        .replace(/_/g, ' ')
        .replace(/\b\w/g, letter => letter.toUpperCase())}
    </Badge>
  )
}

export const clientLabel = client =>
  client?.full_name || client?.email || client?.id?.slice(0, 8) || 'Client'

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
 * Run `loader` on mount and whenever `deps` change, exposing the result
 * alongside the loading and error state the admin pages render from.
 *
 * @template T
 * @param {() => Promise<T>} loader
 * @param {unknown[]} deps
 * @param {T} initial - the data value held while loading and after a failure
 * @returns {{ data: T, loading: boolean, error: string|null, reload: () => Promise<void> }}
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

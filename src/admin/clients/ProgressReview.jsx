import { useEffect, useState } from 'react'
import { ImageOff } from 'lucide-react'
import { Badge } from '@deluxfit/ds'
import { signedUrl } from '@/lib/adminApi'
import { AdminEmpty, fmtDate } from '../components/AdminPrimitives'

/**
 * PhotoThumb — lazily resolves its own signed URL for a private progress photo
 * and renders a thumbnail. Falls back to a placeholder if the URL can't be
 * resolved. Each instance fetches independently so the strip is non-blocking.
 */
function PhotoThumb({ path, label }) {
  const [url, setUrl] = useState(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let active = true
    setUrl(null)
    setFailed(false)
    signedUrl('progress-photos', path)
      .then(resolved => {
        if (!active) return
        if (resolved) setUrl(resolved)
        else setFailed(true)
      })
      .catch(() => active && setFailed(true))
    return () => {
      active = false
    }
  }, [path])

  if (failed) {
    return (
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-df-md border border-df-border bg-df-surface-2 text-df-text-faint">
        <ImageOff className="h-5 w-5" aria-hidden="true" />
      </div>
    )
  }

  if (!url) {
    return <div className="h-20 w-20 shrink-0 animate-pulse rounded-df-md border border-df-border bg-df-surface-2" />
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="block h-20 w-20 shrink-0 overflow-hidden rounded-df-md border border-df-border transition hover:border-df-accent"
    >
      <img src={url} alt={label} loading="lazy" className="h-full w-full object-cover" />
    </a>
  )
}

/** A minimal inline SVG sparkline of weight over time (oldest → newest). */
function WeightSparkline({ points }) {
  if (points.length < 2) return null
  const width = 220
  const height = 48
  const values = points.map(p => p.weight)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const step = width / (points.length - 1)
  const coords = points.map((p, i) => {
    const x = i * step
    const y = height - ((p.weight - min) / span) * (height - 8) - 4
    return [x, y]
  })
  const d = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const [lastX, lastY] = coords[coords.length - 1]
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-12 w-full max-w-[220px]"
      role="img"
      aria-label="Weight trend"
    >
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.75" className="text-df-accent" />
      <circle cx={lastX} cy={lastY} r="2.75" className="fill-df-accent-bright" />
    </svg>
  )
}

/**
 * ProgressReview — read-only review of a client's progress: a weight sparkline,
 * the most recent entries (weight / body fat / measurements as chips), and a
 * photo strip resolving private signed URLs lazily.
 */
export default function ProgressReview({ progress }) {
  const entries = progress ?? []
  if (entries.length === 0) {
    return <AdminEmpty body="No progress entries logged yet." />
  }

  // entries arrive newest-first; sparkline wants oldest → newest.
  const weighted = [...entries]
    .filter(e => e.weight != null)
    .reverse()
    .map(e => ({ weight: Number(e.weight) }))

  const recent = entries.slice(0, 6)
  const withPhotos = entries.filter(e => e.photo_path)

  return (
    <div className="grid gap-6">
      {weighted.length >= 2 && (
        <div>
          <p className="text-[11px] font-700 uppercase tracking-[0.16em] text-df-text-muted">Weight trend</p>
          <div className="mt-2">
            <WeightSparkline points={weighted} />
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {recent.map(entry => {
          const measurements = entry.measurements && typeof entry.measurements === 'object'
            ? Object.entries(entry.measurements)
            : []
          return (
            <div key={entry.id} className="rounded-df-lg border border-df-border bg-df-surface/60 px-4 py-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm font-600 text-df-text">{fmtDate(entry.entry_date)}</span>
                <span className="text-sm text-df-text-muted">
                  {entry.weight != null && <span className="text-df-text">{entry.weight} lb</span>}
                  {entry.body_fat != null && <span className="ml-3">{entry.body_fat}% bf</span>}
                </span>
              </div>
              {measurements.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {measurements.map(([label, value]) => (
                    <Badge key={label} tone="neutral" variant="outline" size="sm">
                      {label}: {String(value)}
                    </Badge>
                  ))}
                </div>
              )}
              {entry.notes && (
                <p className="mt-2 text-sm leading-relaxed text-df-text-muted">{entry.notes}</p>
              )}
            </div>
          )
        })}
      </div>

      {withPhotos.length > 0 && (
        <div>
          <p className="text-[11px] font-700 uppercase tracking-[0.16em] text-df-text-muted">Photos</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {withPhotos.map(entry => (
              <PhotoThumb
                key={entry.id}
                path={entry.photo_path}
                label={`Progress photo from ${fmtDate(entry.entry_date)}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

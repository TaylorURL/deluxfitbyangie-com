import { useEffect, useState } from 'react'
import { ImageOff } from 'lucide-react'
import { Badge, Card, MicroLabel, Skeleton } from '@deluxfit/ds'
import { signedUrl } from '@/lib/adminApi'
import Sparkline from '@/components/Sparkline'
import { AdminEmpty, fmtDate } from '../components/AdminPrimitives'

// Each thumb resolves its own signed URL independently, so one slow or failed
// photo never holds up the rest of the strip.
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
    return <Skeleton radius="md" className="h-20 w-20 shrink-0" />
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="block h-20 w-20 shrink-0 overflow-hidden rounded-df-md shadow-df-sm transition-shadow duration-df-base ease-df-out hover:shadow-df-lg"
    >
      <img
        src={url}
        alt={label}
        width="80"
        height="80"
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
    </a>
  )
}

export default function ProgressReview({ progress }) {
  const entries = progress ?? []
  if (entries.length === 0) {
    return <AdminEmpty body="No progress entries logged yet." />
  }

  // entries arrive newest-first; sparkline wants oldest to newest.
  const weighted = [...entries]
    .filter(entry => entry.weight != null)
    .reverse()
    .map(entry => Number(entry.weight))

  const recent = entries.slice(0, 6)
  const withPhotos = entries.filter(e => e.photo_path)

  return (
    <div className="grid gap-6">
      {weighted.length >= 2 && (
        <div>
          <MicroLabel>Weight Trend</MicroLabel>
          <div className="mt-2 max-w-[220px]">
            <Sparkline values={weighted} height={48} label="Weight trend" />
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {recent.map(entry => {
          const measurements =
            entry.measurements && typeof entry.measurements === 'object'
              ? Object.entries(entry.measurements)
              : []
          return (
            <Card key={entry.id} variant="inset" padded={false} className="px-4 py-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm font-600 text-df-text">{fmtDate(entry.entry_date)}</span>
                <span className="text-sm text-df-text-muted">
                  {entry.weight != null && <span className="text-df-text">{entry.weight} lb</span>}
                  {entry.body_fat != null && <span className="ml-3">{entry.body_fat}% bf</span>}
                </span>
              </div>
              {measurements.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
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
            </Card>
          )
        })}
      </div>

      {withPhotos.length > 0 && (
        <div>
          <MicroLabel>Photos</MicroLabel>
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

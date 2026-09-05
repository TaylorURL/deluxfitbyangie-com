import { ExternalLink, FileUp, Pencil, Trash2 } from 'lucide-react'
import { Badge, Button } from '@deluxfit/ds'
import {
  MEDIA_ICON,
  accessLevelLabel,
  accessTone,
  categoryLabel,
  mediaTypeLabel,
} from './contentMeta'

/** "Glute Growth · W2 D3" — only the parts the item actually carries. */
const placementLabel = item =>
  [item.program, item.week ? `W${item.week}` : null, item.day ? `D${item.day}` : null]
    .filter(Boolean)
    .join(' · ')

export default function ContentRow({ item, onEdit, onDelete, busy }) {
  const Icon = MEDIA_ICON[item.media_type] ?? MEDIA_ICON.video
  const hasUpload = Boolean(item.media_path)
  const hasUrl = Boolean(item.url)

  return (
    <li className="bg-df-surface-2/50 flex flex-col gap-4 rounded-df-md border border-df-border p-4 sm:flex-row sm:items-center">
      <span
        aria-hidden="true"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-df-lg bg-df-accent-soft text-df-accent-bright"
      >
        <Icon className="h-5 w-5" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-400 truncate font-display text-base uppercase tracking-[0.01em] text-df-text">
            {item.title}
          </p>
          <Badge tone="neutral" variant="soft" size="sm">
            {categoryLabel(item.category)}
          </Badge>
          <Badge tone="neutral" variant="outline" size="sm">
            {mediaTypeLabel(item.media_type)}
          </Badge>
          <Badge tone={accessTone(item.access_level)} variant="soft" size="sm">
            {accessLevelLabel(item.access_level)}
          </Badge>
          {item.program ? (
            <Badge tone="accent" variant="outline" size="sm">
              {placementLabel(item)}
            </Badge>
          ) : null}
        </div>
        {item.description ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-df-text-muted">
            {item.description}
          </p>
        ) : null}
        <p className="mt-2 inline-flex items-center gap-2 text-[11px] font-600 uppercase tracking-[0.16em] text-df-text-faint">
          {hasUpload ? (
            <>
              <FileUp className="h-3.5 w-3.5" aria-hidden="true" />
              Uploaded File
            </>
          ) : hasUrl ? (
            <>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              External Link
            </>
          ) : (
            'No media'
          )}
          <span aria-hidden="true">·</span>
          <span>Sort {Number.isFinite(item.sort) ? item.sort : 0}</span>
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(item)} disabled={busy}>
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Edit
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(item)} disabled={busy}>
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Delete
        </Button>
      </div>
    </li>
  )
}

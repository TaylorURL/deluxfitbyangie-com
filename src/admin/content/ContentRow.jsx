import { ExternalLink, FileUp, Pencil, Trash2 } from 'lucide-react'
import { Badge, Button } from '@deluxfit/ds'
import {
  MEDIA_ICON,
  accessLevelLabel,
  accessTone,
  categoryLabel,
  mediaTypeLabel,
} from './contentMeta'

/**
 * A single content-library item rendered as a row inside the list card, with
 * its title, taxonomy badges, media source, and edit / delete actions.
 */
export default function ContentRow({ item, onEdit, onDelete, busy }) {
  const Icon = MEDIA_ICON[item.media_type] ?? MEDIA_ICON.video
  const hasUpload = Boolean(item.media_path)
  const hasUrl = Boolean(item.url)

  return (
    <li className="flex flex-col gap-4 rounded-df-md border border-df-border bg-df-surface-2/50 p-4 sm:flex-row sm:items-center">
      <span
        aria-hidden="true"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-df-lg bg-df-accent-soft text-df-accent-bright"
      >
        <Icon className="h-5 w-5" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-display text-base font-400 uppercase tracking-[0.01em] text-df-text">
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
        </div>
        {item.description ? (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-df-text-muted">
            {item.description}
          </p>
        ) : null}
        <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-600 uppercase tracking-[0.16em] text-df-text-faint">
          {hasUpload ? (
            <>
              <FileUp className="h-3.5 w-3.5" aria-hidden="true" />
              Uploaded file
            </>
          ) : hasUrl ? (
            <>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              External link
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

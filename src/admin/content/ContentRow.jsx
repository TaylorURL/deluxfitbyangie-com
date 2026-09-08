import { ExternalLink, FileUp, Pencil, Trash2 } from 'lucide-react'
import { Badge, Button, MicroLabel } from '@deluxfit/ds'
import {
  MEDIA_ICON,
  accessLevelLabel,
  accessTone,
  categoryLabel,
  mediaTypeLabel,
} from './contentMeta'

/**
 * Every label sitting beside an icon is wrapped in a span rather than left as
 * bare text. A page translator swaps a loose text node for a <font> of its own
 * while React goes on holding the node it rendered, so the next insert beside
 * it hands the parent a reference that is no longer its child and the row
 * throws mid-redraw instead of updating. Wrapped, the element the reconciler
 * points at stays put and the translator rewrites only what is inside it.
 */

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
    <li className="flex flex-col gap-4 rounded-df-md bg-df-surface-2 p-4 shadow-df-sm sm:flex-row sm:items-center">
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
        <MicroLabel tone="faint" className="mt-2 inline-flex items-center gap-2">
          {hasUpload ? (
            <>
              <FileUp className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Uploaded File</span>
            </>
          ) : hasUrl ? (
            <>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              <span>External Link</span>
            </>
          ) : (
            <span>No media</span>
          )}
          <span aria-hidden="true">·</span>
          <span>Sort {Number.isFinite(item.sort) ? item.sort : 0}</span>
        </MicroLabel>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(item)} disabled={busy}>
          <Pencil className="h-4 w-4" aria-hidden="true" />
          <span>Edit</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(item)} disabled={busy}>
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          <span>Delete</span>
        </Button>
      </div>
    </li>
  )
}

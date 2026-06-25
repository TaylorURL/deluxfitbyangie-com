import { useState } from 'react'
import { BookOpen, ExternalLink, FileText, Loader2, PlayCircle } from 'lucide-react'
import { Badge, Button, Card, cn } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { getSignedUrl } from '@/lib/portalApi'
import { EmptyState, PanelHeading } from './PanelPrimitives'

const MEDIA_ICON = { video: PlayCircle, article: BookOpen, pdf: FileText }

/** A single library card. External-url items are plain links; private
 * media_path items resolve a short-lived signed URL on demand. */
function LibraryCard({ item, copy, coachingLabel }) {
  const [opening, setOpening] = useState(false)
  const Icon = MEDIA_ICON[item.media_type] ?? PlayCircle

  const handleOpen = async () => {
    setOpening(true)
    try {
      const url = await getSignedUrl('library-media', item.media_path)
      if (url) window.open(url, '_blank', 'noopener,noreferrer')
    } finally {
      setOpening(false)
    }
  }

  const inner = (
    <Card variant="surface" interactive={!!item.url} className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-df-lg bg-df-accent-soft text-df-accent-bright"
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" />
        </span>
        {item.access_level === 'coaching' && (
          <Badge tone="accent" variant="outline" size="sm">
            {coachingLabel}
          </Badge>
        )}
      </div>
      <h3 className="mt-4 font-display text-lg font-400 uppercase tracking-[0.01em] text-df-text">
        {item.title}
      </h3>
      {item.description && (
        <p className="mt-2 text-sm leading-relaxed text-df-text-muted">{item.description}</p>
      )}
      {!item.url && item.media_path && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleOpen}
          disabled={opening}
          className="mt-4 self-start"
        >
          {opening ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {copy.opening}
            </>
          ) : (
            <>
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              {copy.open}
            </>
          )}
        </Button>
      )}
    </Card>
  )

  if (item.url) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block focus-visible:outline-none"
      >
        {inner}
      </a>
    )
  }
  return inner
}

/**
 * LibraryPanel — the gated content library (workouts, nutrition, education).
 * RLS already filters rows to what the user is entitled to; when the user has
 * no entitlement at all, we show the gated upsell instead of an empty grid.
 */
export default function LibraryPanel({ content, entitlements }) {
  const { portal } = useContent()
  const copy = portal.library
  const [category, setCategory] = useState('all')

  if (!entitlements.hasMembership && !entitlements.hasCoaching) {
    return (
      <section>
        <PanelHeading title={copy.title} />
        <EmptyState
          title={copy.gatedTitle}
          body={copy.gatedBody}
          ctaLabel={copy.gatedCta}
          ctaHref="/membership"
        />
      </section>
    )
  }

  const filters = [
    { id: 'all', label: copy.categoryAll },
    { id: 'workout', label: copy.categoryWorkout },
    { id: 'nutrition', label: copy.categoryNutrition },
    { id: 'education', label: copy.categoryEducation },
  ]
  const visible = category === 'all' ? content : content.filter(item => item.category === category)

  return (
    <section>
      <PanelHeading title={copy.title} intro={copy.intro} />

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map(filter => (
          <button
            key={filter.id}
            type="button"
            aria-pressed={category === filter.id}
            onClick={() => setCategory(filter.id)}
            className={cn(
              'rounded-df-full border px-3.5 py-1.5 text-[11px] font-700 uppercase tracking-[0.16em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright',
              category === filter.id
                ? 'border-df-accent bg-df-accent text-df-on-accent'
                : 'border-df-border-strong text-df-text-muted hover:border-df-border-hover hover:text-df-text'
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState body={copy.empty} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map(item => (
            <LibraryCard
              key={item.id}
              item={item}
              copy={copy}
              coachingLabel={portal.overview.coachingStatus}
            />
          ))}
        </div>
      )}
    </section>
  )
}

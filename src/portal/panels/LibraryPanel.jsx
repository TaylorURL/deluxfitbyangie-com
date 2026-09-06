import { useState } from 'react'
import { BookOpen, ExternalLink, FileText, Loader2, PlayCircle } from 'lucide-react'
import { Badge, Button, Card, MicroLabel, SegmentedControl, SplitHeading } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { getSignedUrl } from '@/lib/portalApi'
import { EmptyState, PanelHeading } from './PanelPrimitives'

const MEDIA_ICON = { video: PlayCircle, article: BookOpen, pdf: FileText }

/**
 * Group items the way the training is actually followed: program, then week,
 * then day. A program is a sequence, and a flat grid of forty videos hides
 * that — the member has to read titles to work out what comes next.
 *
 * Items with no program are a different thing entirely (a nutrition PDF, a
 * single demo) and collect into one trailing group rather than pretending to
 * be week one of something.
 *
 * @returns {{ key: string, program: string|null,
 *   weeks: { week: number|null, days: { day: number|null, items: object[] }[] }[] }[]}
 */
function groupByProgram(items) {
  const programs = new Map()
  for (const item of items) {
    const program = item.program || null
    if (!programs.has(program)) programs.set(program, new Map())
    const weeks = programs.get(program)
    const week = item.week ?? null
    if (!weeks.has(week)) weeks.set(week, new Map())
    const days = weeks.get(week)
    const day = item.day ?? null
    if (!days.has(day)) days.set(day, [])
    days.get(day).push(item)
  }

  // null sorts last within each level, so an unnumbered item trails the
  // numbered ones instead of leading them.
  const ordered = value => (value == null ? Number.POSITIVE_INFINITY : value)

  return [...programs.entries()]
    .sort(([a], [b]) => {
      if (a === b) return 0
      if (a === null) return 1
      if (b === null) return -1
      return a.localeCompare(b)
    })
    .map(([program, weeks]) => ({
      key: program ?? '__standalone__',
      program,
      weeks: [...weeks.entries()]
        .sort(([a], [b]) => ordered(a) - ordered(b))
        .map(([week, days]) => ({
          week,
          days: [...days.entries()]
            .sort(([a], [b]) => ordered(a) - ordered(b))
            .map(([day, dayItems]) => ({
              day,
              items: [...dayItems].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)),
            })),
        })),
    }))
}

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
      <h3 className="font-400 mt-4 font-display text-lg uppercase tracking-[0.01em] text-df-text">
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
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="group block">
        {inner}
      </a>
    )
  }
  return inner
}

/**
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
  const groups = groupByProgram(visible)

  return (
    <section>
      <PanelHeading title={copy.title} intro={copy.intro} />

      <SegmentedControl
        className="mb-6 sm:w-auto"
        label={copy.title}
        value={category}
        onChange={setCategory}
        options={filters.map(filter => ({ value: filter.id, label: filter.label }))}
      />

      {visible.length === 0 ? (
        <EmptyState body={copy.empty} />
      ) : (
        <div className="flex flex-col gap-10">
          {groups.map(group => (
            <div key={group.key}>
              <SplitHeading as="h3" size="card" text={group.program ?? copy.resourcesGroup} />
              <div className="mt-4 flex flex-col gap-6">
                {group.weeks.map(({ week, days }) => (
                  <div key={week ?? 'no-week'}>
                    {week != null && (
                      <MicroLabel tone="accent">
                        {copy.weekLabel} {week}
                      </MicroLabel>
                    )}
                    <div className="mt-3 flex flex-col gap-5">
                      {days.map(({ day, items }) => (
                        <div key={day ?? 'no-day'}>
                          {day != null && (
                            <MicroLabel className="mb-3">
                              {copy.dayLabel} {day}
                            </MicroLabel>
                          )}
                          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map(item => (
                              <LibraryCard
                                key={item.id}
                                item={item}
                                copy={copy}
                                coachingLabel={portal.overview.coachingStatus}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

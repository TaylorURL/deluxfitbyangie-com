import { BookOpen, FileText, PlayCircle } from 'lucide-react'

export const CATEGORY_OPTIONS = [
  { value: 'workout', label: 'Workout' },
  { value: 'nutrition', label: 'Nutrition' },
  { value: 'education', label: 'Education' },
]

export const MEDIA_TYPE_OPTIONS = [
  { value: 'video', label: 'Video' },
  { value: 'article', label: 'Article' },
  { value: 'pdf', label: 'PDF' },
]

export const ACCESS_LEVEL_OPTIONS = [
  { value: 'public', label: 'Public' },
  { value: 'membership', label: 'Membership' },
  { value: 'coaching', label: 'Coaching' },
]

export const MEDIA_ICON = { video: PlayCircle, article: BookOpen, pdf: FileText }

const ACCESS_TONE = {
  public: 'positive',
  membership: 'accent',
  coaching: 'warning',
}

export const accessTone = level => ACCESS_TONE[level] ?? 'neutral'

const labelFrom = (options, value) =>
  options.find(option => option.value === value)?.label ?? value ?? '—'

export const categoryLabel = value => labelFrom(CATEGORY_OPTIONS, value)
export const mediaTypeLabel = value => labelFrom(MEDIA_TYPE_OPTIONS, value)
export const accessLevelLabel = value => labelFrom(ACCESS_LEVEL_OPTIONS, value)

export const emptyDraft = () => ({
  id: null,
  title: '',
  description: '',
  category: 'workout',
  mediaType: 'video',
  accessLevel: 'coaching',
  sort: 0,
  url: '',
  program: '',
  week: '',
  day: '',
})

/** Map a content_item row onto the editable draft shape. */
export const draftFromItem = item => ({
  id: item.id,
  title: item.title ?? '',
  description: item.description ?? '',
  category: item.category ?? 'workout',
  mediaType: item.media_type ?? 'video',
  accessLevel: item.access_level ?? 'coaching',
  sort: Number.isFinite(item.sort) ? item.sort : 0,
  url: item.url ?? '',
  program: item.program ?? '',
  week: item.week ?? '',
  day: item.day ?? '',
})

/**
 * Order a library list the way it is trained: by program, then week, then day,
 * then the manual sort within a day. Standalone items (no program) sort after
 * the programs, because they are resources rather than a sequence.
 */
export const byProgramOrder = (a, b) => {
  const programA = a.program ?? ''
  const programB = b.program ?? ''
  if (programA !== programB) {
    if (!programA) return 1
    if (!programB) return -1
    return programA.localeCompare(programB)
  }
  const weekDiff = (a.week ?? 0) - (b.week ?? 0)
  if (weekDiff !== 0) return weekDiff
  const dayDiff = (a.day ?? 0) - (b.day ?? 0)
  if (dayDiff !== 0) return dayDiff
  return (a.sort ?? 0) - (b.sort ?? 0)
}

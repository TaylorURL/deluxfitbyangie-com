import { BookOpen, FileText, PlayCircle } from 'lucide-react'

/** Shared option lists + display metadata for the content library admin. */

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
})

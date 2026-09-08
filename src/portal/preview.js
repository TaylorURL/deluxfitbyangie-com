/*
 * CLIENT PREVIEW — the coach's view of her own portal, held to a client's
 * access rules.
 *
 * Staff read every library row: `content_items_select_entitled` ends in
 * `or public.is_staff(auth.uid())`, so the coach opening the portal sees the
 * whole library whatever she is entitled to. That is right for authoring and
 * useless for checking, because the one question the portal cannot otherwise
 * answer is "what does a member actually get". The preview answers it by
 * putting the client's own gate back in front of the coach: an access level she
 * picks, the entitlements a client on that level carries, and the rows that
 * level can read.
 *
 * It is a narrower view of her own account, never a wider one. Nothing here
 * reaches another client's rows — her plan, progress, messages and sessions
 * stay hers — so the preview shows the library and the locks, which is what
 * the level decides.
 */

export const PREVIEW_LEVELS = ['membership', 'coaching']

/**
 * The previewed level named by `?preview=`, or null when the query says
 * nothing or names something that is not a level.
 */
export function readPreviewLevel(search) {
  const query = search ?? (typeof window === 'undefined' ? '' : window.location.search)
  const value = new URLSearchParams(query).get('preview')
  return PREVIEW_LEVELS.includes(value) ? value : null
}

/**
 * Write the previewed level into the current URL, keeping the path and the
 * section fragment. Passing null leaves the portal on the coach's own view.
 */
export function previewHref(level, { pathname, hash } = {}) {
  const path = pathname ?? (typeof window === 'undefined' ? '/portal' : window.location.pathname)
  const fragment = hash ?? (typeof window === 'undefined' ? '' : window.location.hash)
  const query = PREVIEW_LEVELS.includes(level) ? `?preview=${level}` : ''
  return `${path}${query}${fragment}`
}

/**
 * Entitlements exactly as a client on `level` carries them. Coaching implies
 * membership, which is the rule `deriveEntitlements` applies to real rows.
 */
export function previewEntitlements(level) {
  if (level === 'coaching') return { hasMembership: true, hasCoaching: true }
  if (level === 'membership') return { hasMembership: true, hasCoaching: false }
  return null
}

/** Which access levels a client on the previewed level can read. */
const READABLE = {
  membership: ['public', 'membership'],
  coaching: ['public', 'membership', 'coaching'],
}

/**
 * The library rows a client on `level` would have been handed, filtered out of
 * the full set RLS gives staff.
 *
 * An item with no access level is treated as coaching — the level the authoring
 * form defaults to — so an unlabelled row is previewed at its most restricted
 * rather than shown to a member who would not see it.
 */
export function previewContent(items, level) {
  const readable = READABLE[level]
  if (!readable) return items
  return items.filter(item => readable.includes(item.access_level ?? 'coaching'))
}

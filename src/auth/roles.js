/**
 * Default landing path for a signed-in user, by role. Staff land on /admin;
 * clients land on /portal. Unknown / not-yet-loaded roles default to /portal —
 * the safer surface, which shows an empty state instead of leaking admin
 * scaffolding for a half-loaded session.
 */
export function roleLandingPath(role) {
  if (role === 'staff') return '/admin'
  return '/portal'
}

/**
 * Whether a `?next=` path may be followed after signing in or signing up.
 *
 * Only a path inside this site, and only one the role can actually use, so a
 * crafted link cannot bounce a client at `/admin`. A protocol-relative `//host`
 * also starts with a slash and names somewhere else entirely, so it is refused
 * before the role is consulted.
 */
export function nextIsAllowedForRole(next, role) {
  if (typeof next !== 'string') return false
  if (!next.startsWith('/') || next.startsWith('//')) return false
  if (next.startsWith('/admin')) return role === 'staff'
  if (next.startsWith('/portal')) return role === 'client' || role === 'staff'
  return true
}

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

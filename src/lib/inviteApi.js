import { invokeOk } from '@/lib/functions'

/**
 * Invite a user to DeluxFit via the staff-only `invite-user` edge function.
 *
 * The frontend NEVER writes a role or creates an auth user directly — every
 * invite is brokered server-side so the function can verify the caller is
 * staff before stamping the new profile's role.
 *
 * @param {object} payload
 * @param {string} payload.email
 * @param {string} [payload.fullName]
 * @param {'client' | 'staff'} payload.role
 * @returns {Promise<{ id?: string, email?: string, role: 'client' | 'staff' }>}
 */
export async function inviteUser({ email, fullName, role }) {
  const data = await invokeOk(
    'invite-user',
    { email, fullName, role },
    'Could not send the invite.'
  )
  return data?.user
}

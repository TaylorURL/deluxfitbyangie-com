import { supabase } from '@/config/supabase'

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
  const { data, error } = await supabase.functions.invoke('invite-user', {
    body: { email, fullName, role },
  })
  if (error) throw new Error(error.message || 'Could not send the invite.')
  if (data?.ok === false) throw new Error(data.error || 'Could not send the invite.')
  return data?.user
}

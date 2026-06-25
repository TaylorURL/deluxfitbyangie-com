import { supabase } from '@/config/supabase'

/**
 * ADMIN API — the coach/staff data layer.
 *
 * Reads go straight to the tables: the `*_select_staff` RLS policies (migrations
 * 0003 + 0005) let a staff profile read every client's rows, so the admin panel
 * never needs the service-role key in the browser. Every WRITE is brokered by a
 * staff-only edge function that re-checks `profile.role = 'staff'` server-side
 * before touching the database. The frontend never mutates a table directly.
 */

const rows = async query => {
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data ?? []
}

const one = async query => {
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data ?? null
}

/** Invoke a staff edge function and unwrap the { ok, ... } envelope. */
async function invoke(fn, body) {
  const { data, error } = await supabase.functions.invoke(fn, { body })
  if (error) {
    // Surface the function's JSON error body when present.
    try {
      const parsed = await error.context?.json?.()
      if (parsed?.error) throw new Error(parsed.error)
    } catch (inner) {
      if (inner instanceof Error && inner.message) throw inner
    }
    throw new Error(error.message || `${fn} failed`)
  }
  if (data?.ok === false) throw new Error(data.error || `${fn} failed`)
  return data
}

/* -------------------------------------------------------------------------- */
/*  People                                                                      */
/* -------------------------------------------------------------------------- */

export const listClients = () =>
  rows(
    supabase
      .from('profiles')
      .select('id, full_name, email, role, created_at')
      .eq('role', 'client')
      .order('created_at', { ascending: false })
  )

export const listStaff = () =>
  rows(
    supabase
      .from('profiles')
      .select('id, full_name, email, role, created_at')
      .eq('role', 'staff')
      .order('created_at', { ascending: false })
  )

export const getClientProfile = userId =>
  one(supabase.from('profiles').select('*').eq('id', userId).maybeSingle())

/* -------------------------------------------------------------------------- */
/*  Per-client reads (used by the client detail / monthly-review surface)       */
/* -------------------------------------------------------------------------- */

export const getClientPlans = userId =>
  rows(
    supabase
      .from('plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  )

export const getClientProgress = userId =>
  rows(
    supabase
      .from('progress_entries')
      .select('*')
      .eq('user_id', userId)
      .order('entry_date', { ascending: false })
  )

export const getClientNutrition = userId =>
  rows(
    supabase
      .from('nutrition_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  )

export const getClientMemberships = userId =>
  rows(supabase.from('memberships').select('*').eq('user_id', userId))

export const getClientBookings = userId =>
  rows(
    supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('slot_start', { ascending: false })
  )

/** A client's full message thread (oldest first), resolving the conversation. */
export const getClientMessages = async userId => {
  const conversation = await one(
    supabase.from('conversations').select('id').eq('user_id', userId).maybeSingle()
  )
  if (!conversation?.id) return []
  return rows(
    supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true })
  )
}

export const getClientAssignments = userId =>
  rows(
    supabase
      .from('content_assignments')
      .select('content_id')
      .eq('user_id', userId)
  ).then(list => list.map(row => row.content_id))

/* -------------------------------------------------------------------------- */
/*  Library / bookings / memberships (cross-client reads)                       */
/* -------------------------------------------------------------------------- */

export const listContent = (locale = 'en') =>
  rows(
    supabase
      .from('content_items')
      .select('*')
      .eq('locale', locale)
      .order('sort', { ascending: true })
  )

export const listAllBookings = () =>
  rows(
    supabase
      .from('bookings')
      .select('*')
      .order('slot_start', { ascending: false })
  )

export const listAllMemberships = () =>
  rows(
    supabase
      .from('memberships')
      .select('*')
      .order('updated_at', { ascending: false })
  )

/* -------------------------------------------------------------------------- */
/*  Writes — all via staff-only edge functions                                  */
/* -------------------------------------------------------------------------- */

export const savePlan = payload => invoke('upsert-plan', payload).then(d => d.plan)
export const deletePlan = id => invoke('upsert-plan', { id, delete: true })

export const saveNutrition = payload => invoke('upsert-nutrition', payload).then(d => d.plan)
export const deleteNutrition = id => invoke('upsert-nutrition', { id, delete: true })

export const saveContent = payload => invoke('upsert-content', payload).then(d => d.item)
export const deleteContent = id => invoke('upsert-content', { id, delete: true })

export const sendCoachMessage = payload => invoke('coach-message', payload).then(d => d.message)

export const saveMembership = payload => invoke('update-membership', payload).then(d => d.membership)
export const removeMembership = ({ userId, product }) =>
  invoke('update-membership', { userId, product, delete: true })

export const updateBookingStatus = (id, status) =>
  invoke('update-booking', { id, status }).then(d => d.booking)

/**
 * Upload coach media (library video/PDF, message feedback) to the private
 * `library-media` bucket via the staff-only `upload-media` function. Returns
 * { bucket, path }.
 */
export async function uploadMedia(file, prefix = 'library') {
  const form = new FormData()
  form.append('file', file, file.name)
  form.append('prefix', prefix)
  const { data, error } = await supabase.functions.invoke('upload-media', { body: form })
  if (error) {
    try {
      const parsed = await error.context?.json?.()
      if (parsed?.error) throw new Error(parsed.error)
    } catch (inner) {
      if (inner instanceof Error && inner.message) throw inner
    }
    throw new Error(error.message || 'Upload failed')
  }
  if (data?.ok === false) throw new Error(data.error || 'Upload failed')
  return { bucket: data.bucket, path: data.path }
}

/** Resolve a signed URL for a private object (shared broker with the portal). */
export async function signedUrl(bucket, path) {
  if (!path) return null
  try {
    const { data, error } = await supabase.functions.invoke('signed-url', {
      body: { bucket, path },
    })
    if (error || data?.ok === false) return null
    return data?.url ?? null
  } catch {
    return null
  }
}

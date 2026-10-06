import { supabase } from '@/config/supabase'
import { invokeOk, isConnectionLost, resolveSignedUrl } from '@/lib/api/functions'

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
const invoke = (fn, body) => invokeOk(fn, body)

// People

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

// Per-client reads (used by the client detail / monthly-review surface)

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

/** Every set of macro calculator answers a client has sent, newest first. */
export const getClientMacroIntakes = userId =>
  rows(
    supabase
      .from('macro_intakes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  )

/** Clients whose macro calculator answers are waiting on review. */
export const listPendingMacroIntakes = () =>
  rows(
    supabase
      .from('macro_intakes')
      .select('id, user_id, created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
  )

/** Mark macro calculator answers reviewed, through `resolve_macro_intake()`. */
export async function resolveMacroIntake(id) {
  const { error } = await supabase.rpc('resolve_macro_intake', { p_id: id })
  if (error) throw new Error(error.message)
}

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
  rows(supabase.from('content_assignments').select('content_id').eq('user_id', userId)).then(list =>
    list.map(row => row.content_id)
  )

// Library / bookings / memberships (cross-client reads)

// The whole library, in one language-independent list. The authoring form and
// the portal have to agree on which rows exist, so neither one filters on the
// `locale` stamp the row carries.
export const listContent = () =>
  rows(supabase.from('content_items').select('*').order('sort', { ascending: true }))

export const listAllBookings = () =>
  rows(supabase.from('bookings').select('*').order('slot_start', { ascending: false }))

export const listAllMemberships = () =>
  rows(supabase.from('memberships').select('*').order('updated_at', { ascending: false }))

// Writes — all via staff-only edge functions

export const savePlan = payload => invoke('upsert-plan', payload).then(d => d.plan)
export const deletePlan = id => invoke('upsert-plan', { id, delete: true })

export const saveNutrition = payload => invoke('upsert-nutrition', payload).then(d => d.plan)
export const deleteNutrition = id => invoke('upsert-nutrition', { id, delete: true })

export const saveContent = payload => invoke('upsert-content', payload).then(d => d.item)
export const deleteContent = id => invoke('upsert-content', { id, delete: true })

export const sendCoachMessage = payload => invoke('coach-message', payload).then(d => d.message)

export const saveMembership = payload =>
  invoke('update-membership', payload).then(d => d.membership)
export const removeMembership = ({ userId, product }) =>
  invoke('update-membership', { userId, product, delete: true })

export const updateBookingStatus = (id, status) =>
  invoke('update-booking', { id, status }).then(d => d.booking)

// Availability

/**
 * Angie's standing week as `{ 0..6: number[] }`, every weekday present so the
 * editor can draw an empty row for a day she does not work.
 */
export const getStandingAvailability = async () => {
  const list = await rows(supabase.from('coach_availability').select('weekday, hour'))
  const standing = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }
  for (const row of list) if (standing[row.weekday]) standing[row.weekday].push(row.hour)
  for (const day of Object.keys(standing)) standing[day].sort((a, b) => a - b)
  return standing
}

/** The dates that do something other than their weekday, today onward. */
export const listAvailabilityOverrides = () =>
  rows(
    supabase
      .from('coach_availability_overrides')
      .select('*')
      .gte('override_date', new Date().toISOString().slice(0, 10))
      .order('override_date', { ascending: true })
  )

/** Replace the whole standing week. The payload is the grid, not a delta. */
export const saveStandingAvailability = standing => invoke('upsert-availability', { standing })

export const saveAvailabilityOverride = override =>
  invoke('upsert-availability', { override }).then(d => d.override)

export const removeAvailabilityOverride = date =>
  invoke('upsert-availability', { deleteOverride: date })

// A coach's library file is a training video, so the body spends seconds or
// minutes on the wire and a connection that drops anywhere in that window ends
// the whole upload. Retrying is safe here and nowhere else: a request that
// never reached the function wrote nothing, and the function names every
// object with a fresh id, so a repeat cannot land twice or overwrite.
const UPLOAD_ATTEMPTS = 3
const RETRY_PAUSE_MS = 1500

const pause = ms =>
  new Promise(resolve => {
    setTimeout(resolve, ms)
  })

/**
 * Upload coach media (library video/PDF, message feedback) to the private
 * `library-media` bucket via the staff-only `upload-media` function. Returns
 * { bucket, path }.
 */
export async function uploadMedia(file, prefix = 'library') {
  for (let attempt = 1; ; attempt += 1) {
    // The form is rebuilt each time: a body that has already been handed to
    // fetch cannot be sent a second time.
    const form = new FormData()
    form.append('file', file, file.name)
    form.append('prefix', prefix)
    try {
      const data = await invokeOk('upload-media', form, 'Upload failed')
      return { bucket: data.bucket, path: data.path }
    } catch (error) {
      if (attempt >= UPLOAD_ATTEMPTS || !isConnectionLost(error)) throw error
      await pause(RETRY_PAUSE_MS * attempt)
    }
  }
}

/** Resolve a signed URL for a private object (shared broker with the portal). */
export const signedUrl = resolveSignedUrl

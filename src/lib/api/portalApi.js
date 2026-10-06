import { supabase } from '@/config/supabase'
import { invokeOk, resolveSignedUrl } from '@/lib/api/functions'

/**
 * PORTAL API — RLS-scoped reads + edge-function-backed writes for the member
 * portal. Reads return `[]`/`null` (never throw) when a table is missing or
 * unreachable, so the dashboard degrades to empty states instead of crashing
 * before the migration has been applied. Writes throw so the UI can surface a
 * clear error.
 */

const safeSelect = async query => {
  try {
    const { data, error } = await query
    if (error) throw error
    return data ?? null
  } catch {
    return null
  }
}

/** The signed-in user's profile row. */
export const getProfile = userId =>
  safeSelect(supabase.from('profiles').select('*').eq('id', userId).maybeSingle())

/** Active/known entitlement rows (membership + coaching). */
export const getMemberships = userId =>
  safeSelect(supabase.from('memberships').select('*').eq('user_id', userId)).then(
    rows => rows ?? []
  )

/** Assigned personalized plans, newest first. */
export const getPlans = userId =>
  safeSelect(
    supabase
      .from('plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  ).then(rows => rows ?? [])

/** Progress entries, newest first. */
export const getProgressEntries = userId =>
  safeSelect(
    supabase
      .from('progress_entries')
      .select('*')
      .eq('user_id', userId)
      .order('entry_date', { ascending: false })
  ).then(rows => rows ?? [])

/** The user's bookings, soonest first. */
export const getBookings = userId =>
  safeSelect(
    supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('slot_start', { ascending: true })
  ).then(rows => rows ?? [])

/** Messages in the user's conversation, oldest first. */
export const getMessages = async userId => {
  const conversation = await safeSelect(
    supabase.from('conversations').select('id').eq('user_id', userId).maybeSingle()
  )
  if (!conversation?.id) return []
  return safeSelect(
    supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true })
  ).then(rows => rows ?? [])
}

/**
 * Content library items the user is entitled to or assigned (RLS does the
 * gating).
 *
 * Deliberately not filtered by the reader's interface language. The library is
 * the coach's own uploaded media, titled in whatever language she wrote, and
 * there is one of each file — a video is not re-recorded per locale the way the
 * site's own copy is translated. Gating it on the language the reader happens
 * to be browsing in could only ever hide her work from the people it is for.
 */
export const getContentItems = () =>
  safeSelect(supabase.from('content_items').select('*').order('sort', { ascending: true })).then(
    rows => rows ?? []
  )

/**
 * The client's active personalized nutrition plan (newest active first),
 * returned as `{ plan, error }`.
 *
 * A plan nobody has written yet and a plan the read could not reach are the
 * same `null` to a caller that only gets the row back, so the panel would tell
 * an active coaching client "nothing written yet" for a read that failed. The
 * reason travels with the result instead, and the panel says which one it is.
 */
export const getNutritionPlan = async userId => {
  const { data, error } = await supabase
    .from('nutrition_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) return { plan: null, error: error.message || 'Could not load.' }
  return { plan: data ?? null, error: null }
}

/** The client's newest macro calculator answers, or null when none were sent. */
export const getMacroIntake = userId =>
  safeSelect(
    supabase
      .from('macro_intakes')
      .select('id, status, created_at, updated_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
  )

// Mutations — routed through edge functions or security-definer database
// functions (never direct table writes)

/**
 * Send the macro calculator answers through `submit_macro_intake()`, which
 * checks the caller holds coaching and replaces an earlier answer still
 * waiting on review. Weight and height arrive here already in kg and cm.
 */
export async function submitMacroIntake(intake) {
  const { data, error } = await supabase.rpc('submit_macro_intake', {
    p_sex: intake.sex,
    p_age: intake.age,
    p_weight_kg: Number(intake.weightKg.toFixed(1)),
    p_height_cm: Number(intake.heightCm.toFixed(1)),
    p_activity: intake.activity,
    p_goal: intake.goal,
    p_pregnant_or_breastfeeding: intake.pregnantOrBreastfeeding,
    p_medical_conditions: intake.medicalConditions || null,
  })
  if (error) throw new Error(error.message || 'Could not send your answers.')
  return data
}

/** Insert a progress entry via the `log-progress` edge function. */
export async function logProgress(entry) {
  const data = await invokeOk('log-progress', entry, 'Could not save your entry.')
  return data?.entry
}

/** Send a message to Angie via the `send-message` edge function. */
export async function sendMessage({ body, attachmentPath }) {
  const data = await invokeOk(
    'send-message',
    { body, attachmentPath },
    'Could not send your message.'
  )
  return data?.message
}

/**
 * Upload a message attachment to storage and return its path. Best-effort:
 * throws on failure so the caller can fall back to a text-only message.
 */
export async function uploadAttachment(userId, file) {
  const path = `${userId}/${Date.now()}-${file.name}`
  const { error } = await supabase.storage.from('message-attachments').upload(path, file)
  if (error) throw new Error(error.message || 'Upload failed.')
  return path
}

/** Upload a progress photo to the client's own folder and return its path. */
export async function uploadProgressPhoto(userId, file) {
  const path = `${userId}/${Date.now()}-${file.name}`
  const { error } = await supabase.storage.from('progress-photos').upload(path, file)
  if (error) throw new Error(error.message || 'Photo upload failed.')
  return path
}

/** Resolve a short-lived signed URL for a private storage object (shared broker with the admin panel). */
export const getSignedUrl = resolveSignedUrl

/**
 * Derive entitlement booleans from membership rows. Coaching implies access to
 * membership-level (general) content too.
 */
export function deriveEntitlements(memberships = []) {
  const active = memberships.filter(row => row.status === 'active')
  const hasCoaching = active.some(row => row.product === 'coaching')
  const hasMembership = hasCoaching || active.some(row => row.product === 'membership')
  return { hasMembership, hasCoaching }
}

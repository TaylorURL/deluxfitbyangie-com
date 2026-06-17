import { supabase } from '@/config/supabase'

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
  safeSelect(supabase.from('memberships').select('*').eq('user_id', userId)).then(rows => rows ?? [])

/** Assigned personalized plans, newest first. */
export const getPlans = userId =>
  safeSelect(
    supabase.from('plans').select('*').eq('user_id', userId).order('created_at', { ascending: false })
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

/** Content library items the user is entitled to (RLS does the gating). */
export const getContentItems = locale =>
  safeSelect(
    supabase
      .from('content_items')
      .select('*')
      .eq('locale', locale)
      .order('sort', { ascending: true })
  ).then(rows => rows ?? [])

/* -------------------------------------------------------------------------- */
/*  Mutations — all routed through edge functions (never direct table writes)  */
/* -------------------------------------------------------------------------- */

/** Insert a progress entry via the `log-progress` edge function. */
export async function logProgress(entry) {
  const { data, error } = await supabase.functions.invoke('log-progress', { body: entry })
  if (error) throw new Error(error.message || 'Could not save your entry.')
  if (data?.ok === false) throw new Error(data.error || 'Could not save your entry.')
  return data?.entry
}

/** Send a message to Angie via the `send-message` edge function. */
export async function sendMessage({ body, attachmentPath }) {
  const { data, error } = await supabase.functions.invoke('send-message', {
    body: { body, attachmentPath },
  })
  if (error) throw new Error(error.message || 'Could not send your message.')
  if (data?.ok === false) throw new Error(data.error || 'Could not send your message.')
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

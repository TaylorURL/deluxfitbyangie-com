// upsert-availability
// POST { standing? } | { override } | { deleteOverride }
//   standing:       { "0".."6": number[] }  replaces the whole standing week
//   override:       { date: 'YYYY-MM-DD', closed?: boolean, hours?: number[], note?: string }
//   deleteOverride: 'YYYY-MM-DD'
// Auth REQUIRED + staff only.
//
// The booking calendar reads `coach_availability` and
// `coach_availability_overrides` directly (they are world-readable, because a
// visitor has to see open slots before signing in) and writes nothing. This is
// the only way either table changes.

import { corsHeaders, json } from '../_shared/cors.ts'
import { requireStaff, serviceClient } from '../_shared/auth.ts'

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

/** Sorted, de-duplicated whole hours in 0-23. Anything else is dropped. */
function cleanHours(value: unknown): number[] {
  if (!Array.isArray(value)) return []
  const hours = value
    .map(entry => Number(entry))
    .filter(hour => Number.isInteger(hour) && hour >= 0 && hour <= 23)
  return [...new Set(hours)].sort((a, b) => a - b)
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405)

  const supabase = serviceClient()
  const auth = await requireStaff(req, supabase)
  if (auth.error) return json({ ok: false, error: auth.error }, auth.status)

  let payload: {
    standing?: Record<string, unknown>
    override?: { date?: string; closed?: boolean; hours?: unknown; note?: string }
    deleteOverride?: string
  }
  try {
    payload = await req.json()
  } catch {
    return json({ ok: false, error: 'Invalid JSON body' }, 400)
  }

  // --- one date stops being exceptional -----------------------------------
  if (payload.deleteOverride) {
    if (!DATE_PATTERN.test(payload.deleteOverride)) {
      return json({ ok: false, error: 'Invalid date' }, 400)
    }
    const { error } = await supabase
      .from('coach_availability_overrides')
      .delete()
      .eq('override_date', payload.deleteOverride)
    if (error) return json({ ok: false, error: error.message }, 400)
    return json({ ok: true, deletedOverride: payload.deleteOverride }, 200)
  }

  // --- one date does something other than its weekday ---------------------
  if (payload.override) {
    const { date, closed, hours, note } = payload.override
    if (!date || !DATE_PATTERN.test(date)) {
      return json({ ok: false, error: 'Invalid date' }, 400)
    }
    const isClosed = Boolean(closed)
    const row = {
      override_date: date,
      closed: isClosed,
      // A closed day keeps no hours, so reopening it later cannot silently
      // restore a set she last saw months ago.
      hours: isClosed ? [] : cleanHours(hours),
      note: note?.trim() || null,
    }
    if (!isClosed && row.hours.length === 0) {
      return json({ ok: false, error: 'An open day needs at least one hour' }, 400)
    }
    const { data, error } = await supabase
      .from('coach_availability_overrides')
      .upsert(row, { onConflict: 'override_date' })
      .select()
      .single()
    if (error) return json({ ok: false, error: error.message }, 400)
    return json({ ok: true, override: data }, 200)
  }

  // --- the standing week --------------------------------------------------
  if (payload.standing && typeof payload.standing === 'object') {
    const rows: { weekday: number; hour: number }[] = []
    for (const [key, value] of Object.entries(payload.standing)) {
      const weekday = Number(key)
      if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6) {
        return json({ ok: false, error: `Invalid weekday: ${key}` }, 400)
      }
      for (const hour of cleanHours(value)) rows.push({ weekday, hour })
    }

    // Replace rather than merge: the editor sends the whole week, so a row the
    // payload no longer carries is an hour she just took off the grid. The
    // delete and the insert are two statements, so a reader between them sees
    // an empty week — acceptable for a table one person edits by hand, and the
    // alternative (a transaction) is not reachable through PostgREST.
    const { error: clearError } = await supabase
      .from('coach_availability')
      .delete()
      .gte('weekday', 0)
    if (clearError) return json({ ok: false, error: clearError.message }, 400)

    if (rows.length) {
      const { error: insertError } = await supabase.from('coach_availability').insert(rows)
      if (insertError) return json({ ok: false, error: insertError.message }, 400)
    }
    return json({ ok: true, standingHours: rows.length }, 200)
  }

  return json({ ok: false, error: 'Nothing to update' }, 400)
})

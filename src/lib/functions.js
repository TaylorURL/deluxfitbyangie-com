import { supabase } from '@/config/supabase'

/**
 * EDGE-FUNCTION HELPERS — the shared invoke + signed-URL plumbing behind the
 * portal and admin data layers. Every privileged write goes through a
 * service-role edge function; these wrap the two shapes those calls repeat.
 */

/**
 * Invoke an edge function and unwrap its `{ ok, error, ... }` envelope. Throws a
 * clean Error on transport failure or an `ok: false` body, surfacing the
 * function's JSON error message when it sends one. Returns the raw data object
 * on success.
 *
 * @param {string} name - the edge function name (e.g. 'log-progress')
 * @param {unknown} body - the request body (JSON or FormData)
 * @param {string} [fallbackMessage] - error text when the server sends none
 */
export async function invokeOk(name, body, fallbackMessage = `${name} failed`) {
  const { data, error } = await supabase.functions.invoke(name, { body })
  if (error) {
    // Surface the function's JSON error body when present.
    try {
      const parsed = await error.context?.json?.()
      if (parsed?.error) throw new Error(parsed.error)
    } catch (inner) {
      if (inner instanceof Error && inner.message) throw inner
    }
    throw new Error(error.message || fallbackMessage)
  }
  if (data?.ok === false) throw new Error(data.error || fallbackMessage)
  return data
}

/**
 * Resolve a short-lived signed URL for a private storage object via the
 * `signed-url` edge function, which authorizes the caller before signing.
 * Returns null on any failure so callers can degrade gracefully.
 */
export async function resolveSignedUrl(bucket, path) {
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

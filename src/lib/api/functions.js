import { supabase } from '@/config/supabase'

/**
 * EDGE-FUNCTION HELPERS — the shared invoke + signed-URL plumbing behind the
 * portal and admin data layers. Every privileged write goes through a
 * service-role edge function; these wrap the two shapes those calls repeat.
 */

/**
 * A request that never got an answer: the connection died before the function
 * could reply, or before the body finished going up. The server wrote nothing,
 * because it was never reached.
 *
 * The SDK reports this as a `FunctionsFetchError` reading "Failed to send a
 * request to the Edge Function", which is a sentence about our plumbing rather
 * than about the thing the person was doing, so it is replaced here.
 */
export class ConnectionLostError extends Error {
  constructor() {
    super('The connection dropped before this finished sending. Nothing was saved — try again.')
    this.name = 'ConnectionLostError'
  }
}

/** True when a request never reached the server, so repeating it is safe. */
export function isConnectionLost(error) {
  return error instanceof ConnectionLostError
}

/**
 * @param {string} name - the edge function name (e.g. 'log-progress')
 * @param {unknown} body - the request body (JSON or FormData)
 * @param {string} [fallbackMessage] - error text when the server sends none
 */
export async function invokeOk(name, body, fallbackMessage = `${name} failed`) {
  const { data, error } = await supabase.functions.invoke(name, { body })
  if (error) {
    if (error.name === 'FunctionsFetchError') throw new ConnectionLostError()
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

/*
 * Backs the application, contact and booking forms. Nothing here reaches a
 * server yet: the only live backend integration is the `deluxfit-intake` edge
 * function, which takes FormData with a file attached and so can't carry these
 * JSON payloads.
 *
 * Until an endpoint exists this simulates a successful submit, which keeps the
 * whole funnel clickable end-to-end but means real submissions are dropped on
 * the floor. Anything relying on these forms actually delivering is broken
 * until FORM_ENDPOINT is set.
 */

/**
 * Point at a real endpoint URL (or a Supabase function URL) to start
 * delivering submissions. While `null`, nothing leaves the browser.
 */
export const FORM_ENDPOINT = null

const ARTIFICIAL_LATENCY_MS = 650

/**
 * @param {string} formKey - short identifier for which form is submitting
 *   (e.g. 'online-coaching-application', 'one-on-one-booking', 'contact')
 * @param {Record<string, unknown>} payload - the captured form values
 */
export async function submitForm(formKey, payload) {
  const body = {
    formKey,
    submittedAt: new Date().toISOString(),
    payload,
  }

  if (!FORM_ENDPOINT) {
    if (typeof console !== 'undefined') {
      console.info(`[deluxfit] ${formKey} submission (no endpoint configured)`, body)
    }
    await new Promise(resolve => setTimeout(resolve, ARTIFICIAL_LATENCY_MS))
    return { ok: true, simulated: true }
  }

  const response = await fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`Submission failed (${response.status})`)
  }

  return response.json().catch(() => ({ ok: true }))
}

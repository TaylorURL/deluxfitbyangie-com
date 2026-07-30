/*
 * Backs the application, contact and booking forms. While FORM_ENDPOINT is
 * null nothing leaves the browser: submit() waits out a short delay and
 * resolves as if it succeeded, so the funnel stays clickable end-to-end but
 * every submission is dropped. Treat these forms as non-delivering until an
 * endpoint is set.
 *
 * `deluxfit-intake` is not that endpoint — it takes FormData with a file
 * attached and cannot carry these JSON payloads.
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

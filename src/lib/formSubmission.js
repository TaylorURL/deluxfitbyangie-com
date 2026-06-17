/* =============================================================================
   FORM SUBMISSION — stub helper for the application + contact + booking forms
   -----------------------------------------------------------------------------
   The DeluxFit funnel currently has ONE production backend integration: the
   `deluxfit-intake` Supabase edge function, which only accepts FormData with a
   file. There is no live JSON endpoint for marketing form submissions yet.

   ⚠️  TODO — POINT THESE FORMS AT A REAL ENDPOINT.
   When the backend is ready, replace `FORM_ENDPOINT` below with the production
   URL (or a Supabase edge function name + supabase.functions.invoke) and the
   forms across the site will start delivering submissions. Until then, this
   helper simulates a successful submit so the UI flows end-to-end.
   ========================================================================== */

/**
 * Set to a real endpoint URL (e.g. `/api/intake` or a Supabase function URL)
 * to start delivering submissions. While `null`, submissions are accepted
 * locally without leaving the browser.
 */
export const FORM_ENDPOINT = null

const ARTIFICIAL_LATENCY_MS = 650

/**
 * Submit a form payload. Returns a promise that resolves once the submission
 * has been accepted (or rejects with an Error on transport failure).
 *
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
    // TODO: wire to backend. See the comment block above.
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

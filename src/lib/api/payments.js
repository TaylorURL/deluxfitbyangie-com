import { supabase } from '@/config/supabase'

/**
 * The browser never talks to Stripe directly. It invokes the edge function,
 * which owns the secret key and price IDs. When Stripe keys are missing the
 * function returns `{ configured: false }` — we surface that honestly instead
 * of faking a charge.
 *
 * @typedef {'membership'|'coaching'|'single_session'|'live_program'} CheckoutProduct
 */

/**
 * @param {CheckoutProduct} product
 * @param {{ quantity?: number, bookingId?: string }} [options]
 * @returns {Promise<{ status: 'redirecting' } | { status: 'unconfigured', message: string }>}
 * @throws {Error} when the checkout call fails for a reason other than missing config
 */
export async function startCheckout(product, { quantity, bookingId } = {}) {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const { data, error } = await supabase.functions.invoke('create-checkout', {
    body: {
      product,
      quantity,
      bookingId,
      successUrl: `${origin}/portal?checkout=success`,
      cancelUrl: `${origin}/portal?checkout=cancelled`,
    },
  })

  if (error) throw new Error(error.message || 'Checkout is unavailable right now.')

  if (data?.configured === false) {
    return { status: 'unconfigured', message: data.message || 'Payments are not configured yet.' }
  }
  if (data?.url) {
    window.location.href = data.url
    return { status: 'redirecting' }
  }
  throw new Error(data?.error || 'Checkout did not return a payment link.')
}

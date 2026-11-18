// deno-lint-ignore-file no-explicit-any -- Stripe objects arrive as untyped JSON.
// promo-codes
// POST { action: 'list' }
// POST { action: 'create', code, offer, percentOff?, product, lastDay, newClientsOnly? }
// POST { action: 'turn-off', id }
// Auth REQUIRED + staff only.
//
// The codes a buyer types into the promotion-code field on Stripe Checkout,
// which create-checkout shows on every session. Each code is a Stripe
// promotion code on a coupon of its own, so Stripe stays the only record of
// what a code gives and how often it has been used; nothing is mirrored here.
//
//   offer ∈ { 'first_month_free', 'percent_first_month', 'percent_every_month' }
//     first_month_free     -> 100% off, duration once: the first invoice is $0,
//                             and the card taken at checkout is billed from the
//                             second month on.
//     percent_first_month  -> percentOff% off, duration once.
//     percent_every_month  -> percentOff% off, duration forever, so it rides
//                             every renewal (a standing rate for one client).
//   product ∈ { 'membership', 'coaching' } — the coupon applies to that
//     product only, read off the STRIPE_PRICE_* price create-checkout sells.
//   lastDay — YYYY-MM-DD, the last day the code can be redeemed, Houston time.
//     It stops working at midnight that night.
//   newClientsOnly — Stripe refuses the code to a customer who has paid before.
//
// Turning a code off stops new redemptions. A subscription that already used
// it keeps the discount it was given.

import { corsHeaders, json } from '../_shared/cors.ts'
import { requireStaff, serviceClient } from '../_shared/auth.ts'

// Pinned so the shape of a promotion code (its `coupon`, its `restrictions`)
// does not move under this function when the account's default version does.
const STRIPE_VERSION = '2024-06-20'
const ZONE = 'America/Chicago'

const PRODUCTS: Record<string, { env: string; label: string }> = {
  membership: { env: 'STRIPE_PRICE_MEMBERSHIP', label: 'Membership' },
  coaching: { env: 'STRIPE_PRICE_COACHING', label: 'Coaching' },
}

const OFFERS = ['first_month_free', 'percent_first_month', 'percent_every_month']

const CODE_PATTERN = /^[A-Z0-9]{3,20}$/
const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const MAX_DAYS_AHEAD = 730

type StripeResult = { ok: boolean; status: number; body: Record<string, any> }

async function stripe(
  secret: string,
  method: 'GET' | 'POST' | 'DELETE',
  path: string,
  params?: URLSearchParams
): Promise<StripeResult> {
  const query = method === 'GET' && params ? `?${params.toString()}` : ''
  const res = await fetch(`https://api.stripe.com/v1/${path}${query}`, {
    method,
    headers: {
      Authorization: `Bearer ${secret}`,
      'Stripe-Version': STRIPE_VERSION,
      ...(method === 'POST' ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
    },
    body: method === 'POST' ? (params ?? new URLSearchParams()).toString() : undefined,
  })
  const body = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, body }
}

/** The day an instant falls on in Houston, as YYYY-MM-DD. */
function zoneDay(seconds: number): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(seconds * 1000))
}

/**
 * The instant Houston's midnight ends `day`, in Stripe's seconds. Midnight
 * there is 05:00 or 06:00 UTC depending on daylight saving, so both are tried
 * and the one that reads as midnight wins.
 */
function endOfZoneDay(day: string): number {
  const [y, m, d] = day.split('-').map(Number)
  const hourIn = new Intl.DateTimeFormat('en-US', {
    timeZone: ZONE,
    hour: '2-digit',
    hourCycle: 'h23',
  })
  for (const utcHour of [5, 6]) {
    const instant = Date.UTC(y, m - 1, d + 1, utcHour)
    if (hourIn.format(new Date(instant)) === '00') return instant / 1000
  }
  return Date.UTC(y, m - 1, d + 1, 6) / 1000
}

/** The Stripe product each of our products sells, read off its price. */
async function productIds(secret: string): Promise<Record<string, string>> {
  const ids: Record<string, string> = {}
  await Promise.all(
    Object.entries(PRODUCTS).map(async ([key, { env }]) => {
      const priceId = Deno.env.get(env)
      if (!priceId) return
      const res = await stripe(secret, 'GET', `prices/${encodeURIComponent(priceId)}`)
      const product = res.body?.product
      if (res.ok && product) ids[key] = typeof product === 'string' ? product : product.id
    })
  )
  return ids
}

function offerLabel(coupon: Record<string, any>): string {
  const percent = coupon?.percent_off
  const amount = coupon?.amount_off
  const off =
    percent != null
      ? `${Number(percent)}% off`
      : amount != null
        ? `$${(amount / 100).toFixed(2)} off`
        : 'A discount'
  if (percent === 100 && coupon?.duration === 'once') return 'First month free'
  if (coupon?.duration === 'once') return `${off} the first month`
  if (coupon?.duration === 'forever') return `${off} every month`
  if (coupon?.duration === 'repeating') {
    return `${off} for ${coupon.duration_in_months} months`
  }
  return off
}

function describe(promo: Record<string, any>, products: Record<string, string>) {
  const coupon = promo.coupon ?? {}
  const now = Math.floor(Date.now() / 1000)
  const expired = promo.expires_at != null && promo.expires_at <= now
  const status = !promo.active || coupon.valid === false ? 'off' : expired ? 'expired' : 'active'
  const applies: string[] = coupon.applies_to?.products ?? []
  const labels = Object.entries(products)
    .filter(([, id]) => applies.includes(id))
    .map(([key]) => PRODUCTS[key].label)
  return {
    id: promo.id,
    code: promo.code,
    status,
    offer: offerLabel(coupon),
    appliesTo: applies.length === 0 ? 'Everything' : labels.join(', ') || 'Another product',
    // The last day it works, which is the day before the midnight it stops.
    lastDay: promo.expires_at != null ? zoneDay(promo.expires_at - 1) : null,
    timesRedeemed: promo.times_redeemed ?? 0,
    newClientsOnly: Boolean(promo.restrictions?.first_time_transaction),
    created: promo.created ?? null,
  }
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405)

  const supabase = serviceClient()
  const auth = await requireStaff(req, supabase)
  if (auth.error) return json({ ok: false, error: auth.error }, auth.status)
  const staffId = auth.user?.id ?? ''

  const secret = Deno.env.get('STRIPE_SECRET_KEY')
  if (!secret) return json({ ok: false, error: 'Stripe is not connected yet.' }, 503)

  let payload: {
    action?: string
    id?: string
    code?: string
    offer?: string
    percentOff?: number | string
    product?: string
    lastDay?: string
    newClientsOnly?: boolean
  }
  try {
    payload = await req.json()
  } catch {
    return json({ ok: false, error: 'Invalid JSON body' }, 400)
  }

  if (payload.action === 'list') {
    const params = new URLSearchParams()
    params.set('limit', '100')
    params.append('expand[]', 'data.coupon.applies_to')
    const [res, products] = await Promise.all([
      stripe(secret, 'GET', 'promotion_codes', params),
      productIds(secret),
    ])
    if (!res.ok) {
      return json({ ok: false, error: res.body?.error?.message ?? 'Stripe error' }, 502)
    }
    const codes = (res.body.data ?? []).map((promo: Record<string, any>) =>
      describe(promo, products)
    )
    return json({ ok: true, codes }, 200)
  }

  if (payload.action === 'turn-off') {
    if (!payload.id || !/^promo_[A-Za-z0-9]+$/.test(payload.id)) {
      return json({ ok: false, error: 'Missing code id' }, 400)
    }
    const params = new URLSearchParams({ active: 'false' })
    params.append('expand[]', 'coupon.applies_to')
    const res = await stripe(secret, 'POST', `promotion_codes/${payload.id}`, params)
    if (!res.ok) {
      return json({ ok: false, error: res.body?.error?.message ?? 'Stripe error' }, 502)
    }
    return json({ ok: true, code: describe(res.body, await productIds(secret)) }, 200)
  }

  if (payload.action !== 'create') {
    return json({ ok: false, error: 'Unknown action' }, 400)
  }

  const code = String(payload.code ?? '')
    .trim()
    .toUpperCase()
  if (!CODE_PATTERN.test(code)) {
    return json(
      { ok: false, error: 'Use 3 to 20 letters and numbers for the code, with no spaces.' },
      400
    )
  }

  const offer = String(payload.offer ?? '')
  if (!OFFERS.includes(offer)) return json({ ok: false, error: 'Pick what the code gives.' }, 400)

  const percentOff = offer === 'first_month_free' ? 100 : Number(payload.percentOff)
  if (!Number.isInteger(percentOff) || percentOff < 1 || percentOff > 100) {
    return json({ ok: false, error: 'The discount has to be a whole number from 1 to 100.' }, 400)
  }

  const product = String(payload.product ?? '')
  if (!PRODUCTS[product]) return json({ ok: false, error: 'Pick what the code works on.' }, 400)

  const lastDay = String(payload.lastDay ?? '')
  if (!DAY_PATTERN.test(lastDay)) {
    return json({ ok: false, error: 'Pick the last day the code works.' }, 400)
  }
  const now = Math.floor(Date.now() / 1000)
  const expiresAt = endOfZoneDay(lastDay)
  if (lastDay < zoneDay(now)) {
    return json({ ok: false, error: 'The last day has already passed.' }, 400)
  }
  if (expiresAt - now > MAX_DAYS_AHEAD * 86400) {
    return json({ ok: false, error: 'Pick a last day within the next two years.' }, 400)
  }

  const products = await productIds(secret)
  const productId = products[product]
  if (!productId) {
    return json({ ok: false, error: `The ${PRODUCTS[product].label} price is not set up.` }, 503)
  }

  const duration = offer === 'percent_every_month' ? 'forever' : 'once'
  const name =
    offer === 'first_month_free'
      ? 'First month free'
      : duration === 'once'
        ? `${percentOff}% off the first month`
        : `${percentOff}% off every month`

  const couponParams = new URLSearchParams()
  couponParams.set('percent_off', String(percentOff))
  couponParams.set('duration', duration)
  couponParams.set('name', name)
  couponParams.set('applies_to[products][0]', productId)
  couponParams.set('metadata[code]', code)
  couponParams.set('metadata[created_by]', staffId)
  const coupon = await stripe(secret, 'POST', 'coupons', couponParams)
  if (!coupon.ok) {
    return json({ ok: false, error: coupon.body?.error?.message ?? 'Stripe error' }, 502)
  }

  const promoParams = new URLSearchParams()
  promoParams.set('coupon', coupon.body.id)
  promoParams.set('code', code)
  promoParams.set('expires_at', String(expiresAt))
  if (payload.newClientsOnly) promoParams.set('restrictions[first_time_transaction]', 'true')
  promoParams.set('metadata[created_by]', staffId)
  const promo = await stripe(secret, 'POST', 'promotion_codes', promoParams)
  if (!promo.ok) {
    // A coupon with no code on it can never be redeemed, so it goes rather
    // than sitting in the dashboard looking like a live offer.
    await stripe(secret, 'DELETE', `coupons/${coupon.body.id}`).catch(() => null)
    const message: string = promo.body?.error?.message ?? 'Stripe error'
    const taken = /already exists/i.test(message)
    return json(
      { ok: false, error: taken ? `${code} is already a live code. Pick another name.` : message },
      taken ? 409 : 502
    )
  }

  const issued = { ...coupon.body, applies_to: { products: [productId] } }
  return json({ ok: true, code: describe({ ...promo.body, coupon: issued }, products) }, 200)
})

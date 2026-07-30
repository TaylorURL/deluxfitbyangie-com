// create-checkout
// POST { product, quantity?, bookingId?, successUrl, cancelUrl }
//   product: 'membership' | 'coaching' | 'single_session' | 'live_program'
//
// Creates a Stripe Checkout Session via the Stripe REST API.
//   * membership / coaching  -> mode 'subscription'
//   * single_session / live_program -> mode 'payment'
//   * live_program uses `quantity` (number of sessions).
//
// If STRIPE_SECRET_KEY is missing, returns { configured:false } WITHOUT ever
// faking a charge.

import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders, json } from "../_shared/cors.ts";

// Each env var holds a Stripe price id; the ids live in the Stripe dashboard
// rather than here so pricing can change without a redeploy.
//   STRIPE_PRICE_MEMBERSHIP     -> $14.99/mo recurring
//   STRIPE_PRICE_COACHING       -> $150/mo recurring
//   STRIPE_PRICE_SINGLE_SESSION -> $75 one-off
//   STRIPE_PRICE_LIVE_PROGRAM   -> $50 one-off (quantity = number of sessions)
const PRICE_ENV: Record<string, { env: string; mode: "subscription" | "payment" }> = {
  membership:     { env: "STRIPE_PRICE_MEMBERSHIP",     mode: "subscription" },
  coaching:       { env: "STRIPE_PRICE_COACHING",       mode: "subscription" },
  single_session: { env: "STRIPE_PRICE_SINGLE_SESSION", mode: "payment" },
  live_program:   { env: "STRIPE_PRICE_LIVE_PROGRAM",   mode: "payment" },
};

// Stripe sends the customer to successUrl / cancelUrl after checkout, and both
// arrive in the request body, so they have to be pinned to origins we own.
// Without this an unrelated site can mint a genuine, DeluxFit-branded Checkout
// session that lands the payer on a page of its choosing once they have paid.
// Override ALLOWED_REDIRECT_ORIGINS (comma-separated) to authorise preview
// deployments or a different production domain.
const DEFAULT_REDIRECT_ORIGINS = [
  "https://deluxfitbyangie.com",
  "https://www.deluxfitbyangie.com",
  "http://localhost:5173",
];

const ALLOWED_REDIRECT_ORIGINS = (Deno.env.get("ALLOWED_REDIRECT_ORIGINS") ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const REDIRECT_ORIGINS = ALLOWED_REDIRECT_ORIGINS.length
  ? ALLOWED_REDIRECT_ORIGINS
  : DEFAULT_REDIRECT_ORIGINS;

/**
 * True when `value` is an absolute URL whose origin is one we own. Compares the
 * parsed origin rather than a string prefix, so a lookalike host such as
 * https://deluxfitbyangie.com.example.com is rejected.
 */
function isAllowedRedirect(value: unknown): boolean {
  if (typeof value !== "string") return false;
  try {
    return REDIRECT_ORIGINS.includes(new URL(value).origin);
  } catch {
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, 405);
  }

  let payload: {
    product?: string;
    quantity?: number;
    bookingId?: string;
    successUrl?: string;
    cancelUrl?: string;
  };
  try {
    payload = await req.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON body" }, 400);
  }

  const { product, quantity, bookingId, successUrl, cancelUrl } = payload;

  if (!product || !PRICE_ENV[product]) {
    return json({ ok: false, error: "Invalid or missing product" }, 400);
  }
  if (!successUrl || !cancelUrl) {
    return json({ ok: false, error: "Missing successUrl or cancelUrl" }, 400);
  }
  if (!isAllowedRedirect(successUrl) || !isAllowedRedirect(cancelUrl)) {
    return json({ ok: false, error: "Invalid redirect URL" }, 400);
  }

  const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeSecret) {
    // Never fake a charge: report that Stripe is unconfigured and let the
    // caller say so.
    return json(
      {
        configured: false,
        message: "Stripe not configured — set STRIPE_SECRET_KEY and price IDs.",
      },
      200,
    );
  }

  const { env: priceEnvName, mode } = PRICE_ENV[product];
  const priceId = Deno.env.get(priceEnvName);
  if (!priceId) {
    return json(
      { configured: false, message: `Missing price env ${priceEnvName}.` },
      200,
    );
  }

  // Optionally attach the calling user so the webhook can map the membership.
  let userId: string | null = null;
  let customerEmail: string | undefined;
  const authHeader = req.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );
    const { data } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (data?.user) {
      userId = data.user.id;
      customerEmail = data.user.email ?? undefined;
    }
  }

  // live_program is sold per-session; everything else is quantity 1.
  const lineQuantity =
    product === "live_program" ? Math.max(1, Number(quantity) || 1) : 1;

  // Stripe's REST API expects application/x-www-form-urlencoded.
  const form = new URLSearchParams();
  form.set("mode", mode);
  form.set("success_url", successUrl);
  form.set("cancel_url", cancelUrl);
  form.set("line_items[0][price]", priceId);
  form.set("line_items[0][quantity]", String(lineQuantity));
  if (customerEmail) form.set("customer_email", customerEmail);

  // Metadata so the webhook can resolve which membership / booking to update.
  form.set("metadata[product]", product);
  if (userId) form.set("metadata[user_id]", userId);
  if (bookingId) form.set("metadata[booking_id]", bookingId);
  // Propagate metadata onto the subscription itself for recurring products.
  if (mode === "subscription") {
    form.set("subscription_data[metadata][product]", product);
    if (userId) form.set("subscription_data[metadata][user_id]", userId);
  }

  const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });

  const session = await stripeRes.json();
  if (!stripeRes.ok) {
    return json(
      { ok: false, error: session?.error?.message ?? "Stripe error" },
      stripeRes.status,
    );
  }

  return json({ url: session.url }, 200);
});

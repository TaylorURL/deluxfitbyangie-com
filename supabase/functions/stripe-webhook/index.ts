// stripe-webhook
// POST (raw body). Verifies the Stripe-Signature header with Web Crypto
// (constructEvent-style HMAC SHA256) and upserts memberships rows in response to:
//   * checkout.session.completed
//   * customer.subscription.updated
//   * customer.subscription.deleted
//
// If STRIPE_WEBHOOK_SECRET is missing, returns { configured:false } (200).

import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders, json } from "../_shared/cors.ts";

// Fallback used only when the subscription carries no `product` metadata, so a
// subscription created outside the checkout flow still resolves to a product.
// Reads the same STRIPE_PRICE_* env vars create-checkout sends the customer to;
// point either function at a different price and this mapping goes silently
// null, which downstream reads as "not a membership".
function productFromPriceId(priceId?: string | null): string | null {
  if (!priceId) return null;
  if (priceId === Deno.env.get("STRIPE_PRICE_MEMBERSHIP")) return "membership";
  if (priceId === Deno.env.get("STRIPE_PRICE_COACHING")) return "coaching";
  return null;
}

// Map a Stripe subscription status to our memberships.status enum.
function mapStatus(stripeStatus?: string): string {
  switch (stripeStatus) {
    case "active":
    case "trialing":
      return "active";
    case "past_due":
    case "unpaid":
      return "past_due";
    case "canceled":
    case "incomplete_expired":
      return "canceled";
    default:
      return "incomplete";
  }
}

const encoder = new TextEncoder();

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Verify a Stripe webhook signature (constructEvent-style) using Web Crypto.
 * Returns the parsed event on success, or null on failure.
 */
async function verifyAndParse(
  payload: string,
  sigHeader: string | null,
  secret: string,
  toleranceSeconds = 300,
): Promise<Record<string, unknown> | null> {
  if (!sigHeader) return null;

  // Header format: "t=timestamp,v1=signature,v1=signature2,..."
  const parts = sigHeader.split(",").map((p) => p.trim());
  let timestamp = "";
  const signatures: string[] = [];
  for (const part of parts) {
    const [key, value] = part.split("=");
    if (key === "t") timestamp = value;
    else if (key === "v1") signatures.push(value);
  }
  if (!timestamp || signatures.length === 0) return null;

  // Reject events outside the tolerance window to guard against replay.
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - Number(timestamp)) > toleranceSeconds) return null;

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signedPayload = `${timestamp}.${payload}`;
  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(signedPayload));
  const expected = toHex(mac);

  const valid = signatures.some((sig) => timingSafeEqual(sig, expected));
  if (!valid) return null;

  try {
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, 405);
  }

  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!webhookSecret) {
    return json({ configured: false }, 200);
  }

  // Raw body is required for signature verification — read it as text.
  const rawBody = await req.text();
  const sigHeader = req.headers.get("Stripe-Signature");

  const event = await verifyAndParse(rawBody, sigHeader, webhookSecret);
  if (!event) {
    return json({ ok: false, error: "Invalid signature" }, 400);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  const type = event.type as string;
  const dataObject = (event.data as { object?: Record<string, unknown> })?.object ??
    {};

  try {
    if (type === "checkout.session.completed") {
      const session = dataObject;
      const metadata = (session.metadata as Record<string, string>) ?? {};
      const userId = metadata.user_id ?? null;
      const product = metadata.product ?? null;
      const mode = session.mode as string | undefined;

      // Only subscriptions create/refresh a membership row. One-off payments
      // (single_session / live_program) are tracked via bookings, not here.
      if (
        userId &&
        product &&
        (product === "membership" || product === "coaching") &&
        mode === "subscription"
      ) {
        await supabase
          .from("memberships")
          .upsert(
            {
              user_id: userId,
              product,
              status: "active",
              stripe_customer_id: (session.customer as string) ?? null,
              stripe_subscription_id: (session.subscription as string) ?? null,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id,product" },
          );
      }
    } else if (
      type === "customer.subscription.updated" ||
      type === "customer.subscription.deleted"
    ) {
      const sub = dataObject;
      const metadata = (sub.metadata as Record<string, string>) ?? {};
      const items = (sub.items as { data?: Array<{ price?: { id?: string } }> })
        ?.data ?? [];
      const priceId = items[0]?.price?.id ?? null;

      const product = metadata.product ?? productFromPriceId(priceId);
      const userId = metadata.user_id ?? null;
      const status =
        type === "customer.subscription.deleted"
          ? "canceled"
          : mapStatus(sub.status as string);

      const periodEnd = sub.current_period_end
        ? new Date((sub.current_period_end as number) * 1000).toISOString()
        : null;

      // Prefer matching by stripe_subscription_id; fall back to user_id+product.
      const stripeSubId = sub.id as string;
      const update = {
        status,
        current_period_end: periodEnd,
        stripe_customer_id: (sub.customer as string) ?? null,
        updated_at: new Date().toISOString(),
      };

      const { data: bySub } = await supabase
        .from("memberships")
        .update(update)
        .eq("stripe_subscription_id", stripeSubId)
        .select("id");

      if ((!bySub || bySub.length === 0) && userId && product) {
        await supabase
          .from("memberships")
          .upsert(
            {
              user_id: userId,
              product,
              stripe_subscription_id: stripeSubId,
              ...update,
            },
            { onConflict: "user_id,product" },
          );
      }
    }
  } catch (e) {
    // Log and still 200 so Stripe does not hammer retries on a transient error
    // we have already recorded; surface the message for debugging.
    console.error("stripe-webhook handler error:", e);
    return json({ received: true, warning: String(e) }, 200);
  }

  return json({ received: true }, 200);
});

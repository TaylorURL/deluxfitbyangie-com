// update-membership
// POST { userId, product, status, currentPeriodEnd?, delete? }
// Auth REQUIRED + staff only. Lets Angie manually manage a client's
// subscription state (the Stripe webhook handles automated changes; this is the
// manual override). Upserts on (user_id, product).
//   product ∈ { 'membership', 'coaching' }
//   status  ∈ { 'active', 'canceled', 'past_due', 'incomplete' }

import { corsHeaders, json } from "../_shared/cors.ts";
import { requireStaff, serviceClient } from "../_shared/auth.ts";

const PRODUCTS = ["membership", "coaching"];
const STATUSES = ["active", "canceled", "past_due", "incomplete"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);

  const supabase = serviceClient();
  const auth = await requireStaff(req, supabase);
  if (auth.error) return json({ ok: false, error: auth.error }, auth.status);

  let payload: {
    userId?: string;
    product?: string;
    status?: string;
    currentPeriodEnd?: string;
    delete?: boolean;
  };
  try {
    payload = await req.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON body" }, 400);
  }

  const { userId, product } = payload;
  if (!userId) return json({ ok: false, error: "Missing userId" }, 400);
  if (!product || !PRODUCTS.includes(product)) {
    return json({ ok: false, error: "Invalid product" }, 400);
  }

  if (payload.delete) {
    const { error } = await supabase
      .from("memberships")
      .delete()
      .eq("user_id", userId)
      .eq("product", product);
    if (error) return json({ ok: false, error: error.message }, 400);
    return json({ ok: true, deleted: { userId, product } }, 200);
  }

  if (!payload.status || !STATUSES.includes(payload.status)) {
    return json({ ok: false, error: "Invalid status" }, 400);
  }

  const { data, error } = await supabase
    .from("memberships")
    .upsert(
      {
        user_id: userId,
        product,
        status: payload.status,
        current_period_end: payload.currentPeriodEnd ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,product" },
    )
    .select()
    .single();

  if (error) return json({ ok: false, error: error.message }, 400);
  return json({ ok: true, membership: data }, 200);
});

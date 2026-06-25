// update-booking
// POST { id, status }
// Auth REQUIRED + staff only. Lets Angie confirm or cancel a booking from the
// admin panel. status ∈ { 'pending', 'confirmed', 'canceled' }.

import { corsHeaders, json } from "../_shared/cors.ts";
import { requireStaff, serviceClient } from "../_shared/auth.ts";

const STATUSES = ["pending", "confirmed", "canceled"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);

  const supabase = serviceClient();
  const auth = await requireStaff(req, supabase);
  if (auth.error) return json({ ok: false, error: auth.error }, auth.status);

  let payload: { id?: string; status?: string };
  try {
    payload = await req.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON body" }, 400);
  }

  if (!payload.id) return json({ ok: false, error: "Missing id" }, 400);
  if (!payload.status || !STATUSES.includes(payload.status)) {
    return json({ ok: false, error: "Invalid status" }, 400);
  }

  const { data, error } = await supabase
    .from("bookings")
    .update({ status: payload.status })
    .eq("id", payload.id)
    .select()
    .single();

  if (error) return json({ ok: false, error: error.message }, 400);
  return json({ ok: true, booking: data }, 200);
});

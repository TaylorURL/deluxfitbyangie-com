// create-booking
// POST { service, slotStart (ISO), trainingFocus, fitnessGoal, guestName?, guestEmail? }
// Auth optional: if a valid bearer token is present, the booking is attached to
// that user. Computes slot_end = slotStart + 60min. The bookings table has a
// partial unique index preventing double-booking; a 23505 conflict -> 409.

import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders, json } from "../_shared/cors.ts";

const SLOT_MINUTES = 60;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  let payload: {
    service?: string;
    slotStart?: string;
    trainingFocus?: string;
    fitnessGoal?: string;
    guestName?: string;
    guestEmail?: string;
  };
  try {
    payload = await req.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON body" }, 400);
  }

  const { service, slotStart, trainingFocus, fitnessGoal, guestName, guestEmail } =
    payload;

  if (!service || !["single_session", "live_program"].includes(service)) {
    return json({ ok: false, error: "Invalid or missing service" }, 400);
  }
  if (!slotStart) {
    return json({ ok: false, error: "Missing slotStart" }, 400);
  }

  const start = new Date(slotStart);
  if (Number.isNaN(start.getTime())) {
    return json({ ok: false, error: "Invalid slotStart" }, 400);
  }
  const end = new Date(start.getTime() + SLOT_MINUTES * 60 * 1000);

  // Auth is optional — attach the user_id when a valid bearer is supplied.
  let userId: string | null = null;
  const authHeader = req.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const jwt = authHeader.replace("Bearer ", "");
    const { data } = await supabase.auth.getUser(jwt);
    if (data?.user) userId = data.user.id;
  }

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      user_id: userId,
      guest_name: guestName ?? null,
      guest_email: guestEmail ?? null,
      service,
      slot_start: start.toISOString(),
      slot_end: end.toISOString(),
      training_focus: trainingFocus ?? null,
      fitness_goal: fitnessGoal ?? null,
      status: "confirmed",
    })
    .select()
    .single();

  if (error) {
    // 23505 = unique_violation -> the partial unique index rejected a double-book.
    if (error.code === "23505") {
      return json(
        { ok: false, code: "slot_taken", error: "That time slot is already booked." },
        409,
      );
    }
    return json({ ok: false, error: error.message }, 400);
  }

  // Confirmation mail is opt-in per environment: with no key the booking still
  // succeeds and the guest simply gets no email.
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (resendKey) {
    const to = guestEmail ?? booking?.guest_email;
    if (to) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Resend rejects a send unless this domain is verified on the account
            // the API key belongs to.
            from: "DeluxFit by Angie <bookings@deluxfitbyangie.com>",
            to,
            subject: "Your DeluxFit session is confirmed",
            html: `<p>Hi ${guestName ?? "there"}, your ${service.replace(
              "_",
              " ",
            )} on ${start.toUTCString()} is confirmed.</p>`,
          }),
        });
      } catch (_e) {
        // Non-fatal: the booking succeeded even if the email send fails.
      }
    }
  }

  return json({ ok: true, booking }, 200);
});

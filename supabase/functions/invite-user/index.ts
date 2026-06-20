// invite-user
// POST { email, fullName?, role }   role ∈ {'client','staff'}
// Auth REQUIRED. The caller's profile must have role='staff'. Only staff may
// grant role='staff'. Sends a Supabase Auth invite email (admin API) with
// raw_user_meta_data.role pre-populated, so the handle_new_user() trigger
// stamps the new profile with the correct role on first sign-in.

import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders, json } from "../_shared/cors.ts";

type Payload = {
  email?: string;
  fullName?: string;
  role?: "client" | "staff";
};

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

  // Caller must be authenticated.
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return json({ ok: false, error: "Unauthorized" }, 401);
  }
  const jwt = authHeader.replace("Bearer ", "");
  const { data: userData, error: userError } = await supabase.auth.getUser(jwt);
  if (userError || !userData?.user) {
    return json({ ok: false, error: "Unauthorized" }, 401);
  }
  const callerId = userData.user.id;

  // Caller must have role='staff' on their profile.
  const { data: callerProfile, error: callerProfileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", callerId)
    .maybeSingle();
  if (callerProfileError) {
    return json({ ok: false, error: callerProfileError.message }, 500);
  }
  if (!callerProfile || callerProfile.role !== "staff") {
    return json({ ok: false, error: "Forbidden: staff only" }, 403);
  }

  let payload: Payload;
  try {
    payload = await req.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON body" }, 400);
  }

  const email = payload.email?.trim().toLowerCase();
  const fullName = payload.fullName?.trim() || null;
  const role = payload.role;

  if (!email || !email.includes("@")) {
    return json({ ok: false, error: "Valid email required" }, 400);
  }
  if (role !== "client" && role !== "staff") {
    return json({ ok: false, error: "Role must be 'client' or 'staff'" }, 400);
  }
  // (Currently redundant since callers are already staff, but kept explicit so
  // tightening caller eligibility later doesn't accidentally allow non-staff
  // to grant staff.)
  if (role === "staff" && callerProfile.role !== "staff") {
    return json(
      { ok: false, error: "Only staff may grant the 'staff' role" },
      403,
    );
  }

  // Optional redirect target. Falls back to the request origin's reset page so
  // the invitee lands on the password-set screen after clicking the email.
  const origin = req.headers.get("Origin") ?? new URL(req.url).origin;
  const redirectTo = `${origin}/update-password`;

  const { data: invited, error: inviteError } = await supabase.auth.admin
    .inviteUserByEmail(email, {
      data: {
        full_name: fullName,
        role,
      },
      redirectTo,
    });

  if (inviteError) {
    return json({ ok: false, error: inviteError.message }, 400);
  }

  return json({
    ok: true,
    user: {
      id: invited?.user?.id,
      email: invited?.user?.email,
      role,
    },
  }, 200);
});

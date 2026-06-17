// log-progress
// POST { entryDate, weight?, bodyFat?, notes?, photoPath? }
// Auth REQUIRED. Inserts a progress_entries row for the calling user.

import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders, json } from "../_shared/cors.ts";

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

  // Auth required.
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return json({ ok: false, error: "Unauthorized" }, 401);
  }
  const jwt = authHeader.replace("Bearer ", "");
  const { data: userData, error: userError } = await supabase.auth.getUser(jwt);
  if (userError || !userData?.user) {
    return json({ ok: false, error: "Unauthorized" }, 401);
  }
  const userId = userData.user.id;

  let payload: {
    entryDate?: string;
    weight?: number;
    bodyFat?: number;
    notes?: string;
    photoPath?: string;
  };
  try {
    payload = await req.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON body" }, 400);
  }

  const { entryDate, weight, bodyFat, notes, photoPath } = payload;
  if (!entryDate) {
    return json({ ok: false, error: "Missing entryDate" }, 400);
  }

  const { data: entry, error } = await supabase
    .from("progress_entries")
    .insert({
      user_id: userId,
      entry_date: entryDate,
      weight: weight ?? null,
      body_fat: bodyFat ?? null,
      notes: notes ?? null,
      photo_path: photoPath ?? null,
    })
    .select()
    .single();

  if (error) {
    return json({ ok: false, error: error.message }, 400);
  }

  return json({ ok: true, entry }, 200);
});

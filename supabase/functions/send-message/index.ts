// send-message
// POST { body, attachmentPath? }
// Auth REQUIRED. Upserts the caller's conversation (one per user) then inserts a
// message with sender='client'.

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

  let payload: { body?: string; attachmentPath?: string };
  try {
    payload = await req.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON body" }, 400);
  }

  const { body, attachmentPath } = payload;
  if (!body && !attachmentPath) {
    return json({ ok: false, error: "Message body or attachment required" }, 400);
  }

  // Upsert the conversation (user_id is unique). Use the existing one if present.
  let conversationId: string | undefined;
  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    conversationId = existing.id;
  } else {
    const { data: created, error: convError } = await supabase
      .from("conversations")
      .insert({ user_id: userId })
      .select("id")
      .single();
    if (convError || !created) {
      return json(
        { ok: false, error: convError?.message ?? "Failed to create conversation" },
        400,
      );
    }
    conversationId = created.id;
  }

  const { data: message, error: msgError } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender: "client",
      body: body ?? null,
      attachment_path: attachmentPath ?? null,
    })
    .select()
    .single();

  if (msgError) {
    return json({ ok: false, error: msgError.message }, 400);
  }

  return json({ ok: true, message }, 200);
});

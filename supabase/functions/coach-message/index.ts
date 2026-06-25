// coach-message
// POST { userId, body?, attachmentPath?, attachmentBucket? }
// Auth REQUIRED + staff only. Inserts a message with sender='coach' into the
// target client's conversation (creating it if needed). Coach attachments live
// in the private `library-media` bucket (uploaded via `upload-media`); the
// client reads them through `signed-url`.

import { corsHeaders, json } from "../_shared/cors.ts";
import { requireStaff, serviceClient } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);

  const supabase = serviceClient();
  const auth = await requireStaff(req, supabase);
  if (auth.error) return json({ ok: false, error: auth.error }, auth.status);

  let payload: {
    userId?: string;
    body?: string;
    attachmentPath?: string;
    attachmentBucket?: string;
  };
  try {
    payload = await req.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON body" }, 400);
  }

  const { userId, body, attachmentPath } = payload;
  if (!userId) return json({ ok: false, error: "Missing userId" }, 400);
  if (!body?.trim() && !attachmentPath) {
    return json({ ok: false, error: "Message body or attachment required" }, 400);
  }
  const attachmentBucket = payload.attachmentBucket === "library-media"
    ? "library-media"
    : "message-attachments";

  // Upsert the client's conversation (user_id is unique).
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
      return json({ ok: false, error: convError?.message ?? "Failed to create conversation" }, 400);
    }
    conversationId = created.id;
  }

  const { data: message, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender: "coach",
      body: body?.trim() || null,
      attachment_path: attachmentPath ?? null,
      attachment_bucket: attachmentBucket,
    })
    .select()
    .single();

  if (error) return json({ ok: false, error: error.message }, 400);
  return json({ ok: true, message }, 200);
});

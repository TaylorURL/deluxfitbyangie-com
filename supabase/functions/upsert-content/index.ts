// upsert-content
// POST { id?, title, description?, category, mediaType, url?, mediaPath?,
//        accessLevel?, locale?, sort?, assignedUserIds?, delete? }
// Auth REQUIRED + staff only. Creates / updates / deletes a library item and
// syncs its per-client assignments. `mediaPath` is a key in the private
// `library-media` bucket (uploaded via `upload-media`); `url` is an external
// link. One of the two should be set.

import { corsHeaders, json } from "../_shared/cors.ts";
import { requireStaff, serviceClient } from "../_shared/auth.ts";

const CATEGORIES = ["workout", "nutrition", "education"];
const MEDIA_TYPES = ["video", "article", "pdf"];
const ACCESS_LEVELS = ["public", "membership", "coaching"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);

  const supabase = serviceClient();
  const auth = await requireStaff(req, supabase);
  if (auth.error) return json({ ok: false, error: auth.error }, auth.status);

  let payload: {
    id?: string;
    title?: string;
    description?: string;
    category?: string;
    mediaType?: string;
    url?: string;
    mediaPath?: string;
    accessLevel?: string;
    locale?: string;
    sort?: number;
    assignedUserIds?: string[];
    delete?: boolean;
  };
  try {
    payload = await req.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON body" }, 400);
  }

  if (payload.delete) {
    if (!payload.id) return json({ ok: false, error: "Missing id" }, 400);
    // content_assignments cascade-delete via the FK.
    const { error } = await supabase.from("content_items").delete().eq("id", payload.id);
    if (error) return json({ ok: false, error: error.message }, 400);
    return json({ ok: true, deleted: payload.id }, 200);
  }

  if (!payload.title?.trim()) return json({ ok: false, error: "Missing title" }, 400);
  if (!payload.category || !CATEGORIES.includes(payload.category)) {
    return json({ ok: false, error: "Invalid category" }, 400);
  }
  if (!payload.mediaType || !MEDIA_TYPES.includes(payload.mediaType)) {
    return json({ ok: false, error: "Invalid mediaType" }, 400);
  }
  const accessLevel = ACCESS_LEVELS.includes(payload.accessLevel ?? "")
    ? payload.accessLevel
    : "coaching";

  const row = {
    title: payload.title.trim(),
    description: payload.description ?? null,
    category: payload.category,
    media_type: payload.mediaType,
    url: payload.url ?? null,
    media_path: payload.mediaPath ?? null,
    access_level: accessLevel,
    locale: payload.locale || "en",
    sort: Number.isFinite(payload.sort) ? payload.sort : 0,
  };

  const query = payload.id
    ? supabase.from("content_items").update(row).eq("id", payload.id).select().single()
    : supabase.from("content_items").insert(row).select().single();

  const { data: item, error } = await query;
  if (error) return json({ ok: false, error: error.message }, 400);

  // Sync per-client assignments when the caller provides an explicit list.
  if (Array.isArray(payload.assignedUserIds)) {
    await supabase.from("content_assignments").delete().eq("content_id", item.id);
    const unique = [...new Set(payload.assignedUserIds.filter(Boolean))];
    if (unique.length) {
      const rows = unique.map((userId) => ({ content_id: item.id, user_id: userId }));
      const { error: assignError } = await supabase
        .from("content_assignments")
        .insert(rows);
      if (assignError) return json({ ok: false, error: assignError.message }, 400);
    }
  }

  return json({ ok: true, item }, 200);
});

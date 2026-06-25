// upsert-plan
// POST { id?, userId, title, summary?, status?, content?, delete? }
// Auth REQUIRED + staff only. Creates, updates, or deletes a client's workout
// program (a `plans` row). `content` is free-form JSON (e.g. { weeks: [...] }).

import { corsHeaders, json } from "../_shared/cors.ts";
import { requireStaff, serviceClient } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);

  const supabase = serviceClient();
  const auth = await requireStaff(req, supabase);
  if (auth.error) return json({ ok: false, error: auth.error }, auth.status);

  let payload: {
    id?: string;
    userId?: string;
    title?: string;
    summary?: string;
    status?: string;
    content?: unknown;
    delete?: boolean;
  };
  try {
    payload = await req.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON body" }, 400);
  }

  if (payload.delete) {
    if (!payload.id) return json({ ok: false, error: "Missing id" }, 400);
    const { error } = await supabase.from("plans").delete().eq("id", payload.id);
    if (error) return json({ ok: false, error: error.message }, 400);
    return json({ ok: true, deleted: payload.id }, 200);
  }

  if (!payload.userId) return json({ ok: false, error: "Missing userId" }, 400);
  if (!payload.title?.trim()) return json({ ok: false, error: "Missing title" }, 400);

  const row = {
    user_id: payload.userId,
    title: payload.title.trim(),
    summary: payload.summary ?? null,
    status: payload.status ?? "active",
    content: payload.content ?? {},
  };

  const query = payload.id
    ? supabase.from("plans").update(row).eq("id", payload.id).select().single()
    : supabase.from("plans").insert(row).select().single();

  const { data, error } = await query;
  if (error) return json({ ok: false, error: error.message }, 400);
  return json({ ok: true, plan: data }, 200);
});

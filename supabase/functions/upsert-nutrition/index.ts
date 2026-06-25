// upsert-nutrition
// POST { id?, userId, title?, calorieTarget?, proteinG?, carbsG?, fatG?,
//        mealStructure?, resources?, notes?, status?, delete? }
// Auth REQUIRED + staff only. Creates, updates, or deletes a client's
// personalized nutrition plan (a `nutrition_plans` row).
//   mealStructure: array of { meal, suggestion }
//   resources:     array of { label, url }

import { corsHeaders, json } from "../_shared/cors.ts";
import { requireStaff, serviceClient } from "../_shared/auth.ts";

const toInt = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n) : null;
};

const toArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

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
    calorieTarget?: number;
    proteinG?: number;
    carbsG?: number;
    fatG?: number;
    mealStructure?: unknown;
    resources?: unknown;
    notes?: string;
    status?: string;
    delete?: boolean;
  };
  try {
    payload = await req.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON body" }, 400);
  }

  if (payload.delete) {
    if (!payload.id) return json({ ok: false, error: "Missing id" }, 400);
    const { error } = await supabase.from("nutrition_plans").delete().eq("id", payload.id);
    if (error) return json({ ok: false, error: error.message }, 400);
    return json({ ok: true, deleted: payload.id }, 200);
  }

  if (!payload.userId) return json({ ok: false, error: "Missing userId" }, 400);

  const row = {
    user_id: payload.userId,
    title: payload.title?.trim() || "Nutrition guidance",
    calorie_target: toInt(payload.calorieTarget),
    protein_g: toInt(payload.proteinG),
    carbs_g: toInt(payload.carbsG),
    fat_g: toInt(payload.fatG),
    meal_structure: toArray(payload.mealStructure),
    resources: toArray(payload.resources),
    notes: payload.notes ?? null,
    status: payload.status === "archived" ? "archived" : "active",
    updated_at: new Date().toISOString(),
  };

  const query = payload.id
    ? supabase.from("nutrition_plans").update(row).eq("id", payload.id).select().single()
    : supabase.from("nutrition_plans").insert(row).select().single();

  const { data, error } = await query;
  if (error) return json({ ok: false, error: error.message }, 400);
  return json({ ok: true, plan: data }, 200);
});

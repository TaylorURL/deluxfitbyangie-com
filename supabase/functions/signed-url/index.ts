// signed-url
// POST { bucket, path }
// Auth REQUIRED. The single media-access broker for the portal. Returns a
// short-lived signed URL for a private object ONLY when the caller is allowed
// to see it:
//   * staff  → any object in a known bucket.
//   * client → their own upload (path under <uid>/), an attachment on a message
//              in their conversation, or content media assigned/entitled to them.
// This keeps the private buckets locked down while still letting clients view
// exactly what belongs to them — the storage analogue of the table RLS.

import { corsHeaders, json } from "../_shared/cors.ts";
import { requireUser, serviceClient } from "../_shared/auth.ts";

const KNOWN_BUCKETS = ["progress-photos", "message-attachments", "library-media"];
const EXPIRES_SECONDS = 60 * 30;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);

  const supabase = serviceClient();
  const auth = await requireUser(req, supabase);
  if (auth.error) return json({ ok: false, error: auth.error }, auth.status);
  const userId = auth.user.id;

  let payload: { bucket?: string; path?: string };
  try {
    payload = await req.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON body" }, 400);
  }

  const { bucket, path } = payload;
  if (!bucket || !KNOWN_BUCKETS.includes(bucket)) {
    return json({ ok: false, error: "Unknown bucket" }, 400);
  }
  if (!path) return json({ ok: false, error: "Missing path" }, 400);

  const allowed = await isAllowed(supabase, userId, bucket, path);
  if (!allowed) return json({ ok: false, error: "Forbidden" }, 403);

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, EXPIRES_SECONDS);
  if (error || !data?.signedUrl) {
    return json({ ok: false, error: error?.message ?? "Could not sign URL" }, 400);
  }
  return json({ ok: true, url: data.signedUrl }, 200);
});

async function isAllowed(
  supabase: ReturnType<typeof serviceClient>,
  userId: string,
  bucket: string,
  path: string,
): Promise<boolean> {
  // Staff may read any known-bucket object.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  if (profile?.role === "staff") return true;

  // A client's own upload lives under their <uid>/ folder.
  if (path.split("/")[0] === userId) return true;

  // An attachment on a message in the caller's own conversation.
  const { data: msg } = await supabase
    .from("messages")
    .select("id, conversations!inner(user_id)")
    .eq("attachment_path", path)
    .eq("attachment_bucket", bucket)
    .eq("conversations.user_id", userId)
    .limit(1)
    .maybeSingle();
  if (msg) return true;

  // Library media assigned to, or entitled by, the caller. content_items RLS
  // already encodes "can this user see this item", so query it with the
  // caller's identity rather than re-deriving entitlement here.
  const { data: item } = await supabase
    .from("content_items")
    .select("id, access_level")
    .eq("media_path", path)
    .maybeSingle();
  if (item) {
    if (item.access_level === "public") return true;
    const { data: assignment } = await supabase
      .from("content_assignments")
      .select("id")
      .eq("content_id", item.id)
      .eq("user_id", userId)
      .maybeSingle();
    if (assignment) return true;
    const { data: entitled } = await supabase.rpc("has_entitlement", {
      uid: userId,
      needed: item.access_level,
    });
    if (entitled === true) return true;
  }

  return false;
}

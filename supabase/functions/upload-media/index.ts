// upload-media
// POST multipart/form-data { file, prefix? }
// Auth REQUIRED + staff only. Uploads coach media (library videos, PDFs,
// message video feedback) to the private `library-media` bucket and returns its
// storage path. The path is then stored on a content_items.media_path or a
// messages.attachment_path and served to clients via `signed-url`.

import { corsHeaders, json } from "../_shared/cors.ts";
import { requireStaff, serviceClient } from "../_shared/auth.ts";

const BUCKET = "library-media";
const MAX_BYTES = 500 * 1024 * 1024;

function sanitize(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[^\w.\- ]+/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80) || "file";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);

  const supabase = serviceClient();
  const auth = await requireStaff(req, supabase);
  if (auth.error) return json({ ok: false, error: auth.error }, auth.status);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return json({ ok: false, error: "Expected multipart/form-data" }, 400);
  }

  const file = form.get("file");
  if (!(file instanceof File)) return json({ ok: false, error: "Missing file" }, 400);
  if (file.size > MAX_BYTES) return json({ ok: false, error: "File too large" }, 413);

  const prefix = sanitize(String(form.get("prefix") ?? "library"));
  const path = `${prefix}/${crypto.randomUUID()}-${sanitize(file.name)}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (error) return json({ ok: false, error: error.message }, 400);

  return json({ ok: true, bucket: BUCKET, path }, 200);
});

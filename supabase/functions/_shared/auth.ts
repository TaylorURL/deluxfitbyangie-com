// Shared auth helpers for edge functions.
//
// Every privileged write runs with the service-role key (which bypasses RLS),
// so the function itself MUST authenticate and authorize the caller. These
// helpers centralise that check so each function stays a thin, declarative
// handler.

import { createClient, type SupabaseClient } from "jsr:@supabase/supabase-js@2";

/** A service-role client — bypasses RLS. Never expose this to the browser. */
export function serviceClient(): SupabaseClient {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );
}

export type AuthResult =
  | { user: { id: string; email?: string }; error?: undefined; status?: undefined }
  | { user?: undefined; error: string; status: number };

/** Resolve the bearer-token user, or an error result if unauthenticated. */
export async function requireUser(
  req: Request,
  supabase: SupabaseClient,
): Promise<AuthResult> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { error: "Unauthorized", status: 401 };
  }
  const jwt = authHeader.replace("Bearer ", "");
  const { data, error } = await supabase.auth.getUser(jwt);
  if (error || !data?.user) {
    return { error: "Unauthorized", status: 401 };
  }
  return { user: { id: data.user.id, email: data.user.email ?? undefined } };
}

/** Like requireUser, but additionally requires the caller's profile.role = 'staff'. */
export async function requireStaff(
  req: Request,
  supabase: SupabaseClient,
): Promise<AuthResult> {
  const result = await requireUser(req, supabase);
  if (result.error) return result;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", result.user.id)
    .maybeSingle();
  if (error) return { error: error.message, status: 500 };
  if (!profile || profile.role !== "staff") {
    return { error: "Forbidden: staff only", status: 403 };
  }
  return result;
}

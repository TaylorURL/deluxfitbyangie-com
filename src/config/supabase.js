import { createClient } from '@supabase/supabase-js'

/**
 * DeluxFit's public Supabase project. The publishable key is shipped
 * intentionally, and it is the `sb_publishable_` key rather than the legacy
 * anon JWT: the two grant the same thing, and only one of them looks like a
 * token to anything scanning the bundle.
 *
 * The member portal uses Supabase Auth, so the client persists sessions and
 * auto-refreshes tokens. Privileged writes (bookings, messages, progress,
 * checkout) never hit the tables directly from the browser — they route through
 * Supabase Edge Functions that own the service-role key. Client code only reads
 * (RLS-scoped selects) and invokes those functions.
 *
 * Hardcoded (rather than read from import.meta.env) so production deploys do not
 * require dashboard env wiring; an env override is still honoured when present.
 */
export const SUPABASE_URL =
  import.meta.env?.VITE_SUPABASE_URL || 'https://wmqwcnpiewfujmxaivvy.supabase.co'
export const SUPABASE_ANON_KEY =
  import.meta.env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_tt--aNq041OKafRlo-5Pww_Ep-4oV-M'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'deluxfit:auth',
  },
})

import { createClient } from '@supabase/supabase-js'

/**
 * Sunday's public Supabase project — anon key is shipped intentionally.
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
  import.meta.env?.VITE_SUPABASE_URL || 'https://gujgtjqqurildqurpffh.supabase.co'
export const SUPABASE_ANON_KEY =
  import.meta.env?.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1amd0anFxdXJpbGRxdXJwZmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MTkxOTAsImV4cCI6MjA3OTQ5NTE5MH0.9jd6izem9wvp9RgYvlzgLhjSAiRxfsCfTxuIQHOunZc'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'deluxfit:auth',
  },
})

import { createClient } from '@supabase/supabase-js'

/**
 * Sunday's public Supabase project — anon key is shipped intentionally.
 * Client uploads route through the public `deluxfit-intake` edge function,
 * which owns the storage write and the `sunday_files` row insert server-side.
 * Hardcoded (rather than read from import.meta.env) so production deploys do
 * not require dashboard env wiring.
 */
export const SUPABASE_URL = 'https://gujgtjqqurildqurpffh.supabase.co'
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1amd0anFxdXJpbGRxdXJwZmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MTkxOTAsImV4cCI6MjA3OTQ5NTE5MH0.9jd6izem9wvp9RgYvlzgLhjSAiRxfsCfTxuIQHOunZc'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

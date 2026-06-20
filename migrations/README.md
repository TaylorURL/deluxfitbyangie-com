# Database migrations

Raw, append-only SQL DDL for the DeluxFit by Angie Supabase project
(ref `wmqwcnpiewfujmxaivvy`). Files are numbered and applied in order. Never edit
an already-applied migration — add a new `NNNN_*.sql` file instead.

## Files

- `0001_init.sql` — initial schema: `profiles`, `memberships`, `plans`,
  `progress_entries`, `bookings`, `conversations`, `messages`, `content_items`;
  the `handle_new_user()` signup trigger, the `has_entitlement()` access check,
  the `booking_slots_taken` view, RLS policies and indexes.
- `0002_storage.sql` — private `message-attachments` bucket + per-user folder
  RLS policies for the portal Messages tab.
- `0003_auth_roles.sql` — `profiles.role` column (`'staff' | 'client'`,
  defaults to `'client'`), the `public.is_staff(uid)` helper, a
  `profiles_select_staff` RLS policy so staff can read every profile,
  column-level UPDATE grants so authenticated users can update their own
  `full_name`/`email` but never their own `role`, and an updated
  `handle_new_user()` that honours an invited `role` claim on
  `raw_user_meta_data` (set server-side by the `invite-user` edge function).

## Applying

Pick whichever path fits your workflow.

### Supabase CLI (recommended)

```bash
# One-time link
supabase link --project-ref wmqwcnpiewfujmxaivvy

# Apply this file against the linked project (or local stack)
supabase db execute --file migrations/0001_init.sql
# ...or for local dev: supabase db reset then load the file
```

### psql

```bash
psql "$SUPABASE_DB_URL" -f migrations/0001_init.sql
```

Get `SUPABASE_DB_URL` (the Postgres connection string) from
**Project Settings → Database → Connection string** in the Supabase dashboard.

### SQL editor

Paste the file contents into the dashboard SQL editor and run.

## Notes

- The schema is written to be re-runnable: `create table if not exists`,
  `create or replace function`, `drop policy if exists` before each `create
  policy`, and `create index if not exists`.
- RLS is enabled on every table. Client access is read-only ("select own");
  all sensitive writes happen in edge functions using the service-role key,
  which bypasses RLS. See `supabase/functions/README.md`.
- `pgcrypto` is enabled for `gen_random_uuid()`.

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
- `0004_nutrition.sql` — `nutrition_plans` (per-client calorie/macro targets,
  meal-structure suggestions, educational resources, notes). RLS: select-own +
  select-staff; writes are service-role only (the `upsert-nutrition` function).
- `0005_coach_access.sql` — coach (staff) read access + supporting columns:
  `*_select_staff` RLS policies on `memberships`, `plans`, `progress_entries`,
  `bookings`, `conversations`, `messages` so the admin panel can read every
  client's rows; `content_assignments` (assign library items to specific
  clients) with a widened `content_items` SELECT policy; `content_items.media_path`;
  `progress_entries.measurements jsonb`; `messages.attachment_bucket`; and the
  private `progress-photos` + `library-media` storage buckets with per-user and
  staff RLS.

### Verification

- `verify_rls_isolation.sql` — a non-destructive, transaction-wrapped test that
  seeds two throwaway clients, impersonates one (via the `request.jwt.claims`
  GUC that `auth.uid()` reads), and asserts that client sees ONLY their own rows
  across every per-client table — then `ROLLBACK`s. Prints
  `RLS ISOLATION: ALL CHECKS PASSED` on success; raises an exception naming the
  leaking table otherwise. Run with
  `psql "$SUPABASE_DB_URL" -f migrations/verify_rls_isolation.sql`.

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

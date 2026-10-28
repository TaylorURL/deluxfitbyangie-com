# Database migrations

Append-only SQL for the DeluxFit by Angie Supabase project. Numbered files applied in order (schema, RLS policies, storage buckets), plus a self-test in a rolled-back transaction that checks clients only see their own rows.

## What this folder is

The schema, its row-level security, and the storage buckets are the security perimeter of the
whole app: the browser talks to Postgres directly, so RLS is what keeps one client from
reading another's rows. These files are the append-only record of that perimeter. Files are
numbered and applied in order; **never edit an already-applied migration. Add a new
`NNNN_*.sql` file instead.**

> **Note**: the `.sql` files are gitignored (`migrations/*.sql` in the repo's `.gitignore`), so
> this document is the version-controlled record of the migration set. The SQL itself lives in
> this folder locally and is applied straight to Supabase (CLI, `psql`, or the dashboard SQL
> editor); a fresh clone contains this document, not the files it describes.

## Files

| File                         | What it adds                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| :--------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `0001_init.sql`              | Initial schema: `profiles`, `memberships`, `plans`, `progress_entries`, `bookings`, `conversations`, `messages`, `content_items`; the `handle_new_user()` signup trigger, the `has_entitlement()` access check, the `booking_slots_taken` view, RLS policies, and indexes.                                                                                                                                                                               |
| `0002_storage.sql`           | Private `message-attachments` bucket + per-user folder RLS policies for the portal Messages tab.                                                                                                                                                                                                                                                                                                                                                         |
| `0003_auth_roles.sql`        | `profiles.role` column (`'staff' \| 'client'`, defaults to `'client'`), the `public.is_staff(uid)` helper, a `profiles_select_staff` policy so staff can read every profile, column-level UPDATE grants so users can change their own `full_name`/`email` but never their own `role`, and an updated `handle_new_user()` that honours an invited `role` claim (set server-side by the `invite-user` edge function).                                      |
| `0004_nutrition.sql`         | `nutrition_plans` (per-client calorie/macro targets, meal-structure suggestions, resources, notes). RLS: select-own + select-staff; writes are service-role only (the `upsert-nutrition` function).                                                                                                                                                                                                                                                      |
| `0005_coach_access.sql`      | Coach (staff) read access + supporting columns: `*_select_staff` policies on `memberships`, `plans`, `progress_entries`, `bookings`, `conversations`, `messages`; `content_assignments` with a widened `content_items` SELECT; `content_items.media_path`; `progress_entries.measurements jsonb`; `messages.attachment_bucket`; and the private `progress-photos` + `library-media` buckets with per-user and staff RLS.                                 |
| `0006_slots_view_grants.sql` | Revokes `insert`, `update`, `delete`, `truncate`, `references` and `trigger` on `booking_slots_taken` from `anon` and `authenticated`, leaving `select`.                                                                                                                                                                                                                                                                                                 |
| `0007_availability.sql`      | `coach_availability` (the standing weekly grid of bookable hours) and `coach_availability_overrides` (one row per date that differs: closed, or different hours). Both are readable by `anon`, because the booking calendar draws open slots before anyone signs in; neither has a write policy, so only the `upsert-availability` function changes them. Seeds the standing grid with the hours that used to be compiled into `src/lib/api/booking.js`. |
| `0008_content_structure.sql` | `content_items.program`, `.week` and `.day`, so a library item can say where it sits inside a program rather than encoding it in the title. All nullable. An item without them is a standalone resource. Adds the `(access_level, program, week, day, sort)` index the library reads in.                                                                                                                                                                 |

### Availability belongs to the coach, not the release

`0007` exists because Angie's bookable hours were a constant in the bundle, and
hers move week to week. The standing grid answers "what does a normal week look
like"; an override answers "what does this date do instead", and it replaces
that date's hours rather than adding to them, so what she ticks in the coach
panel is exactly what a client is offered. `booking.js` keeps a copy of the
seeded hours as a fallback for a read that fails, because a calendar with no
open dates reads as a closed business.

### `booking_slots_taken` is read-only to the browser

The view is `security_invoker=off`, so it runs as its owner and a write through it
reaches `bookings` without RLS in the way. It is also a plain projection of one
table, which makes it auto-updatable: while `anon` held `insert`, `update` and
`delete` on it, an unauthenticated caller could rewrite or drop every booking the
view selects. `0006` takes those back, and the whole of it is:

```sql
revoke insert, update, delete, truncate, references, trigger
    on public.booking_slots_taken from anon, authenticated;
```

Anything added to this view later inherits the same rule: the browser reads
`slot_start` through it and writes nothing, because bookings are created by the
`create-booking` function.

### Verification

`verify_rls_isolation.sql` is a non-destructive, transaction-wrapped test that seeds two
throwaway clients, impersonates one (via the `request.jwt.claims` GUC that `auth.uid()` reads),
and asserts that client sees ONLY their own rows across every per-client table, then
`ROLLBACK`s. It prints `RLS ISOLATION: ALL CHECKS PASSED` on success, or raises an exception
naming the leaking table otherwise.

```bash
psql "$SUPABASE_DB_URL" -f migrations/verify_rls_isolation.sql
```

## Applying

Pick whichever path fits your workflow.

### Supabase CLI (recommended)

```bash
# One-time link
supabase link --project-ref wmqwcnpiewfujmxaivvy

# Apply a file against the linked project (or local stack)
supabase db execute --file migrations/0001_init.sql
# ...or for local dev: supabase db reset then load the file
```

### psql

```bash
psql "$SUPABASE_DB_URL" -f migrations/0001_init.sql
```

Get `SUPABASE_DB_URL` (the Postgres connection string) from
**Project Settings > Database > Connection string** in the Supabase dashboard.

### SQL editor

Paste the file contents into the dashboard SQL editor and run.

## How it works

- **Re-runnable by design**: `create table if not exists`, `create or replace function`,
  `drop policy if exists` before each `create policy`, and `create index if not exists`.
- **RLS on every table**: client access is read-only ("select own"); all sensitive writes
  happen in edge functions using the service-role key, which bypasses RLS. See
  [`supabase/functions/EDGE_FUNCTIONS.md`](../supabase/functions/EDGE_FUNCTIONS.md).
- **`pgcrypto` enabled**, for `gen_random_uuid()`.

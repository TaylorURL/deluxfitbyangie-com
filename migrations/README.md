<h1 align="center">Database migrations</h1>

<p align="center">
  <b>Raw, append-only SQL DDL for the DeluxFit by Angie Supabase project.</b>
</p>
<p align="center">
  Numbered files applied in order — schema, RLS policies, and storage buckets —<br />
  plus a transaction-wrapped self-test that proves clients see only their own rows.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Supabase-2563eb?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/PostgreSQL-RLS-2563eb?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL RLS" />
  <img src="https://img.shields.io/badge/project-wmqwcnpiewfujmxaivvy-2563eb?style=for-the-badge" alt="Project ref" />
</p>

<br />

## Why this folder

The schema, its row-level security, and the storage buckets are the security perimeter of the
whole app — the browser talks to Postgres directly, so RLS is what keeps one client from
reading another's rows. These files are the append-only record of that perimeter. Files are
numbered and applied in order; **never edit an already-applied migration — add a new
`NNNN_*.sql` file instead.**

## Files

| File | What it adds |
| :--- | :----------- |
| `0001_init.sql` | Initial schema — `profiles`, `memberships`, `plans`, `progress_entries`, `bookings`, `conversations`, `messages`, `content_items`; the `handle_new_user()` signup trigger, the `has_entitlement()` access check, the `booking_slots_taken` view, RLS policies, and indexes. |
| `0002_storage.sql` | Private `message-attachments` bucket + per-user folder RLS policies for the portal Messages tab. |
| `0003_auth_roles.sql` | `profiles.role` column (`'staff' \| 'client'`, defaults to `'client'`), the `public.is_staff(uid)` helper, a `profiles_select_staff` policy so staff can read every profile, column-level UPDATE grants so users can change their own `full_name`/`email` but never their own `role`, and an updated `handle_new_user()` that honours an invited `role` claim (set server-side by the `invite-user` edge function). |
| `0004_nutrition.sql` | `nutrition_plans` (per-client calorie/macro targets, meal-structure suggestions, resources, notes). RLS: select-own + select-staff; writes are service-role only (the `upsert-nutrition` function). |
| `0005_coach_access.sql` | Coach (staff) read access + supporting columns: `*_select_staff` policies on `memberships`, `plans`, `progress_entries`, `bookings`, `conversations`, `messages`; `content_assignments` with a widened `content_items` SELECT; `content_items.media_path`; `progress_entries.measurements jsonb`; `messages.attachment_bucket`; and the private `progress-photos` + `library-media` buckets with per-user and staff RLS. |

### Verification

`verify_rls_isolation.sql` is a non-destructive, transaction-wrapped test that seeds two
throwaway clients, impersonates one (via the `request.jwt.claims` GUC that `auth.uid()` reads),
and asserts that client sees ONLY their own rows across every per-client table — then
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
**Project Settings → Database → Connection string** in the Supabase dashboard.

### SQL editor

Paste the file contents into the dashboard SQL editor and run.

## How it works

- **Re-runnable by design** — `create table if not exists`, `create or replace function`,
  `drop policy if exists` before each `create policy`, and `create index if not exists`.
- **RLS on every table** — client access is read-only ("select own"); all sensitive writes
  happen in edge functions using the service-role key, which bypasses RLS. See
  [`supabase/functions/README.md`](../supabase/functions/README.md).
- **`pgcrypto` enabled** — for `gen_random_uuid()`.

<br />

<p align="center">
  <sub>Every row scoped to its owner — proven on rollback.</sub>
</p>

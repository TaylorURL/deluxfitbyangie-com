-- =============================================================================
-- 0003_auth_roles.sql — add a `role` column to profiles and lock down who can
-- read or change it.
--
-- Project ref: wmqwcnpiewfujmxaivvy
--
-- Adds:
--   * profiles.role text default 'client' check in ('staff','client')
--   * public.is_staff(uid)   — security-definer helper used by RLS policies
--                              (bypasses RLS to avoid infinite recursion when
--                              a policy on profiles needs to read profiles).
--   * profiles_select_staff  — RLS policy so a staff caller may read all rows.
--   * Column-level UPDATE grants — authenticated users may update full_name +
--                                  email, but NEVER role. Role changes are
--                                  service-role only (the invite-user edge
--                                  function).
--   * handle_new_user() update — honours an invited `role` claim on
--                                raw_user_meta_data so staff invites land with
--                                the right role on first login.
--
-- Idempotent: safe to re-run.
-- =============================================================================

-- 1. role column ------------------------------------------------------------

alter table public.profiles
  add column if not exists role text not null default 'client';

-- Add the check constraint separately so the migration is idempotent even
-- after the column already exists.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_role_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_role_check check (role in ('staff', 'client'));
  end if;
end
$$;

create index if not exists profiles_role_idx on public.profiles (role);

-- 2. is_staff() helper ------------------------------------------------------
-- Used by RLS policies so we don't recurse: a policy on public.profiles cannot
-- itself query public.profiles under the same caller, so we route the lookup
-- through a SECURITY DEFINER function that bypasses RLS.

create or replace function public.is_staff(uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select role = 'staff' from public.profiles where id = uid),
    false
  );
$$;

grant execute on function public.is_staff(uuid) to authenticated, anon;

-- 3. handle_new_user — honour invited role ----------------------------------
-- Staff invites set raw_user_meta_data.role to 'staff' or 'client' via the
-- invite-user edge function. Public sign-ups never set it and fall back to
-- 'client'. Any unknown value is coerced to 'client' as a safety net.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  invited_role text;
begin
  invited_role := new.raw_user_meta_data ->> 'role';
  if invited_role is null or invited_role not in ('staff', 'client') then
    invited_role := 'client';
  end if;

  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    invited_role
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- 4. Column-level grants ----------------------------------------------------
-- Prevent authenticated users from changing their own role via direct table
-- writes. They keep table-level SELECT (gated by the existing select-own and
-- the new select-staff policies) and column-scoped UPDATE on (full_name,
-- email). The role column is service-role only.

revoke update on public.profiles from authenticated;
grant update (full_name, email) on public.profiles to authenticated;

-- 5. Staff-can-read-all policy ---------------------------------------------

drop policy if exists "profiles_select_staff" on public.profiles;
create policy "profiles_select_staff"
  on public.profiles
  for select
  to authenticated
  using (public.is_staff(auth.uid()));

-- 6. Backfill — any rows that pre-date this migration default to 'client'.
update public.profiles set role = 'client' where role is null;

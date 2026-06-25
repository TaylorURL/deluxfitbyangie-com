-- =============================================================================
-- 0005_coach_access.sql — coach (staff) read access, per-client library
-- assignment, progress measurements/photos, coach message attachments.
-- Project ref: wmqwcnpiewfujmxaivvy
--
-- The foundation gave every client read-only access to THEIR OWN rows. The
-- admin panel needs Angie (a `staff` profile) to READ every client's data so
-- she can review and author from the frontend. All WRITES still flow through
-- edge functions (service role) — this migration only adds staff SELECT
-- policies plus the supporting columns/tables/buckets the coach surfaces need.
--
-- Adds:
--   * Staff SELECT policies on memberships, plans, progress_entries, bookings,
--     conversations, messages (read-all for the admin panel).
--   * public.content_assignments — assign specific library items to specific
--     clients; clients may then read those items even without a matching
--     entitlement. content_items SELECT policy widened to honour assignments
--     and to let staff read everything.
--   * content_items.media_path — storage key for coach-uploaded media (served
--     to clients via the `signed-url` edge function).
--   * progress_entries.measurements jsonb — body measurements over time.
--   * messages.attachment_bucket — which private bucket an attachment lives in
--     ('message-attachments' for client uploads, 'library-media' for coach
--     video/PDF feedback).
--   * Private storage buckets: progress-photos, library-media, with per-user
--     and staff RLS. (message-attachments already exists from 0002.)
--
-- Idempotent: safe to re-run.
-- =============================================================================

-- 1. Staff read-all policies on the existing per-client tables ---------------

drop policy if exists "memberships_select_staff" on public.memberships;
create policy "memberships_select_staff"
  on public.memberships for select to authenticated
  using (public.is_staff(auth.uid()));

drop policy if exists "plans_select_staff" on public.plans;
create policy "plans_select_staff"
  on public.plans for select to authenticated
  using (public.is_staff(auth.uid()));

drop policy if exists "progress_entries_select_staff" on public.progress_entries;
create policy "progress_entries_select_staff"
  on public.progress_entries for select to authenticated
  using (public.is_staff(auth.uid()));

drop policy if exists "bookings_select_staff" on public.bookings;
create policy "bookings_select_staff"
  on public.bookings for select to authenticated
  using (public.is_staff(auth.uid()));

drop policy if exists "conversations_select_staff" on public.conversations;
create policy "conversations_select_staff"
  on public.conversations for select to authenticated
  using (public.is_staff(auth.uid()));

drop policy if exists "messages_select_staff" on public.messages;
create policy "messages_select_staff"
  on public.messages for select to authenticated
  using (public.is_staff(auth.uid()));

-- 2. progress_entries.measurements ------------------------------------------
-- Free-form { label: value } map (e.g. { "waist": 30, "hips": 40 }) so clients
-- can track measurements over time without a rigid column per body part.

alter table public.progress_entries
  add column if not exists measurements jsonb not null default '{}'::jsonb;

-- 3. content_items.media_path + per-client assignment -----------------------

alter table public.content_items
  add column if not exists media_path text;

create table if not exists public.content_assignments (
  id         uuid primary key default gen_random_uuid(),
  content_id uuid not null references public.content_items (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (content_id, user_id)
);

alter table public.content_assignments enable row level security;

create index if not exists content_assignments_user_id_idx
  on public.content_assignments (user_id);
create index if not exists content_assignments_content_id_idx
  on public.content_assignments (content_id);

drop policy if exists "content_assignments_select_own" on public.content_assignments;
create policy "content_assignments_select_own"
  on public.content_assignments for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "content_assignments_select_staff" on public.content_assignments;
create policy "content_assignments_select_staff"
  on public.content_assignments for select to authenticated
  using (public.is_staff(auth.uid()));

-- Widen the content read policy: a client sees an item when it is public, when
-- their entitlement covers it, OR when it has been explicitly assigned to them.
-- Staff see every item.
drop policy if exists "content_items_select_entitled" on public.content_items;
create policy "content_items_select_entitled"
  on public.content_items
  for select
  to anon, authenticated
  using (
    access_level = 'public'
    or (access_level = 'membership' and public.has_entitlement(auth.uid(), 'membership'))
    or (access_level = 'coaching'   and public.has_entitlement(auth.uid(), 'coaching'))
    or id in (
      select content_id from public.content_assignments where user_id = auth.uid()
    )
    or public.is_staff(auth.uid())
  );

-- 4. messages.attachment_bucket ---------------------------------------------

alter table public.messages
  add column if not exists attachment_bucket text not null default 'message-attachments'
    check (attachment_bucket in ('message-attachments', 'library-media'));

-- 5. Storage buckets + policies ---------------------------------------------
-- progress-photos: clients upload to their own <uid>/ folder; staff read all.
-- library-media:   service-role-only (coach uploads + content media). Clients
--                  never touch it directly — access is brokered by `signed-url`.

insert into storage.buckets (id, name, public)
values ('progress-photos', 'progress-photos', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('library-media', 'library-media', false)
on conflict (id) do nothing;

-- progress-photos: own-folder read/write for the client.
drop policy if exists "progress photos — own folder read" on storage.objects;
create policy "progress photos — own folder read"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'progress-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "progress photos — own folder write" on storage.objects;
create policy "progress photos — own folder write"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'progress-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- progress-photos: staff may read every client's photos (signed URLs in admin).
drop policy if exists "progress photos — staff read" on storage.objects;
create policy "progress photos — staff read"
  on storage.objects for select to authenticated
  using (bucket_id = 'progress-photos' and public.is_staff(auth.uid()));

-- message-attachments: staff may read every client's attachment (admin thread).
drop policy if exists "message attachments — staff read" on storage.objects;
create policy "message attachments — staff read"
  on storage.objects for select to authenticated
  using (bucket_id = 'message-attachments' and public.is_staff(auth.uid()));

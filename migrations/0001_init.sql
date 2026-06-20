-- =============================================================================
-- DeluxFit by Angie — Initial schema
-- Migration: 0001_init.sql
-- Project ref: wmqwcnpiewfujmxaivvy
--
-- Conventions:
--   * All PKs are uuid via gen_random_uuid() (pgcrypto).
--   * Every table has created_at timestamptz default now() and RLS ENABLED.
--   * All user references point at auth.users(id) ON DELETE CASCADE.
--   * Client-facing access is read-only via RLS "select own" policies; all
--     writes that the spec marks as sensitive happen through edge functions
--     using the service-role key (which bypasses RLS).
--
-- This file is written to be re-runnable: tables use CREATE TABLE IF NOT EXISTS,
-- policies are DROPped IF EXISTS before being (re)created, functions use
-- CREATE OR REPLACE, and indexes use IF NOT EXISTS.
-- =============================================================================

create extension if not exists pgcrypto;

-- =============================================================================
-- 1. profiles
-- =============================================================================
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text,
  email      text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Auto-create a profile row whenever a new auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- =============================================================================
-- 2. memberships
-- =============================================================================
create table if not exists public.memberships (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references auth.users (id) on delete cascade,
  product                text not null check (product in ('membership', 'coaching')),
  status                 text not null default 'incomplete'
                           check (status in ('active', 'canceled', 'past_due', 'incomplete')),
  stripe_customer_id     text,
  stripe_subscription_id text,
  current_period_end     timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  unique (user_id, product)
);

alter table public.memberships enable row level security;

create index if not exists memberships_user_id_idx on public.memberships (user_id);

-- Read-only for the owning user. No client insert/update/delete policies:
-- only the service role (via the Stripe webhook) may mutate this table.
drop policy if exists "memberships_select_own" on public.memberships;
create policy "memberships_select_own"
  on public.memberships
  for select
  to authenticated
  using (user_id = auth.uid());

-- =============================================================================
-- 3. plans
-- =============================================================================
create table if not exists public.plans (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  title      text not null,
  summary    text,
  status     text not null default 'active',
  content    jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.plans enable row level security;

create index if not exists plans_user_id_idx on public.plans (user_id);

-- Read-only for the owning user. Writes are service-role only (coach tooling).
drop policy if exists "plans_select_own" on public.plans;
create policy "plans_select_own"
  on public.plans
  for select
  to authenticated
  using (user_id = auth.uid());

-- =============================================================================
-- 4. progress_entries
-- =============================================================================
create table if not exists public.progress_entries (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  entry_date date not null,
  weight     numeric,
  body_fat   numeric,
  notes      text,
  photo_path text,
  created_at timestamptz not null default now()
);

alter table public.progress_entries enable row level security;

create index if not exists progress_entries_user_id_idx on public.progress_entries (user_id);
create index if not exists progress_entries_user_date_idx
  on public.progress_entries (user_id, entry_date desc);

-- Read-only for the owning user. Inserts go through the log-progress edge
-- function (service role) — deliberately NO client insert policy.
drop policy if exists "progress_entries_select_own" on public.progress_entries;
create policy "progress_entries_select_own"
  on public.progress_entries
  for select
  to authenticated
  using (user_id = auth.uid());

-- =============================================================================
-- 5. bookings
-- =============================================================================
create table if not exists public.bookings (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users (id) on delete cascade,
  guest_name     text,
  guest_email    text,
  service        text not null check (service in ('single_session', 'live_program')),
  slot_start     timestamptz not null,
  slot_end       timestamptz,
  training_focus text,
  fitness_goal   text,
  status         text not null default 'confirmed'
                   check (status in ('pending', 'confirmed', 'canceled')),
  created_at     timestamptz not null default now()
);

alter table public.bookings enable row level security;

create index if not exists bookings_user_id_idx on public.bookings (user_id);
create index if not exists bookings_slot_start_idx on public.bookings (slot_start);

-- Prevent double-booking: at most one non-canceled booking per start time.
create unique index if not exists bookings_slot_start_unique_active
  on public.bookings (slot_start)
  where status <> 'canceled';

-- Read-only for the owning user. Inserts go through the create-booking edge
-- function (service role) — no client insert policy.
drop policy if exists "bookings_select_own" on public.bookings;
create policy "bookings_select_own"
  on public.bookings
  for select
  to authenticated
  using (user_id = auth.uid());

-- Expose ONLY the taken start times (no PII) so the client can grey out
-- unavailable slots. security_invoker is left OFF so the view runs with the
-- definer's rights and bypasses the bookings RLS for these non-sensitive rows.
drop view if exists public.booking_slots_taken;
create view public.booking_slots_taken
  with (security_invoker = off)
  as
    select slot_start
    from public.bookings
    where status <> 'canceled';

grant select on public.booking_slots_taken to anon, authenticated;

-- =============================================================================
-- 6. conversations
-- =============================================================================
create table if not exists public.conversations (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid unique references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.conversations enable row level security;

create index if not exists conversations_user_id_idx on public.conversations (user_id);

drop policy if exists "conversations_select_own" on public.conversations;
create policy "conversations_select_own"
  on public.conversations
  for select
  to authenticated
  using (user_id = auth.uid());

-- =============================================================================
-- 7. messages
-- =============================================================================
create table if not exists public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations (id) on delete cascade,
  sender          text check (sender in ('client', 'coach')),
  body            text,
  attachment_path text,
  created_at      timestamptz not null default now()
);

alter table public.messages enable row level security;

create index if not exists messages_conversation_id_idx on public.messages (conversation_id);

-- Read-only for the owning user (messages in their own conversation). Inserts
-- go through the send-message edge function (service role) — no client insert.
drop policy if exists "messages_select_own" on public.messages;
create policy "messages_select_own"
  on public.messages
  for select
  to authenticated
  using (
    conversation_id in (
      select id from public.conversations where user_id = auth.uid()
    )
  );

-- =============================================================================
-- 8. content_items + entitlement check
-- =============================================================================
create table if not exists public.content_items (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  category      text check (category in ('workout', 'nutrition', 'education')),
  media_type    text check (media_type in ('video', 'article', 'pdf')),
  url           text,
  thumbnail_url text,
  access_level  text not null default 'membership'
                  check (access_level in ('public', 'membership', 'coaching')),
  locale        text not null default 'en',
  sort          int not null default 0,
  created_at    timestamptz not null default now()
);

alter table public.content_items enable row level security;

create index if not exists content_items_access_level_idx on public.content_items (access_level);
create index if not exists content_items_locale_idx on public.content_items (locale);
create index if not exists content_items_sort_idx on public.content_items (sort);
create index if not exists content_items_listing_idx
  on public.content_items (access_level, locale, sort);

-- Returns true when the user has an active membership that satisfies `needed`.
-- Coaching entitles membership-level content too.
create or replace function public.has_entitlement(uid uuid, needed text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.memberships m
    where m.user_id = uid
      and m.status = 'active'
      and (
        m.product = needed
        or (needed = 'membership' and m.product = 'coaching')
      )
  );
$$;

drop policy if exists "content_items_select_entitled" on public.content_items;
create policy "content_items_select_entitled"
  on public.content_items
  for select
  to anon, authenticated
  using (
    access_level = 'public'
    or (access_level = 'membership' and public.has_entitlement(auth.uid(), 'membership'))
    or (access_level = 'coaching'   and public.has_entitlement(auth.uid(), 'coaching'))
  );

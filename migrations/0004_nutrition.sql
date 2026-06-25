-- =============================================================================
-- 0004_nutrition.sql — per-client personalized nutrition guidance
-- Project ref: wmqwcnpiewfujmxaivvy
--
-- Adds the NET-NEW nutrition feature:
--   * public.nutrition_plans — one personalized nutrition plan per client
--     (calorie + macro targets, meal-structure suggestions, educational
--     resources, free-form notes). Coaches may keep history by archiving an
--     old plan and writing a new one.
--
-- Access model (identical to plans / progress_entries):
--   * The owning client may READ their own rows (nutrition_plans_select_own).
--   * Staff may READ every row (nutrition_plans_select_staff) so the admin
--     panel can author guidance.
--   * NO client/staff write policies — all writes go through the
--     `upsert-nutrition` edge function using the service-role key.
--
-- Idempotent: safe to re-run.
-- =============================================================================

create table if not exists public.nutrition_plans (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  title          text not null default 'Nutrition guidance',
  calorie_target int,
  protein_g      int,
  carbs_g        int,
  fat_g          int,
  -- Ordered list of { meal, suggestion } objects describing the day's meals.
  meal_structure jsonb not null default '[]'::jsonb,
  -- Ordered list of { label, url } educational nutrition resources.
  resources      jsonb not null default '[]'::jsonb,
  notes          text,
  status         text not null default 'active'
                   check (status in ('active', 'archived')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.nutrition_plans enable row level security;

create index if not exists nutrition_plans_user_id_idx
  on public.nutrition_plans (user_id);
create index if not exists nutrition_plans_user_status_idx
  on public.nutrition_plans (user_id, status, created_at desc);

-- Read-only for the owning client.
drop policy if exists "nutrition_plans_select_own" on public.nutrition_plans;
create policy "nutrition_plans_select_own"
  on public.nutrition_plans
  for select
  to authenticated
  using (user_id = auth.uid());

-- Staff may read every client's nutrition plan (admin authoring surface).
drop policy if exists "nutrition_plans_select_staff" on public.nutrition_plans;
create policy "nutrition_plans_select_staff"
  on public.nutrition_plans
  for select
  to authenticated
  using (public.is_staff(auth.uid()));

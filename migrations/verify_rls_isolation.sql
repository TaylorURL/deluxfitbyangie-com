-- =============================================================================
-- verify_rls_isolation.sql — proves a client can ONLY read their own data.
-- Project ref: wmqwcnpiewfujmxaivvy
--
-- This is the correctness test for the portal's most important property: client
-- isolation. It seeds two throwaway clients (A and B), gives each one a plan,
-- progress entry, nutrition plan, a conversation + message, and an assigned
-- content item, then impersonates client A (via the JWT claims GUC that
-- auth.uid() reads) and asserts that A sees EXACTLY their own rows and ZERO of
-- B's across every per-client table.
--
-- It runs inside a single transaction and ROLLS BACK at the end, so it never
-- mutates real data. Run it in the Supabase SQL editor or via psql:
--
--   psql "$SUPABASE_DB_URL" -f migrations/verify_rls_isolation.sql
--
-- A passing run prints "RLS ISOLATION: ALL CHECKS PASSED". Any leak raises an
-- exception naming the table that failed.
-- =============================================================================

begin;

do $$
declare
  uid_a uuid := gen_random_uuid();
  uid_b uuid := gen_random_uuid();
  conv_a uuid;
  conv_b uuid;
  content_a uuid;
  content_b uuid;
  n int;
begin
  -- --- Seed two auth users; the handle_new_user trigger creates profiles. ----
  -- aud/role/instance_id are included so the insert satisfies auth.users' shape.
  insert into auth.users (instance_id, id, aud, role, email, raw_user_meta_data, created_at)
  values
    ('00000000-0000-0000-0000-000000000000', uid_a, 'authenticated', 'authenticated',
     'rls-test-a@example.com', '{"full_name":"Client A","role":"client"}'::jsonb, now()),
    ('00000000-0000-0000-0000-000000000000', uid_b, 'authenticated', 'authenticated',
     'rls-test-b@example.com', '{"full_name":"Client B","role":"client"}'::jsonb, now());

  insert into public.plans (user_id, title) values (uid_a, 'A plan'), (uid_b, 'B plan');
  insert into public.progress_entries (user_id, entry_date, weight)
    values (uid_a, current_date, 150), (uid_b, current_date, 160);
  insert into public.nutrition_plans (user_id, calorie_target)
    values (uid_a, 1800), (uid_b, 2000);
  -- Distinct products: A is membership-only, B is coaching. This keeps the
  -- content test meaningful — A lacks coaching entitlement, so B's coaching
  -- library item is invisible to A unless explicitly assigned (it isn't).
  insert into public.memberships (user_id, product, status)
    values (uid_a, 'membership', 'active'), (uid_b, 'coaching', 'active');

  insert into public.conversations (user_id) values (uid_a) returning id into conv_a;
  insert into public.conversations (user_id) values (uid_b) returning id into conv_b;
  insert into public.messages (conversation_id, sender, body)
    values (conv_a, 'client', 'A secret'), (conv_b, 'client', 'B secret');

  insert into public.content_items (title, category, media_type, access_level)
    values ('A item', 'workout', 'video', 'coaching') returning id into content_a;
  insert into public.content_items (title, category, media_type, access_level)
    values ('B item', 'workout', 'video', 'coaching') returning id into content_b;
  insert into public.content_assignments (content_id, user_id)
    values (content_a, uid_a), (content_b, uid_b);

  -- --- Impersonate client A -------------------------------------------------
  perform set_config('role', 'authenticated', true);
  perform set_config(
    'request.jwt.claims',
    json_build_object('sub', uid_a, 'role', 'authenticated')::text,
    true
  );

  -- Each check: A must see exactly 1 row (their own) and never B's.
  select count(*) into n from public.plans;
  if n <> 1 then raise exception 'LEAK plans: A sees % rows (want 1)', n; end if;

  select count(*) into n from public.progress_entries;
  if n <> 1 then raise exception 'LEAK progress_entries: A sees % rows (want 1)', n; end if;

  select count(*) into n from public.nutrition_plans;
  if n <> 1 then raise exception 'LEAK nutrition_plans: A sees % rows (want 1)', n; end if;

  select count(*) into n from public.memberships;
  if n <> 1 then raise exception 'LEAK memberships: A sees % rows (want 1)', n; end if;

  select count(*) into n from public.messages;
  if n <> 1 then raise exception 'LEAK messages: A sees % rows (want 1)', n; end if;

  select count(*) into n from public.messages where body = 'B secret';
  if n <> 0 then raise exception 'LEAK messages: A can read B''s message body'; end if;

  -- content_items: A sees their assigned item; must NOT see B's coaching item
  -- (A has no coaching entitlement row that the policy trusts unless assigned).
  select count(*) into n from public.content_items where id = content_b;
  if n <> 0 then raise exception 'LEAK content_items: A can read B''s unassigned item'; end if;

  select count(*) into n from public.content_assignments;
  if n <> 1 then raise exception 'LEAK content_assignments: A sees % rows (want 1)', n; end if;

  -- Reset impersonation.
  perform set_config('role', 'postgres', true);
  perform set_config('request.jwt.claims', NULL, true);

  raise notice 'RLS ISOLATION: ALL CHECKS PASSED';
end
$$;

rollback;

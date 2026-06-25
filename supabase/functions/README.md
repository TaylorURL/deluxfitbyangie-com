# Edge functions

Deno TypeScript edge functions for the DeluxFit by Angie Supabase project
(ref `wmqwcnpiewfujmxaivvy`). Each function lives in its own folder and is a
standard `Deno.serve` handler that:

1. answers the `OPTIONS` CORS preflight,
2. creates a **service-role** Supabase client (bypasses RLS), and
3. derives the calling user from the `Authorization: Bearer <jwt>` header via
   `supabase.auth.getUser(jwt)` when auth is needed.

Shared CORS headers and the `json()` response helper live in `_shared/cors.ts`.
Shared auth helpers (`serviceClient`, `requireUser`, `requireStaff`) live in
`_shared/auth.ts` — the coach/admin functions use `requireStaff` to enforce
`profiles.role = 'staff'` server-side before any write.

## Functions

### Client / public

| Function          | Auth        | Purpose |
|-------------------|-------------|---------|
| `create-booking`  | optional    | Insert a booking; `slot_end = slotStart + 60min`; returns `409 { code:'slot_taken' }` on a double-book (partial unique index, PG `23505`). Sends a Resend confirmation email if `RESEND_API_KEY` is set. |
| `send-message`    | required    | Upsert the caller's conversation, insert a `sender='client'` message. |
| `log-progress`    | required    | Insert a `progress_entries` row for the caller (weight, body fat, notes, photo path, and free-form `measurements`). |
| `signed-url`      | required    | Media-access broker. Returns a short-lived signed URL for a private object only if the caller may see it: staff → any; client → own upload, an attachment on a message in their conversation, or library media assigned/entitled to them. |
| `create-checkout` | optional    | Create a Stripe Checkout Session (subscription for membership/coaching, payment for sessions). Returns `{ configured:false }` if Stripe env is unset — never fakes a charge. |
| `stripe-webhook`  | Stripe sig  | Verifies `Stripe-Signature` (Web Crypto HMAC-SHA256) and upserts `memberships` on `checkout.session.completed` / `customer.subscription.updated|deleted`. Returns `{ configured:false }` if `STRIPE_WEBHOOK_SECRET` is unset. |

### Coach / admin (all `requireStaff`)

| Function            | Purpose |
|---------------------|---------|
| `invite-user`       | Sends a Supabase Auth invite email for `{ email, fullName?, role }` (role ∈ `'client'`/`'staff'`), pre-stamping `data.role` so `handle_new_user()` records the right role. The frontend never writes roles or creates users directly. |
| `upsert-plan`       | Create / update / delete a client's workout program (`plans` row). |
| `upsert-nutrition`  | Create / update / delete a client's nutrition plan (`nutrition_plans` row). |
| `upsert-content`    | Create / update / delete a `content_items` row and sync its per-client `content_assignments`. |
| `upload-media`      | Multipart upload of coach media (library videos/PDFs, message video feedback) to the private `library-media` bucket; returns `{ bucket, path }`. |
| `coach-message`     | Insert a `sender='coach'` message into a client's conversation (creating it if needed); supports a `library-media` attachment for video feedback. |
| `update-membership` | Manually upsert / delete a client's `memberships` row (the manual override alongside the Stripe webhook). |
| `update-booking`    | Set a booking's status (`pending` / `confirmed` / `canceled`). |

## Deploying

```bash
supabase link --project-ref wmqwcnpiewfujmxaivvy

# Deploy all functions
for fn in create-booking send-message log-progress signed-url invite-user \
          create-checkout upsert-plan upsert-nutrition upsert-content \
          upload-media coach-message update-membership update-booking; do
  supabase functions deploy "$fn"
done

# The webhook receives unauthenticated calls from Stripe — disable JWT verify.
supabase functions deploy stripe-webhook --no-verify-jwt
```

Serve locally for testing:

```bash
supabase functions serve --env-file supabase/functions/.env.local
```

## Required environment variables

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically in the
hosted runtime. The rest are set with
`supabase secrets set KEY=value` (or in the dashboard).

| Variable                      | Used by          | Notes |
|-------------------------------|------------------|-------|
| `SUPABASE_URL`                | all              | Auto-injected in production. |
| `SUPABASE_SERVICE_ROLE_KEY`   | all              | Auto-injected in production. Bypasses RLS — keep secret. |
| `RESEND_API_KEY`              | create-booking   | Optional. If absent, the confirmation email is skipped gracefully. |
| `STRIPE_SECRET_KEY`           | create-checkout  | If absent, returns `{ configured:false }`. |
| `STRIPE_WEBHOOK_SECRET`       | stripe-webhook   | Signing secret (`whsec_…`). If absent, returns `{ configured:false }`. |
| `STRIPE_PRICE_MEMBERSHIP`     | create-checkout, stripe-webhook | TODO: $14.99/mo recurring price ID. |
| `STRIPE_PRICE_COACHING`       | create-checkout, stripe-webhook | TODO: $150/mo recurring price ID. |
| `STRIPE_PRICE_SINGLE_SESSION` | create-checkout  | TODO: $75 one-off price ID. |
| `STRIPE_PRICE_LIVE_PROGRAM`   | create-checkout  | TODO: $50 one-off price ID (quantity = sessions). |

Example:

```bash
supabase secrets set \
  STRIPE_SECRET_KEY=sk_live_xxx \
  STRIPE_WEBHOOK_SECRET=whsec_xxx \
  STRIPE_PRICE_MEMBERSHIP=price_xxx \
  STRIPE_PRICE_COACHING=price_xxx \
  STRIPE_PRICE_SINGLE_SESSION=price_xxx \
  STRIPE_PRICE_LIVE_PROGRAM=price_xxx \
  RESEND_API_KEY=re_xxx
```

## Stripe webhook setup

Point a Stripe webhook endpoint at
`https://wmqwcnpiewfujmxaivvy.functions.supabase.co/stripe-webhook` and subscribe
to `checkout.session.completed`, `customer.subscription.updated`, and
`customer.subscription.deleted`. Copy the signing secret into
`STRIPE_WEBHOOK_SECRET`.

## Imports

Functions import the client as `import { createClient } from
'jsr:@supabase/supabase-js@2'`. No bundler or `package.json` is required — the
Supabase Deno runtime resolves JSR/npm specifiers directly.

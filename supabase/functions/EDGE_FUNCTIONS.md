# Edge functions

The service-role backend for DeluxFit by Angie. Every privileged write (bookings, messaging, checkout, media, coach and admin content) runs here, behind CORS, JWT auth and a server-side `requireStaff` check.

## Shape of a function

Each function is a standard `Deno.serve` handler that:

1. answers the `OPTIONS` CORS preflight,
2. creates a **service-role** Supabase client (bypasses RLS), and
3. derives the calling user from the `Authorization: Bearer <jwt>` header via
   `supabase.auth.getUser(jwt)` when auth is needed.

Shared CORS headers and the `json()` response helper live in `_shared/cors.ts`. Shared auth
helpers (`serviceClient`, `requireUser`, `requireStaff`) live in `_shared/auth.ts`. Every
coach/admin function enforces `profiles.role = 'staff'` server-side before any write: through
`requireStaff`, or, in `invite-user`, through the same check written out in the handler.

## Functions

### Client / public

| Function          | Auth       | Purpose                                                                                                                                                                                                                                                 |
| :---------------- | :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `create-booking`  | optional   | Insert a booking; `slot_end = slotStart + 60min`; returns `409 { code:'slot_taken' }` on a double-book (partial unique index, PG `23505`). Sends a Resend confirmation email if `RESEND_API_KEY` is set.                                                |
| `send-message`    | required   | Upsert the caller's conversation, insert a `sender='client'` message.                                                                                                                                                                                   |
| `log-progress`    | required   | Insert a `progress_entries` row for the caller (weight, body fat, notes, photo path, free-form `measurements`).                                                                                                                                         |
| `signed-url`      | required   | Media-access broker. Returns a short-lived signed URL for a private object only if the caller may see it: staff get any; client gets their own upload, an attachment on a message in their conversation, or library media assigned or entitled to them. |
| `create-checkout` | optional   | Create a Stripe Checkout Session (subscription for membership/coaching, payment for sessions). Returns `{ configured:false }` if Stripe env is unset, rather than faking a charge.                                                                      |
| `stripe-webhook`  | Stripe sig | Verifies `Stripe-Signature` (Web Crypto HMAC-SHA256) and upserts `memberships` on `checkout.session.completed` / `customer.subscription.updated\|deleted`. Returns `{ configured:false }` if `STRIPE_WEBHOOK_SECRET` is unset.                          |

### Coach / admin (staff only)

| Function              | Purpose                                                                                                                                                                                                                                   |
| :-------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `invite-user`         | Sends a Supabase Auth invite email for `{ email, fullName?, role }` (role is `'client'` or `'staff'`), pre-stamping `data.role` so `handle_new_user()` records the right role. The frontend never writes roles or creates users directly. |
| `upsert-plan`         | Create / update / delete a client's workout program (`plans` row).                                                                                                                                                                        |
| `upsert-nutrition`    | Create / update / delete a client's nutrition plan (`nutrition_plans` row).                                                                                                                                                               |
| `upsert-content`      | Create / update / delete a `content_items` row and sync its per-client `content_assignments`.                                                                                                                                             |
| `upload-media`        | Multipart upload of coach media (library videos/PDFs, message video feedback) to the private `library-media` bucket; returns `{ bucket, path }`.                                                                                          |
| `coach-message`       | Insert a `sender='coach'` message into a client's conversation (creating it if needed); supports a `library-media` attachment for video feedback.                                                                                         |
| `update-membership`   | Manually upsert / delete a client's `memberships` row (the manual override alongside the Stripe webhook).                                                                                                                                 |
| `update-booking`      | Set a booking's status (`pending` / `confirmed` / `canceled`).                                                                                                                                                                            |
| `upsert-availability` | Replace the standing weekly availability grid, or upsert / delete a single date's override. The booking calendar reads both tables directly and writes neither.                                                                           |

## Deploying

```bash
supabase link --project-ref wmqwcnpiewfujmxaivvy

# Deploy all functions
for fn in create-booking send-message log-progress signed-url invite-user \
          create-checkout upsert-plan upsert-nutrition upsert-content \
          upsert-availability \
          upload-media coach-message update-membership update-booking; do
  supabase functions deploy "$fn"
done

# The webhook receives unauthenticated calls from Stripe, so JWT verify is off.
supabase functions deploy stripe-webhook --no-verify-jwt
```

Serve locally for testing:

```bash
supabase functions serve --env-file supabase/functions/.env.local
```

## Environment

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically in the hosted
runtime. The rest are set with `supabase secrets set KEY=value` (or in the dashboard).

| Variable                      | Used by                         | Notes                                                                                                                                                                                                |
| :---------------------------- | :------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SUPABASE_URL`                | all                             | Auto-injected in production.                                                                                                                                                                         |
| `SUPABASE_SERVICE_ROLE_KEY`   | all                             | Auto-injected in production. Bypasses RLS, so keep it secret.                                                                                                                                        |
| `RESEND_API_KEY`              | create-booking                  | Optional. If absent, the confirmation email is skipped gracefully.                                                                                                                                   |
| `STRIPE_SECRET_KEY`           | create-checkout                 | If absent, returns `{ configured:false }`.                                                                                                                                                           |
| `STRIPE_WEBHOOK_SECRET`       | stripe-webhook                  | Signing secret (`whsec_…`). If absent, returns `{ configured:false }`.                                                                                                                               |
| `STRIPE_PRICE_MEMBERSHIP`     | create-checkout, stripe-webhook | The $14.99/mo recurring price ID.                                                                                                                                                                    |
| `STRIPE_PRICE_COACHING`       | create-checkout, stripe-webhook | The $150/mo recurring price ID.                                                                                                                                                                      |
| `STRIPE_PRICE_SINGLE_SESSION` | create-checkout                 | The $75 one-off price ID.                                                                                                                                                                            |
| `STRIPE_PRICE_LIVE_PROGRAM`   | create-checkout                 | The $50 one-off price ID (quantity = sessions).                                                                                                                                                      |
| `ALLOWED_REDIRECT_ORIGINS`    | create-checkout                 | Optional. Comma-separated origins accepted for `successUrl` / `cancelUrl`. Defaults to the production domain, its `www` alias, and `http://localhost:5173`. Set it to authorise preview deployments. |

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
`https://wmqwcnpiewfujmxaivvy.functions.supabase.co/stripe-webhook` and subscribe to
`checkout.session.completed`, `customer.subscription.updated`, and
`customer.subscription.deleted`. Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

## Gotchas

Functions import `createClient` from `jsr:@supabase/supabase-js@2`. The Deno runtime resolves JSR and npm specifiers itself, which is why there's no `package.json` here.

A missing Stripe or Resend secret doesn't error. Checkout returns `{ configured:false }` instead of pretending to charge, and the booking email is skipped.

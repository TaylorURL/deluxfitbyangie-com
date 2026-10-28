<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/logo-dark.png" />
  <img src="public/deluxfit-logo.webp" width="220" alt="DeluxFit by Angie" />
</picture>

# DeluxFit by Angie

Website and client app for Angie, a certified personal trainer.

[deluxfitbyangie.com](https://www.deluxfitbyangie.com)

<img src="https://img.shields.io/badge/version-2026.44.2-e11d2a?style=for-the-badge" alt="Version 2026.44.2" />

People buy a membership or training, then sign in to a portal with their plan, nutrition, progress, bookings and a message thread with Angie. She runs her side from a coach dashboard in the same app.

It's one Vite build serving the public site, the client portal at `/portal` and the coach dashboard at `/admin`. Supabase does auth, Postgres, private storage and the backend. `/portal?demo=1` shows the portal with sample data and no account.

## Reads and writes

Reads go straight to Postgres under row level security with the publishable key. A client sees their own rows, and staff see across clients through the `*_select_staff` policies and `is_staff()`.

Writes go through the Deno functions in `supabase/functions/`: bookings, messages, checkout, uploads, plans, nutrition, content and invites. Each one gets the caller from the JWT and checks `profiles.role = 'staff'` on the server before any coach write. Column grants let people change their own name and email but never their role. Invited staff get the role from a claim set by `invite-user`.

Every storage bucket is private. `signed-url` is the only way to a file, and it hands out a 30-minute link only for things the caller may see: their own uploads, attachments in their own thread, or library media assigned to them or covered by `has_entitlement()`.

Stripe keys live in Supabase. `create-checkout` sends the buyer to Stripe, and `stripe-webhook` checks the signature with Web Crypto and updates `memberships` when a checkout completes or a subscription changes or ends.

## The coach's preview

Staff can see the whole library, which makes it useless for checking what a member actually gets. The portal preview puts the access rules back in front of her: she picks an access level and sees only what that level can read.

## Smaller decisions

- There's no router library. `src/router/routes.js` is an exact-match path table, and the same list writes `sitemap.xml`.
- `?next=` after sign-in is only followed if it's on this site and the role can use it. `//host` is refused.
- Spanish is its own content tree in `src/i18n/content/es.js`, loaded on demand. English ships in the entry bundle.
- `scripts/first-screen.js` writes the home hero into the served HTML so it draws before the bundle lands. Other routes and Spanish get the bare root rather than a flash of the wrong page.
- WebGL backgrounds draw a single frame on a software renderer.
- UI components come from `packages/deluxfit-design-system`, used from source with no build step.

```bash
npm install
npm run dev
npm run build
```

Node 22. No `.env` needed, the Supabase URL and publishable key are in `src/config/supabase.js`. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to point a clone somewhere else.

More detail lives in [supabase/functions/EDGE_FUNCTIONS.md](supabase/functions/EDGE_FUNCTIONS.md), [migrations/MIGRATIONS.md](migrations/MIGRATIONS.md) and [packages/deluxfit-design-system/DESIGN_SYSTEM.md](packages/deluxfit-design-system/DESIGN_SYSTEM.md).

React 19, Vite 7, Tailwind CSS 3, Framer Motion, Supabase and Stripe, on Vercel. Proprietary, see [LICENSE.md](LICENSE.md).

Built and maintained by [TaylorURL](https://www.taylorurl.com).

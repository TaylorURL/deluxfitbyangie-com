<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/logo-dark.png" />
  <img src="public/deluxfit-logo.webp" width="220" alt="DeluxFit by Angie" />
</picture>

# DeluxFit by Angie

Website and client app for Angie, a certified personal trainer.

[deluxfitbyangie.com](https://www.deluxfitbyangie.com)

<img src="https://img.shields.io/badge/version-2026.44.1-e11d2a?style=for-the-badge" alt="Version 2026.44.1" />

People buy a membership or training, then sign in to a portal with their plan, nutrition, progress, bookings and a message thread with Angie. She runs her side from a coach dashboard in the same app.

## How it's built

One Vite build, three surfaces: the public site, the client portal at `/portal`, and the coach dashboard at `/admin`. Supabase does auth, Postgres, private storage and the backend.

- **Reads go straight to Postgres, under RLS.** The browser only has the publishable key. A client sees their own rows. Staff see across clients through `*_select_staff` policies and `is_staff()`.
- **Writes go through edge functions.** Bookings, messages, checkout, uploads, plans, nutrition, content and invites are Deno functions in `supabase/functions/`. Each one uses a service-role client, gets the caller from the JWT, and checks `profiles.role = 'staff'` on the server before any coach write.
- **One door for media.** Every bucket is private. `signed-url` hands out a 30-minute link only for things the caller is allowed to see: their own uploads, attachments in their own thread, or library media assigned to them or covered by `has_entitlement()`.
- **Payments.** `create-checkout` sends the buyer to Stripe. `stripe-webhook` checks the signature (HMAC-SHA256 with Web Crypto) and updates `memberships` when a checkout completes or a subscription changes or ends. Stripe keys live in Supabase, not here.
- **No router library.** `src/router/routes.js` is an exact-match path table. The same path list writes `sitemap.xml`, so what's mounted is what's published. Portal, admin and auth screens are lazy chunks.

<details>
<summary>Decisions and tradeoffs</summary>

- Roles are `staff` or `client`. Column grants let users change their own name and email but never their role. Invited staff get the role from a claim set by `invite-user`.
- After sign-in, `?next=` is only followed if it's on this site and the role can use it, so a crafted link can't drop a client on `/admin`. `//host` is refused.
- The coach's portal preview puts a client's access rules back in front of her. Staff can see the whole library, which is useless for checking what a member actually gets. She picks an access level and sees only what that level can read.
- Spanish is its own content tree (`src/i18n/content/es.js`), loaded on demand. English ships in the entry bundle.
- `scripts/first-screen.js` writes the home hero into the served HTML from the English content, so the first screen draws before the bundle lands. Other routes and Spanish get the bare root instead of a flash of the wrong page.
- A chunk that fails to load is retried once, then the page reloads onto the current build (`src/lib/chunk.js`). Covers tabs left open across a deploy.
- WebGL backgrounds check for a software renderer (SwiftShader, llvmpipe). On one, they draw a single frame instead of animating.
- UI components come from a local package, `packages/deluxfit-design-system`: `cva` components and a Tailwind preset, used from source with no build step.
- `/portal?demo=1` shows the portal with sample data and no account.
- `middleware.js` checks a TaylorURL status endpoint and shows a holding page if the site is paused. Fails open. `api/version.js` returns the deployed commit, uncached.

</details>

<details>
<summary>Running it locally</summary>

You need Node 22.

```bash
npm install
npm run dev     # open /portal?demo=1 to see the portal with sample data
npm run build
```

No `.env` is needed. The Supabase URL and publishable key are in `src/config/supabase.js`. To point a clone at a different Supabase project, copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Stripe keys and other secrets live in the Supabase project, not in this repo.

The edge functions are documented in [supabase/functions/EDGE_FUNCTIONS.md](supabase/functions/EDGE_FUNCTIONS.md), the database in [migrations/MIGRATIONS.md](migrations/MIGRATIONS.md), and the design system in [packages/deluxfit-design-system/DESIGN_SYSTEM.md](packages/deluxfit-design-system/DESIGN_SYSTEM.md).

</details>

## Built with

React 19, Vite 7, Tailwind CSS 3, Framer Motion, Supabase (auth, Postgres, edge functions) and Stripe. Hosted on Vercel.

<details>
<summary>License</summary>

Proprietary. Copyright (c) 2026 TaylorURL LLC, all rights reserved. See [LICENSE.md](LICENSE.md).

</details>

Built and maintained by [TaylorURL](https://www.taylorurl.com).

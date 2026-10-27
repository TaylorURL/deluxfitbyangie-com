<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/logo-dark.png" />
    <img src="public/deluxfit-logo.webp" width="220" alt="DeluxFit by Angie" />
  </picture>
</p>
<h1 align="center">DeluxFit by Angie</h1>
<p align="center">Website and client app for Angie, a certified personal trainer.</p>
<p align="center"><a href="https://www.deluxfitbyangie.com">deluxfitbyangie.com</a></p>
<p align="center">
  <img src="https://img.shields.io/badge/version-2026.44.0-e11d2a?style=for-the-badge" alt="Version 2026.44.0" />
</p>

Angie sells memberships and live one-on-one training online. People buy a program on the site, then sign in to a portal with their plan, nutrition, progress, bookings and a message thread with Angie. She runs her side from a coach dashboard in the same app.

## What's on the site

- Four programs: a $14.99/month membership, a $75 single live session, live online training at $50 a session, and personalized online coaching at $150/month (marked coming soon for now)
- Stripe checkout and member sign-up
- A booking calendar for the live sessions
- The public pages in English and Spanish
- A member portal with the workout plan, nutrition targets, progress log, bookings, a media library, and messages with Angie that can carry file attachments
- A coach dashboard where Angie writes plans and nutrition, uploads library content, reviews progress, sets her availability and manages bookings, memberships and clients
- Client stories with reviews and transformation photos

## Running it locally

You need Node 22.

```bash
npm install
npm run dev     # open /portal?demo=1 to see the portal with sample data
npm run build
```

No `.env` is needed. The Supabase URL and publishable key are in `src/config/supabase.js`. To point a clone at a different Supabase project, copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Stripe keys and other secrets live in the Supabase project, not in this repo.

The edge functions are documented in [supabase/functions/EDGE_FUNCTIONS.md](supabase/functions/EDGE_FUNCTIONS.md), the database in [migrations/MIGRATIONS.md](migrations/MIGRATIONS.md), and the design system in [packages/deluxfit-design-system/DESIGN_SYSTEM.md](packages/deluxfit-design-system/DESIGN_SYSTEM.md).

## Built with

React 19, Vite 7, Tailwind CSS 3, Framer Motion, Supabase (auth, Postgres, edge functions) and Stripe. Hosted on Vercel.

---

Built and maintained by [TaylorURL](https://www.taylorurl.com). Proprietary, see [LICENSE.md](LICENSE.md).

/* =============================================================================
   STRIPE CHECKOUT LINKS — PLACEHOLDERS
   -----------------------------------------------------------------------------
   ⚠️  FOR ANGIE / STRIPE: replace each URL below with the real Stripe Payment
   Link for that tier (Stripe Dashboard → Payment Links → Create link → copy the
   `https://buy.stripe.com/...` URL).

   This build is intentionally backend-free: there is NO server, NO database, and
   NO auth. Each pricing button simply opens the matching link in a new tab, and
   Stripe hosts the entire checkout + payment. Nothing else needs to change here
   — just swap the strings.
   ========================================================================== */

export const CHECKOUT_LINKS = {
  kickstart: 'https://buy.stripe.com/REPLACE_ME_kickstart',
  transform: 'https://buy.stripe.com/REPLACE_ME_transform',
  elite: 'https://buy.stripe.com/REPLACE_ME_elite',
}

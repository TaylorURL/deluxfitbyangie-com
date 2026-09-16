/*
 * What the coach is asked before a destructive admin write.
 *
 * Two of these prompts are reached from two places each — a program and a
 * nutrition plan can be deleted from the client's own page or from the list
 * that spans every client — and the wording was written out at both. The
 * warning is the only thing standing between a click and a row the client
 * loses, so it is worth one definition rather than two that can drift.
 *
 * Each builder returns the argument `confirm()` takes, so a call site reads
 * `await confirm(deleteProgramPrompt(plan))`.
 */

/** Deleting a training program, with every week inside it. */
export function deleteProgramPrompt(plan) {
  return {
    title: 'Delete This Program?',
    body: `“${plan.title}” and every week inside it will be removed from the client's portal. This cannot be undone.`,
    confirmLabel: 'Delete Program',
  }
}

/** Deleting a nutrition plan, with its macros, meals and notes. */
export function deleteNutritionPlanPrompt(plan) {
  return {
    title: 'Delete This Nutrition Plan?',
    body: `“${plan.title || 'This plan'}” will be removed from the client's portal, along with its macros, meals and notes. This cannot be undone.`,
    confirmLabel: 'Delete Plan',
  }
}

/** Deleting a library item, which reaches every client it is assigned to. */
export function deleteLibraryItemPrompt(item) {
  return {
    title: 'Delete This Item?',
    body: `“${item.title}” will be removed from the library for everyone it is assigned to. This cannot be undone.`,
    confirmLabel: 'Delete Item',
  }
}

/** Removing a membership, which does not reach the subscription in Stripe. */
export function removeMembershipPrompt(clientName, productLabel) {
  return {
    title: 'Remove This Membership?',
    body: `${clientName} loses access to everything the ${productLabel.toLowerCase()} unlocks. Stripe is not touched: cancel the subscription there as well, or it keeps billing.`,
    confirmLabel: 'Remove Membership',
  }
}

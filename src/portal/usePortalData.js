import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/auth/useAuth'
import { previewContent, previewEntitlements } from './preview'
import {
  deriveEntitlements,
  getBookings,
  getContentItems,
  getMemberships,
  getMessages,
  getNutritionPlan,
  getPlans,
  getProfile,
  getProgressEntries,
} from '@/lib/api/portalApi'

/**
 * @param {object} [options]
 * @param {'membership'|'coaching'|null} [options.previewLevel] - render the
 *        portal under a client's access rules instead of the caller's own.
 *        Honoured for staff only; a client already sees their own gate.
 */
export function usePortalData({ previewLevel = null } = {}) {
  const { user, isStaff } = useAuth()
  const userId = user?.id

  const [state, setState] = useState({
    loading: true,
    profile: null,
    memberships: [],
    plans: [],
    progress: [],
    bookings: [],
    messages: [],
    content: [],
    nutrition: null,
    nutritionError: null,
  })

  const loadAll = useCallback(async () => {
    if (!userId) return
    const [profile, memberships, plans, progress, bookings, messages, content, nutrition] =
      await Promise.all([
        getProfile(userId),
        getMemberships(userId),
        getPlans(userId),
        getProgressEntries(userId),
        getBookings(userId),
        getMessages(userId),
        getContentItems(),
        getNutritionPlan(userId),
      ])
    setState({
      loading: false,
      profile,
      memberships,
      plans,
      progress,
      bookings,
      messages,
      content,
      nutrition: nutrition.plan,
      nutritionError: nutrition.error,
    })
  }, [userId])

  useEffect(() => {
    setState(prev => ({ ...prev, loading: true }))
    loadAll()
  }, [loadAll])

  const reloadProgress = useCallback(async () => {
    if (!userId) return
    const progress = await getProgressEntries(userId)
    setState(prev => ({ ...prev, progress }))
  }, [userId])

  const reloadMessages = useCallback(async () => {
    if (!userId) return
    const messages = await getMessages(userId)
    setState(prev => ({ ...prev, messages }))
  }, [userId])

  // Staff read every library row, so the preview has to put the client's gate
  // back in front of them: the entitlements that level carries, over the rows
  // that level can read.
  const preview = isStaff ? previewEntitlements(previewLevel) : null

  return {
    ...state,
    content: preview ? previewContent(state.content, previewLevel) : state.content,
    entitlements: preview ?? deriveEntitlements(state.memberships),
    previewLevel: preview ? previewLevel : null,
    reloadProgress,
    reloadMessages,
  }
}

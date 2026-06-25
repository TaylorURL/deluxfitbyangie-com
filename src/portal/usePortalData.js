import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/auth/useAuth'
import { useLanguage } from '@/i18n'
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
} from '@/lib/portalApi'

/**
 * usePortalData — loads everything the dashboard needs for the signed-in user
 * in one pass and exposes per-collection reloaders so a panel can refresh after
 * a mutation (new progress entry, sent message) without a full reload.
 */
export function usePortalData() {
  const { user } = useAuth()
  const { locale } = useLanguage()
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
        getContentItems(locale),
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
      nutrition,
    })
  }, [userId, locale])

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

  return {
    ...state,
    entitlements: deriveEntitlements(state.memberships),
    reloadProgress,
    reloadMessages,
  }
}

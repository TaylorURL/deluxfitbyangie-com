import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '@/config/supabase'
import { AuthContext } from './useAuth'

/**
 * Session lifecycle:
 *   * Hydrated once on mount via getSession().
 *   * Kept in sync with onAuthStateChange().
 *   * Profile (id, role, full_name, email) is loaded whenever the session's
 *     user id changes and cleared on sign-out.
 *
 * The profile is read with the user's own JWT — the `profiles_select_own`
 * policy ensures they can read their row. Role / privilege changes never go
 * through this provider; they live in the `invite-user` edge function.
 */
export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const lastLoadedUserIdRef = useRef(null)

  useEffect(() => {
    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session ?? null)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null)
    })
    return () => {
      active = false
      listener?.subscription?.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const userId = session?.user?.id ?? null
    if (!userId) {
      setProfile(null)
      lastLoadedUserIdRef.current = null
      return
    }
    if (lastLoadedUserIdRef.current === userId) return

    let active = true
    setProfileLoading(true)
    supabase
      .from('profiles')
      .select('id, role, full_name, email')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return
        if (error) {
          setProfile(null)
        } else {
          setProfile(data ?? null)
          lastLoadedUserIdRef.current = userId
        }
        setProfileLoading(false)
      })
    return () => {
      active = false
    }
  }, [session])

  const signIn = useCallback(async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }, [])

  /**
   * Public client signup — only ever creates a `client`. The `role` column
   * defaults to `'client'` in the DB and the `handle_new_user()` trigger
   * coerces unknown metadata roles to `'client'`, so callers cannot
   * self-promote. Staff creation goes through the `invite-user` edge function.
   */
  const signUp = useCallback(async ({ email, password, fullName }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) throw error
    return { needsConfirmation: !data.session }
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  /**
   * Send a password-reset email. The reset link lands the user on
   * `/update-password` where they can set a new password using the recovery
   * session Supabase creates for them.
   */
  const requestPasswordReset = useCallback(async ({ email }) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: origin ? `${origin}/update-password` : undefined,
    })
    if (error) throw error
  }, [])

  /**
   * Set a new password for the currently-authenticated session. Used by
   * `/update-password` after the user clicks a recovery or invite email link.
   */
  const updatePassword = useCallback(async ({ password }) => {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw error
  }, [])

  const value = useMemo(() => {
    const user = session?.user ?? null
    const role = profile?.role ?? null
    return {
      session,
      user,
      profile,
      role,
      isStaff: role === 'staff',
      isClient: role === 'client',
      loading,
      profileLoading,
      signIn,
      signUp,
      signOut,
      requestPasswordReset,
      updatePassword,
    }
  }, [
    session,
    profile,
    loading,
    profileLoading,
    signIn,
    signUp,
    signOut,
    requestPasswordReset,
    updatePassword,
  ])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AuthContext } from './useAuth'
import { importChunk } from '@/lib/chunk'

/*
 * The client is fetched rather than imported.
 *
 * This provider wraps the whole app, so a static import puts the Supabase SDK
 * (57KB compressed) in the first-load bundle of a marketing page that has no
 * account to read. Fetching it from an effect leaves it in its own chunk, which
 * a visitor downloads when the app asks who they are rather than before the
 * first screen has painted. The promise is cached, so every caller after the
 * first gets the same client without a second request.
 */
let clientPromise = null
const clientWaiters = []

function client() {
  if (!clientPromise) {
    clientPromise = importChunk(() => import('@/config/supabase')).then(m => m.supabase)
    while (clientWaiters.length) clientWaiters.pop()()
  }
  return clientPromise
}

/*
 * Every auth event on this site starts with one of the calls below asking for
 * the client, so a subscriber that is in place by the time the client is first
 * requested cannot miss one.
 */
function onClientRequested(notify) {
  if (clientPromise) {
    notify()
    return () => {}
  }
  clientWaiters.push(notify)
  return () => {
    const index = clientWaiters.indexOf(notify)
    if (index >= 0) clientWaiters.splice(index, 1)
  }
}

const AUTH_STORAGE_KEY = 'deluxfit:auth'

/*
 * Whether this visit has an account to resolve at all. A stored session is one
 * signal; the other is a link the auth server sent the visitor back on, which
 * arrives as a token in the fragment or a code in the query and has to be
 * exchanged before anything else happens on the page.
 *
 * A visit with neither is a reader on a sales page, and signed out is the
 * answer without asking: the SDK is left on the shelf until something on the
 * page actually needs an account.
 */
function hasAccountToResolve() {
  if (typeof window === 'undefined') return true
  const { hash, search } = window.location
  if (hash.includes('access_token') || hash.includes('error') || search.includes('code=')) {
    return true
  }
  try {
    return window.localStorage.getItem(AUTH_STORAGE_KEY) !== null
  } catch {
    return true
  }
}

/**
 * Session lifecycle:
 *   * Identity is hydrated on mount, and again on every auth event, from
 *     getUser(). That call asks the auth server who the token belongs to.
 *     getSession() reads the copy in browser storage and reports whatever it
 *     says, so nothing that decides access is taken from it.
 *   * The session is kept for the access token the data client sends;
 *     identity comes from the verified account beside it.
 *   * Profile (id, role, full_name, email) is loaded whenever the verified
 *     account id changes, and cleared on sign-out.
 *
 * The profile is read under `profiles_select_own`, so the role behind
 * `isStaff` is a decision the database made rather than one the browser
 * announced. Role and privilege changes never go through this provider; they
 * live in the `invite-user` edge function.
 */
export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const lastLoadedUserIdRef = useRef(null)

  useEffect(() => {
    let active = true
    let listener = null

    let hydrated = false

    const hydrate = () => {
      if (hydrated) return
      hydrated = true
      client().then(async supabase => {
        const verify = async nextSession => {
          if (!nextSession) {
            if (!active) return
            setSession(null)
            setUser(null)
            setLoading(false)
            return
          }
          const { data, error } = await supabase.auth.getUser()
          if (!active) return
          setSession(error ? null : nextSession)
          setUser(error ? null : (data.user ?? null))
          setLoading(false)
        }

        const { data } = await supabase.auth.getSession()
        if (!active) return
        await verify(data.session ?? null)
        listener = supabase.auth.onAuthStateChange((_event, nextSession) => {
          verify(nextSession ?? null)
        }).data
      })
    }

    if (hasAccountToResolve()) {
      hydrate()
      return () => {
        active = false
        listener?.subscription?.unsubscribe()
      }
    }

    // Signed out is already the answer, so the app settles on it now and the
    // listener that catches a later sign-in goes up the moment anything asks
    // for the client.
    setLoading(false)
    const stopWatching = onClientRequested(hydrate)

    return () => {
      active = false
      stopWatching()
      listener?.subscription?.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const userId = user?.id ?? null
    if (!userId) {
      setProfile(null)
      lastLoadedUserIdRef.current = null
      return
    }
    if (lastLoadedUserIdRef.current === userId) return

    let active = true
    setProfileLoading(true)
    client()
      .then(supabase =>
        supabase
          .from('profiles')
          .select('id, role, full_name, email')
          .eq('id', userId)
          .maybeSingle()
      )
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
  }, [user])

  const signIn = useCallback(async ({ email, password }) => {
    const supabase = await client()
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
    const supabase = await client()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) throw error
    return { needsConfirmation: !data.session }
  }, [])

  const signOut = useCallback(async () => {
    const supabase = await client()
    await supabase.auth.signOut()
  }, [])

  /**
   * Send a password-reset email. The reset link lands the user on
   * `/update-password` where they can set a new password using the recovery
   * session Supabase creates for them.
   */
  const requestPasswordReset = useCallback(async ({ email }) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const supabase = await client()
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
    const supabase = await client()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw error
  }, [])

  const value = useMemo(() => {
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
    user,
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

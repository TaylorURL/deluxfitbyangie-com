import { createContext, useContext } from 'react'

/** Shared auth context — provided by <AuthProvider>, consumed via useAuth. */
export const AuthContext = createContext(null)

/** Access the Supabase auth session + actions. Must be inside <AuthProvider>. */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>.')
  return ctx
}

import { createContext, useContext } from 'react'

export const AuthContext = createContext(null)

/** Must be called inside <AuthProvider>. */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>.')
  return ctx
}

import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { syncProfileFromSupabaseUser } from '../utils/userProfileStorage'
import AuthContext from './authContextObject'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshSession = useCallback(async () => {
    const { data: { session: s } } = await supabase.auth.getSession()
    setSession(s ?? null)
    if (s?.user) syncProfileFromSupabaseUser(s.user)
  }, [])

  useEffect(() => {
    let cancelled = false

    supabase.auth
      .getSession()
      .then(({ data: { session: s } }) => {
        if (cancelled) return
        setSession(s ?? null)
        if (s?.user) syncProfileFromSupabaseUser(s.user)
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setSession(null)
        setLoading(false)
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      if (cancelled) return
      setSession(s ?? null)
      if (s?.user) syncProfileFromSupabaseUser(s.user)
      setLoading(false)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  const signOut = useCallback(() => supabase.auth.signOut(), [])

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      signOut,
      refreshSession,
    }),
    [session, loading, signOut, refreshSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

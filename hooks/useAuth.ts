'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { UserProfile } from '@/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      else setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(userId: string) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(data as UserProfile | null)
    setLoading(false)
  }

  const refreshProfile = useCallback(async () => {
    if (!user) return
    await loadProfile(user.id)
  }, [user])

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user) return false
    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id)
    if (!error) await loadProfile(user.id)
    return !error
  }, [user])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    isVerified: (profile?.verification_level ?? 0) >= 2,
    isPremium: profile?.is_premium ?? false,
    refreshProfile,
    updateProfile,
    signOut,
  }
}

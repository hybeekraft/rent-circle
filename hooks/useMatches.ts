'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import type { UserProfile } from '@/types'
import { calculateCompatibility } from '@/lib/compatibility'

export type MatchCandidate = UserProfile & { compatibility: number }

export function useMatches() {
  const [candidates, setCandidates] = useState<MatchCandidate[]>([])
  const [matched, setMatched] = useState<MatchCandidate[]>([])
  const [myProfile, setMyProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    // Get my profile
    const { data: me } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (!me) { setLoading(false); return }
    setMyProfile(me as UserProfile)

    // Get users I haven't acted on yet
    const { data: acted } = await supabase
      .from('matches')
      .select('user_b')
      .eq('user_a', user.id)

    const actedIds = (acted || []).map((m: any) => m.user_b)
    const excludeIds = [...actedIds, user.id]

    // Get potential candidates
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .not('id', 'in', `(${excludeIds.join(',')})`)
      .eq('is_active', true)
      .limit(20)

    if (profiles) {
      const withScores: MatchCandidate[] = (profiles as UserProfile[]).map(p => ({
        ...p,
        compatibility: calculateCompatibility(me as UserProfile, p).total,
      })).sort((a, b) => b.compatibility - a.compatibility)

      setCandidates(withScores)
    }

    // Get my matches (mutual likes)
    const { data: mutualMatches } = await supabase
      .from('matches')
      .select('*, profile:profiles!user_b(*)')
      .eq('user_a', user.id)
      .eq('status', 'matched')

    if (mutualMatches) {
      const matchedProfiles = mutualMatches.map((m: any) => ({
        ...(m.profile as UserProfile),
        compatibility: m.compatibility_score,
      }))
      setMatched(matchedProfiles)
    }

    setLoading(false)
  }

  const like = useCallback(async (targetId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !myProfile) return false

    const target = candidates.find(c => c.id === targetId)
    const score = target ? calculateCompatibility(myProfile, target).total : 0

    // Check if they already liked us
    const { data: existing } = await supabase
      .from('matches')
      .select('id, user_a_action')
      .eq('user_a', targetId)
      .eq('user_b', user.id)
      .single()

    const isMatch = existing?.user_a_action === 'like' || existing?.user_a_action === 'super-like'

    if (existing) {
      // Update existing record
      await supabase.from('matches').update({
        user_b_action: 'like',
        status: isMatch ? 'matched' : 'pending',
        compatibility_score: score,
      }).eq('id', existing.id)
    } else {
      await supabase.from('matches').upsert({
        user_a: user.id,
        user_b: targetId,
        user_a_action: 'like',
        compatibility_score: score,
        status: 'pending',
      }, { onConflict: 'user_a,user_b' })
    }

    // Send notification to liked user
    if (isMatch) {
      await supabase.from('notifications').insert([
        { user_id: user.id, type: 'match', title: '🎉 New match!', body: `You and ${target?.full_name} are compatible roommates!`, data: { profile_id: targetId } },
        { user_id: targetId, type: 'match', title: '🎉 New match!', body: `You and ${myProfile.full_name} are compatible roommates!`, data: { profile_id: user.id } },
      ])
    }

    setCandidates(prev => prev.filter(c => c.id !== targetId))
    if (isMatch && target) {
      setMatched(prev => [...prev, { ...target, compatibility: score }])
    }

    return isMatch
  }, [candidates, myProfile])

  const pass = useCallback(async (targetId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('matches').upsert({
      user_a: user.id,
      user_b: targetId,
      user_a_action: 'pass',
      status: 'declined',
    }, { onConflict: 'user_a,user_b' })

    setCandidates(prev => prev.filter(c => c.id !== targetId))
  }, [])

  const superLike = useCallback(async (targetId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !myProfile) return

    const target = candidates.find(c => c.id === targetId)
    const score = target ? calculateCompatibility(myProfile, target).total : 0

    await supabase.from('matches').upsert({
      user_a: user.id,
      user_b: targetId,
      user_a_action: 'super-like',
      compatibility_score: score,
      status: 'pending',
    }, { onConflict: 'user_a,user_b' })

    // Notify the target
    if (target) {
      await supabase.from('notifications').insert({
        user_id: targetId,
        type: 'match',
        title: '⭐ Someone super-liked you!',
        body: `${myProfile.full_name} thinks you'd be a great roommate match!`,
        data: { profile_id: user.id },
      })
    }

    setCandidates(prev => prev.filter(c => c.id !== targetId))
  }, [candidates, myProfile])

  return { candidates, matched, myProfile, loading, like, pass, superLike }
}

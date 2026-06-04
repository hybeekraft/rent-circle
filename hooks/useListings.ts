'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import type { Listing } from '@/types'

export type ListingFilter = {
  area?: string
  state?: string
  max_rent?: number
  min_rent?: number
  verified_only?: boolean
  gender_preference?: 'male' | 'female' | 'any'
  amenities?: string[]
  property_type?: string
  search?: string
}

export function useListings(filter: ListingFilter = {}) {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 10
  const supabase = createClient()

  const buildQuery = useCallback((from: number, to: number) => {
    let q = supabase
      .from('listings')
      .select('*, owner:profiles(full_name,avatar_url,verification_level,is_verified)')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (filter.state) q = q.eq('location->>state', filter.state)
    if (filter.area) q = q.eq('location->>area', filter.area)
    if (filter.max_rent) q = q.lte('rent_amount', filter.max_rent)
    if (filter.min_rent) q = q.gte('rent_amount', filter.min_rent)
    if (filter.verified_only) q = q.eq('is_verified', true)
    if (filter.gender_preference && filter.gender_preference !== 'any') q = q.eq('gender_preference', filter.gender_preference)
    if (filter.property_type) q = q.eq('property_type', filter.property_type)
    if (filter.amenities && filter.amenities.length > 0) q = q.contains('amenities', filter.amenities)
    if (filter.search) q = q.ilike('title', `%${filter.search}%`)

    return q
  }, [JSON.stringify(filter)])

  useEffect(() => {
    setListings([])
    setPage(0)
    setHasMore(true)
    loadPage(0)
  }, [JSON.stringify(filter)])

  async function loadPage(pageNum: number) {
    setLoading(true)
    setError(null)
    try {
      const from = pageNum * PAGE_SIZE
      const to = from + PAGE_SIZE - 1
      const { data, error: err } = await buildQuery(from, to)
      if (err) throw err

      if (data) {
        setListings(prev => pageNum === 0 ? data as Listing[] : [...prev, ...data as Listing[]])
        setHasMore(data.length === PAGE_SIZE)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function loadMore() {
    if (!loading && hasMore) {
      const next = page + 1
      setPage(next)
      loadPage(next)
    }
  }

  async function saveListing(listingId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false
    const { error } = await supabase.from('saved_listings').insert({ user_id: user.id, listing_id: listingId })
    return !error
  }

  async function unsaveListing(listingId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false
    const { error } = await supabase.from('saved_listings').delete().eq('user_id', user.id).eq('listing_id', listingId)
    return !error
  }

  async function incrementViews(listingId: string) {
    await supabase.rpc('increment_listing_views', { listing_id: listingId })
  }

  return { listings, loading, error, hasMore, loadMore, saveListing, unsaveListing, incrementViews }
}

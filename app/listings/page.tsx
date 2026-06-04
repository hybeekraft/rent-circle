'use client'
import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, MapPin, Heart, Shield, Users, X, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import type { Listing } from '@/types'
import { formatCompact, NIGERIAN_AREAS, AMENITY_LABELS } from '@/lib/utils'

const MOCK_LISTINGS: Listing[] = [
  {
    id: '1', owner_id: 'u1', title: 'Cozy 1-room in Yaba, 3 mins from UNILAG',
    description: 'Clean shared apartment. NEPA stable, running water, security. 3 people already in. Looking for 1 more quiet person.',
    property_type: 'room', listing_type: 'room-available',
    rent_amount: 75000, rent_period: 'monthly', caution_fee: 75000,
    location: { state: 'Lagos', city: 'Lagos', area: 'Yaba', address: 'Herbert Macaulay Way' },
    amenities: ['electricity', 'water', 'security', 'internet'], house_rules: ['No smoking', 'Keep common areas clean'],
    photos: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'],
    spots_available: 1, gender_preference: 'any', is_verified: true, is_active: true, views: 234, created_at: '2024-06-01',
  },
  {
    id: '2', owner_id: 'u2', title: 'Self-con in Lekki Phase 1 — serviced estate',
    description: 'Brand new self-contained apartment in a gated estate. 24hr light, CCTV, gym access included.',
    property_type: 'apartment', listing_type: 'room-available',
    rent_amount: 250000, rent_period: 'monthly', caution_fee: 500000, service_charge: 50000,
    location: { state: 'Lagos', city: 'Lagos', area: 'Lekki' },
    amenities: ['electricity', 'water', 'internet', 'security', 'gym', 'cctv', 'parking', 'generator'],
    house_rules: ['No parties', 'Pets allowed'],
    photos: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'],
    spots_available: 1, gender_preference: 'any', is_verified: true, is_active: true, views: 891, created_at: '2024-05-28',
  },
  {
    id: '3', owner_id: 'u3', title: 'Shared 2-bedroom flat in Surulere',
    description: 'Looking for a working-class female to share a 2-bedroom flat. Already have 1 occupant. Very clean environment.',
    property_type: 'flat', listing_type: 'room-available',
    rent_amount: 95000, rent_period: 'monthly', caution_fee: 95000,
    location: { state: 'Lagos', city: 'Lagos', area: 'Surulere' },
    amenities: ['water', 'security', 'kitchen'],
    house_rules: ['Females only', 'No loud music after 10pm'],
    photos: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400'],
    spots_available: 1, gender_preference: 'female', is_verified: false, is_active: true, views: 156, created_at: '2024-05-30',
  },
  {
    id: '4', owner_id: 'u4', title: 'Mini-flat in Ikeja GRA — fully furnished',
    description: 'Newly furnished mini-flat. All appliances included. Ideal for young professional or NYSC member.',
    property_type: 'flat', listing_type: 'room-available',
    rent_amount: 180000, rent_period: 'monthly', caution_fee: 360000,
    location: { state: 'Lagos', city: 'Lagos', area: 'Ikeja' },
    amenities: ['electricity', 'water', 'internet', 'furnished', 'ac', 'parking', 'generator'],
    house_rules: ['No pets', 'Working professionals only'],
    photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'],
    spots_available: 1, gender_preference: 'any', is_verified: true, is_active: true, views: 445, created_at: '2024-05-25',
  },
]

const AREAS = ['All areas', ...NIGERIAN_AREAS['Lagos']]

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS)
  const [search, setSearch] = useState('')
  const [area, setArea] = useState('All areas')
  const [maxBudget, setMaxBudget] = useState(500000)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [saved, setSaved] = useState<string[]>([])

  const filtered = listings.filter(l => {
    if (search && !l.title.toLowerCase().includes(search.toLowerCase()) && !l.location.area.toLowerCase().includes(search.toLowerCase())) return false
    if (area !== 'All areas' && l.location.area !== area) return false
    if (l.rent_amount > maxBudget) return false
    if (verifiedOnly && !l.is_verified) return false
    return true
  })

  function toggleSave(id: string) {
    setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  }

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-ink-100 px-4 py-3">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 flex items-center gap-2 bg-ink-50 rounded-2xl px-3 py-2.5">
            <Search size={16} className="text-ink-400 flex-shrink-0" />
            <input
              placeholder="Search by name, area..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none text-ink-900 placeholder:text-ink-400"
            />
            {search && <button onClick={() => setSearch('')}><X size={14} className="text-ink-400" /></button>}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-2xl border-2 transition-colors ${showFilters ? 'bg-brand-500 border-brand-500 text-white' : 'border-ink-200 text-ink-600'}`}
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>

        {/* Area pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
          {AREAS.slice(0, 8).map(a => (
            <button
              key={a}
              onClick={() => setArea(a)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                area === a ? 'bg-brand-500 text-white' : 'bg-ink-100 text-ink-600'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white border-b border-ink-100 px-4 py-4 animate-slide-up">
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-ink-700">Max monthly rent</label>
                <span className="text-sm font-semibold text-brand-600">₦{(maxBudget/1000).toFixed(0)}k</span>
              </div>
              <input
                type="range" min="20000" max="1000000" step="10000"
                value={maxBudget}
                onChange={e => setMaxBudget(parseInt(e.target.value))}
                className="w-full accent-brand-500"
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={`w-11 h-6 rounded-full transition-colors flex items-center ${verifiedOnly ? 'bg-brand-500' : 'bg-ink-200'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mx-0.5 ${verifiedOnly ? 'translate-x-5' : ''}`} />
              </div>
              <span className="text-sm text-ink-700 flex items-center gap-1.5">
                <Shield size={14} className="text-green-500" /> Verified listings only
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="px-4 py-3">
        <p className="text-sm text-ink-500">
          <span className="font-semibold text-ink-900">{filtered.length}</span> listings found
        </p>
      </div>

      {/* Listing cards */}
      <div className="px-4 flex flex-col gap-4 pb-4">
        {filtered.map(listing => (
          <ListingCard
            key={listing.id}
            listing={listing}
            saved={saved.includes(listing.id)}
            onSave={() => toggleSave(listing.id)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-3xl mb-3">🏠</p>
            <p className="font-semibold text-ink-800">No listings found</p>
            <p className="text-sm text-ink-400 mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ListingCard({ listing, saved, onSave }: { listing: Listing; saved: boolean; onSave: () => void }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-ink-100 active:scale-[0.99] transition-transform">
      {/* Photo */}
      <div className="relative h-48">
        <img
          src={listing.photos[0]}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <button
          onClick={onSave}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center"
        >
          <Heart size={18} className={saved ? 'fill-red-500 text-red-500' : 'text-ink-500'} />
        </button>
        <div className="absolute bottom-3 left-3 flex gap-2">
          {listing.is_verified && (
            <span className="flex items-center gap-1 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              <Shield size={11} /> Verified
            </span>
          )}
          {listing.gender_preference && listing.gender_preference !== 'any' && (
            <span className="bg-purple-500 text-white text-xs font-medium px-2 py-1 rounded-full capitalize">
              {listing.gender_preference} only
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <Link href={`/listings/${listing.id}`}>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-ink-900 text-sm leading-snug flex-1">{listing.title}</h3>
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-brand-600 text-base">{formatCompact(listing.rent_amount)}</p>
              <p className="text-xs text-ink-400">/month</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-ink-500 text-xs mb-3">
            <MapPin size={12} />
            <span>{listing.location.area}, {listing.location.state}</span>
          </div>

          <p className="text-xs text-ink-500 line-clamp-2 mb-3">{listing.description}</p>

          {/* Amenities */}
          <div className="flex gap-1.5 flex-wrap">
            {listing.amenities.slice(0, 4).map(a => (
              <span key={a} className="text-xs bg-ink-50 text-ink-600 px-2 py-1 rounded-full border border-ink-100">
                {AMENITY_LABELS[a] || a}
              </span>
            ))}
            {listing.amenities.length > 4 && (
              <span className="text-xs text-ink-400 py-1">+{listing.amenities.length - 4} more</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

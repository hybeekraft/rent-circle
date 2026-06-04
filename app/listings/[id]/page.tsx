'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Heart, Share2, Shield, MapPin, ChevronDown, ChevronUp, Star, Phone, MessageCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { VerificationBadge } from '@/components/ui/VerificationBadge'
import { formatNaira, AMENITY_LABELS } from '@/lib/utils'
import type { Listing } from '@/types'

// Mock data — replace with Supabase fetch
const LISTING: Listing = {
  id: '1', owner_id: 'u1',
  title: 'Cozy 1-room in Yaba, 3 mins from UNILAG',
  description: `Clean shared apartment in the heart of Yaba. NEPA is very stable here — about 18hrs/day. Running water 24/7. Already have 3 quiet, working-class people. Looking for 1 more respectful person.

The apartment is on the 2nd floor of a 3-storey building in a peaceful street off Herbert Macaulay Way. 10 minutes walk to UNILAG gate, 5 minutes to Herbert Macaulay road for buses.

Shared spaces are well-maintained. We have a house meeting once a month to discuss any issues. Very drama-free household.`,
  property_type: 'room', listing_type: 'room-available',
  rent_amount: 75000, rent_period: 'monthly', caution_fee: 75000,
  location: { state: 'Lagos', city: 'Lagos', area: 'Yaba', address: 'Herbert Macaulay Way, Yaba' },
  amenities: ['electricity', 'water', 'security', 'internet', 'kitchen', 'generator'],
  house_rules: ['No smoking indoors', 'Keep common areas clean', 'Quiet hours after 10pm', 'No overnight guests without notice'],
  photos: [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600',
  ],
  spots_available: 1, gender_preference: 'any',
  is_verified: true, is_active: true, views: 234, created_at: '2024-06-01',
}

const OWNER = {
  name: 'Tunde Adekunle', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
  occupation: 'Software Engineer', verification_level: 2 as const,
  response_rate: 94, response_time: '< 1 hour', reviews: 8, rating: 4.7,
}

const REVIEWS = [
  { name: 'Amara O.', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=60', rating: 5, comment: 'Super clean house, very honest landlord. Highly recommended!', date: '2 weeks ago' },
  { name: 'Chidi N.', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60', rating: 4, comment: 'Great place, good neighbourhood. Slight issue with NEPA sometimes but generator saves it.', date: '1 month ago' },
]

export default function ListingDetailPage() {
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [photoIdx, setPhotoIdx] = useState(0)
  const [showFullDesc, setShowFullDesc] = useState(false)
  const [showReport, setShowReport] = useState(false)

  const shortDesc = LISTING.description.split('\n')[0]

  return (
    <div className="min-h-screen bg-ink-50 pb-28">
      {/* Photo carousel */}
      <div className="relative h-64 bg-ink-200">
        <img
          src={LISTING.photos[photoIdx]}
          alt={LISTING.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />

        {/* Top actions */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm"
          >
            <ArrowLeft size={18} className="text-ink-700" />
          </button>
          <div className="flex gap-2">
            <button onClick={() => setSaved(!saved)} className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
              <Heart size={18} className={saved ? 'fill-red-500 text-red-500' : 'text-ink-700'} />
            </button>
            <button className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
              <Share2 size={18} className="text-ink-700" />
            </button>
          </div>
        </div>

        {/* Photo dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {LISTING.photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setPhotoIdx(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === photoIdx ? 'w-4 bg-white' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-t-3xl -mt-5 relative px-5 pt-5">
        {/* Badges */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {LISTING.is_verified && <VerificationBadge level={3} showLabel />}
          {LISTING.gender_preference && LISTING.gender_preference !== 'any' && (
            <span className="inline-flex items-center gap-1 text-xs font-medium bg-purple-50 text-purple-700 px-2 py-1 rounded-full capitalize">
              {LISTING.gender_preference} only
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-xs font-medium bg-ink-100 text-ink-600 px-2 py-1 rounded-full">
            <MapPin size={11} /> {LISTING.location.area}, {LISTING.location.state}
          </span>
        </div>

        {/* Title & price */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <h1 className="text-lg font-bold text-ink-900 flex-1 leading-snug">{LISTING.title}</h1>
          <div className="text-right flex-shrink-0">
            <p className="text-xl font-bold text-brand-600">{formatNaira(LISTING.rent_amount)}</p>
            <p className="text-xs text-ink-400">/month</p>
          </div>
        </div>

        {/* Key details */}
        <div className="grid grid-cols-3 gap-3 mb-5 p-4 bg-ink-50 rounded-2xl">
          <div className="text-center">
            <p className="font-bold text-ink-900">{formatNaira(LISTING.caution_fee || 0)}</p>
            <p className="text-xs text-ink-400 mt-0.5">Caution fee</p>
          </div>
          <div className="text-center border-x border-ink-200">
            <p className="font-bold text-ink-900">{LISTING.spots_available} spot{LISTING.spots_available > 1 ? 's' : ''}</p>
            <p className="text-xs text-ink-400 mt-0.5">Available</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-ink-900 capitalize">{LISTING.gender_preference || 'Any'}</p>
            <p className="text-xs text-ink-400 mt-0.5">Gender pref</p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-5">
          <h2 className="text-sm font-bold text-ink-900 mb-2">About this place</h2>
          <p className="text-sm text-ink-600 leading-relaxed">
            {showFullDesc ? LISTING.description : shortDesc}
          </p>
          <button
            onClick={() => setShowFullDesc(!showFullDesc)}
            className="flex items-center gap-1 text-brand-500 text-sm font-medium mt-2"
          >
            {showFullDesc ? <><ChevronUp size={15} /> Show less</> : <><ChevronDown size={15} /> Read more</>}
          </button>
        </div>

        {/* Amenities */}
        <div className="mb-5">
          <h2 className="text-sm font-bold text-ink-900 mb-3">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {LISTING.amenities.map(a => (
              <span key={a} className="text-xs bg-ink-50 border border-ink-200 text-ink-600 px-3 py-1.5 rounded-full">
                {AMENITY_LABELS[a] || a}
              </span>
            ))}
          </div>
        </div>

        {/* House rules */}
        <div className="mb-5">
          <h2 className="text-sm font-bold text-ink-900 mb-3">House rules</h2>
          <div className="flex flex-col gap-2">
            {LISTING.house_rules.map((rule, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-ink-600">
                <span className="text-ink-300 mt-0.5">•</span> {rule}
              </div>
            ))}
          </div>
        </div>

        {/* Owner card */}
        <div className="mb-5 p-4 bg-ink-50 rounded-2xl">
          <h2 className="text-sm font-bold text-ink-900 mb-3">Listed by</h2>
          <div className="flex items-center gap-3 mb-3">
            <img src={OWNER.avatar} alt={OWNER.name} className="w-12 h-12 rounded-full object-cover" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-ink-900 text-sm">{OWNER.name}</p>
                <VerificationBadge level={OWNER.verification_level} size="sm" />
              </div>
              <p className="text-xs text-ink-500">{OWNER.occupation}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white rounded-xl p-2">
              <p className="font-bold text-ink-900 text-sm">{OWNER.response_rate}%</p>
              <p className="text-xs text-ink-400">Response</p>
            </div>
            <div className="bg-white rounded-xl p-2">
              <p className="font-bold text-ink-900 text-sm">{OWNER.response_time}</p>
              <p className="text-xs text-ink-400">Replies in</p>
            </div>
            <div className="bg-white rounded-xl p-2">
              <p className="font-bold text-ink-900 text-sm flex items-center justify-center gap-0.5">
                <Star size={11} className="text-amber-400 fill-amber-400" />{OWNER.rating}
              </p>
              <p className="text-xs text-ink-400">{OWNER.reviews} reviews</p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-ink-900">Reviews</h2>
            <button className="text-xs text-brand-500 font-medium">See all</button>
          </div>
          <div className="flex flex-col gap-3">
            {REVIEWS.map((r, i) => (
              <div key={i} className="p-3 bg-ink-50 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <img src={r.avatar} alt={r.name} className="w-8 h-8 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-ink-900">{r.name}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={10} className={j < r.rating ? 'fill-amber-400 text-amber-400' : 'text-ink-200'} />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-ink-400">{r.date}</span>
                </div>
                <p className="text-xs text-ink-600 leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Report */}
        <button
          onClick={() => setShowReport(true)}
          className="flex items-center gap-2 text-xs text-ink-400 mb-6"
        >
          <AlertTriangle size={13} /> Report this listing
        </button>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-ink-100 px-5 py-4 flex gap-3 max-w-lg mx-auto">
        <Button variant="outline" size="lg" className="flex-1" leftIcon={<Phone size={16} />}>
          Call
        </Button>
        <Button size="lg" className="flex-2" leftIcon={<MessageCircle size={16} />} style={{ flex: 2 }}>
          Message landlord
        </Button>
      </div>

      {/* Report sheet */}
      {showReport && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50" onClick={() => setShowReport(false)}>
          <div className="bg-white w-full rounded-t-3xl p-6" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-ink-200 rounded-full mx-auto mb-5" />
            <h3 className="font-semibold text-ink-900 mb-4">Report listing</h3>
            {['Fake or misleading listing', 'Wrong price listed', 'Listing no longer available', 'Suspicious landlord', 'Other'].map(reason => (
              <button
                key={reason}
                className="flex items-center gap-3 w-full py-3 text-sm text-ink-700 border-b border-ink-50 last:border-0"
                onClick={() => setShowReport(false)}
              >
                <AlertTriangle size={16} className="text-amber-500" /> {reason}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

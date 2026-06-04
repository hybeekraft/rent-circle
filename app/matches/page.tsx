'use client'
import { useState } from 'react'
import { X, Heart, Star, MapPin, Briefcase, Moon, Users, Shield, ChevronDown, Info } from 'lucide-react'
import { calculateCompatibility, getCompatibilityLabel } from '@/lib/compatibility'
import type { UserProfile } from '@/types'

const MOCK_PROFILES: UserProfile[] = [
  {
    id: 'p1', email: 'chioma@email.com', full_name: 'Chioma Okafor',
    age: 26, gender: 'female', occupation: 'Software Engineer',
    school_or_company: 'Paystack', bio: 'Tech girl, clean freak 😅. I cook on weekends and love Afrobeats. Looking for a mature, working-class roommate in Lekki or VI.',
    avatar_url: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400',
    preferred_areas: ['Lekki', 'VI', 'Ajah'],
    budget_min: 150000, budget_max: 300000,
    lifestyle: { cleanliness: 5, smoking: 'no', drinking: 'occasionally', sleep_schedule: 'early-bird', guests: 'rarely', work_schedule: 'hybrid', hobbies: ['Cooking', 'Music', 'Fitness'] },
    is_verified: true, verification_level: 3, is_premium: false, created_at: '2024-05-01',
  },
  {
    id: 'p2', email: 'emeka@email.com', full_name: 'Emeka Eze',
    age: 28, gender: 'male', occupation: 'NYSC Member',
    school_or_company: 'Federal Ministry of Finance', bio: 'Corper serving in Lagos. Looking for affordable shared apartment close to work. Very clean and respectful.',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    preferred_areas: ['Yaba', 'Surulere', 'Ikeja'],
    budget_min: 40000, budget_max: 90000,
    lifestyle: { cleanliness: 4, smoking: 'no', drinking: 'no', sleep_schedule: 'early-bird', guests: 'sometimes', work_schedule: 'office', hobbies: ['Sports', 'Reading', 'Gaming'] },
    is_verified: true, verification_level: 2, is_premium: false, created_at: '2024-05-10',
  },
  {
    id: 'p3', email: 'zara@email.com', full_name: 'Zara Abdullahi',
    age: 24, gender: 'female', occupation: 'Remote Worker',
    school_or_company: 'Flutterwave', bio: 'Remote UX designer. I\'m mostly home during the day so need a quiet house. Love plants and cats. 🌿',
    avatar_url: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400',
    preferred_areas: ['Lekki', 'Ikeja', 'Gbagada'],
    budget_min: 100000, budget_max: 200000,
    lifestyle: { cleanliness: 4, smoking: 'no', drinking: 'occasionally', sleep_schedule: 'flexible', guests: 'rarely', work_schedule: 'remote', hobbies: ['Art', 'Travel', 'Music'] },
    is_verified: false, verification_level: 1, is_premium: true, created_at: '2024-05-15',
  },
]

const MY_PROFILE: UserProfile = {
  id: 'me', email: 'me@email.com', full_name: 'You',
  budget_min: 80000, budget_max: 200000,
  preferred_areas: ['Yaba', 'Lekki', 'Ikeja'],
  lifestyle: { cleanliness: 4, smoking: 'no', drinking: 'occasionally', sleep_schedule: 'early-bird', guests: 'sometimes', work_schedule: 'office' },
  is_verified: true, verification_level: 2, is_premium: false, created_at: '2024-06-01',
}

export default function MatchesPage() {
  const [profiles] = useState(MOCK_PROFILES)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | null>(null)
  const [matched, setMatched] = useState<UserProfile[]>([])
  const [showMatch, setShowMatch] = useState<UserProfile | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [tab, setTab] = useState<'discover' | 'matches'>('discover')

  const current = profiles[currentIdx]

  function swipe(dir: 'left' | 'right') {
    setSwipeDir(dir)
    setTimeout(() => {
      if (dir === 'right' && current) {
        setMatched(m => [...m, current])
        setShowMatch(current)
      }
      setSwipeDir(null)
      setCurrentIdx(i => i + 1)
      setExpanded(false)
    }, 400)
  }

  const score = current ? calculateCompatibility(MY_PROFILE, current) : null
  const label = score ? getCompatibilityLabel(score.total) : null

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-ink-100">
        <h1 className="text-xl font-bold text-ink-900 mb-3">Roommate Matches</h1>
        <div className="flex bg-ink-100 rounded-2xl p-1">
          {(['discover', 'matches'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-all ${tab === t ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500'}`}
            >
              {t} {t === 'matches' && matched.length > 0 && `(${matched.length})`}
            </button>
          ))}
        </div>
      </div>

      {tab === 'discover' && (
        <div className="px-4 pt-4">
          {currentIdx >= profiles.length ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🎉</p>
              <p className="text-xl font-bold text-ink-900">You've seen everyone!</p>
              <p className="text-ink-500 text-sm mt-2">Check back later for new profiles</p>
            </div>
          ) : current ? (
            <div>
              {/* Score pill */}
              {score && label && (
                <div className="flex justify-center mb-3">
                  <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-ink-100">
                    <div className="w-2 h-2 rounded-full" style={{ background: label.color }} />
                    <span className="text-sm font-semibold" style={{ color: label.color }}>{score.total}% — {label.label}</span>
                  </div>
                </div>
              )}

              {/* Card */}
              <div className={`bg-white rounded-3xl overflow-hidden shadow-md ${swipeDir === 'left' ? 'swipe-left' : swipeDir === 'right' ? 'swipe-right' : ''}`}>
                <div className="relative h-80">
                  <img src={current.avatar_url} alt={current.full_name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    {current.is_premium && (
                      <span className="flex items-center gap-1 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full">
                        <Star size={10} fill="currentColor" /> PRO
                      </span>
                    )}
                    {current.verification_level >= 2 && (
                      <span className="flex items-center gap-1 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                        <Shield size={10} /> Verified
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-white text-2xl font-bold">{current.full_name}, {current.age}</h2>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {current.occupation && (
                        <span className="flex items-center gap-1 text-white/90 text-xs">
                          <Briefcase size={12} /> {current.occupation}
                        </span>
                      )}
                      {current.preferred_areas && current.preferred_areas.length > 0 && (
                        <span className="flex items-center gap-1 text-white/90 text-xs">
                          <MapPin size={12} /> {current.preferred_areas[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4">
                  <p className="text-sm text-ink-600 leading-relaxed mb-3">{current.bio}</p>

                  {/* Lifestyle chips */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {current.lifestyle.sleep_schedule && (
                      <span className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full">
                        <Moon size={11} />
                        {current.lifestyle.sleep_schedule === 'early-bird' ? 'Early bird' : current.lifestyle.sleep_schedule === 'night-owl' ? 'Night owl' : 'Flexible'}
                      </span>
                    )}
                    {current.lifestyle.cleanliness && (
                      <span className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full">
                        {'★'.repeat(current.lifestyle.cleanliness)} Clean
                      </span>
                    )}
                    {current.lifestyle.smoking === 'no' && (
                      <span className="bg-ink-50 text-ink-600 text-xs px-3 py-1 rounded-full">🚭 Non-smoker</span>
                    )}
                    {current.lifestyle.hobbies?.map(h => (
                      <span key={h} className="bg-purple-50 text-purple-700 text-xs px-3 py-1 rounded-full">{h}</span>
                    ))}
                  </div>

                  {/* Compatibility breakdown */}
                  {score && (
                    <div className="bg-ink-50 rounded-2xl p-3">
                      <p className="text-xs font-semibold text-ink-600 mb-2">Compatibility breakdown</p>
                      {[
                        { label: 'Budget', val: score.budget, max: 25 },
                        { label: 'Location', val: score.location, max: 20 },
                        { label: 'Lifestyle', val: score.lifestyle, max: 35 },
                        { label: 'Schedule', val: score.schedule, max: 20 },
                      ].map(({ label, val, max }) => (
                        <div key={label} className="flex items-center gap-2 mb-1.5 last:mb-0">
                          <span className="text-xs text-ink-500 w-16 flex-shrink-0">{label}</span>
                          <div className="flex-1 h-1.5 bg-ink-200 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-500 rounded-full" style={{ width: `${(val/max)*100}%` }} />
                          </div>
                          <span className="text-xs font-medium text-ink-700 w-8 text-right">{val}/{max}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-center gap-6 mt-6 mb-4">
                <button
                  onClick={() => swipe('left')}
                  className="w-16 h-16 bg-white rounded-full shadow-md border border-ink-100 flex items-center justify-center active:scale-95 transition-transform"
                >
                  <X size={28} className="text-red-400" />
                </button>
                <button
                  onClick={() => swipe('right')}
                  className="w-20 h-20 bg-brand-500 rounded-full shadow-lg shadow-brand-200 flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Heart size={32} className="text-white fill-white" />
                </button>
                <button className="w-16 h-16 bg-white rounded-full shadow-md border border-ink-100 flex items-center justify-center active:scale-95 transition-transform">
                  <Star size={24} className="text-amber-400" />
                </button>
              </div>
              <p className="text-center text-xs text-ink-400">{profiles.length - currentIdx - 1} more profiles to view</p>
            </div>
          ) : null}
        </div>
      )}

      {tab === 'matches' && (
        <div className="px-4 pt-4">
          {matched.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">💫</p>
              <p className="font-semibold text-ink-800">No matches yet</p>
              <p className="text-sm text-ink-400 mt-2">Start swiping to find compatible roommates</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {matched.map(profile => (
                <div key={profile.id} className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-ink-100">
                  <img src={profile.avatar_url} alt={profile.full_name} className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink-900">{profile.full_name}</p>
                    <p className="text-xs text-ink-500">{profile.occupation} · {profile.preferred_areas?.[0]}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs font-medium text-green-600">
                        {calculateCompatibility(MY_PROFILE, profile).total}% match
                      </span>
                    </div>
                  </div>
                  <button className="bg-brand-500 text-white text-xs font-medium px-4 py-2 rounded-xl">Message</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Match popup */}
      {showMatch && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4" style={{background:'rgba(0,0,0,0.6)'}}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm animate-slide-up text-center">
            <div className="text-4xl mb-3">🎊</div>
            <h3 className="text-2xl font-bold text-ink-900 mb-1">It's a match!</h3>
            <p className="text-ink-500 text-sm mb-4">
              You and <span className="font-semibold text-ink-900">{showMatch.full_name}</span> could be great roommates!
            </p>
            <img src={showMatch.avatar_url} alt={showMatch.full_name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-brand-100" />
            <div className="flex gap-3">
              <button onClick={() => setShowMatch(null)} className="flex-1 py-3 border-2 border-ink-200 rounded-2xl text-sm font-medium text-ink-600">
                Keep swiping
              </button>
              <button onClick={() => setShowMatch(null)} className="flex-1 py-3 bg-brand-500 text-white rounded-2xl text-sm font-medium">
                Send message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

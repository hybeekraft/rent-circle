'use client'
import { useState, useCallback } from 'react'
import { Search, SlidersHorizontal, X, MapPin, Zap } from 'lucide-react'
import Link from 'next/link'
import { NIGERIAN_AREAS, AMENITY_LABELS, formatCompact } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

const PROPERTY_TYPES = ['room', 'flat', 'apartment', 'duplex']
const GENDER_PREFS = ['any', 'male', 'female']

const RECENT_SEARCHES = ['Yaba room ₦80k', 'Lekki self-con', 'Surulere female only', 'Ikeja 2 bedroom']

const AI_SUGGESTIONS = [
  { query: 'NYSC-friendly rooms in Yaba', icon: '🎓' },
  { query: 'Remote worker quiet flats in Ikeja', icon: '💻' },
  { query: 'Verified listings under ₦100k Lagos', icon: '✅' },
  { query: 'Group renting opportunities Lekki', icon: '👥' },
]

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [state, setState] = useState('Lagos')
  const [area, setArea] = useState('')
  const [maxRent, setMaxRent] = useState(300000)
  const [minRent, setMinRent] = useState(0)
  const [propertyType, setPropertyType] = useState('')
  const [genderPref, setGenderPref] = useState('any')
  const [amenities, setAmenities] = useState<string[]>([])
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  function toggleAmenity(a: string) {
    setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])
  }

  function clearAll() {
    setQuery('')
    setArea('')
    setMaxRent(300000)
    setMinRent(0)
    setPropertyType('')
    setGenderPref('any')
    setAmenities([])
    setVerifiedOnly(false)
  }

  const hasFilters = area || propertyType || genderPref !== 'any' || amenities.length > 0 || verifiedOnly || minRent > 0 || maxRent < 300000

  const areas = NIGERIAN_AREAS[state as keyof typeof NIGERIAN_AREAS] || []

  const searchParams = new URLSearchParams({
    ...(query && { q: query }),
    ...(area && { area }),
    ...(state && { state }),
    ...(maxRent < 1000000 && { max_rent: maxRent.toString() }),
    ...(minRent > 0 && { min_rent: minRent.toString() }),
    ...(propertyType && { type: propertyType }),
    ...(genderPref !== 'any' && { gender: genderPref }),
    ...(verifiedOnly && { verified: '1' }),
    ...(amenities.length > 0 && { amenities: amenities.join(',') }),
  })

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Search header */}
      <div className="bg-white px-4 py-4 border-b border-ink-100 sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 flex items-center gap-2 bg-ink-50 border border-ink-200 rounded-2xl px-3 py-2.5">
            <Search size={16} className="text-ink-400 flex-shrink-0" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search area, property type..."
              className="flex-1 bg-transparent text-sm outline-none text-ink-900 placeholder:text-ink-400"
              autoFocus
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-ink-400">
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative p-2.5 rounded-2xl border-2 transition-colors ${showFilters ? 'bg-brand-500 border-brand-500 text-white' : 'border-ink-200 text-ink-600'}`}
          >
            <SlidersHorizontal size={18} />
            {hasFilters && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                !
              </span>
            )}
          </button>
        </div>

        {/* State tabs */}
        <div className="flex gap-2">
          {Object.keys(NIGERIAN_AREAS).map(s => (
            <button
              key={s}
              onClick={() => { setState(s); setArea('') }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all ${state === s ? 'bg-brand-500 border-brand-500 text-white' : 'border-ink-200 text-ink-600'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white border-b border-ink-100 px-4 py-5 space-y-5">
          {/* Area */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-ink-700 uppercase tracking-wide">Area in {state}</label>
              {area && <button onClick={() => setArea('')} className="text-xs text-brand-500">Clear</button>}
            </div>
            <div className="flex flex-wrap gap-2">
              {areas.map(a => (
                <button
                  key={a}
                  onClick={() => setArea(a === area ? '' : a)}
                  className={`px-3 py-1.5 rounded-full text-xs border-2 transition-all ${area === a ? 'border-brand-500 bg-brand-500 text-white' : 'border-ink-200 text-ink-600 bg-white'}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Rent range */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-ink-700 uppercase tracking-wide">Monthly rent</label>
              <span className="text-xs font-bold text-brand-600">
                {minRent > 0 ? `₦${(minRent/1000).toFixed(0)}k` : '₦0'} – ₦{(maxRent/1000).toFixed(0)}k
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs text-ink-400 w-8">Min</span>
                <input type="range" min="0" max="500000" step="5000" value={minRent}
                  onChange={e => setMinRent(Math.min(parseInt(e.target.value), maxRent - 10000))}
                  className="flex-1 accent-brand-500" />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-ink-400 w-8">Max</span>
                <input type="range" min="20000" max="1000000" step="10000" value={maxRent}
                  onChange={e => setMaxRent(Math.max(parseInt(e.target.value), minRent + 10000))}
                  className="flex-1 accent-brand-500" />
              </div>
            </div>
          </div>

          {/* Property type */}
          <div>
            <label className="text-xs font-semibold text-ink-700 uppercase tracking-wide block mb-2">Property type</label>
            <div className="flex gap-2 flex-wrap">
              {PROPERTY_TYPES.map(t => (
                <button key={t} onClick={() => setPropertyType(t === propertyType ? '' : t)}
                  className={`px-3.5 py-2 rounded-full text-xs capitalize border-2 transition-all ${propertyType === t ? 'border-brand-500 bg-brand-50 text-brand-700 font-medium' : 'border-ink-200 text-ink-600'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Gender preference */}
          <div>
            <label className="text-xs font-semibold text-ink-700 uppercase tracking-wide block mb-2">Gender preference</label>
            <div className="flex gap-2">
              {GENDER_PREFS.map(g => (
                <button key={g} onClick={() => setGenderPref(g)}
                  className={`flex-1 py-2 rounded-xl text-xs capitalize border-2 font-medium transition-all ${genderPref === g ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-ink-200 text-ink-600'}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="text-xs font-semibold text-ink-700 uppercase tracking-wide block mb-2">Must-have amenities</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(AMENITY_LABELS).map(([key, label]) => (
                <button key={key} onClick={() => toggleAmenity(key)}
                  className={`px-3 py-1.5 rounded-full text-xs border-2 transition-all ${amenities.includes(key) ? 'border-brand-500 bg-brand-500 text-white' : 'border-ink-200 text-ink-600 bg-white'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Verified only */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink-900">Verified listings only</p>
              <p className="text-xs text-ink-400">Manually checked by RentCircle</p>
            </div>
            <button
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`w-12 h-6 rounded-full transition-colors flex items-center px-0.5 ${verifiedOnly ? 'bg-brand-500' : 'bg-ink-200'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${verifiedOnly ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex gap-3 pt-1">
            <Button variant="secondary" size="md" onClick={clearAll} className="flex-1">
              Clear all
            </Button>
            <Link href={`/listings?${searchParams}`} className="flex-1">
              <Button size="md" fullWidth leftIcon={<Search size={15} />}>
                Search listings
              </Button>
            </Link>
          </div>
        </div>
      )}

      <div className="px-4 py-5 space-y-5">
        {/* AI Suggestions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap size={14} className="text-brand-500" />
            <p className="text-xs font-bold text-ink-700 uppercase tracking-wide">AI-powered searches</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {AI_SUGGESTIONS.map(({ query: q, icon }) => (
              <button
                key={q}
                onClick={() => setQuery(q)}
                className="flex items-start gap-2 p-3 bg-white rounded-2xl border border-ink-100 text-left hover:border-brand-200 hover:bg-brand-50 transition-all"
              >
                <span className="text-lg flex-shrink-0">{icon}</span>
                <p className="text-xs text-ink-700 leading-snug font-medium">{q}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent searches */}
        <div>
          <p className="text-xs font-bold text-ink-700 uppercase tracking-wide mb-3">Recent searches</p>
          <div className="flex flex-col gap-1">
            {RECENT_SEARCHES.map(s => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-ink-100 transition-colors text-left"
              >
                <Search size={14} className="text-ink-400 flex-shrink-0" />
                <span className="text-sm text-ink-700">{s}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Popular areas */}
        <div>
          <p className="text-xs font-bold text-ink-700 uppercase tracking-wide mb-3">Popular areas in Lagos</p>
          <div className="grid grid-cols-3 gap-2">
            {['Yaba', 'Lekki', 'Surulere', 'Ikeja', 'VI', 'Ajah'].map(a => (
              <Link
                key={a}
                href={`/listings?area=${a}&state=Lagos`}
                className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-ink-100 hover:border-brand-200 hover:bg-brand-50 transition-all"
              >
                <MapPin size={16} className="text-brand-500 mb-1.5" />
                <p className="text-xs font-semibold text-ink-900">{a}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        {(query || hasFilters) && (
          <div className="fixed bottom-20 left-4 right-4 max-w-lg mx-auto">
            <Link href={`/listings?${searchParams}`}>
              <Button size="lg" fullWidth leftIcon={<Search size={18} />} className="shadow-xl shadow-brand-200">
                Search listings
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

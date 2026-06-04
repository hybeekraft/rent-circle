'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Upload, Plus, X, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase'
import { NIGERIAN_AREAS, AMENITY_LABELS } from '@/lib/utils'
import { z } from 'zod'

const STEPS = ['type', 'details', 'location', 'amenities', 'photos', 'rules', 'review'] as const
type Step = typeof STEPS[number]

const PROPERTY_TYPES = [
  { val: 'room', label: 'Single Room', emoji: '🛏️', desc: 'A room in a shared apartment' },
  { val: 'flat', label: 'Flat / Mini-flat', emoji: '🏠', desc: 'Self-contained or shared flat' },
  { val: 'apartment', label: 'Apartment', emoji: '🏢', desc: 'Full apartment seeking roommates' },
  { val: 'duplex', label: 'Duplex / Bungalow', emoji: '🏡', desc: 'Larger property' },
]

export default function PostListingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('type')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const [form, setForm] = useState({
    property_type: '',
    listing_type: 'room-available',
    title: '',
    description: '',
    rent_amount: 75000,
    caution_fee: 75000,
    service_charge: 0,
    state: 'Lagos',
    area: '',
    address: '',
    amenities: [] as string[],
    house_rules: ['Keep common areas clean', 'No smoking indoors'],
    new_rule: '',
    gender_preference: 'any',
    spots_available: 1,
    photos: [] as string[],
  })

  const stepIdx = STEPS.indexOf(step)
  const progress = ((stepIdx + 1) / STEPS.length) * 100

  function update(k: string, v: any) {
    setForm(f => ({ ...f, [k]: v }))
  }

  function toggleAmenity(a: string) {
    update('amenities', form.amenities.includes(a)
      ? form.amenities.filter(x => x !== a)
      : [...form.amenities, a])
  }

  function addRule() {
    if (!form.new_rule.trim()) return
    update('house_rules', [...form.house_rules, form.new_rule.trim()])
    update('new_rule', '')
  }

  function removeRule(i: number) {
    update('house_rules', form.house_rules.filter((_, idx) => idx !== i))
  }

  function next() {
    setStep(STEPS[Math.min(STEPS.length - 1, stepIdx + 1)])
  }

  function back() {
    setStep(STEPS[Math.max(0, stepIdx - 1)])
  }

  async function submit() {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not logged in')

      await supabase.from('listings').insert({
        owner_id: user.id,
        title: form.title,
        description: form.description,
        property_type: form.property_type,
        listing_type: form.listing_type,
        rent_amount: form.rent_amount,
        caution_fee: form.caution_fee,
        service_charge: form.service_charge || null,
        location: { state: form.state, city: form.state, area: form.area, address: form.address },
        amenities: form.amenities,
        house_rules: form.house_rules,
        gender_preference: form.gender_preference,
        spots_available: form.spots_available,
        photos: form.photos,
      })
      router.push('/listings')
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const areas = NIGERIAN_AREAS[form.state as keyof typeof NIGERIAN_AREAS] || []

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-ink-100 px-4 py-3">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={back} disabled={stepIdx === 0} className="p-1 text-ink-400 disabled:opacity-0">
            <ArrowLeft size={20} />
          </button>
          <h2 className="flex-1 text-center text-sm font-semibold text-ink-700">Post a listing</h2>
          <span className="text-xs text-ink-400 font-medium">{stepIdx + 1}/{STEPS.length}</span>
        </div>
        <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
          <div className="h-full bg-brand-500 rounded-full transition-all duration-400" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex-1 px-5 py-6">

        {/* STEP: TYPE */}
        {step === 'type' && (
          <div>
            <h2 className="text-xl font-bold text-ink-900 mb-1">What are you listing?</h2>
            <p className="text-ink-500 text-sm mb-6">Select the type of space you have available</p>
            <div className="flex flex-col gap-3">
              {PROPERTY_TYPES.map(({ val, label, emoji, desc }) => (
                <button
                  key={val}
                  onClick={() => update('property_type', val)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                    form.property_type === val
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-ink-200 hover:border-ink-300'
                  }`}
                >
                  <span className="text-3xl">{emoji}</span>
                  <div>
                    <p className="font-semibold text-ink-900">{label}</p>
                    <p className="text-xs text-ink-500">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP: DETAILS */}
        {step === 'details' && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-ink-900 mb-1">Listing details</h2>

            <Input label="Listing title" placeholder="e.g. Cozy room in Yaba, 5 mins from UNILAG" value={form.title} onChange={e => update('title', e.target.value)} />

            <div>
              <label className="text-xs font-semibold text-ink-600 uppercase tracking-wide block mb-1.5">Description</label>
              <textarea
                rows={4}
                placeholder="Describe the space, neighbourhood, current occupants, vibe..."
                value={form.description}
                onChange={e => update('description', e.target.value)}
                className="w-full border border-ink-200 rounded-2xl px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 outline-none focus:border-brand-400 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-ink-600 uppercase tracking-wide block mb-1.5">Monthly rent (₦)</label>
                <input type="number" value={form.rent_amount} onChange={e => update('rent_amount', parseInt(e.target.value) || 0)}
                  className="w-full border border-ink-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-brand-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-600 uppercase tracking-wide block mb-1.5">Caution fee (₦)</label>
                <input type="number" value={form.caution_fee} onChange={e => update('caution_fee', parseInt(e.target.value) || 0)}
                  className="w-full border border-ink-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-brand-400" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-ink-600 uppercase tracking-wide block mb-2">Gender preference</label>
              <div className="flex gap-2">
                {['any', 'male', 'female'].map(g => (
                  <button key={g} onClick={() => update('gender_preference', g)}
                    className={`flex-1 py-2.5 rounded-2xl text-sm capitalize border-2 font-medium transition-all ${form.gender_preference === g ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-ink-200 text-ink-600'}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-ink-600 uppercase tracking-wide block mb-2">Spots available</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map(n => (
                  <button key={n} onClick={() => update('spots_available', n)}
                    className={`w-12 h-12 rounded-xl border-2 text-sm font-semibold transition-all ${form.spots_available === n ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-ink-200 text-ink-600'}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP: LOCATION */}
        {step === 'location' && (
          <div className="flex flex-col gap-4">
            <div className="w-11 h-11 bg-blue-50 rounded-2xl flex items-center justify-center mb-1">
              <MapPin size={22} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-ink-900 mb-0">Location</h2>

            <div>
              <label className="text-xs font-semibold text-ink-600 uppercase tracking-wide block mb-2">State</label>
              <div className="flex gap-2">
                {Object.keys(NIGERIAN_AREAS).map(s => (
                  <button key={s} onClick={() => { update('state', s); update('area', '') }}
                    className={`flex-1 py-2.5 rounded-2xl text-sm border-2 font-medium transition-all ${form.state === s ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-ink-200 text-ink-600'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-ink-600 uppercase tracking-wide block mb-2">Area</label>
              <div className="flex flex-wrap gap-2">
                {areas.map(a => (
                  <button key={a} onClick={() => update('area', a)}
                    className={`px-3.5 py-2 rounded-full text-xs border-2 transition-all ${form.area === a ? 'border-brand-500 bg-brand-500 text-white' : 'border-ink-200 text-ink-600 bg-white'}`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <Input label="Street / Address (optional)" placeholder="e.g. 12 Herbert Macaulay Way" value={form.address} onChange={e => update('address', e.target.value)} leftIcon={<MapPin size={15} />} hint="Exact address shown only after match" />
          </div>
        )}

        {/* STEP: AMENITIES */}
        {step === 'amenities' && (
          <div>
            <h2 className="text-xl font-bold text-ink-900 mb-1">Amenities</h2>
            <p className="text-ink-500 text-sm mb-5">Select everything available in this property</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(AMENITY_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => toggleAmenity(key)}
                  className={`px-3.5 py-2.5 rounded-full text-sm border-2 transition-all ${
                    form.amenities.includes(key)
                      ? 'border-brand-500 bg-brand-500 text-white'
                      : 'border-ink-200 bg-white text-ink-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-5 p-3 bg-amber-50 rounded-2xl text-xs text-amber-700">
              💡 Listings with verified amenities get 3x more inquiries
            </div>
          </div>
        )}

        {/* STEP: PHOTOS */}
        {step === 'photos' && (
          <div>
            <h2 className="text-xl font-bold text-ink-900 mb-1">Photos</h2>
            <p className="text-ink-500 text-sm mb-5">Add clear photos to attract serious inquiries</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button className="aspect-square border-2 border-dashed border-ink-300 rounded-2xl flex flex-col items-center justify-center gap-2 bg-ink-50 hover:bg-ink-100 transition-colors">
                <Upload size={22} className="text-ink-400" />
                <span className="text-xs text-ink-400 font-medium">Add photo</span>
              </button>
              {['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200',
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200'].map((url, i) => (
                <div key={i} className="aspect-square relative rounded-2xl overflow-hidden">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                    <X size={12} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-ink-400 text-center">Add up to 10 photos · First photo is the cover</p>
          </div>
        )}

        {/* STEP: RULES */}
        {step === 'rules' && (
          <div>
            <h2 className="text-xl font-bold text-ink-900 mb-1">House rules</h2>
            <p className="text-ink-500 text-sm mb-5">Set expectations for potential roommates</p>
            <div className="flex flex-col gap-2 mb-4">
              {form.house_rules.map((rule, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-ink-50 rounded-xl">
                  <span className="text-ink-300 text-sm">•</span>
                  <span className="flex-1 text-sm text-ink-700">{rule}</span>
                  <button onClick={() => removeRule(i)} className="text-ink-400 hover:text-red-500">
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={form.new_rule}
                onChange={e => update('new_rule', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addRule()}
                placeholder="Add a rule..."
                className="flex-1 border border-ink-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-brand-400"
              />
              <button onClick={addRule} className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Plus size={20} className="text-white" />
              </button>
            </div>
          </div>
        )}

        {/* STEP: REVIEW */}
        {step === 'review' && (
          <div>
            <h2 className="text-xl font-bold text-ink-900 mb-1">Review & publish</h2>
            <p className="text-ink-500 text-sm mb-5">Check everything looks good before publishing</p>
            <div className="flex flex-col gap-3">
              <div className="p-4 bg-ink-50 rounded-2xl">
                <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-1">Title</p>
                <p className="text-sm font-medium text-ink-900">{form.title || '—'}</p>
              </div>
              <div className="p-4 bg-ink-50 rounded-2xl">
                <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-1">Location</p>
                <p className="text-sm font-medium text-ink-900">{[form.area, form.state].filter(Boolean).join(', ') || '—'}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-ink-50 rounded-2xl">
                  <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-1">Monthly rent</p>
                  <p className="text-sm font-bold text-brand-600">₦{form.rent_amount.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-ink-50 rounded-2xl">
                  <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-1">Caution</p>
                  <p className="text-sm font-bold text-ink-900">₦{form.caution_fee.toLocaleString()}</p>
                </div>
              </div>
              <div className="p-4 bg-ink-50 rounded-2xl">
                <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-2">Amenities</p>
                <div className="flex flex-wrap gap-1.5">
                  {form.amenities.length > 0 ? form.amenities.map(a => (
                    <span key={a} className="text-xs bg-white text-ink-600 border border-ink-200 px-2 py-1 rounded-full">{AMENITY_LABELS[a]}</span>
                  )) : <span className="text-sm text-ink-400">None selected</span>}
                </div>
              </div>
              <div className="p-4 bg-brand-50 rounded-2xl border border-brand-200">
                <p className="text-xs font-semibold text-brand-700 mb-1">🛡 Listing review</p>
                <p className="text-xs text-brand-600">Your listing will be reviewed within 24 hours. We'll notify you once it's live.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="sticky bottom-0 bg-white border-t border-ink-100 px-5 py-4">
        {step !== 'review' ? (
          <Button
            size="lg"
            fullWidth
            rightIcon={<ArrowRight size={18} />}
            onClick={next}
            disabled={
              (step === 'type' && !form.property_type) ||
              (step === 'details' && !form.title) ||
              (step === 'location' && !form.area)
            }
          >
            Continue
          </Button>
        ) : (
          <Button size="lg" fullWidth loading={saving} onClick={submit}>
            🚀 Publish listing
          </Button>
        )}
      </div>
    </div>
  )
}

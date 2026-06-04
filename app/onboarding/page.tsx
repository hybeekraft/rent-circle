'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, MapPin, Briefcase, Moon, Sun, Users, Heart, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase'
import { NIGERIAN_AREAS } from '@/lib/utils'

const STEPS = ['basics', 'location', 'lifestyle', 'budget', 'done'] as const
type Step = typeof STEPS[number]

const OCCUPATIONS = ['Student', 'NYSC Member', 'Young Professional', 'Remote Worker', 'Entrepreneur', 'Other']
const HOBBIES = ['Gaming', 'Cooking', 'Fitness', 'Music', 'Movies', 'Reading', 'Travel', 'Art', 'Sports', 'Tech']

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState<Step>('basics')
  const [saving, setSaving] = useState(false)

  const [profile, setProfile] = useState({
    age: '',
    gender: '',
    occupation: '',
    bio: '',
    preferred_state: 'Lagos',
    preferred_areas: [] as string[],
    budget_min: 50000,
    budget_max: 200000,
    lifestyle: {
      cleanliness: 3 as 1|2|3|4|5,
      smoking: 'no' as 'yes'|'no'|'occasionally',
      drinking: 'no' as 'yes'|'no'|'occasionally',
      sleep_schedule: 'flexible' as 'early-bird'|'night-owl'|'flexible',
      guests: 'sometimes' as 'often'|'sometimes'|'rarely'|'never',
      work_schedule: 'office' as 'office'|'remote'|'hybrid'|'student',
      hobbies: [] as string[],
    }
  })

  function update(key: string, val: any) {
    setProfile(p => ({ ...p, [key]: val }))
  }

  function updateLifestyle(key: string, val: any) {
    setProfile(p => ({ ...p, lifestyle: { ...p.lifestyle, [key]: val } }))
  }

  function toggleArea(area: string) {
    setProfile(p => ({
      ...p,
      preferred_areas: p.preferred_areas.includes(area)
        ? p.preferred_areas.filter(a => a !== area)
        : [...p.preferred_areas, area]
    }))
  }

  function toggleHobby(h: string) {
    const hobbies = profile.lifestyle.hobbies
    updateLifestyle('hobbies', hobbies.includes(h) ? hobbies.filter(x => x !== h) : [...hobbies, h])
  }

  const stepIdx = STEPS.indexOf(step)
  const progress = (stepIdx / (STEPS.length - 1)) * 100

  async function finish() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').upsert({
        id: user.id,
        age: parseInt(profile.age) || null,
        gender: profile.gender || null,
        occupation: profile.occupation || null,
        bio: profile.bio || null,
        preferred_areas: profile.preferred_areas,
        budget_min: profile.budget_min,
        budget_max: profile.budget_max,
        lifestyle: profile.lifestyle,
      })
    }
    router.push('/listings')
  }

  const areas = NIGERIAN_AREAS[profile.preferred_state as keyof typeof NIGERIAN_AREAS] || []

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Progress bar */}
      <div className="h-1 bg-ink-100">
        <div className="h-full bg-brand-500 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex-1 flex flex-col px-6 pt-8 pb-12 max-w-lg mx-auto w-full">
        {step !== 'done' && (
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setStep(STEPS[Math.max(0, stepIdx - 1)])}
              disabled={stepIdx === 0}
              className="p-2 rounded-xl text-ink-400 disabled:opacity-0 hover:bg-ink-100"
            >
              <ArrowLeft size={20} />
            </button>
            <span className="text-sm text-ink-400 font-medium">Step {stepIdx + 1} of {STEPS.length - 1}</span>
            <button
              onClick={() => setStep(STEPS[Math.min(STEPS.length - 1, stepIdx + 1)])}
              className="text-sm text-brand-500 font-medium"
            >
              Skip
            </button>
          </div>
        )}

        {/* BASICS */}
        {step === 'basics' && (
          <div className="animate-slide-up">
            <h2 className="text-2xl font-bold text-ink-900 mb-1">Tell us about yourself</h2>
            <p className="text-ink-500 text-sm mb-8">This helps us find compatible roommates</p>

            <div className="flex flex-col gap-5">
              <div>
                <label className="text-sm font-medium text-ink-700 mb-2 block">Age</label>
                <input
                  type="number"
                  placeholder="25"
                  value={profile.age}
                  onChange={e => update('age', e.target.value)}
                  min="18" max="65"
                  className="w-full border border-ink-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-3 focus:ring-brand-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-ink-700 mb-2 block">Gender</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Male', 'Female', 'Non-binary'].map(g => (
                    <button
                      key={g}
                      onClick={() => update('gender', g.toLowerCase())}
                      className={`py-3 rounded-2xl text-sm font-medium border-2 transition-all ${
                        profile.gender === g.toLowerCase()
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'border-ink-200 text-ink-600'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-ink-700 mb-2 block">Occupation</label>
                <div className="grid grid-cols-2 gap-2">
                  {OCCUPATIONS.map(o => (
                    <button
                      key={o}
                      onClick={() => update('occupation', o)}
                      className={`py-2.5 px-3 rounded-2xl text-sm border-2 transition-all text-left ${
                        profile.occupation === o
                          ? 'border-brand-500 bg-brand-50 text-brand-700 font-medium'
                          : 'border-ink-200 text-ink-600'
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-ink-700 mb-2 block">Bio <span className="text-ink-400 font-normal">(optional)</span></label>
                <textarea
                  placeholder="Tell potential roommates a bit about yourself..."
                  value={profile.bio}
                  onChange={e => update('bio', e.target.value)}
                  rows={3}
                  className="w-full border border-ink-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-brand-400 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* LOCATION */}
        {step === 'location' && (
          <div className="animate-slide-up">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-5">
              <MapPin size={24} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-ink-900 mb-1">Where are you looking?</h2>
            <p className="text-ink-500 text-sm mb-8">Pick your preferred locations</p>

            <div className="flex flex-col gap-5">
              <div>
                <label className="text-sm font-medium text-ink-700 mb-2 block">State</label>
                <div className="flex gap-2">
                  {Object.keys(NIGERIAN_AREAS).map(state => (
                    <button
                      key={state}
                      onClick={() => { update('preferred_state', state); update('preferred_areas', []) }}
                      className={`flex-1 py-2.5 rounded-2xl text-sm border-2 font-medium transition-all ${
                        profile.preferred_state === state
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'border-ink-200 text-ink-600'
                      }`}
                    >
                      {state}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-ink-700 mb-3 block">
                  Areas in {profile.preferred_state}
                  <span className="text-ink-400 font-normal ml-1">(select all that apply)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {areas.map(area => (
                    <button
                      key={area}
                      onClick={() => toggleArea(area)}
                      className={`px-4 py-2 rounded-full text-sm border-2 transition-all ${
                        profile.preferred_areas.includes(area)
                          ? 'border-brand-500 bg-brand-500 text-white'
                          : 'border-ink-200 text-ink-600 bg-white'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LIFESTYLE */}
        {step === 'lifestyle' && (
          <div className="animate-slide-up">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-5">
              <Heart size={24} className="text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-ink-900 mb-1">Your lifestyle</h2>
            <p className="text-ink-500 text-sm mb-8">Helps match you with compatible people</p>

            <div className="flex flex-col gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-ink-700">Cleanliness level</label>
                  <span className="text-sm text-brand-500 font-semibold">
                    {['','Very Relaxed','Relaxed','Average','Clean','Very Clean'][profile.lifestyle.cleanliness]}
                  </span>
                </div>
                <input
                  type="range" min="1" max="5" step="1"
                  value={profile.lifestyle.cleanliness}
                  onChange={e => updateLifestyle('cleanliness', parseInt(e.target.value))}
                  className="w-full accent-brand-500"
                />
                <div className="flex justify-between text-xs text-ink-400 mt-1">
                  <span>Very relaxed</span><span>Very clean</span>
                </div>
              </div>

              {[
                { key: 'smoking', label: 'Smoking', opts: ['yes', 'no', 'occasionally'] },
                { key: 'drinking', label: 'Drinking alcohol', opts: ['yes', 'no', 'occasionally'] },
                { key: 'guests', label: 'Having guests over', opts: ['often', 'sometimes', 'rarely', 'never'] },
              ].map(({ key, label, opts }) => (
                <div key={key}>
                  <label className="text-sm font-medium text-ink-700 mb-2 block">{label}</label>
                  <div className="flex gap-2 flex-wrap">
                    {opts.map(o => (
                      <button
                        key={o}
                        onClick={() => updateLifestyle(key, o)}
                        className={`px-4 py-2 rounded-full text-sm border-2 capitalize transition-all ${
                          (profile.lifestyle as any)[key] === o
                            ? 'border-brand-500 bg-brand-50 text-brand-700 font-medium'
                            : 'border-ink-200 text-ink-600'
                        }`}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div>
                <label className="text-sm font-medium text-ink-700 mb-2 block">Sleep schedule</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 'early-bird', label: '🌅 Early bird' },
                    { val: 'night-owl', label: '🦉 Night owl' },
                    { val: 'flexible', label: '😴 Flexible' },
                  ].map(({ val, label }) => (
                    <button
                      key={val}
                      onClick={() => updateLifestyle('sleep_schedule', val)}
                      className={`py-3 rounded-2xl text-sm border-2 transition-all ${
                        profile.lifestyle.sleep_schedule === val
                          ? 'border-brand-500 bg-brand-50 text-brand-700 font-medium'
                          : 'border-ink-200 text-ink-600'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-ink-700 mb-2 block">Hobbies & interests</label>
                <div className="flex flex-wrap gap-2">
                  {HOBBIES.map(h => (
                    <button
                      key={h}
                      onClick={() => toggleHobby(h)}
                      className={`px-4 py-2 rounded-full text-sm border-2 transition-all ${
                        profile.lifestyle.hobbies.includes(h)
                          ? 'border-brand-500 bg-brand-500 text-white'
                          : 'border-ink-200 text-ink-600'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BUDGET */}
        {step === 'budget' && (
          <div className="animate-slide-up">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-5">
              <span className="text-2xl">₦</span>
            </div>
            <h2 className="text-2xl font-bold text-ink-900 mb-1">Your rent budget</h2>
            <p className="text-ink-500 text-sm mb-8">Monthly rent you can afford</p>

            <div className="bg-brand-50 rounded-3xl p-6 mb-6 text-center">
              <p className="text-sm text-brand-600 mb-1">Your range</p>
              <p className="text-3xl font-bold text-brand-700">
                ₦{(profile.budget_min / 1000).toFixed(0)}k – ₦{(profile.budget_max / 1000).toFixed(0)}k
              </p>
              <p className="text-xs text-brand-500 mt-1">per month</p>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-ink-700">Minimum</label>
                  <span className="text-sm text-brand-600 font-semibold">₦{(profile.budget_min/1000).toFixed(0)}k</span>
                </div>
                <input
                  type="range" min="20000" max="500000" step="5000"
                  value={profile.budget_min}
                  onChange={e => update('budget_min', Math.min(parseInt(e.target.value), profile.budget_max - 10000))}
                  className="w-full accent-brand-500"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-ink-700">Maximum</label>
                  <span className="text-sm text-brand-600 font-semibold">₦{(profile.budget_max/1000).toFixed(0)}k</span>
                </div>
                <input
                  type="range" min="20000" max="1000000" step="5000"
                  value={profile.budget_max}
                  onChange={e => update('budget_max', Math.max(parseInt(e.target.value), profile.budget_min + 10000))}
                  className="w-full accent-brand-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium text-ink-700 mb-3">Popular ranges in Lagos</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Budget', min: 30000, max: 80000 },
                  { label: 'Mid-range', min: 80000, max: 200000 },
                  { label: 'Comfortable', min: 150000, max: 350000 },
                  { label: 'Premium', min: 300000, max: 800000 },
                ].map(({ label, min, max }) => (
                  <button
                    key={label}
                    onClick={() => { update('budget_min', min); update('budget_max', max) }}
                    className={`py-3 px-4 rounded-2xl text-sm text-left border-2 transition-all ${
                      profile.budget_min === min && profile.budget_max === max
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-ink-200'
                    }`}
                  >
                    <div className="font-medium text-ink-800">{label}</div>
                    <div className="text-xs text-ink-500">₦{min/1000}k–₦{max/1000}k</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DONE */}
        {step === 'done' && (
          <div className="flex-1 flex flex-col items-center justify-center animate-slide-up text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-ink-900 mb-2">You're all set! 🎉</h2>
            <p className="text-ink-500 mb-2">Welcome to RentCircle</p>
            <p className="text-sm text-ink-400 max-w-xs">
              We'll use your preferences to find the best roommate matches and listings for you.
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto pt-8">
          {step !== 'done' ? (
            <Button
              size="lg"
              fullWidth
              rightIcon={<ArrowRight size={18} />}
              onClick={() => setStep(STEPS[stepIdx + 1])}
            >
              Continue
            </Button>
          ) : (
            <Button size="lg" fullWidth loading={saving} onClick={finish}>
              Explore listings
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

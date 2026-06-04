'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Edit3, LogOut, Star, Eye, ChevronRight, Bell, Lock, HelpCircle, Crown, Camera } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { VerificationBadge } from '@/components/ui/VerificationBadge'
import { Button } from '@/components/ui/Button'

const MOCK_USER = {
  full_name: 'Ada Okonkwo', email: 'ada@gmail.com', phone: '+234 801 234 5678',
  age: 26, gender: 'female', occupation: 'Software Engineer', school_or_company: 'Paystack',
  bio: 'Tech girl, clean freak 😅. I cook on weekends and love Afrobeats. Looking for a mature, working-class roommate in Lekki or VI.',
  preferred_areas: ['Yaba', 'Lekki', 'Ikeja'],
  budget_min: 100000, budget_max: 250000,
  lifestyle: { cleanliness: 4, smoking: 'no', drinking: 'occasionally', sleep_schedule: 'early-bird', guests: 'sometimes', hobbies: ['Cooking', 'Fitness', 'Music'] },
  is_verified: true, verification_level: 2 as const, is_premium: false,
  stats: { views: 12, matches: 8, messages: 4 },
}

const SETTINGS = [
  { icon: Bell, label: 'Notifications', sub: 'Manage alerts & push notifications' },
  { icon: Lock, label: 'Privacy & Security', sub: 'Control who sees your profile' },
  { icon: Shield, label: 'Verification', sub: 'Upgrade your trust level', badge: 'Verify ID' },
  { icon: Crown, label: 'Go Premium', sub: 'Boost visibility & unlock features', badge: 'PRO', badgeColor: 'bg-amber-400 text-amber-900' },
  { icon: HelpCircle, label: 'Help & Support', sub: 'FAQs, contact us, report bugs' },
]

export default function ProfilePage() {
  const router = useRouter()
  const [user] = useState(MOCK_USER)
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const cleanLabel = ['', 'Very relaxed', 'Relaxed', 'Average', 'Clean', 'Very clean'][user.lifestyle.cleanliness]
  const scheduleLabel = { 'early-bird': '🌅 Early bird', 'night-owl': '🦉 Night owl', 'flexible': '😴 Flexible' }[user.lifestyle.sleep_schedule] || 'Flexible'

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Header */}
      <div className="bg-gradient-to-b from-brand-50 to-white px-5 pt-10 pb-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {user.full_name[0]}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full border border-ink-200 flex items-center justify-center shadow-sm">
                <Camera size={14} className="text-ink-500" />
              </button>
            </div>
            <div>
              <h1 className="text-xl font-bold text-ink-900">{user.full_name}</h1>
              <p className="text-sm text-ink-500 mb-2">{user.occupation} · {user.school_or_company}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <VerificationBadge level={user.verification_level} showLabel />
                {user.preferred_areas[0] && (
                  <span className="text-xs bg-ink-100 text-ink-600 px-2 py-1 rounded-full">
                    📍 {user.preferred_areas[0]}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button className="p-2 rounded-xl hover:bg-ink-100">
            <Edit3 size={18} className="text-ink-500" />
          </button>
        </div>

        <p className="text-sm text-ink-600 leading-relaxed mb-4">{user.bio}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-3 text-center border border-ink-100">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Eye size={13} className="text-brand-500" />
              <p className="font-bold text-ink-900">{user.stats.views}</p>
            </div>
            <p className="text-xs text-ink-400">Profile views</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center border border-ink-100">
            <p className="font-bold text-ink-900 mb-0.5">{user.stats.matches}</p>
            <p className="text-xs text-ink-400">Matches</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center border border-ink-100">
            <div className="flex items-center justify-center gap-0.5 mb-0.5">
              <Star size={13} className="text-amber-400 fill-amber-400" />
              <p className="font-bold text-ink-900">4.8</p>
            </div>
            <p className="text-xs text-ink-400">Rating</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 flex flex-col gap-4">
        {/* Lifestyle card */}
        <div className="bg-white rounded-2xl p-4 border border-ink-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-ink-900">Lifestyle</h3>
            <button className="text-xs text-brand-500 font-medium">Edit</button>
          </div>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4">
            {[
              { label: 'Cleanliness', val: cleanLabel },
              { label: 'Schedule', val: scheduleLabel },
              { label: 'Smoking', val: user.lifestyle.smoking === 'no' ? '🚭 No' : '🚬 Yes' },
              { label: 'Guests', val: `${user.lifestyle.guests}` },
            ].map(({ label, val }) => (
              <div key={label}>
                <p className="text-xs text-ink-400">{label}</p>
                <p className="text-sm font-medium text-ink-800 capitalize">{val}</p>
              </div>
            ))}
          </div>
          {user.lifestyle.hobbies && user.lifestyle.hobbies.length > 0 && (
            <div className="mt-3 pt-3 border-t border-ink-100">
              <p className="text-xs text-ink-400 mb-2">Hobbies</p>
              <div className="flex flex-wrap gap-2">
                {user.lifestyle.hobbies.map(h => (
                  <span key={h} className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full">{h}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Budget & areas */}
        <div className="bg-white rounded-2xl p-4 border border-ink-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-ink-900">Preferences</h3>
            <button className="text-xs text-brand-500 font-medium">Edit</button>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <p className="text-sm text-ink-500">Monthly budget</p>
              <p className="text-sm font-semibold text-ink-900">
                ₦{(user.budget_min / 1000).toFixed(0)}k – ₦{(user.budget_max / 1000).toFixed(0)}k
              </p>
            </div>
            <div className="flex justify-between items-start">
              <p className="text-sm text-ink-500">Preferred areas</p>
              <div className="flex flex-wrap gap-1 justify-end max-w-[60%]">
                {user.preferred_areas.map(a => (
                  <span key={a} className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">{a}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Verification */}
        <div className="bg-white rounded-2xl p-4 border border-ink-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-ink-900">Verification</h3>
            <VerificationBadge level={user.verification_level} showLabel />
          </div>
          <div className="flex flex-col gap-2.5">
            {[
              { label: 'Email address', done: true },
              { label: 'Phone number', done: true },
              { label: 'NIN / National ID', done: false },
              { label: 'Address verification', done: false },
            ].map(({ label, done }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${done ? 'bg-green-500' : 'bg-ink-200'}`}>
                    {done ? (
                      <span className="text-white text-xs">✓</span>
                    ) : (
                      <span className="text-ink-400 text-xs">○</span>
                    )}
                  </div>
                  <p className="text-sm text-ink-700">{label}</p>
                </div>
                {!done && (
                  <button className="text-xs text-brand-500 font-semibold">Verify →</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
          {SETTINGS.map(({ icon: Icon, label, sub, badge, badgeColor }, i) => (
            <button
              key={label}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-ink-50 transition-colors ${i < SETTINGS.length - 1 ? 'border-b border-ink-50' : ''}`}
            >
              <div className="w-9 h-9 bg-ink-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-ink-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink-900">{label}</p>
                <p className="text-xs text-ink-400 truncate">{sub}</p>
              </div>
              {badge && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeColor || 'bg-brand-100 text-brand-700'}`}>
                  {badge}
                </span>
              )}
              <ChevronRight size={16} className="text-ink-300 flex-shrink-0" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <Button variant="secondary" size="lg" fullWidth leftIcon={<LogOut size={16} />} onClick={handleLogout} className="mb-4">
          Sign out
        </Button>

        <p className="text-center text-xs text-ink-400 pb-2">RentCircle v1.0 · Built for Nigeria 🇳🇬</p>
      </div>
    </div>
  )
}

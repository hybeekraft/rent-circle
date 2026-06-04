'use client'
import { useState } from 'react'
import { Check, Star, Zap, Eye, Shield, Crown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { initializePayment, PLANS } from '@/lib/payments'
import { createClient } from '@/lib/supabase'

const FEATURES = [
  { icon: Eye, title: 'See who viewed your profile', desc: 'Know exactly who\'s interested in you', premium: true },
  { icon: Zap, title: 'Priority in matches', desc: 'Show up first in discovery results', premium: true },
  { icon: Star, title: 'Super likes (5/day)', desc: 'Stand out with super likes', premium: true },
  { icon: Shield, title: 'Advanced filters', desc: 'Filter by occupation, religion, work schedule', premium: true },
  { icon: Crown, title: 'Boost your listing', desc: 'Get 10x more views on your listing', premium: true },
]

const FREE_FEATURES = [
  'Browse verified listings',
  'Basic roommate matching',
  'Send messages to matches',
  'Create 1 listing',
  'Basic profile',
]

export default function PremiumPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const plan = billing === 'monthly' ? PLANS.premium_monthly : PLANS.premium_annual
  const monthlyPrice = billing === 'monthly' ? 2999 : Math.round(24999 / 12)
  const saving = billing === 'annual' ? Math.round((2999 * 12 - 24999) / (2999 * 12) * 100) : 0

  async function handleUpgrade() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data: profile } = await supabase.from('profiles').select('email').eq('id', user.id).single()

    await initializePayment({
      email: profile?.email || user.email || '',
      amount: plan.amount,
      meta: { user_id: user.id, type: 'premium' },
      onSuccess: async (reference) => {
        const res = await fetch('/api/payments/verify', {
          method: 'POST',
          body: JSON.stringify({ reference }),
          headers: { 'Content-Type': 'application/json' }
        })
        if (res.ok) window.location.reload()
      },
      onClose: () => setLoading(false),
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-ink-50">
      {/* Header */}
      <div className="px-5 pt-12 pb-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-200">
          <Crown size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-ink-900 mb-2">RentCircle Premium</h1>
        <p className="text-ink-500 text-sm max-w-xs mx-auto leading-relaxed">
          Find your perfect match faster with powerful tools designed for Nigerian renters
        </p>
      </div>

      {/* Billing toggle */}
      <div className="px-5 mb-5">
        <div className="flex bg-white rounded-2xl p-1.5 border border-ink-200 gap-1">
          <button
            onClick={() => setBilling('monthly')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${billing === 'monthly' ? 'bg-ink-900 text-white' : 'text-ink-500'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling('annual')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${billing === 'annual' ? 'bg-ink-900 text-white' : 'text-ink-500'}`}
          >
            Annual {saving > 0 && <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${billing === 'annual' ? 'bg-amber-400 text-amber-900' : 'bg-amber-100 text-amber-700'}`}>-{saving}%</span>}
          </button>
        </div>
      </div>

      {/* Pricing card */}
      <div className="px-5 mb-5">
        <div className="bg-ink-900 rounded-3xl p-6 text-white">
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-3xl font-bold">₦{monthlyPrice.toLocaleString()}</span>
            <span className="text-white/60 text-sm">/month</span>
          </div>
          {billing === 'annual' && (
            <p className="text-amber-400 text-sm font-medium mb-1">Billed ₦24,999/year · Save ₦{(2999 * 12 - 24999).toLocaleString()}</p>
          )}
          <p className="text-white/60 text-xs">Cancel anytime · Instant activation</p>
          <Button
            onClick={handleUpgrade}
            loading={loading}
            size="lg"
            fullWidth
            className="mt-5 bg-amber-400 hover:bg-amber-500 text-amber-900 font-bold border-0"
          >
            <Crown size={18} /> Upgrade to Premium
          </Button>
        </div>
      </div>

      {/* Features */}
      <div className="px-5 mb-5">
        <div className="bg-white rounded-3xl p-5 border border-ink-100">
          <h3 className="text-sm font-bold text-ink-900 mb-4">Everything in Premium</h3>
          <div className="flex flex-col gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={17} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-900">{title}</p>
                  <p className="text-xs text-ink-500">{desc}</p>
                </div>
                <Check size={16} className="text-green-500 ml-auto flex-shrink-0 mt-0.5" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Free vs premium */}
      <div className="px-5 mb-8">
        <div className="bg-ink-50 rounded-3xl p-5 border border-ink-200">
          <h3 className="text-sm font-bold text-ink-700 mb-3">Free plan includes:</h3>
          <div className="flex flex-col gap-2">
            {FREE_FEATURES.map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-ink-600">
                <Check size={14} className="text-ink-400" /> {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-ink-400 px-5 pb-8">
        Payments processed securely via Paystack 🔒 · Nigerian cards, bank transfer & USSD accepted
      </p>
    </div>
  )
}

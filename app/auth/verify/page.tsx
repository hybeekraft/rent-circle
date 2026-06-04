'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, ArrowRight, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase'

export default function VerifyPage() {
  const router = useRouter()
  const params = useSearchParams()
  const email = params.get('email') || ''
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const supabase = createClient()

  useEffect(() => {
    if (resendCooldown > 0) {
      const t = setTimeout(() => setResendCooldown(c => c - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [resendCooldown])

  function handleInput(idx: number, val: string) {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]
    next[idx] = val.slice(-1)
    setOtp(next)
    if (val && idx < 5) refs.current[idx + 1]?.focus()
    if (next.every(d => d) && next.join('').length === 6) {
      handleVerify(next.join(''))
    }
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      refs.current[idx - 1]?.focus()
    }
  }

  async function handleVerify(code?: string) {
    const token = code || otp.join('')
    if (token.length !== 6) { setError('Enter all 6 digits'); return }
    setError('')
    setLoading(true)
    try {
      const { error } = await supabase.auth.verifyOtp({ email, token, type: 'signup' })
      if (error) throw error
      router.push('/onboarding')
    } catch (err: any) {
      setError('Invalid code. Please check and try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setResendCooldown(60)
    await supabase.auth.resend({ type: 'signup', email })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white flex flex-col items-center justify-center px-6">
      <div className="w-16 h-16 bg-brand-50 border-2 border-brand-200 rounded-3xl flex items-center justify-center mb-6">
        <Mail size={28} className="text-brand-500" />
      </div>

      <h1 className="text-2xl font-bold text-ink-900 mb-2 text-center">Verify your email</h1>
      <p className="text-ink-500 text-sm text-center max-w-xs mb-8">
        We sent a 6-digit code to <span className="font-semibold text-ink-800">{email}</span>. Enter it below.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl px-4 py-3 mb-4 w-full max-w-xs text-center">
          {error}
        </div>
      )}

      {/* OTP Input */}
      <div className="flex gap-3 mb-8">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={el => { refs.current[idx] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleInput(idx, e.target.value)}
            onKeyDown={e => handleKeyDown(idx, e)}
            className={`w-12 h-14 text-center text-xl font-bold rounded-2xl border-2 outline-none transition-all
              ${digit ? 'border-brand-400 bg-brand-50 text-brand-700' : 'border-ink-200 bg-white text-ink-900'}
              focus:border-brand-500 focus:ring-3 focus:ring-brand-100`}
          />
        ))}
      </div>

      <Button
        onClick={() => handleVerify()}
        size="lg"
        fullWidth
        loading={loading}
        rightIcon={<ArrowRight size={18} />}
        className="max-w-xs"
      >
        Verify email
      </Button>

      <button
        onClick={handleResend}
        disabled={resendCooldown > 0}
        className="flex items-center gap-2 mt-4 text-sm text-ink-500 disabled:opacity-50"
      >
        <RefreshCw size={14} />
        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
      </button>
    </div>
  )
}

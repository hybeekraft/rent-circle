'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [agree, setAgree] = useState(false)
  const supabase = createClient()

  function update(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!agree) { setError('Please agree to our Terms of Service'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
    setError('')
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.name, phone: form.phone },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
      // Create profile
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: form.name,
          email: form.email,
          phone: form.phone,
          lifestyle: {},
          is_verified: false,
          verification_level: 0,
          is_premium: false,
        })
      }
      router.push('/auth/verify?email=' + encodeURIComponent(form.email))
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const strengthScore = [
    form.password.length >= 8,
    /[A-Z]/.test(form.password),
    /[0-9]/.test(form.password),
    /[^A-Za-z0-9]/.test(form.password),
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-ink-50 flex flex-col">
      <div className="px-6 pt-12 pb-6">
        <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-brand-200">
          <span className="text-white text-xl font-bold">R</span>
        </div>
        <h1 className="text-3xl font-bold text-ink-900 mb-1">Create account</h1>
        <p className="text-ink-500 text-sm">Join thousands finding homes across Nigeria</p>
      </div>

      <div className="flex-1 bg-white rounded-t-[2rem] px-6 pt-8 pb-12">
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl px-4 py-3">
              {error}
            </div>
          )}

          <Input
            label="Full name"
            type="text"
            placeholder="Ada Okonkwo"
            value={form.name}
            onChange={e => update('name', e.target.value)}
            leftIcon={<User size={16} />}
            required
            autoComplete="name"
          />

          <Input
            label="Email address"
            type="email"
            placeholder="you@gmail.com"
            value={form.email}
            onChange={e => update('email', e.target.value)}
            leftIcon={<Mail size={16} />}
            required
            autoComplete="email"
          />

          <Input
            label="Phone number"
            type="tel"
            placeholder="+234 800 000 0000"
            value={form.phone}
            onChange={e => update('phone', e.target.value)}
            leftIcon={<Phone size={16} />}
            hint="Used for OTP verification"
          />

          <div className="flex flex-col gap-1.5">
            <Input
              label="Password"
              type={showPass ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={e => update('password', e.target.value)}
              leftIcon={<Lock size={16} />}
              rightElement={
                <button type="button" onClick={() => setShowPass(!showPass)} className="text-ink-400">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              required
              autoComplete="new-password"
            />
            {form.password && (
              <div className="flex gap-1 mt-1">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strengthScore ? ['bg-red-400','bg-amber-400','bg-blue-400','bg-green-400'][strengthScore-1] : 'bg-ink-100'}`} />
                ))}
                <span className="text-xs text-ink-400 ml-1">
                  {['','Weak','Fair','Good','Strong'][strengthScore]}
                </span>
              </div>
            )}
          </div>

          <label className="flex items-start gap-3 cursor-pointer mt-1">
            <div
              onClick={() => setAgree(!agree)}
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors ${agree ? 'bg-brand-500 border-brand-500' : 'border-ink-300'}`}
            >
              {agree && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <span className="text-sm text-ink-600">
              I agree to RentCircle's{' '}
              <Link href="/terms" className="text-brand-500 font-medium">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-brand-500 font-medium">Privacy Policy</Link>
            </span>
          </label>

          <Button type="submit" size="lg" fullWidth loading={loading} rightIcon={<ArrowRight size={18} />} className="mt-2">
            Create account
          </Button>
        </form>

        <p className="text-center text-sm text-ink-500 mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-brand-500 font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Phone, Mail, ArrowRight, Lock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase'

type Method = 'email' | 'phone'

export default function LoginPage() {
  const router = useRouter()
  const [method, setMethod] = useState<Method>('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: method === 'email' ? email : `${phone}@rentcircle.ng`,
        password,
      })
      if (error) throw error
      router.push('/listings')
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-ink-50 flex flex-col">
      {/* Header */}
      <div className="px-6 pt-16 pb-8">
        <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-200">
          <span className="text-white text-xl font-bold">R</span>
        </div>
        <h1 className="text-3xl font-bold text-ink-900 mb-1">Welcome back</h1>
        <p className="text-ink-500 text-sm">Sign in to find your perfect home</p>
      </div>

      <div className="flex-1 bg-white rounded-t-[2rem] px-6 pt-8 pb-12 shadow-sm">
        {/* Method toggle */}
        <div className="flex bg-ink-100 rounded-2xl p-1 mb-6">
          {(['email', 'phone'] as Method[]).map(m => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                method === m ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500'
              }`}
            >
              {m === 'email' ? <Mail size={15} /> : <Phone size={15} />}
              {m === 'email' ? 'Email' : 'Phone'}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl px-4 py-3">
              {error}
            </div>
          )}

          {method === 'email' ? (
            <Input
              label="Email address"
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              leftIcon={<Mail size={16} />}
              required
              autoComplete="email"
            />
          ) : (
            <Input
              label="Phone number"
              type="tel"
              placeholder="+234 800 000 0000"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              leftIcon={<Phone size={16} />}
              hint="We'll send an OTP to verify"
              required
            />
          )}

          <Input
            label="Password"
            type={showPass ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            leftIcon={<Lock size={16} />}
            rightElement={
              <button type="button" onClick={() => setShowPass(!showPass)} className="text-ink-400">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            required
            autoComplete="current-password"
          />

          <div className="flex justify-end">
            <Link href="/auth/forgot-password" className="text-sm text-brand-500 font-medium">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" size="lg" fullWidth loading={loading} rightIcon={<ArrowRight size={18} />}>
            Sign in
          </Button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-ink-100" />
          <span className="text-xs text-ink-400">or continue with</span>
          <div className="flex-1 h-px bg-ink-100" />
        </div>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-ink-200 rounded-2xl py-3.5 text-sm font-medium text-ink-700 hover:bg-ink-50 transition-colors disabled:opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-sm text-ink-500 mt-6">
          New to RentCircle?{' '}
          <Link href="/auth/register" className="text-brand-500 font-semibold">
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}

'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (error) throw error
      setSent(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 bg-green-50 border-2 border-green-200 rounded-3xl flex items-center justify-center mb-6">
          <CheckCircle2 size={28} className="text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-ink-900 mb-2 text-center">Check your email</h1>
        <p className="text-ink-500 text-sm text-center max-w-xs mb-8 leading-relaxed">
          We sent a password reset link to <strong className="text-ink-800">{email}</strong>. Check your inbox.
        </p>
        <p className="text-xs text-ink-400 mb-4">Didn't get it? Check spam or</p>
        <button onClick={() => setSent(false)} className="text-brand-500 font-semibold text-sm">
          Try a different email
        </button>
        <Link href="/auth/login" className="mt-6 flex items-center gap-2 text-sm text-ink-500">
          <ArrowLeft size={14} /> Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white flex flex-col">
      <div className="px-6 pt-12 pb-6">
        <Link href="/auth/login" className="inline-flex items-center gap-2 text-ink-500 text-sm mb-8">
          <ArrowLeft size={16} /> Back to sign in
        </Link>
        <div className="w-12 h-12 bg-brand-50 border-2 border-brand-200 rounded-2xl flex items-center justify-center mb-5">
          <Mail size={22} className="text-brand-500" />
        </div>
        <h1 className="text-2xl font-bold text-ink-900 mb-2">Forgot password?</h1>
        <p className="text-ink-500 text-sm">Enter your email and we'll send you a reset link.</p>
      </div>

      <div className="flex-1 px-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl px-4 py-3">{error}</div>
          )}
          <Input
            label="Email address"
            type="email"
            placeholder="you@gmail.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            leftIcon={<Mail size={16} />}
            required
            autoComplete="email"
          />
          <Button type="submit" size="lg" fullWidth loading={loading}>
            Send reset link
          </Button>
        </form>
      </div>
    </div>
  )
}

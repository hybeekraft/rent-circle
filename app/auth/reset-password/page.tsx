'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setError('')
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setDone(true)
      setTimeout(() => router.push('/listings'), 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 bg-green-50 border-2 border-green-200 rounded-3xl flex items-center justify-center mb-5">
          <CheckCircle2 size={28} className="text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-ink-900 mb-2">Password updated!</h1>
        <p className="text-ink-500 text-sm">Redirecting you to the app…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white flex flex-col">
      <div className="px-6 pt-16 pb-6">
        <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-brand-200">
          <Lock size={22} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-ink-900 mb-2">Set new password</h1>
        <p className="text-ink-500 text-sm">Choose a strong password you haven't used before.</p>
      </div>

      <div className="flex-1 px-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl px-4 py-3">{error}</div>
          )}
          <Input
            label="New password"
            type={showPass ? 'text' : 'password'}
            placeholder="Min. 8 characters"
            value={password}
            onChange={e => setPassword(e.target.value)}
            leftIcon={<Lock size={16} />}
            rightElement={
              <button type="button" onClick={() => setShowPass(s => !s)} className="text-ink-400">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            required
          />
          <Input
            label="Confirm password"
            type={showPass ? 'text' : 'password'}
            placeholder="Repeat your password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            leftIcon={<Lock size={16} />}
            required
          />
          <Button type="submit" size="lg" fullWidth loading={loading}>
            Update password
          </Button>
        </form>
      </div>
    </div>
  )
}

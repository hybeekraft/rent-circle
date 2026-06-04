/**
 * RentCircle — Paystack Payment Integration
 * Handles: Premium subscriptions, verification fees, promoted listings
 */

// ─── Types ─────────────────────────────────────────────────────────────────
export type PaystackPlan = {
  name: string
  code: string
  amount: number // in kobo (₦ × 100)
  interval: 'monthly' | 'annually'
}

export type PaymentMeta = {
  user_id: string
  type: 'premium' | 'verification' | 'boost'
  listing_id?: string
}

// ─── Plans ──────────────────────────────────────────────────────────────────
export const PLANS: Record<string, PaystackPlan> = {
  premium_monthly: { name: 'RentCircle Premium', code: 'PLN_monthly', amount: 299900, interval: 'monthly' },
  premium_annual:  { name: 'RentCircle Premium Annual', code: 'PLN_annual', amount: 2499900, interval: 'annually' },
  verification:    { name: 'ID Verification Fee', code: 'ONE_TIME', amount: 99900, interval: 'monthly' },
  listing_boost:   { name: 'Boost Listing (7 days)', code: 'ONE_TIME', amount: 199900, interval: 'monthly' },
}

// ─── Initialize payment ──────────────────────────────────────────────────────
export async function initializePayment({
  email,
  amount,
  meta,
  onSuccess,
  onClose,
}: {
  email: string
  amount: number
  meta: PaymentMeta
  onSuccess: (reference: string) => void
  onClose: () => void
}) {
  // Load Paystack script dynamically
  if (typeof window === 'undefined') return

  const script = document.createElement('script')
  script.src = 'https://js.paystack.co/v1/inline.js'
  document.head.appendChild(script)

  script.onload = () => {
    const handler = (window as any).PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email,
      amount,
      currency: 'NGN',
      metadata: {
        custom_fields: [
          { display_name: 'User ID', variable_name: 'user_id', value: meta.user_id },
          { display_name: 'Payment Type', variable_name: 'payment_type', value: meta.type },
          ...(meta.listing_id ? [{ display_name: 'Listing ID', variable_name: 'listing_id', value: meta.listing_id }] : []),
        ],
      },
      callback: (response: { reference: string }) => {
        onSuccess(response.reference)
      },
      onClose,
    })
    handler.openIframe()
  }
}

// ─── Verify payment (server-side) ───────────────────────────────────────────
export async function verifyPayment(reference: string): Promise<boolean> {
  const res = await fetch(`/api/payments/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reference }),
  })
  const data = await res.json()
  return data.success
}

// ─── API Route: verify payment server-side ───────────────────────────────────
// Create this file: app/api/payments/verify/route.ts
/*
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const { reference } = await req.json()

  // Verify with Paystack
  const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
  })
  const data = await res.json()

  if (!data.data || data.data.status !== 'success') {
    return NextResponse.json({ success: false, error: 'Payment not verified' }, { status: 400 })
  }

  const meta = data.data.metadata?.custom_fields || []
  const userId = meta.find((f: any) => f.variable_name === 'user_id')?.value
  const type = meta.find((f: any) => f.variable_name === 'payment_type')?.value

  const supabase = createServerSupabase()

  // Update user based on payment type
  if (type === 'premium') {
    await supabase.from('profiles').update({ is_premium: true }).eq('id', userId)
  }
  if (type === 'verification') {
    await supabase.from('profiles').update({ verification_level: 3 }).eq('id', userId)
  }
  if (type === 'boost') {
    const listingId = meta.find((f: any) => f.variable_name === 'listing_id')?.value
    if (listingId) {
      await supabase.from('listings').update({ is_featured: true }).eq('id', listingId)
    }
  }

  // Log the payment
  await supabase.from('payment_logs').insert({
    user_id: userId,
    reference,
    amount: data.data.amount,
    type,
    status: 'success'
  })

  return NextResponse.json({ success: true })
}
*/

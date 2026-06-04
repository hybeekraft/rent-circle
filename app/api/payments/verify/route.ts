import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const { reference } = await req.json()
    if (!reference) {
      return NextResponse.json({ success: false, error: 'Reference required' }, { status: 400 })
    }

    // Verify with Paystack
    const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await res.json()

    if (!data.data || data.data.status !== 'success') {
      return NextResponse.json({ success: false, error: 'Payment not verified' }, { status: 400 })
    }

    const tx = data.data
    const meta = tx.metadata?.custom_fields || []
    const userId = meta.find((f: any) => f.variable_name === 'user_id')?.value
    const type = meta.find((f: any) => f.variable_name === 'payment_type')?.value
    const listingId = meta.find((f: any) => f.variable_name === 'listing_id')?.value

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Invalid payment metadata' }, { status: 400 })
    }

    const supabase = createServerSupabase()

    // Update based on payment type
    if (type === 'premium') {
      const expiresAt = new Date()
      expiresAt.setMonth(expiresAt.getMonth() + (tx.amount >= 2499900 ? 12 : 1))
      await supabase.from('profiles').update({
        is_premium: true,
        premium_expires_at: expiresAt.toISOString(),
      }).eq('id', userId)
    }

    if (type === 'verification') {
      await supabase.from('profiles').update({ verification_level: 3 }).eq('id', userId)
      await supabase.from('verification_requests').insert({
        user_id: userId, type: 'id', status: 'approved',
      })
    }

    if (type === 'boost' && listingId) {
      const boostUntil = new Date()
      boostUntil.setDate(boostUntil.getDate() + 7)
      await supabase.from('listings').update({
        is_featured: true,
        boost_expires_at: boostUntil.toISOString(),
      }).eq('id', listingId).eq('owner_id', userId)
    }

    // Log payment
    await supabase.from('payment_logs').insert({
      user_id: userId,
      reference,
      amount: tx.amount,
      currency: tx.currency,
      type,
      listing_id: listingId || null,
      status: 'success',
      paystack_data: tx,
    })

    // Send notification
    await supabase.from('notifications').insert({
      user_id: userId,
      type: type === 'premium' ? 'verification' : 'verification',
      title: type === 'premium' ? '🎉 Premium activated!' : type === 'boost' ? '🚀 Listing boosted!' : '✓ Verified!',
      body: type === 'premium'
        ? 'Your RentCircle Premium is now active. Enjoy all premium features!'
        : type === 'boost'
        ? 'Your listing is now featured and will get 10x more views for 7 days.'
        : 'Your identity has been verified. You now have a Level 3 badge!',
    })

    return NextResponse.json({ success: true, type, userId })
  } catch (err: any) {
    console.error('Payment verify error:', err)
    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 500 })
  }
}

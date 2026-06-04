import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const { listing_id } = await req.json()
    const supabase = createServerSupabase()

    const { data: listing } = await supabase
      .from('listings')
      .select('*, owner:profiles(full_name,verification_level,created_at,is_verified)')
      .eq('id', listing_id)
      .single()

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    const prompt = `You are a fraud detection expert for Nigerian real estate listings. Analyze this listing for potential scams or red flags.

LISTING:
- Title: ${listing.title}
- Description: ${listing.description}
- Rent: ₦${listing.rent_amount?.toLocaleString()}/month
- Caution fee: ₦${listing.caution_fee?.toLocaleString()}
- Location: ${listing.location?.area}, ${listing.location?.state}
- Property type: ${listing.property_type}
- Amenities claimed: ${listing.amenities?.join(', ')}
- Photos count: ${listing.photos?.length || 0}
- Owner verification level: ${(listing.owner as any)?.verification_level || 0}/3
- Owner account age: ${listing.owner ? Math.round((Date.now() - new Date((listing.owner as any).created_at).getTime()) / 86400000) : 0} days

Nigerian context:
- Typical Yaba room: ₦40k-100k/month
- Typical Lekki: ₦150k-500k/month  
- Very low prices are often bait for advance fee fraud
- Very new accounts with no verification posting luxury listings are suspicious
- Caution fee should typically equal 1-3 months rent

Respond in this exact JSON format only:
{
  "risk_score": <0-100, where 100 is highest risk>,
  "risk_level": "<safe|low|medium|high|very_high>",
  "flags": ["<red flag 1 if any>", "<red flag 2>"],
  "positive_signals": ["<trust signal 1>", "<trust signal 2>"],
  "recommendation": "<one of: approve|review|reject>",
  "summary": "<1 sentence explanation>"
}`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 512,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const aiData = await response.json()
    const rawText = aiData.content?.[0]?.text || ''
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Invalid response')

    const result = JSON.parse(jsonMatch[0])

    // Auto-flag high-risk listings for admin review
    if (result.risk_score >= 70) {
      await supabase.from('reports').insert({
        reporter_id: listing.owner_id,
        target_listing: listing_id,
        reason: 'AI fraud detection flag',
        description: `AI risk score: ${result.risk_score}/100. Flags: ${result.flags?.join(', ')}`,
        status: 'pending',
      })
    }

    return NextResponse.json({ result, listing_id })
  } catch (err: any) {
    console.error('AI listing check error:', err)
    return NextResponse.json({ error: 'Check failed' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const { user_id } = await req.json()
    const supabase = createServerSupabase()

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user_id)
      .single()

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    // Get listings matching their broad criteria
    const { data: listings } = await supabase
      .from('listings')
      .select('id, title, rent_amount, location, amenities, property_type, is_verified')
      .eq('is_active', true)
      .lte('rent_amount', (profile.budget_max || 300000) * 1.2)
      .gte('rent_amount', (profile.budget_min || 0) * 0.8)
      .limit(20)

    const prompt = `You are a smart Nigerian real estate advisor. Based on this user's profile, rank and recommend the best listings for them.

USER PROFILE:
- Occupation: ${profile.occupation}
- Budget: ₦${profile.budget_min?.toLocaleString()} - ₦${profile.budget_max?.toLocaleString()}/month
- Preferred areas: ${profile.preferred_areas?.join(', ')}
- Lifestyle: ${JSON.stringify(profile.lifestyle)}
- Bio: "${profile.bio}"

AVAILABLE LISTINGS (${listings?.length || 0} candidates):
${listings?.map((l, i) => `${i + 1}. ID:${l.id} | "${l.title}" | ₦${l.rent_amount?.toLocaleString()} | ${(l.location as any)?.area}, ${(l.location as any)?.state} | ${l.property_type} | Verified:${l.is_verified} | Amenities:${(l.amenities as string[])?.join(',')}`).join('\n')}

Respond with JSON only:
{
  "recommendations": [
    {
      "listing_id": "<id from above>",
      "rank": 1,
      "reason": "<2 sentence Nigeria-aware explanation of why this fits>",
      "match_score": <60-100>
    }
  ],
  "tips": ["<personalised search tip for this person>", "<another tip>"]
}

Return top 3 recommendations maximum. Consider their lifestyle, occupation, and area preferences carefully.`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 768,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const aiData = await response.json()
    const rawText = aiData.content?.[0]?.text || ''
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Bad AI response')

    const result = JSON.parse(jsonMatch[0])
    return NextResponse.json(result)
  } catch (err: any) {
    console.error('Recommendations error:', err)
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 })
  }
}

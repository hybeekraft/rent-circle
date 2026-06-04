import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const { profile_id } = await req.json()
    const supabase = createServerSupabase()

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profile_id)
      .single()

    if (error || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const lifestyle = profile.lifestyle || {}
    const completeness = {
      hasPhoto: !!profile.avatar_url,
      hasBio: !!(profile.bio && profile.bio.length >= 30),
      hasOccupation: !!profile.occupation,
      hasAge: !!profile.age,
      hasGender: !!profile.gender,
      hasBudget: !!(profile.budget_min && profile.budget_max),
      hasAreas: !!(profile.preferred_areas?.length >= 2),
      hasCleanliness: !!lifestyle.cleanliness,
      hasSleepSchedule: !!lifestyle.sleep_schedule,
      hasSmoking: lifestyle.smoking !== undefined,
      hasHobbies: !!(lifestyle.hobbies?.length >= 2),
      isVerified: profile.verification_level >= 1,
    }

    const prompt = `You are an expert at helping Nigerian young professionals optimize their roommate-finding profiles. Analyze this profile and give actionable, Nigeria-specific improvement tips.

PROFILE DATA:
- Name: ${profile.full_name}
- Age: ${profile.age || 'NOT SET'}
- Gender: ${profile.gender || 'NOT SET'}
- Occupation: ${profile.occupation || 'NOT SET'}
- Company/School: ${profile.school_or_company || 'NOT SET'}
- Bio: "${profile.bio || 'NOT SET'}"
- Preferred areas: ${profile.preferred_areas?.join(', ') || 'NOT SET'}
- Budget: ${profile.budget_min ? `₦${profile.budget_min?.toLocaleString()} - ₦${profile.budget_max?.toLocaleString()}` : 'NOT SET'}
- Lifestyle set: ${JSON.stringify(lifestyle)}
- Has profile photo: ${!!profile.avatar_url}
- Verification level: ${profile.verification_level}/3

COMPLETENESS CHECK:
${Object.entries(completeness).map(([k, v]) => `${k}: ${v}`).join('\n')}

Give your analysis as JSON only (no markdown):
{
  "score": <0-100>,
  "summary": "<one sentence about their profile strength>",
  "strengths": ["<thing they've done well>", "<another strength>"],
  "suggestions": [
    {
      "category": "<e.g. 'Profile Photo' or 'Bio'>",
      "issue": "<what's missing or weak>",
      "fix": "<specific actionable fix>",
      "impact": "<high|medium|low>"
    }
  ]
}

Only include suggestions for real gaps. Max 4 suggestions. Be friendly and Nigeria-aware (e.g. mention NEPA, Lagos areas, NYSC etc when relevant).`

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

    const analysis = JSON.parse(jsonMatch[0])
    return NextResponse.json({ analysis })
  } catch (err: any) {
    console.error('Profile check error:', err)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}

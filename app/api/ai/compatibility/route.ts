import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const { profile_a_id, profile_b_id } = await req.json()

    if (!profile_a_id || !profile_b_id) {
      return NextResponse.json({ error: 'Both profile IDs required' }, { status: 400 })
    }

    const supabase = createServerSupabase()

    // Fetch both profiles
    const [{ data: a }, { data: b }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', profile_a_id).single(),
      supabase.from('profiles').select('*').eq('id', profile_b_id).single(),
    ])

    if (!a || !b) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Build a structured prompt for Claude
    const prompt = `You are a roommate compatibility expert for Nigeria. Analyze these two potential roommates and give a detailed compatibility assessment.

PERSON A:
- Name: ${a.full_name}, Age: ${a.age}, Gender: ${a.gender}
- Occupation: ${a.occupation} at ${a.school_or_company}
- Budget: ₦${a.budget_min?.toLocaleString()} – ₦${a.budget_max?.toLocaleString()}/month
- Preferred areas: ${a.preferred_areas?.join(', ')}
- Lifestyle: ${JSON.stringify(a.lifestyle)}
- Bio: "${a.bio}"

PERSON B:
- Name: ${b.full_name}, Age: ${b.age}, Gender: ${b.gender}
- Occupation: ${b.occupation} at ${b.school_or_company}
- Budget: ₦${b.budget_min?.toLocaleString()} – ₦${b.budget_max?.toLocaleString()}/month
- Preferred areas: ${b.preferred_areas?.join(', ')}
- Lifestyle: ${JSON.stringify(b.lifestyle)}
- Bio: "${b.bio}"

Provide your analysis in this exact JSON format:
{
  "overall_score": <0-100>,
  "summary": "<2 sentence summary of compatibility>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "potential_conflicts": ["<conflict 1>", "<conflict 2>"],
  "tips": ["<tip to improve cohabitation 1>", "<tip 2>"],
  "verdict": "<one of: Excellent Match, Great Match, Good Match, Fair Match, Low Compatibility>"
}`

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const aiData = await response.json()
    const rawText = aiData.content?.[0]?.text || ''

    // Parse JSON from response
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Invalid AI response format')

    const analysis = JSON.parse(jsonMatch[0])

    // Cache the result in Supabase
    await supabase.from('matches').upsert({
      user_a: profile_a_id,
      user_b: profile_b_id,
      compatibility_score: analysis.overall_score,
    }, { onConflict: 'user_a,user_b', ignoreDuplicates: false })

    return NextResponse.json({ analysis })
  } catch (err: any) {
    console.error('AI compatibility error:', err)
    return NextResponse.json({ error: 'Failed to analyze compatibility' }, { status: 500 })
  }
}

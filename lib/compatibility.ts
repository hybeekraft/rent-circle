import type { UserProfile } from '@/types'

type ScoreBreakdown = {
  budget: number
  location: number
  lifestyle: number
  schedule: number
  total: number
}

export function calculateCompatibility(a: UserProfile, b: UserProfile): ScoreBreakdown {
  let budget = 0
  let location = 0
  let lifestyle = 0
  let schedule = 0

  // Budget overlap (25 pts)
  if (a.budget_min && a.budget_max && b.budget_min && b.budget_max) {
    const overlapMin = Math.max(a.budget_min, b.budget_min)
    const overlapMax = Math.min(a.budget_max, b.budget_max)
    if (overlapMax >= overlapMin) {
      const aRange = a.budget_max - a.budget_min || 1
      const bRange = b.budget_max - b.budget_min || 1
      const overlapA = (overlapMax - overlapMin) / aRange
      const overlapB = (overlapMax - overlapMin) / bRange
      budget = Math.round(((overlapA + overlapB) / 2) * 25)
    }
  } else {
    budget = 12 // neutral if not set
  }

  // Location preference overlap (20 pts)
  if (a.preferred_areas?.length && b.preferred_areas?.length) {
    const shared = a.preferred_areas.filter(area =>
      b.preferred_areas?.some(bArea => bArea.toLowerCase() === area.toLowerCase())
    )
    location = Math.round((shared.length / Math.max(a.preferred_areas.length, b.preferred_areas.length)) * 20)
  } else {
    location = 10
  }

  // Lifestyle (35 pts)
  const la = a.lifestyle || {}
  const lb = b.lifestyle || {}
  let lifePoints = 0
  let lifeChecks = 0

  if (la.cleanliness && lb.cleanliness) {
    const diff = Math.abs(la.cleanliness - lb.cleanliness)
    lifePoints += Math.max(0, 10 - diff * 2.5)
    lifeChecks++
  }
  if (la.smoking && lb.smoking) {
    lifePoints += la.smoking === lb.smoking ? 8 : la.smoking === 'no' && lb.smoking === 'no' ? 8 : 0
    lifeChecks++
  }
  if (la.drinking && lb.drinking) {
    lifePoints += la.drinking === lb.drinking ? 7 : 3
    lifeChecks++
  }
  if (la.pets !== undefined && lb.pets !== undefined) {
    lifePoints += la.pets === lb.pets ? 5 : 0
    lifeChecks++
  }
  if (la.guests && lb.guests) {
    const guestMap: Record<string, number> = { often: 3, sometimes: 2, rarely: 1, never: 0 }
    const diff = Math.abs((guestMap[la.guests] ?? 1) - (guestMap[lb.guests] ?? 1))
    lifePoints += Math.max(0, 5 - diff * 2)
    lifeChecks++
  }

  lifestyle = lifeChecks > 0 ? Math.round((lifePoints / (lifeChecks * 7)) * 35) : 17

  // Schedule (20 pts)
  if (la.sleep_schedule && lb.sleep_schedule) {
    schedule = la.sleep_schedule === lb.sleep_schedule ? 20
      : la.sleep_schedule === 'flexible' || lb.sleep_schedule === 'flexible' ? 15
      : 5
  } else {
    schedule = 10
  }

  const total = Math.min(100, budget + location + lifestyle + schedule)

  return { budget, location, lifestyle, schedule, total }
}

export function getCompatibilityLabel(score: number): { label: string; color: string } {
  if (score >= 85) return { label: 'Excellent Match', color: '#16a34a' }
  if (score >= 70) return { label: 'Great Match', color: '#2563eb' }
  if (score >= 55) return { label: 'Good Match', color: '#d97706' }
  if (score >= 40) return { label: 'Fair Match', color: '#ea580c' }
  return { label: 'Low Compatibility', color: '#dc2626' }
}

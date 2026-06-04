'use client'
import { useState } from 'react'
import { Zap, CheckCircle2, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import type { UserProfile } from '@/types'

type Suggestion = {
  category: string
  issue: string
  fix: string
  impact: 'high' | 'medium' | 'low'
}

type Analysis = {
  score: number
  summary: string
  suggestions: Suggestion[]
  strengths: string[]
}

interface Props {
  profile: UserProfile
}

export function AIProfileSuggester({ profile }: Props) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)

  async function analyzeProfile() {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/profile-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_id: profile.id }),
      })
      const data = await res.json()
      setAnalysis(data.analysis)
      setExpanded(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const impactColors = {
    high: 'text-red-600 bg-red-50 border-red-200',
    medium: 'text-amber-600 bg-amber-50 border-amber-200',
    low: 'text-blue-600 bg-blue-50 border-blue-200',
  }

  return (
    <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
      <button
        onClick={() => analysis ? setExpanded(e => !e) : analyzeProfile()}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-ink-50 transition-colors"
        disabled={loading}
      >
        <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
          {loading ? (
            <Loader2 size={18} className="text-brand-500 animate-spin" />
          ) : (
            <Zap size={18} className="text-brand-500" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-ink-900">
            {analysis ? `Profile score: ${analysis.score}/100` : 'AI Profile Analysis'}
          </p>
          <p className="text-xs text-ink-500">
            {loading ? 'Analyzing your profile…' :
             analysis ? analysis.summary :
             'Get tips to improve your match rate'}
          </p>
        </div>
        {analysis && (
          expanded ? <ChevronUp size={16} className="text-ink-400" /> : <ChevronDown size={16} className="text-ink-400" />
        )}
      </button>

      {analysis && expanded && (
        <div className="px-4 pb-4 border-t border-ink-100">
          {/* Score bar */}
          <div className="py-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-ink-500">Profile completeness</span>
              <span className="text-xs font-bold text-ink-900">{analysis.score}%</span>
            </div>
            <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  analysis.score >= 80 ? 'bg-green-500' :
                  analysis.score >= 60 ? 'bg-brand-500' : 'bg-amber-500'
                }`}
                style={{ width: `${analysis.score}%` }}
              />
            </div>
          </div>

          {/* Strengths */}
          {analysis.strengths.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-ink-600 uppercase tracking-wide mb-2">What's working ✓</p>
              <div className="flex flex-col gap-1.5">
                {analysis.strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-ink-600">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {analysis.suggestions.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-ink-600 uppercase tracking-wide mb-2">Improvements</p>
              <div className="flex flex-col gap-2">
                {analysis.suggestions.map((s, i) => (
                  <div key={i} className={`p-3 rounded-xl border text-xs ${impactColors[s.impact]}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">{s.category}</span>
                      <span className="capitalize opacity-70">{s.impact} impact</span>
                    </div>
                    <p className="opacity-80 mb-1">{s.issue}</p>
                    <p className="font-medium">→ {s.fix}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

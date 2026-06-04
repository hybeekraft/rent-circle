'use client'
import { useState } from 'react'
import { Plus, Users, MapPin, Target, ArrowRight, Crown, CheckCircle2 } from 'lucide-react'
import { formatCompact } from '@/lib/utils'

const MOCK_GROUPS = [
  {
    id: 'g1', name: 'Lekki Crew 🏠', description: 'Looking for a 4-bedroom apartment in Lekki or VI',
    members: [
      { id: 'u1', name: 'Chioma', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=60', isCreator: true },
      { id: 'u2', name: 'Emeka', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60' },
      { id: 'u3', name: 'Zara', avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=60' },
    ],
    maxMembers: 4, budget_per_person: 200000, target_area: 'Lekki', status: 'forming',
  },
  {
    id: 'g2', name: 'Yaba Budget Squad', description: '4 corpers pooling budget to get a good flat near UNILAG',
    members: [
      { id: 'u4', name: 'Kemi', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=60', isCreator: true },
      { id: 'u5', name: 'Tunde', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60' },
    ],
    maxMembers: 4, budget_per_person: 60000, target_area: 'Yaba', status: 'forming',
  },
]

export default function GroupPage() {
  const [tab, setTab] = useState<'browse' | 'create'>('browse')
  const [form, setForm] = useState({ name: '', description: '', target_area: '', budget_per_person: 100000, max_members: 3 })
  const [step, setStep] = useState(0)

  return (
    <div className="min-h-screen bg-ink-50">
      <div className="bg-white px-4 py-4 border-b border-ink-100">
        <h1 className="text-xl font-bold text-ink-900 mb-3">Group Renting</h1>
        <p className="text-xs text-ink-500 mb-3">Pool budgets with others to afford better apartments</p>
        <div className="flex bg-ink-100 rounded-2xl p-1">
          {(['browse', 'create'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-all ${tab === t ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500'}`}
            >
              {t === 'browse' ? '🔍 Browse groups' : '➕ Create group'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'browse' && (
        <div className="px-4 pt-4 flex flex-col gap-4">
          {/* How it works */}
          <div className="bg-gradient-to-br from-brand-50 to-brand-100/50 rounded-3xl p-4 border border-brand-200">
            <p className="font-semibold text-brand-800 mb-2 text-sm">💡 How group renting works</p>
            <div className="flex flex-col gap-2">
              {[
                '4 people × ₦150k budget = ₦600k combined',
                'Afford a bigger, better apartment together',
                'Find verified roommates through RentCircle',
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-brand-500 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-brand-700">{t}</span>
                </div>
              ))}
            </div>
          </div>

          {MOCK_GROUPS.map(group => {
            const totalBudget = group.budget_per_person * group.maxMembers
            const fillPercent = (group.members.length / group.maxMembers) * 100
            return (
              <div key={group.id} className="bg-white rounded-3xl p-4 border border-ink-100 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-ink-900">{group.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <MapPin size={12} className="text-ink-400" />
                      <span className="text-xs text-ink-500">{group.target_area}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${
                    group.status === 'forming' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
                  }`}>
                    {group.status}
                  </span>
                </div>

                <p className="text-sm text-ink-500 mb-3">{group.description}</p>

                {/* Budget */}
                <div className="bg-ink-50 rounded-2xl p-3 mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-ink-500">Combined budget</span>
                    <span className="text-sm font-bold text-ink-900">{formatCompact(totalBudget)}/mo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-ink-400">{formatCompact(group.budget_per_person)}/person</span>
                    <div className="flex-1 h-1.5 bg-ink-200 rounded-full">
                      <div className="h-full bg-brand-500 rounded-full" style={{ width: `${fillPercent}%` }} />
                    </div>
                    <span className="text-xs text-ink-500">{group.members.length}/{group.maxMembers}</span>
                  </div>
                </div>

                {/* Members */}
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {group.members.map(m => (
                      <div key={m.id} className="relative">
                        <img src={m.avatar} alt={m.name} className="w-9 h-9 rounded-full border-2 border-white object-cover" />
                        {m.isCreator && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                            <Crown size={8} className="text-amber-900" />
                          </div>
                        )}
                      </div>
                    ))}
                    {group.maxMembers - group.members.length > 0 && (
                      <div className="w-9 h-9 rounded-full border-2 border-dashed border-ink-300 bg-ink-50 flex items-center justify-center">
                        <Plus size={14} className="text-ink-400" />
                      </div>
                    )}
                  </div>
                  <button className="flex items-center gap-1.5 bg-brand-500 text-white text-sm font-medium px-4 py-2 rounded-xl active:scale-95 transition-transform">
                    Join group <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'create' && (
        <div className="px-4 pt-4 animate-slide-up">
          <div className="bg-white rounded-3xl p-5 border border-ink-100">
            <h3 className="font-bold text-ink-900 mb-4">Create a renting group</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-ink-700 mb-1.5 block">Group name</label>
                <input
                  placeholder="e.g. Lekki Professionals 2024"
                  value={form.name}
                  onChange={e => setForm(f => ({...f, name: e.target.value}))}
                  className="w-full border border-ink-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-brand-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink-700 mb-1.5 block">Description</label>
                <textarea
                  placeholder="What are you looking for? Who should join?"
                  value={form.description}
                  onChange={e => setForm(f => ({...f, description: e.target.value}))}
                  rows={3}
                  className="w-full border border-ink-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-brand-400 resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink-700 mb-1.5 block">Target area</label>
                <input
                  placeholder="e.g. Lekki, Yaba, Ikeja"
                  value={form.target_area}
                  onChange={e => setForm(f => ({...f, target_area: e.target.value}))}
                  className="w-full border border-ink-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-brand-400"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-sm font-medium text-ink-700">Your budget/person</label>
                  <span className="text-sm font-bold text-brand-600">{formatCompact(form.budget_per_person)}/mo</span>
                </div>
                <input type="range" min="20000" max="500000" step="5000"
                  value={form.budget_per_person}
                  onChange={e => setForm(f => ({...f, budget_per_person: parseInt(e.target.value)}))}
                  className="w-full accent-brand-500"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-sm font-medium text-ink-700">Max group size</label>
                  <span className="text-sm font-bold text-brand-600">{form.max_members} people</span>
                </div>
                <input type="range" min="2" max="6" step="1"
                  value={form.max_members}
                  onChange={e => setForm(f => ({...f, max_members: parseInt(e.target.value)}))}
                  className="w-full accent-brand-500"
                />
              </div>
              {/* Summary */}
              <div className="bg-brand-50 rounded-2xl p-4">
                <p className="text-xs text-brand-600 mb-1">Combined monthly budget</p>
                <p className="text-2xl font-bold text-brand-700">{formatCompact(form.budget_per_person * form.max_members)}</p>
                <p className="text-xs text-brand-500">{form.max_members} people × {formatCompact(form.budget_per_person)}</p>
              </div>
              <button className="w-full bg-brand-500 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-98 transition-transform">
                <Users size={18} /> Create group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

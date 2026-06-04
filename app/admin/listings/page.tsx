'use client'
import { useState } from 'react'
import { Search, Shield, CheckCircle, XCircle, Eye, Zap, AlertTriangle, Star } from 'lucide-react'

const LISTINGS = [
  { id: 'l1', title: 'Cozy room in Yaba near UNILAG', area: 'Yaba, Lagos', rent: 75000, type: 'room', owner: 'Ada Okonkwo', verified: true, status: 'active', aiRisk: 12, photos: 3, created: '2 hrs ago', views: 89 },
  { id: 'l2', title: '3-bedroom apartment in Lekki for ₦50k', area: 'Lekki, Lagos', rent: 50000, type: 'apartment', owner: 'Unknown User', verified: false, status: 'flagged', aiRisk: 91, photos: 0, created: '30 mins ago', views: 4 },
  { id: 'l3', title: 'Self-con in Ikeja, furnished', area: 'Ikeja, Lagos', rent: 180000, type: 'flat', owner: 'Emeka Eze', verified: true, status: 'active', aiRisk: 8, photos: 5, created: '1 day ago', views: 234 },
  { id: 'l4', title: 'Luxury penthouse in VI — looking for roommates', area: 'VI, Lagos', rent: 600000, type: 'apartment', owner: 'New Account', verified: false, status: 'pending', aiRisk: 67, photos: 2, created: '2 hrs ago', views: 12 },
  { id: 'l5', title: 'Room in shared flat, Surulere', area: 'Surulere, Lagos', rent: 55000, type: 'room', owner: 'Fatimah Bello', verified: true, status: 'active', aiRisk: 15, photos: 4, created: '3 days ago', views: 156 },
  { id: 'l6', title: 'AMAZING deal — 4 bedroom house in Lekki for ₦80k!!!', area: 'Lekki, Lagos', rent: 80000, type: 'duplex', owner: 'John Doe', verified: false, status: 'flagged', aiRisk: 95, photos: 1, created: '15 mins ago', views: 2 },
]

function RiskBadge({ score }: { score: number }) {
  const { label, cls } = score >= 80 ? { label: 'Very High Risk', cls: 'bg-red-100 text-red-700' }
    : score >= 60 ? { label: 'High Risk', cls: 'bg-orange-100 text-orange-700' }
    : score >= 40 ? { label: 'Medium Risk', cls: 'bg-amber-100 text-amber-700' }
    : { label: 'Low Risk', cls: 'bg-green-100 text-green-700' }
  return <span className={`text-xs font-semibold px-2 py-1 rounded-full ${cls}`}>{label} ({score})</span>
}

function StatusBadge({ status }: { status: string }) {
  const cls = status === 'active' ? 'bg-green-100 text-green-700'
    : status === 'flagged' ? 'bg-red-100 text-red-700'
    : status === 'pending' ? 'bg-amber-100 text-amber-700'
    : 'bg-gray-100 text-gray-600'
  return <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${cls}`}>{status}</span>
}

export default function AdminListingsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeId, setActiveId] = useState<string | null>(null)

  const filtered = LISTINGS.filter(l => {
    if (search && !l.title.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter !== 'all' && l.status !== statusFilter) return false
    return true
  })

  const active = LISTINGS.find(l => l.id === activeId)

  const flaggedCount = LISTINGS.filter(l => l.status === 'flagged').length
  const pendingCount = LISTINGS.filter(l => l.status === 'pending').length

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Listings</h1>
          <p className="text-gray-500 text-sm mt-1">{LISTINGS.length} total · <span className="text-red-600 font-medium">{flaggedCount} flagged</span> · <span className="text-amber-600 font-medium">{pendingCount} pending review</span></p>
        </div>
      </div>

      {/* AI summary banner */}
      {flaggedCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Zap size={18} className="text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">AI detected {flaggedCount} suspicious listings</p>
            <p className="text-xs text-red-600">Two listings show classic advance-fee fraud patterns. Review and remove immediately.</p>
          </div>
          <button className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-red-700">Review now</button>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
          <Search size={16} className="text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search listings..." className="flex-1 text-sm outline-none" />
        </div>
        {['all', 'active', 'pending', 'flagged'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize border transition-all ${statusFilter === s ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Listing</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Rent</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">AI Risk</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Owner</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(l => (
              <tr key={l.id} className={`hover:bg-gray-50 transition-colors ${l.status === 'flagged' ? 'bg-red-50/30' : ''}`}>
                <td className="px-4 py-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 max-w-xs truncate">{l.title}</p>
                      {l.verified && <Shield size={13} className="text-green-500 flex-shrink-0" />}
                      {l.status === 'flagged' && <AlertTriangle size={13} className="text-red-500 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-400">{l.area} · {l.photos} photos · {l.views} views · {l.created}</p>
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-gray-900">₦{l.rent.toLocaleString()}</td>
                <td className="px-4 py-3"><RiskBadge score={l.aiRisk} /></td>
                <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {l.verified && <Shield size={12} className="text-green-500" />}
                    <span className="text-sm text-gray-700">{l.owner}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setActiveId(l.id)} className="p-1.5 text-gray-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg">
                      <Eye size={15} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg" title="Verify listing">
                      <CheckCircle size={15} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg" title="Remove listing">
                      <XCircle size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail panel */}
      {active && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={() => setActiveId(null)}>
          <div className="bg-white w-96 h-full overflow-y-auto p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900">Listing Details</h2>
              <button onClick={() => setActiveId(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{active.title}</h3>
                <div className="flex gap-2 flex-wrap">
                  <StatusBadge status={active.status} />
                  <RiskBadge score={active.aiRisk} />
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                {[
                  ['Location', active.area],
                  ['Rent', `₦${active.rent.toLocaleString()}/month`],
                  ['Type', active.type],
                  ['Photos', `${active.photos} uploaded`],
                  ['Views', active.views.toString()],
                  ['Posted', active.created],
                  ['Owner', active.owner],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-gray-500">{k}</span>
                    <span className="font-medium text-gray-900">{v}</span>
                  </div>
                ))}
              </div>

              {active.aiRisk >= 60 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-xs font-semibold text-red-700 mb-1">⚠ AI Red Flags</p>
                  {active.aiRisk >= 80 && <p className="text-xs text-red-600">• Price is suspiciously low for {active.area}</p>}
                  {active.aiRisk >= 60 && <p className="text-xs text-red-600">• Owner account created recently with no verification</p>}
                  {active.photos < 2 && <p className="text-xs text-red-600">• Very few photos uploaded</p>}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <button className="w-full flex items-center justify-center gap-2 bg-green-500 text-white text-sm font-medium py-3 rounded-xl hover:bg-green-600">
                  <CheckCircle size={15} /> Verify & Approve
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-amber-50 text-amber-700 text-sm font-medium py-3 rounded-xl border border-amber-200 hover:bg-amber-100">
                  <AlertTriangle size={15} /> Request more info
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 text-sm font-medium py-3 rounded-xl border border-red-200 hover:bg-red-100">
                  <XCircle size={15} /> Remove listing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

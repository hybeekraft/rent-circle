'use client'
import { useState } from 'react'
import { Shield, CheckCircle, XCircle, Eye, Clock } from 'lucide-react'

const QUEUE = [
  { id: 'v1', user: 'Zara Abdullahi', email: 'zara@gmail.com', type: 'NIN', doc: 'NIN Slip', submitted: '10 mins ago', level: 1, avatar: '👩🏾', status: 'pending' },
  { id: 'v2', user: 'Segun Omotola', email: 'segun@gmail.com', type: 'Address', doc: 'PHCN Bill', submitted: '1 hr ago', level: 2, avatar: '👨🏿', status: 'pending' },
  { id: 'v3', user: 'Ngozi Eze', email: 'ngozi@gmail.com', type: 'NIN', doc: 'NIN Slip', submitted: '3 hrs ago', level: 1, avatar: '👩🏿', status: 'reviewing' },
  { id: 'v4', user: 'Kemi Adeyemi', email: 'kemi@gmail.com', type: 'NIN', doc: 'Passport Data Page', submitted: '5 hrs ago', level: 1, avatar: '👩🏽', status: 'pending' },
  { id: 'v5', user: 'Femi Olatunji', email: 'femi@gmail.com', type: 'Address', doc: 'Bank Statement', submitted: '1 day ago', level: 2, avatar: '👨🏾', status: 'approved' },
]

const TYPE_INFO: Record<string, { label: string; grants: string; level: number }> = {
  NIN: { label: 'NIN / National ID', grants: 'Level 2 — ID Verified badge', level: 2 },
  Address: { label: 'Address Verification', grants: 'Level 3 — Fully Verified badge', level: 3 },
}

export default function AdminVerificationPage() {
  const [active, setActive] = useState<typeof QUEUE[0] | null>(null)
  const [filter, setFilter] = useState('pending')

  const filtered = QUEUE.filter(v => filter === 'all' || v.status === filter)
  const pendingCount = QUEUE.filter(v => v.status === 'pending').length

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Verification Queue</h1>
          <p className="text-gray-500 text-sm mt-1">
            {pendingCount} pending review · Average review time: 2 hours
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Pending', count: QUEUE.filter(v => v.status === 'pending').length, color: 'text-amber-600 bg-amber-50' },
          { label: 'Reviewing', count: QUEUE.filter(v => v.status === 'reviewing').length, color: 'text-blue-600 bg-blue-50' },
          { label: 'Approved today', count: 12, color: 'text-green-600 bg-green-50' },
          { label: 'Rejected today', count: 3, color: 'text-red-600 bg-red-50' },
        ].map(({ label, count, color }) => (
          <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
            <p className={`text-2xl font-bold mb-0.5 ${color.split(' ')[0]}`}>{count}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {['pending', 'reviewing', 'approved', 'all'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize border transition-all ${filter === s ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        {/* Queue list */}
        <div className="flex-1 flex flex-col gap-2">
          {filtered.map(v => (
            <button
              key={v.id}
              onClick={() => setActive(v)}
              className={`w-full text-left p-4 bg-white border rounded-2xl hover:border-brand-300 transition-all ${active?.id === v.id ? 'border-brand-500 ring-2 ring-brand-100' : 'border-gray-100'}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{v.avatar}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900 text-sm">{v.user}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                      v.status === 'approved' ? 'bg-green-50 text-green-700' :
                      v.status === 'reviewing' ? 'bg-blue-50 text-blue-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>{v.status}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Shield size={10} /> {TYPE_INFO[v.type]?.label}</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> {v.submitted}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        {active ? (
          <div className="w-80 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm h-fit sticky top-6">
            <div className="text-center mb-5">
              <span className="text-4xl">{active.avatar}</span>
              <h3 className="font-bold text-gray-900 mt-2">{active.user}</h3>
              <p className="text-sm text-gray-500">{active.email}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Document type</span>
                <span className="font-medium text-gray-900">{active.doc}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Verification type</span>
                <span className="font-medium text-gray-900">{TYPE_INFO[active.type]?.label}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Will grant</span>
                <span className="font-medium text-green-700">{TYPE_INFO[active.type]?.grants}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Submitted</span>
                <span className="text-gray-900">{active.submitted}</span>
              </div>
            </div>

            {/* Document preview (mock) */}
            <div className="bg-gray-100 rounded-xl h-40 flex items-center justify-center mb-4 border-2 border-dashed border-gray-300">
              <div className="text-center">
                <Eye size={24} className="text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-400">Document preview</p>
                <p className="text-xs text-gray-300">(Secured, admins only)</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button className="w-full flex items-center justify-center gap-2 bg-green-500 text-white text-sm font-medium py-3 rounded-xl hover:bg-green-600">
                <CheckCircle size={15} /> Approve verification
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium py-3 rounded-xl border border-blue-200 hover:bg-blue-100">
                <Eye size={15} /> Request more info
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 text-sm font-medium py-3 rounded-xl border border-red-200 hover:bg-red-100">
                <XCircle size={15} /> Reject
              </button>
            </div>
          </div>
        ) : (
          <div className="w-80 bg-gray-50 border border-dashed border-gray-200 rounded-2xl flex items-center justify-center h-48">
            <p className="text-sm text-gray-400 text-center">Select a request<br />to review</p>
          </div>
        )}
      </div>
    </div>
  )
}

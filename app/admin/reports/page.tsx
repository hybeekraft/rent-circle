'use client'
import { useState } from 'react'
import { AlertTriangle, CheckCircle, XCircle, Eye, MessageSquare, Home, User } from 'lucide-react'

const REPORTS = [
  { id: 'r1', type: 'listing', priority: 'high', title: 'Fake listing — ₦50k for 3-bedroom in Lekki', reporter: 'Ada Okonkwo', target: 'Unknown User', reason: 'Price is clearly bait for advance fee fraud. No photos, new account.', status: 'pending', time: '5 mins ago' },
  { id: 'r2', type: 'user', priority: 'high', title: 'Harassment in chat', reporter: 'Fatimah Bello', target: 'Tunde Adeyemi', reason: 'User sent threatening messages after I declined to visit the property alone.', status: 'reviewing', time: '23 mins ago' },
  { id: 'r3', type: 'listing', priority: 'medium', title: 'Wrong price listed — actually ₦200k not ₦80k', reporter: 'Emeka Eze', target: 'Chidi Okafor', reason: 'Arrived at property and landlord quoted a different price.', status: 'pending', time: '1 hr ago' },
  { id: 'r4', type: 'user', priority: 'high', title: 'Suspected scammer requesting upfront payment', reporter: 'Ngozi Eze', target: 'John Doe', reason: 'Asked me to send ₦20k before showing me the property. Classic advance fee.', status: 'pending', time: '2 hrs ago' },
  { id: 'r5', type: 'listing', priority: 'low', title: 'Duplicate listing posted', reporter: 'Segun Omotola', target: 'Ada Okonkwo', reason: 'This property is listed twice with slightly different prices.', status: 'resolved', time: '3 hrs ago' },
  { id: 'r6', type: 'user', priority: 'medium', title: 'Fake profile photos', reporter: 'Kemi Adeyemi', target: 'New User', reason: 'Profile photo is clearly a stock image, not a real person.', status: 'dismissed', time: '1 day ago' },
]

const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 }

export default function AdminReportsPage() {
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<string | null>(null)

  const sorted = [...REPORTS]
    .filter(r => filter === 'all' || r.status === filter)
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])

  const active = REPORTS.find(r => r.id === selected)

  function PriorityDot({ p }: { p: string }) {
    return <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${p === 'high' ? 'bg-red-500' : p === 'medium' ? 'bg-amber-500' : 'bg-gray-400'}`} />
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-500 text-sm mt-1">
          {REPORTS.filter(r => r.status === 'pending').length} pending ·
          {' '}{REPORTS.filter(r => r.priority === 'high' && r.status !== 'resolved' && r.status !== 'dismissed').length} high priority
        </p>
      </div>

      <div className="flex gap-3 mb-5">
        {['all', 'pending', 'reviewing', 'resolved', 'dismissed'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize border transition-all ${filter === s ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        {/* Reports list */}
        <div className="flex-1 flex flex-col gap-2">
          {sorted.map(report => (
            <button
              key={report.id}
              onClick={() => setSelected(report.id)}
              className={`w-full text-left p-4 bg-white border rounded-2xl hover:border-brand-300 transition-all ${selected === report.id ? 'border-brand-500 ring-2 ring-brand-100' : 'border-gray-100'}`}
            >
              <div className="flex items-start gap-3">
                <PriorityDot p={report.priority} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-gray-900 text-sm leading-snug">{report.title}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 capitalize ${
                      report.status === 'resolved' ? 'bg-green-50 text-green-700' :
                      report.status === 'dismissed' ? 'bg-gray-100 text-gray-500' :
                      report.status === 'reviewing' ? 'bg-blue-50 text-blue-700' :
                      'bg-red-50 text-red-700'
                    }`}>{report.status}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      {report.type === 'listing' ? <Home size={11} /> : <User size={11} />}
                      {report.type}
                    </span>
                    <span>Reported by {report.reporter}</span>
                    <span>{report.time}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        {active ? (
          <div className="w-80 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm h-fit sticky top-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-sm leading-snug">{active.title}</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 ml-2">×</button>
            </div>

            <div className="space-y-3 mb-4">
              <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                <div className="flex justify-between text-xs"><span className="text-gray-500">Reporter</span><span className="font-medium text-gray-900">{active.reporter}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500">Target</span><span className="font-medium text-gray-900">{active.target}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500">Priority</span><span className={`font-semibold capitalize ${active.priority === 'high' ? 'text-red-600' : active.priority === 'medium' ? 'text-amber-600' : 'text-gray-600'}`}>{active.priority}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500">Reported</span><span className="text-gray-900">{active.time}</span></div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs font-semibold text-amber-700 mb-1">Report reason</p>
                <p className="text-xs text-amber-800 leading-relaxed">"{active.reason}"</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white text-xs font-medium py-2.5 rounded-xl hover:bg-blue-600">
                <MessageSquare size={13} /> Contact reporter
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-red-500 text-white text-xs font-medium py-2.5 rounded-xl hover:bg-red-600">
                <XCircle size={13} /> Suspend {active.type === 'user' ? 'user' : 'listing'}
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-green-50 text-green-700 text-xs font-medium py-2.5 rounded-xl border border-green-200 hover:bg-green-100">
                <CheckCircle size={13} /> Mark resolved
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-600 text-xs font-medium py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100">
                Dismiss report
              </button>
            </div>
          </div>
        ) : (
          <div className="w-80 bg-gray-50 border border-dashed border-gray-200 rounded-2xl flex items-center justify-center h-48">
            <p className="text-sm text-gray-400 text-center">Select a report<br />to view details</p>
          </div>
        )}
      </div>
    </div>
  )
}

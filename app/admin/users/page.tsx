'use client'
import { useState } from 'react'
import { Search, Filter, Shield, Crown, Ban, CheckCircle, AlertTriangle, Eye, MoreHorizontal } from 'lucide-react'

const USERS = [
  { id: 'u1', name: 'Ada Okonkwo', email: 'ada@gmail.com', phone: '+234 801 234 5678', joined: '2024-06-01', location: 'Yaba, Lagos', occupation: 'Software Engineer', level: 2, premium: false, status: 'active', listings: 1, matches: 8 },
  { id: 'u2', name: 'Emeka Eze', email: 'emeka@yahoo.com', phone: '+234 812 345 6789', joined: '2024-05-15', location: 'Surulere, Lagos', occupation: 'NYSC Member', level: 3, premium: true, status: 'active', listings: 0, matches: 12 },
  { id: 'u3', name: 'Fatimah Bello', email: 'fatimah@gmail.com', phone: '+234 803 456 7890', joined: '2024-05-28', location: 'Ikeja, Lagos', occupation: 'Remote Worker', level: 1, premium: false, status: 'active', listings: 2, matches: 4 },
  { id: 'u4', name: 'Tunde Adeyemi', email: 'tunde@outlook.com', phone: '+234 705 678 9012', joined: '2024-06-02', location: 'Lekki, Lagos', occupation: 'Entrepreneur', level: 0, premium: false, status: 'suspended', listings: 3, matches: 0 },
  { id: 'u5', name: 'Ngozi Eze', email: 'ngozi@gmail.com', phone: '+234 816 789 0123', joined: '2024-05-10', location: 'Abuja', occupation: 'Civil Servant', level: 2, premium: false, status: 'active', listings: 0, matches: 6 },
  { id: 'u6', name: 'Segun Omotola', email: 'segun@gmail.com', phone: '+234 702 890 1234', joined: '2024-04-20', location: 'VI, Lagos', occupation: 'Banker', level: 3, premium: true, status: 'active', listings: 1, matches: 20 },
]

const LEVEL_LABELS = ['Unverified', 'Email', 'ID Verified', 'Fully Verified']
const LEVEL_COLORS = ['bg-gray-100 text-gray-600', 'bg-amber-50 text-amber-700', 'bg-blue-50 text-blue-700', 'bg-green-50 text-green-700']

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState<string[]>([])
  const [activeUser, setActiveUser] = useState<typeof USERS[0] | null>(null)

  const filtered = USERS.filter(u => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter !== 'all' && u.status !== statusFilter) return false
    return true
  })

  function toggleSelect(id: string) {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 text-sm mt-1">{USERS.length} total users</p>
        </div>
        <div className="flex gap-3">
          {selected.length > 0 && (
            <div className="flex gap-2">
              <button className="flex items-center gap-2 bg-red-50 text-red-600 text-sm font-medium px-4 py-2 rounded-xl border border-red-200 hover:bg-red-100">
                <Ban size={14} /> Suspend ({selected.length})
              </button>
              <button className="flex items-center gap-2 bg-green-50 text-green-600 text-sm font-medium px-4 py-2 rounded-xl border border-green-200 hover:bg-green-100">
                <CheckCircle size={14} /> Verify ({selected.length})
              </button>
            </div>
          )}
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 text-sm font-medium px-4 py-2 rounded-xl hover:bg-gray-50">
            <Filter size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
          <Search size={16} className="text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="flex-1 text-sm outline-none text-gray-900 placeholder:text-gray-400"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'suspended'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize border transition-all ${statusFilter === s ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                <input type="checkbox" onChange={e => setSelected(e.target.checked ? USERS.map(u => u.id) : [])} className="rounded" />
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">User</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Location</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Verification</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Listings</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(user.id)}
                    onChange={() => toggleSelect(user.id)}
                    className="rounded"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-sm flex-shrink-0">
                      {user.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-medium text-gray-900">{user.name}</p>
                        {user.premium && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-semibold">PRO</span>}
                      </div>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-gray-700">{user.location}</p>
                  <p className="text-xs text-gray-400">{user.occupation}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${LEVEL_COLORS[user.level]}`}>
                    <Shield size={10} className="inline mr-1" />
                    {LEVEL_LABELS[user.level]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${user.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{user.listings}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setActiveUser(user)} className="p-1.5 text-gray-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-colors">
                      <Eye size={15} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors">
                      <Shield size={15} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Ban size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User detail slide-over */}
      {activeUser && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={() => setActiveUser(null)}>
          <div className="bg-white w-96 h-full overflow-y-auto p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-gray-900">User Details</h2>
              <button onClick={() => setActiveUser(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-2xl mx-auto mb-3">
                {activeUser.name[0]}
              </div>
              <h3 className="font-semibold text-gray-900">{activeUser.name}</h3>
              <p className="text-sm text-gray-500">{activeUser.email}</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${LEVEL_COLORS[activeUser.level]}`}>
                  {LEVEL_LABELS[activeUser.level]}
                </span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${activeUser.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {activeUser.status}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Account Info</h4>
                <div className="space-y-2">
                  {[
                    ['Phone', activeUser.phone],
                    ['Location', activeUser.location],
                    ['Occupation', activeUser.occupation],
                    ['Joined', new Date(activeUser.joined).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })],
                    ['Listings', activeUser.listings.toString()],
                    ['Matches', activeUser.matches.toString()],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-sm">
                      <span className="text-gray-500">{k}</span>
                      <span className="font-medium text-gray-900">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button className="w-full flex items-center justify-center gap-2 bg-green-500 text-white text-sm font-medium py-3 rounded-xl hover:bg-green-600">
                  <Shield size={15} /> Verify Identity (Level 3)
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-amber-50 text-amber-700 text-sm font-medium py-3 rounded-xl border border-amber-200 hover:bg-amber-100">
                  <AlertTriangle size={15} /> Send Warning
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 text-sm font-medium py-3 rounded-xl border border-red-200 hover:bg-red-100">
                  <Ban size={15} /> {activeUser.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

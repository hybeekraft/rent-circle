import { Users, Home, MessageCircle, Shield, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

const STATS = [
  { label: 'Total Users', value: '12,847', change: '+234 this week', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Active Listings', value: '3,421', change: '+89 today', icon: Home, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Messages Today', value: '8,921', change: '+12% vs yesterday', icon: MessageCircle, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Pending Reports', value: '47', change: '12 high priority', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
]

const RECENT_USERS = [
  { name: 'Ada Okonkwo', email: 'ada@gmail.com', joined: '2 mins ago', verified: true, premium: false },
  { name: 'Emeka Eze', email: 'emeka@yahoo.com', joined: '18 mins ago', verified: true, premium: true },
  { name: 'Fatimah Bello', email: 'fatimah@gmail.com', joined: '42 mins ago', verified: false, premium: false },
  { name: 'Tunde Adeyemi', email: 'tunde@outlook.com', joined: '1 hr ago', verified: true, premium: false },
  { name: 'Chidinma Okafor', email: 'chidi@gmail.com', joined: '2 hrs ago', verified: false, premium: false },
]

const RECENT_REPORTS = [
  { title: 'Fake listing in Lekki', type: 'listing', priority: 'high', status: 'pending', time: '5 mins ago' },
  { title: 'Suspicious account activity', type: 'user', priority: 'high', status: 'reviewing', time: '23 mins ago' },
  { title: 'Wrong price listed', type: 'listing', priority: 'medium', status: 'pending', time: '1 hr ago' },
  { title: 'Harassment in chat', type: 'user', priority: 'high', status: 'pending', time: '2 hrs ago' },
  { title: 'Duplicate listing', type: 'listing', priority: 'low', status: 'resolved', time: '3 hrs ago' },
]

const PENDING_VERIFICATIONS = [
  { name: 'Zara Abdullahi', type: 'NIN Verification', submitted: '10 mins ago', avatar: '👩🏾' },
  { name: 'Segun Omotola', type: 'Address Verification', submitted: '1 hr ago', avatar: '👨🏿' },
  { name: 'Ngozi Eze', type: 'NIN Verification', submitted: '3 hrs ago', avatar: '👩🏿' },
]

export default function AdminPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">
          {new Date().toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {STATS.map(({ label, value, change, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon size={20} className={color} />
              </div>
              <TrendingUp size={14} className="text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-0.5">{value}</p>
            <p className="text-xs font-medium text-gray-500">{label}</p>
            <p className="text-xs text-green-600 mt-1">{change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Recent users */}
        <div className="col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">New Users</h2>
            <a href="/admin/users" className="text-xs text-brand-500 font-medium">View all →</a>
          </div>
          <div className="flex flex-col gap-3">
            {RECENT_USERS.map(({ name, email, joined, verified, premium }) => (
              <div key={email} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600 flex-shrink-0">
                  {name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
                    {verified && <span className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0" title="Verified" />}
                    {premium && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-semibold">PRO</span>}
                  </div>
                  <p className="text-xs text-gray-400">{joined}</p>
                </div>
                <button className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 px-2 py-1 rounded-lg">View</button>
              </div>
            ))}
          </div>
        </div>

        {/* Reports */}
        <div className="col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Reports</h2>
            <a href="/admin/reports" className="text-xs text-brand-500 font-medium">View all →</a>
          </div>
          <div className="flex flex-col gap-3">
            {RECENT_REPORTS.map(({ title, type, priority, status, time }) => (
              <div key={title} className="flex items-start gap-3">
                <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                  priority === 'high' ? 'bg-red-500' :
                  priority === 'medium' ? 'bg-amber-500' : 'bg-gray-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">{time}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                      status === 'resolved' ? 'bg-green-50 text-green-700' :
                      status === 'reviewing' ? 'bg-blue-50 text-blue-700' :
                      'bg-red-50 text-red-700'
                    }`}>{status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verifications */}
        <div className="col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Pending Verifications</h2>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
              {PENDING_VERIFICATIONS.length} pending
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {PENDING_VERIFICATIONS.map(({ name, type, submitted, avatar }) => (
              <div key={name} className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{avatar}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{name}</p>
                    <p className="text-xs text-gray-500">{type}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{submitted}</span>
                  <div className="flex gap-2">
                    <button className="text-xs bg-green-500 text-white px-2.5 py-1 rounded-lg flex items-center gap-1 hover:bg-green-600">
                      <CheckCircle size={11} /> Approve
                    </button>
                    <button className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-lg hover:bg-red-100">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="mt-4 bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl p-5 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-100 mb-1">🤖 AI Safety Monitor</p>
            <h3 className="text-lg font-bold mb-1">3 listings flagged for review today</h3>
            <p className="text-brand-100 text-sm">AI detected 2 potential scam listings in Lekki and 1 price manipulation in Yaba. Review recommended.</p>
          </div>
          <button className="bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors flex-shrink-0 ml-6">
            Review flagged →
          </button>
        </div>
      </div>
    </div>
  )
}

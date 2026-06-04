import { TrendingUp, Users, Home, MessageCircle, DollarSign } from 'lucide-react'

const METRICS = [
  { label: 'Daily Active Users', value: '4,821', change: '+8.2%', up: true },
  { label: 'New Registrations', value: '234', change: '+15.4%', up: true },
  { label: 'Listings Posted', value: '89', change: '+5.1%', up: true },
  { label: 'Successful Matches', value: '312', change: '+22.1%', up: true },
  { label: 'Messages Sent', value: '12,847', change: '+11.3%', up: true },
  { label: 'Premium Conversions', value: '18', change: '-3.2%', up: false },
]

const TOP_AREAS = [
  { area: 'Yaba, Lagos', listings: 487, users: 1203 },
  { area: 'Lekki, Lagos', listings: 392, users: 987 },
  { area: 'Surulere, Lagos', listings: 284, users: 721 },
  { area: 'Ikeja, Lagos', listings: 256, users: 634 },
  { area: 'Maitama, Abuja', listings: 198, users: 412 },
  { area: 'Wuse, Abuja', listings: 167, users: 389 },
]

const REVENUE = [
  { month: 'Jan', amount: 284000 },
  { month: 'Feb', amount: 341000 },
  { month: 'Mar', amount: 412000 },
  { month: 'Apr', amount: 389000 },
  { month: 'May', amount: 521000 },
  { month: 'Jun', amount: 648000 },
]

const maxRevenue = Math.max(...REVENUE.map(r => r.amount))

export default function AdminAnalyticsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Last 30 days performance overview</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {METRICS.map(({ label, value, change, up }) => (
          <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-2xl font-bold text-gray-900 mb-0.5">{value}</p>
            <p className="text-xs text-gray-500 mb-2">{label}</p>
            <div className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${up ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              <TrendingUp size={11} className={up ? '' : 'rotate-180'} /> {change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Revenue chart */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900">Monthly Revenue</h2>
            <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full">₦648k this month</span>
          </div>
          <div className="flex items-end gap-2 h-32">
            {REVENUE.map(({ month, amount }) => (
              <div key={month} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-brand-500 rounded-t-lg transition-all hover:bg-brand-600"
                  style={{ height: `${(amount / maxRevenue) * 100}%`, minHeight: 4 }}
                  title={`₦${amount.toLocaleString()}`}
                />
                <span className="text-xs text-gray-400">{month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User breakdown */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">User Breakdown</h2>
          <div className="space-y-3">
            {[
              { label: 'Young Professionals', pct: 38, color: 'bg-brand-500' },
              { label: 'Students', pct: 27, color: 'bg-blue-500' },
              { label: 'NYSC Members', pct: 19, color: 'bg-purple-500' },
              { label: 'Remote Workers', pct: 11, color: 'bg-green-500' },
              { label: 'Others', pct: 5, color: 'bg-gray-400' },
            ].map(({ label, pct, color }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-semibold text-gray-900">{pct}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full">
                  <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top areas */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-4">
        <h2 className="font-semibold text-gray-900 mb-4">Top Areas by Activity</h2>
        <div className="overflow-hidden rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Area</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Listings</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Users</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {TOP_AREAS.map(({ area, listings, users }, i) => (
                <tr key={area} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400 w-4">#{i + 1}</span>
                      <span className="font-medium text-gray-900">{area}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">{listings.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{users.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full">
                        <div className="h-full bg-brand-500 rounded-full" style={{ width: `${(users / 1203) * 100}%` }} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Premium revenue breakdown */}
      <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign size={18} className="text-brand-200" />
          <h2 className="font-semibold">Revenue Breakdown (This Month)</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Premium subs', amount: '₦359k', pct: 55 },
            { label: 'Verification fees', amount: '₦164k', pct: 25 },
            { label: 'Listing boosts', amount: '₦125k', pct: 20 },
          ].map(({ label, amount, pct }) => (
            <div key={label} className="bg-white/10 rounded-xl p-3">
              <p className="text-xl font-bold">{amount}</p>
              <p className="text-xs text-brand-200 mt-0.5">{label}</p>
              <p className="text-xs text-brand-100 font-semibold mt-1">{pct}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import Link from 'next/link'
import { LayoutDashboard, Users, Home, AlertTriangle, Shield, BarChart3, Settings, LogOut } from 'lucide-react'

const NAV = [
  { href: '/admin', icon: LayoutDashboard, label: 'Overview' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/listings', icon: Home, label: 'Listings' },
  { href: '/admin/reports', icon: AlertTriangle, label: 'Reports' },
  { href: '/admin/verification', icon: Shield, label: 'Verification' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 flex flex-col fixed h-full z-30">
        {/* Brand */}
        <div className="px-4 py-5 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">RentCircle</p>
              <p className="text-gray-400 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {NAV.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-sm font-medium group"
            >
              <Icon size={16} className="group-hover:text-brand-400" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-gray-700">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-7 h-7 bg-brand-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <div>
              <p className="text-white text-xs font-medium">Admin User</p>
              <p className="text-gray-500 text-xs">admin@rentcircle.ng</p>
            </div>
          </div>
          <Link href="/auth/login" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors text-sm">
            <LogOut size={15} /> Sign out
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-56 overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  )
}

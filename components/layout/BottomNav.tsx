'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Users, MessageCircle, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/listings', icon: Home, label: 'Listings' },
  { href: '/search', icon: Search, label: 'Search' },
  { href: '/matches', icon: Users, label: 'Matches' },
  { href: '/chat', icon: MessageCircle, label: 'Chats' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export function BottomNav({ unreadMessages = 0 }: { unreadMessages?: number }) {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-ink-100 pb-safe max-w-lg mx-auto">
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/listings' && pathname.startsWith(href))
          const showBadge = label === 'Chats' && unreadMessages > 0
          return (
            <Link key={href} href={href}
              className={cn('flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-[56px]',
                active ? 'text-brand-500' : 'text-ink-400')}>
              <div className={cn('relative flex items-center justify-center w-8 h-8 rounded-xl transition-all', active && 'bg-brand-50')}>
                <Icon size={20} strokeWidth={active ? 2.5 : 1.75} />
                {showBadge && <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">{unreadMessages > 9 ? '9+' : unreadMessages}</span>}
              </div>
              <span className={cn('text-[10px] font-medium', active ? 'text-brand-500' : 'text-ink-400')}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

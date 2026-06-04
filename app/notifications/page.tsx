'use client'
import { useState } from 'react'
import { Bell, Heart, MessageCircle, Shield, Star, Users, Home, X } from 'lucide-react'

type NotifType = 'match' | 'message' | 'listing' | 'verification' | 'review' | 'group'

const ICON_MAP: Record<NotifType, { icon: typeof Bell; color: string; bg: string }> = {
  match:        { icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50' },
  message:      { icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
  listing:      { icon: Home, color: 'text-brand-500', bg: 'bg-brand-50' },
  verification: { icon: Shield, color: 'text-green-500', bg: 'bg-green-50' },
  review:       { icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
  group:        { icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
}

const NOTIFICATIONS = [
  { id: '1', type: 'match' as NotifType, title: 'New match!', body: 'You and Chioma Okafor are 87% compatible. Send a message to connect.', time: '2 mins ago', read: false },
  { id: '2', type: 'message' as NotifType, title: 'New message from Emeka', body: 'Cool! I can do a viewing this Saturday around 2pm. Does that work?', time: '1 hour ago', read: false },
  { id: '3', type: 'listing' as NotifType, title: 'New listing in Yaba', body: 'A new verified room just dropped in your preferred area for ₦70k/month.', time: '3 hours ago', read: false },
  { id: '4', type: 'verification' as NotifType, title: 'Phone verified ✓', body: 'Your phone number has been verified. Your profile is now more trustworthy!', time: '1 day ago', read: true },
  { id: '5', type: 'group' as NotifType, title: 'Group invite', body: 'Amaka invited you to join "Lekki Professionals 2024". Combined budget: ₦800k.', time: '2 days ago', read: true },
  { id: '6', type: 'review' as NotifType, title: 'New review on your profile', body: 'Tunde rated you ⭐⭐⭐⭐⭐ and said "Great roommate, very clean!"', time: '3 days ago', read: true },
  { id: '7', type: 'match' as NotifType, title: 'New match!', body: 'Zara Abdullahi wants to connect. 74% compatibility score.', time: '4 days ago', read: true },
]

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS)

  const unreadCount = notifs.filter(n => !n.read).length

  function markAllRead() {
    setNotifs(n => n.map(x => ({ ...x, read: true })))
  }

  function dismiss(id: string) {
    setNotifs(n => n.filter(x => x.id !== id))
  }

  const grouped = {
    new: notifs.filter(n => !n.read),
    earlier: notifs.filter(n => n.read),
  }

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-ink-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-ink-900">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-xs text-ink-500 mt-0.5">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-sm text-brand-500 font-medium">
              Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="px-4 py-4 flex flex-col gap-6">
        {grouped.new.length > 0 && (
          <div>
            <p className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-3">New</p>
            <div className="flex flex-col gap-2">
              {grouped.new.map(n => (
                <NotifCard key={n.id} notif={n} onDismiss={() => dismiss(n.id)} />
              ))}
            </div>
          </div>
        )}

        {grouped.earlier.length > 0 && (
          <div>
            <p className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-3">Earlier</p>
            <div className="flex flex-col gap-2">
              {grouped.earlier.map(n => (
                <NotifCard key={n.id} notif={n} onDismiss={() => dismiss(n.id)} />
              ))}
            </div>
          </div>
        )}

        {notifs.length === 0 && (
          <div className="text-center py-20">
            <Bell size={40} className="text-ink-200 mx-auto mb-3" />
            <p className="font-semibold text-ink-700">All caught up!</p>
            <p className="text-sm text-ink-400 mt-1">No new notifications</p>
          </div>
        )}
      </div>
    </div>
  )
}

function NotifCard({ notif, onDismiss }: { notif: typeof NOTIFICATIONS[0]; onDismiss: () => void }) {
  const { icon: Icon, color, bg } = ICON_MAP[notif.type]

  return (
    <div className={`flex items-start gap-3 p-4 rounded-2xl border transition-colors ${notif.read ? 'bg-white border-ink-100' : 'bg-brand-50/50 border-brand-100'}`}>
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${bg}`}>
        <Icon size={18} className={color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm font-semibold ${notif.read ? 'text-ink-800' : 'text-ink-900'}`}>{notif.title}</p>
          {!notif.read && <div className="w-2 h-2 bg-brand-500 rounded-full flex-shrink-0 mt-1.5" />}
        </div>
        <p className="text-xs text-ink-500 mt-0.5 leading-relaxed">{notif.body}</p>
        <p className="text-xs text-ink-400 mt-1.5">{notif.time}</p>
      </div>
      <button onClick={onDismiss} className="p-1 text-ink-300 hover:text-ink-500 flex-shrink-0">
        <X size={15} />
      </button>
    </div>
  )
}

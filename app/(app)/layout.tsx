import { BottomNav } from '@/components/layout/BottomNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen max-w-lg mx-auto relative bg-ink-50">
      <main className="pb-24 pt-safe">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}

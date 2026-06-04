'use client'
import { useState, useCallback, createContext, useContext } from 'react'
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info' | 'warning'
type Toast = { id: string; type: ToastType; title: string; message?: string }

const ToastContext = createContext<{ toast: (t: Omit<Toast, 'id'>) => void } | null>(null)

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

const STYLES = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
}

const ICON_STYLES = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-blue-500',
  warning: 'text-amber-500',
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { ...t, id }])
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 4000)
  }, [])

  function dismiss(id: string) {
    setToasts(prev => prev.filter(x => x.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(t => {
          const Icon = ICONS[t.type]
          return (
            <div
              key={t.id}
              className={cn(
                'flex items-start gap-3 p-4 rounded-2xl border shadow-lg pointer-events-auto animate-slide-up',
                STYLES[t.type]
              )}
            >
              <Icon size={18} className={cn('flex-shrink-0 mt-0.5', ICON_STYLES[t.type])} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{t.title}</p>
                {t.message && <p className="text-xs mt-0.5 opacity-80">{t.message}</p>}
              </div>
              <button onClick={() => dismiss(t.id)} className="flex-shrink-0 opacity-60 hover:opacity-100">
                <X size={15} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx.toast
}

import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  level: 0 | 1 | 2 | 3
  size?: 'sm' | 'md'
  showLabel?: boolean
}

const LEVELS = [
  { label: 'Unverified', icon: Shield, color: 'text-ink-400', bg: 'bg-ink-100' },
  { label: 'Email Verified', icon: ShieldAlert, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'ID Verified', icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Fully Verified', icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50' },
]

export function VerificationBadge({ level, size = 'md', showLabel }: BadgeProps) {
  const { label, icon: Icon, color, bg } = LEVELS[level] || LEVELS[0]
  const iconSize = size === 'sm' ? 12 : 14

  if (!showLabel) {
    return (
      <span className={cn('inline-flex items-center justify-center rounded-full p-1', bg)} title={label}>
        <Icon size={iconSize} className={color} />
      </span>
    )
  }

  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium', bg, color)}>
      <Icon size={iconSize} />
      {label}
    </span>
  )
}

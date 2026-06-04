import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatCompact(amount: number): string {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(0)}k`
  return `₦${amount}`
}

export function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })
}

export const NIGERIAN_AREAS = {
  Lagos: ['Yaba', 'Lekki', 'Surulere', 'Ikeja', 'Ajah', 'Festac', 'VI', 'Ikoyi', 'Gbagada', 'Ojodu', 'Magodo', 'Maryland', 'Ogudu', 'Ketu', 'Isale-Eko'],
  Abuja: ['Maitama', 'Wuse', 'Gwarinpa', 'Jabi', 'Kubwa', 'Garki', 'Asokoro', 'Utako', 'Life Camp', 'Lugbe'],
  'Port Harcourt': ['GRA', 'Rumuola', 'Rumuola', 'D-line', 'Eliozu', 'Rumuokoro', 'Trans-Amadi'],
}

export const AMENITY_LABELS: Record<string, string> = {
  electricity: '⚡ 24hr Light',
  water: '💧 Running Water',
  internet: '📶 Internet',
  security: '🔒 Security',
  parking: '🚗 Parking',
  generator: '🔋 Generator',
  kitchen: '🍳 Kitchen',
  laundry: '🧺 Laundry',
  gym: '💪 Gym',
  pool: '🏊 Pool',
  cctv: '📷 CCTV',
  furnished: '🛋️ Furnished',
  ac: '❄️ A/C',
  balcony: '🌇 Balcony',
  garden: '🌿 Garden',
}

import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ToastProvider } from '@/components/ui/Toast'

export const metadata: Metadata = {
  title: 'RentCircle — Find Your Perfect Roommate in Nigeria',
  description: 'Nigeria\'s #1 platform for roommate matching, verified listings, and shared housing in Lagos, Abuja & Port Harcourt.',
  manifest: '/manifest.json',
  icons: { icon: '/icon.png', apple: '/apple-icon.png' },
  openGraph: {
    title: 'RentCircle',
    description: 'Find roommates & shared apartments across Nigeria',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#FF8C42',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body><ToastProvider>{children}</ToastProvider></body>
    </html>
  )
}

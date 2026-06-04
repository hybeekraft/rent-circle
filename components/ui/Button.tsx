'use client'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { forwardRef } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary', size = 'md', loading, fullWidth,
  leftIcon, rightIcon, className, children, disabled, ...props
}, ref) => {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-2xl transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed select-none'

  const variants = {
    primary: 'bg-brand-500 text-white hover:bg-brand-600 shadow-sm shadow-brand-200',
    secondary: 'bg-ink-100 text-ink-800 hover:bg-ink-200',
    ghost: 'text-ink-600 hover:bg-ink-100',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border-2 border-brand-500 text-brand-600 hover:bg-brand-50',
  }

  const sizes = {
    sm: 'text-xs px-3 py-2 h-8',
    md: 'text-sm px-4 py-2.5 h-11',
    lg: 'text-base px-6 py-3 h-12',
    xl: 'text-base px-8 py-4 h-14',
  }

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" size={16} /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  )
})

Button.displayName = 'Button'

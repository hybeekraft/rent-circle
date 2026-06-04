'use client'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightElement?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label, error, hint, leftIcon, rightElement, className, id, ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink-700 dark:text-ink-200">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3.5 text-ink-400 pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-white dark:bg-ink-900 border rounded-2xl px-4 py-3 text-sm text-ink-900 dark:text-ink-50',
            'placeholder:text-ink-400 outline-none transition-all duration-150',
            'focus:border-brand-400 focus:ring-3 focus:ring-brand-100',
            error ? 'border-red-400 focus:border-red-400 focus:ring-red-50' : 'border-ink-200 dark:border-ink-700',
            leftIcon && 'pl-10',
            rightElement && 'pr-12',
            className
          )}
          {...props}
        />
        {rightElement && (
          <span className="absolute right-3.5">{rightElement}</span>
        )}
      </div>
      {error && <p className="text-xs text-red-500 flex items-center gap-1">⚠ {error}</p>}
      {hint && !error && <p className="text-xs text-ink-400">{hint}</p>}
    </div>
  )
})

Input.displayName = 'Input'

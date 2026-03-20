import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'cta' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-accent hover:bg-accent-light text-white',
      secondary: 'bg-white/10 hover:bg-white/15 text-[#EEEEFF]',
      ghost: 'bg-transparent hover:bg-white/5 text-text-muted hover:text-[#EEEEFF]',
      outline: 'bg-transparent border border-accent text-accent-light hover:bg-accent/20',
      cta: 'bg-cta hover:bg-cta-hover text-black font-bold shadow-lg shadow-cta/30',
      danger: 'bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20',
    }
    const sizes = {
      sm: 'px-3 py-1.5 text-xs rounded-lg',
      md: 'px-4 py-2.5 text-sm rounded-xl',
      lg: 'px-6 py-3.5 text-base rounded-xl',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'hover:-translate-y-0.5 active:translate-y-0',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

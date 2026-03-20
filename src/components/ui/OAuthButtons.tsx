'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface OAuthButtonsProps {
  redirectTo?: string
  mode?: 'login' | 'register'
}

// Google SVG Icon
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

// Apple SVG Icon
function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

// Facebook SVG Icon
function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

const PROVIDERS = [
  {
    id: 'google' as const,
    label: 'Google',
    Icon: GoogleIcon,
    className: 'bg-white hover:bg-gray-50 text-gray-800 border-gray-200',
  },
  {
    id: 'apple' as const,
    label: 'Apple',
    Icon: AppleIcon,
    className: 'bg-black hover:bg-zinc-900 text-white border-zinc-800',
  },
  {
    id: 'facebook' as const,
    label: 'Facebook',
    Icon: FacebookIcon,
    className: 'bg-[#1877F2] hover:bg-[#166FE5] text-white border-transparent',
  },
]

export function OAuthButtons({ redirectTo = '/dashboard', mode = 'login' }: OAuthButtonsProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleOAuth = async (provider: 'google' | 'apple' | 'facebook') => {
    setLoading(provider)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
          queryParams: provider === 'google' ? { access_type: 'offline', prompt: 'consent' } : undefined,
        },
      })

      if (error) {
        setError(
          provider === 'apple'
            ? 'Apple Sign In belum dikonfigurasi. Hubungi admin.'
            : error.message
        )
        setLoading(null)
      }
      // Sukses → browser redirect ke OAuth provider
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
      setLoading(null)
    }
  }

  const verb = mode === 'login' ? 'Masuk' : 'Daftar'

  return (
    <div className="space-y-3">
      {PROVIDERS.map(({ id, label, Icon, className }) => (
        <button
          key={id}
          onClick={() => handleOAuth(id)}
          disabled={!!loading}
          className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 ${className}`}
        >
          {loading === id ? (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <Icon />
          )}
          {loading === id ? 'Menghubungkan...' : `${verb} dengan ${label}`}
        </button>
      ))}

      {error && (
        <p className="text-xs text-red-400 text-center pt-1">{error}</p>
      )}
    </div>
  )
}

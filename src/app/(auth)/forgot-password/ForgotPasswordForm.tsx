'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { checkEmailExists } from './actions'

const schema = z.object({
  email: z.string().email('Email tidak valid'),
})
type Values = z.infer<typeof schema>

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const turnstileRef = useRef<TurnstileInstance>(null)
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (values: Values) => {
    setError(null)
    
    // Cek apakah email terdaftar (Server Action)
    const exists = await checkEmailExists(values.email)
    if (!exists) {
      setError('Email tidak ditemukan. Cek lagi atau daftar akun baru.')
      return
    }

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      captchaToken: captchaToken || undefined,
    })

    if (resetError) {
      setError(resetError.message)
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto">
          <CheckCircle2 size={32} className="text-green-400" />
        </div>
        <h3 className="font-syne font-bold text-lg">Cek email kamu!</h3>
        <p className="text-sm text-text-muted leading-relaxed">
          Kami telah mengirimkan instruksi pemulihan password ke email kamu.<br />
          Link ini berlaku selama 1 jam.
        </p>
        <Link 
          href="/login"
          className="inline-flex items-center gap-2 text-xs text-accent-light font-semibold hover:underline mt-4"
        >
          <ArrowLeft size={14} /> Kembali ke login
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center space-y-2 mb-2">
        <p className="text-text-muted text-sm text-balance">
          Jangan khawatir! Masukkan email kamu di bawah, nanti kami kirim link untuk atur ulang password.
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/25 rounded-xl text-sm text-red-400 flex items-start gap-2">
          <span className="shrink-0 mt-0.5">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <Input
        label="Alamat Email"
        type="email"
        placeholder="kamu@email.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />

      {/* Turnstile Captcha */}
      <div className="flex justify-center py-2">
        <Turnstile
          ref={turnstileRef}
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          onSuccess={(token) => setCaptchaToken(token)}
          onExpire={() => setCaptchaToken(null)}
          onError={() => setCaptchaToken(null)}
          options={{ theme: 'dark' }}
        />
      </div>

      <Button type="submit" size="lg" className="w-full font-syne font-bold text-base" loading={isSubmitting}>
        Kirim Link Pemulihan →
      </Button>

      <div className="text-center">
        <Link 
          href="/login"
          className="inline-flex items-center gap-2 text-xs text-text-dim hover:text-text-muted transition-colors"
        >
          <ArrowLeft size={14} /> Ingat password? Login
        </Link>
      </div>
    </form>
  )
}

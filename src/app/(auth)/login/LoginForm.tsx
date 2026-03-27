'use client'

import { useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'

const schema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password harus diisi'),
})
type Values = z.infer<typeof schema>

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [showPass, setShowPass] = useState(false)
  const [mfaData, setMfaData] = useState<{ factorId: string } | null>(null)
  const [mfaCode, setMfaCode] = useState('')
  const [isVerifyingMfa, setIsVerifyingMfa] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const turnstileRef = useRef<TurnstileInstance>(null)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/dashboard'
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: Values) => {
    setError(null)
    const { data, error: loginError } = await supabase.auth.signInWithPassword({ 
      email: values.email, 
      password: values.password,
      options: {
        captchaToken: captchaToken || undefined,
      }
    })
    
    if (loginError) {
      if (loginError.message === 'Invalid login credentials') {
        setError('Email atau password salah. Periksa kembali.')
      } else if (loginError.message === 'Email not confirmed') {
        setError('Email belum dikonfirmasi. Cek email kamu untuk aktivasi.')
      } else {
        setError(loginError.message)
      }
      return
    }

    // Check if MFA is required
    const { data: mfaLevels, error: mfaError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    
    if (!mfaError && mfaLevels && mfaLevels.currentLevel === 'aal1' && mfaLevels.nextLevel === 'aal2') {
      const { data: factors } = await supabase.auth.mfa.listFactors()
      const factor = factors?.all?.find(f => f.status === 'verified')
      if (factor) {
        setMfaData({ factorId: factor.id })
        return
      }
    }
    
    completeLogin()
  }

  const onVerifyMfa = async () => {
    if (!mfaData) return
    setIsVerifyingMfa(true)
    setError(null)

    const challenge = await supabase.auth.mfa.challenge({ factorId: mfaData.factorId })
    if (challenge.error) {
      setError(challenge.error.message)
      setIsVerifyingMfa(false)
      return
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: mfaData.factorId,
      challengeId: challenge.data.id,
      code: mfaCode
    })

    if (verifyError) {
      setError(verifyError.message)
      setIsVerifyingMfa(false)
    } else {
      completeLogin()
    }
  }

  const completeLogin = () => {
    router.refresh()
    setTimeout(() => {
      router.push(redirectTo)
    }, 100)
  }

  if (mfaData) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="font-syne font-bold text-xl">Verifikasi 2FA</h2>
          <p className="text-text-muted text-sm text-balance">Masukkan 6 digit kode dari aplikasi authenticator Anda.</p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/25 rounded-xl text-sm text-red-400">
            ⚠️ {error}
          </div>
        )}

        <div className="space-y-4">
          <Input 
            placeholder="000000"
            value={mfaCode}
            onChange={e => setMfaCode(e.target.value)}
            maxLength={6}
            className="text-center font-mono tracking-[0.5em] text-xl py-4"
            autoFocus
          />
          <Button 
            className="w-full font-syne font-bold" 
            onClick={onVerifyMfa}
            loading={isVerifyingMfa}
            disabled={mfaCode.length !== 6}
          >
            Verifikasi & Masuk →
          </Button>
          <button 
            onClick={() => setMfaData(null)}
            className="w-full text-xs text-text-dim hover:text-text-muted transition-colors py-2"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

      {/* Password with show/hide */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">Password</label>
        <div className="relative">
          <input
            type={showPass ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
            className="w-full px-4 py-3 pr-11 bg-surface border border-slate-200 rounded-xl text-text placeholder:text-text-dim text-sm outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30"
            {...register('password')}
          />
          <button type="button" onClick={() => setShowPass(p => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-muted transition-colors p-1">
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
      </div>
      
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

      <Button type="submit" size="lg" className="w-full font-syne font-bold text-base mt-2" loading={isSubmitting}>
        Masuk Sekarang →
      </Button>
    </form>
  )
}

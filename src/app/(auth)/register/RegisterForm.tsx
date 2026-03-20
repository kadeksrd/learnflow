'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const schema = z.object({
  full_name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string()
    .min(8, 'Minimal 8 karakter')
    .regex(/[A-Z]/, 'Harus ada huruf kapital')
    .regex(/[0-9]/, 'Harus ada angka'),
  confirm_password: z.string(),
}).refine(d => d.password === d.confirm_password, { message: 'Password tidak sama', path: ['confirm_password'] })

type Values = z.infer<typeof schema>

const passwordRules = [
  { label: 'Minimal 8 karakter', test: (v: string) => v.length >= 8 },
  { label: 'Ada huruf kapital', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'Ada angka', test: (v: string) => /[0-9]/.test(v) },
]

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [passwordVal, setPasswordVal] = useState('')
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: Values) => {
    setError(null)
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { full_name: values.full_name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) { setError(error.message); return }
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
          Kami kirim link konfirmasi ke emailmu.<br />
          Klik link tersebut untuk aktivasi akun.
        </p>
        <p className="text-xs text-text-dim">Tidak ada email? Cek folder spam.</p>
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
        label="Nama Lengkap"
        placeholder="John Doe"
        autoComplete="name"
        error={errors.full_name?.message}
        {...register('full_name')}
      />

      <Input
        label="Alamat Email"
        type="email"
        placeholder="kamu@email.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />

      {/* Password with strength indicator */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">Password</label>
        <div className="relative">
          <input
            type={showPass ? 'text' : 'password'}
            placeholder="Min. 8 karakter"
            autoComplete="new-password"
            className="w-full px-4 py-3 pr-11 bg-surface border border-white/[0.07] rounded-xl text-[#EEEEFF] placeholder:text-text-dim text-sm outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30"
            {...register('password', { onChange: e => setPasswordVal(e.target.value) })}
          />
          <button type="button" onClick={() => setShowPass(p => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-muted p-1 transition-colors">
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}

        {/* Password rules */}
        {passwordVal.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {passwordRules.map(rule => {
              const ok = rule.test(passwordVal)
              return (
                <span key={rule.label} className={`flex items-center gap-1 text-xs ${ok ? 'text-green-400' : 'text-text-dim'}`}>
                  {ok ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                  {rule.label}
                </span>
              )
            })}
          </div>
        )}
      </div>

      <Input
        label="Konfirmasi Password"
        type="password"
        placeholder="Ulangi password"
        autoComplete="new-password"
        error={errors.confirm_password?.message}
        {...register('confirm_password')}
      />

      <Button type="submit" variant="cta" size="lg" className="w-full font-syne font-bold text-base" loading={isSubmitting}>
        Buat Akun Gratis →
      </Button>

      <p className="text-xs text-text-dim text-center pt-1">
        Dengan mendaftar, kamu setuju dengan{' '}
        <a href="#" className="underline hover:text-text-muted">Syarat & Ketentuan</a> kami.
      </p>
    </form>
  )
}

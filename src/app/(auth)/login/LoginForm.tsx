'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const schema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password harus diisi'),
})
type Values = z.infer<typeof schema>

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [showPass, setShowPass] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/dashboard'
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: Values) => {
    setError(null)
    const { error: loginError } = await supabase.auth.signInWithPassword({ 
      email: values.email, 
      password: values.password 
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
    
    // Refresh to update cookies then redirect
    router.refresh()
    setTimeout(() => {
      router.push(redirectTo)
    }, 100)
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
            className="w-full px-4 py-3 pr-11 bg-surface border border-white/[0.07] rounded-xl text-[#EEEEFF] placeholder:text-text-dim text-sm outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30"
            {...register('password')}
          />
          <button type="button" onClick={() => setShowPass(p => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-muted transition-colors p-1">
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
      </div>

      <Button type="submit" size="lg" className="w-full font-syne font-bold text-base mt-2" loading={isSubmitting}>
        Masuk Sekarang →
      </Button>
    </form>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const schema = z.object({
  password: z.string()
    .min(8, 'Minimal 8 karakter')
    .regex(/[A-Z]/, 'Harus ada huruf kapital')
    .regex(/[0-9]/, 'Harus ada angka'),
  confirm_password: z.string(),
}).refine(d => d.password === d.confirm_password, { 
    message: 'Password tidak sama', 
    path: ['confirm_password'] 
})
type Values = z.infer<typeof schema>

export function ResetPasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (values: Values) => {
    setError(null)
    const { error: updateError } = await supabase.auth.updateUser({
      password: values.password
    })

    if (updateError) {
      setError(updateError.message)
      return
    }

    setSuccess(true)
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  }

  if (success) {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto">
          <CheckCircle2 size={32} className="text-green-400" />
        </div>
        <h3 className="font-syne font-bold text-lg">Password Berhasil Diubah!</h3>
        <p className="text-sm text-text-muted leading-relaxed">
          Password kamu telah berhasil diperbarui. Kamu akan dialihkan ke halaman login sejenak lagi...
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center space-y-2 mb-2">
        <p className="text-text-muted text-sm text-balance">
          Hampir selesai! Buat password baru yang kuat untuk akun kamu.
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/25 rounded-xl text-sm text-red-400 flex items-start gap-2">
          <span className="shrink-0 mt-0.5">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">Password Baru</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
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

        <Input
          label="Konfirmasi Password Baru"
          type="password"
          placeholder="••••••••"
          error={errors.confirm_password?.message}
          {...register('confirm_password')}
        />
      </div>

      <Button type="submit" size="lg" className="w-full font-syne font-bold text-base" loading={isSubmitting}>
        Simpan Password Baru →
      </Button>
    </form>
  )
}

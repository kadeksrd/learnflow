'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Eye, EyeOff } from 'lucide-react'

const schema = z.object({
  password: z.string().min(8, 'Password minimal 8 karakter'),
  confirm_password: z.string().min(1, 'Konfirmasi password harus diisi'),
}).refine((data) => data.password === data.confirm_password, {
  message: "Password tidak cocok",
  path: ["confirm_password"],
})

type Values = z.infer<typeof schema>

export function PasswordForm() {
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors }, reset } = useForm<Values>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (values: Values) => {
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.updateUser({
      password: values.password
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Password berhasil diperbarui!' })
      reset()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
      {message && (
        <div className={`p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        <div className="relative">
          <Input
            label="Password Baru"
            type={showPass ? 'text' : 'password'}
            placeholder="Min. 8 karakter"
            error={errors.password?.message}
            {...register('password')}
          />
          <button type="button" onClick={() => setShowPass(!showPass)} 
            className="absolute right-3 top-[32px] text-text-dim hover:text-text-muted transition-colors p-1">
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <Input
          label="Konfirmasi Password Baru"
          type={showPass ? 'text' : 'password'}
          placeholder="Ulangi password baru"
          error={errors.confirm_password?.message}
          {...register('confirm_password')}
        />
      </div>

      <Button type="submit" loading={loading} className="px-8" variant="primary">
        Update Password
      </Button>
    </form>
  )
}

'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

const schema = z.object({
  full_name: z.string().min(2, 'Nama minimal 2 karakter').max(50, 'Nama terlalu panjang'),
})

type Values = z.infer<typeof schema>

export function BasicInfoForm({ user }: { user: User }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: user.user_metadata?.full_name || ''
    }
  })

  const onSubmit = async (values: Values) => {
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.updateUser({
      data: { full_name: values.full_name }
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' })
      router.refresh()
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
        <Input
          label="Alamat Email"
          value={user.email}
          disabled
          className="bg-surface/50 opacity-70 cursor-not-allowed"
          hint="Email hanya dapat diubah oleh administrator."
        />

        <Input
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap"
          error={errors.full_name?.message}
          {...register('full_name')}
        />
      </div>

      <Button type="submit" loading={loading} className="px-8">
        Simpan Perubahan
      </Button>
    </form>
  )
}

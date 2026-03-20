import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { CheckCircle, ArrowRight } from 'lucide-react'

export default async function PaymentSuccessPage({ searchParams }: { searchParams: { order_id?: string } }) {
  let orderData = null
  if (searchParams.order_id) {
    const supabase = await createClient()
    const { data } = await supabase.from('orders').select('*, products(title)').eq('id', searchParams.order_id).single()
    orderData = data
  }
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-400" />
        </div>
        <h1 className="font-syne font-extrabold text-3xl mb-3">Pembayaran Berhasil! 🎉</h1>
        <p className="text-text-muted mb-8">
          {(orderData?.products as any)?.title ? `Kursus "${(orderData.products as any).title}" sudah aktif.` : 'Kursusmu sudah aktif. Selamat belajar!'}
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/dashboard" className="flex items-center justify-center gap-2 px-6 py-4 bg-cta hover:bg-cta-hover text-black font-syne font-bold rounded-xl transition-all">
            Mulai Belajar <ArrowRight size={18} />
          </Link>
          <Link href="/store" className="px-6 py-4 bg-card border border-white/[0.07] rounded-xl text-text-muted hover:text-[#EEEEFF] transition-all text-sm">
            Kembali ke Store
          </Link>
        </div>
        {orderData && <p className="text-text-dim text-xs mt-6">Order ID: {orderData.id}</p>}
      </div>
    </div>
  )
}

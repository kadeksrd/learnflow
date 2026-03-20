import Link from 'next/link'
import { XCircle } from 'lucide-react'

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
          <XCircle size={40} className="text-red-400" />
        </div>
        <h1 className="font-syne font-extrabold text-3xl mb-3">Pembayaran Gagal</h1>
        <p className="text-text-muted mb-8">Transaksi tidak berhasil diproses. Silakan coba lagi.</p>
        <div className="flex flex-col gap-3">
          <Link href="/store" className="flex items-center justify-center gap-2 px-6 py-4 bg-accent hover:bg-accent-light text-white font-syne font-bold rounded-xl transition-all">
            Kembali ke Store
          </Link>
        </div>
      </div>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { PaymentSettingsEditor } from './PaymentSettingsEditor'

export default async function PaymentSettingsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_settings').select('value').eq('key', 'payment').single()

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold mb-4">
          💳 Payment Gateway
        </div>
        <h1 className="font-syne font-extrabold text-2xl mb-2">Pengaturan Payment Gateway</h1>
        <p className="text-text-muted text-sm max-w-xl">
          Aktifkan/nonaktifkan gateway pembayaran, atur metode yang ditampilkan ke pembeli, dan pilih gateway default.
        </p>
      </div>
      <PaymentSettingsEditor initialSettings={data?.value || {}} />
    </div>
  )
}

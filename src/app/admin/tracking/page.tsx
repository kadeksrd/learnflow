import { createClient } from '@/lib/supabase/server'
import { TrackingEditor } from './TrackingEditor'

export default async function TrackingPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('site_settings').select('value').eq('key', 'tracking').single()
  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-4">
          📡 Tracking & Analytics
        </div>
        <h1 className="font-syne font-extrabold text-2xl mb-2">Pixel & Tag Manager</h1>
        <p className="text-text-muted text-sm max-w-xl">
          Pasang Facebook Pixel, TikTok Pixel, Google Tag Manager, dan skrip kustom lainnya.
          Semua tracking aktif di seluruh halaman website secara otomatis.
        </p>
      </div>
      <TrackingEditor initialSettings={data?.value || {}} />
    </div>
  )
}

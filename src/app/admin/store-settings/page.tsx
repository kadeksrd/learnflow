import { createClient } from '@/lib/supabase/server'
import { StoreSettingsEditor } from './StoreSettingsEditor'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Web Store Settings — Admin LearnFlow' }

async function getSettings() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['homepage', 'store'])

  const map: Record<string, any> = {}
  for (const row of (data || [])) map[row.key] = row.value
  return map
}

async function getProducts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('id, title, thumbnail, is_free, price, categories(name)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
  return data || []
}

export default async function StoreSettingsPage() {
  const [settings, products] = await Promise.all([getSettings(), getProducts()])

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent-light text-xs font-bold mb-4">
          🏪 Web Store CMS
        </div>
        <h1 className="font-syne font-extrabold text-2xl mb-2">Pengaturan Web Store</h1>
        <p className="text-text-muted text-sm max-w-xl">
          Edit semua konten yang tampil di halaman publik — homepage, store, hingga teks CTA — tanpa perlu sentuh kode.
        </p>
      </div>

      <StoreSettingsEditor
        initialHomepage={settings.homepage || {}}
        initialStore={settings.store || {}}
        products={products}
      />
    </div>
  )
}

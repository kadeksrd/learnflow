import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default async function AdminProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false })

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-syne font-extrabold text-xl sm:text-2xl mb-1">Products</h1>
          <p className="text-text-muted text-sm">{products?.length || 0} produk</p>
        </div>
        <Link href="/admin/products/new"
          className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-accent hover:bg-accent-light rounded-xl text-sm font-bold text-white transition-all">
          <Plus size={15} /> <span className="hidden sm:inline">Tambah Produk</span><span className="sm:hidden">Tambah</span>
        </Link>
      </div>

      {/* Card list on mobile, table on desktop */}
      <div className="sm:hidden space-y-3">
        {products?.map(p => (
          <div key={p.id} className="bg-card border border-white/[0.07] rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-lg overflow-hidden shrink-0">
                {p.thumbnail ? <img src={p.thumbnail} alt="" className="w-full h-full object-cover" /> : '📦'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{p.title}</div>
                <div className="text-text-muted text-xs">{(p.categories as any)?.name || '-'}</div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold shrink-0 ${p.is_published ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-text-muted'}`}>
                {p.is_published ? '✓ Live' : 'Draft'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`font-bold text-sm ${p.is_free ? 'text-green-400' : ''}`}>{p.is_free ? 'GRATIS' : formatPrice(p.price)}</span>
              <Link href={`/admin/products/${p.id}`} className="px-3 py-1.5 rounded-lg border border-white/[0.07] text-xs text-text-muted hover:text-[#EEEEFF] transition-all">Edit</Link>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-card border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_100px] gap-4 px-5 py-3 bg-surface text-xs font-bold text-text-muted uppercase tracking-wider">
          <span>Produk</span><span>Kategori</span><span>Harga</span><span>Status</span><span>Aksi</span>
        </div>
        {products?.map(p => (
          <div key={p.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_100px] gap-4 px-5 py-4 border-t border-white/[0.05] items-center hover:bg-card-hover transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-lg shrink-0 overflow-hidden">
                {p.thumbnail ? <img src={p.thumbnail} alt="" className="w-full h-full object-cover" /> : '📦'}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate">{p.title}</div>
              </div>
            </div>
            <span className="text-sm text-text-muted">{(p.categories as any)?.name || '-'}</span>
            <span className={`text-sm font-bold ${p.is_free ? 'text-green-400' : ''}`}>{p.is_free ? 'GRATIS' : formatPrice(p.price)}</span>
            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold w-fit ${p.is_published ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-text-muted'}`}>
              {p.is_published ? 'Published' : 'Draft'}
            </span>
            <Link href={`/admin/products/${p.id}`} className="px-3 py-1.5 rounded-lg border border-white/[0.07] text-xs text-text-muted hover:text-[#EEEEFF] hover:border-accent/30 transition-all">Edit</Link>
          </div>
        ))}
      </div>
    </div>
  )
}

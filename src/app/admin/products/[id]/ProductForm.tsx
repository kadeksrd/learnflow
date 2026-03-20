'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, FileText, CheckCircle } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ImageUploader } from '@/components/ui/ImageUploader'

export function ProductForm({ product, categories }: { product: any; categories: any[] }) {
  const router = useRouter()
  const isNew = !product
  const [form, setForm] = useState({
    title:        product?.title        || '',
    description:  product?.description  || '',
    price:        product?.price        || 0,
    is_free:      product?.is_free      ?? false,
    category_id:  product?.category_id  || '',
    is_published: product?.is_published ?? false,
    thumbnail:    product?.thumbnail    || '',
  })
  const [saving,      setSaving]      = useState(false)
  const [error,       setError]       = useState<string | null>(null)
  const [justCreated, setJustCreated] = useState<string | null>(null)

  const handleSave = async () => {
    if (!form.title.trim()) { setError('Judul produk harus diisi'); return }
    setSaving(true); setError(null)
    const payload = { ...form, price: form.is_free ? 0 : Number(form.price), updated_at: new Date().toISOString() }
    const res = await fetch(isNew ? '/api/admin/products' : `/api/admin/products/${product.id}`, {
      method: isNew ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.message || 'Gagal menyimpan') }
    else if (isNew) { setJustCreated(data.id) }
    else { router.push('/admin/products'); router.refresh() }
    setSaving(false)
  }

  const Toggle = ({ label, sub, value, onChange }: any) => (
    <div className="flex items-center justify-between p-4 bg-card border border-white/[0.07] rounded-xl">
      <div><div className="font-semibold text-sm">{label}</div><div className="text-text-muted text-xs mt-0.5">{sub}</div></div>
      <div onClick={onChange} className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${value ? 'bg-green-500' : 'bg-surface border border-white/20'}`}>
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${value ? 'left-4' : 'left-0.5'}`} />
      </div>
    </div>
  )

  if (justCreated) {
    return (
      <div className="max-w-lg space-y-5">
        <div className="p-5 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-start gap-4">
          <CheckCircle size={24} className="text-green-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-syne font-bold text-base mb-1">Produk berhasil dibuat! 🎉</div>
            <p className="text-text-muted text-sm">Sekarang buat landing page-nya agar produk bisa diakses pembeli:</p>
          </div>
        </div>
        <div className="p-5 bg-card border-2 border-accent/40 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center shrink-0"><FileText size={16} className="text-accent-light" /></div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-syne font-bold text-sm">Buat Landing Page</span>
                <span className="px-2 py-0.5 bg-red-500/15 text-red-400 text-xs font-bold rounded">WAJIB</span>
              </div>
              <p className="text-text-muted text-xs mb-3">Atur headline, gambar hero, benefit, testimoni dengan foto, video preview, dan semua konten halaman penjualan.</p>
              <Button onClick={() => router.push(`/admin/landing-pages/${justCreated}`)} size="sm">
                Buat Landing Page <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => router.push('/admin/products')}>← Kembali ke Products</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">{error}</div>}

      {/* Thumbnail — pakai ImageUploader */}
      <ImageUploader
        label="Thumbnail Produk"
        value={form.thumbnail}
        onChange={url => setForm(p => ({ ...p, thumbnail: url }))}
        folder="products"
        aspect="landscape"
        hint="Tampil di store, dashboard, dan landing page. Ukuran ideal: 1280×720px."
      />

      <Input label="Judul Produk *" placeholder="Contoh: TikTok Viral Mastery" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />

      <div>
        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Deskripsi Singkat</label>
        <textarea className="w-full px-4 py-3 bg-surface border border-white/[0.07] rounded-xl text-[#EEEEFF] text-sm outline-none focus:border-accent resize-none" rows={3}
          value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Deskripsi yang muncul di store..." />
      </div>

      <div>
        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Kategori</label>
        <select className="w-full px-4 py-3 bg-surface border border-white/[0.07] rounded-xl text-[#EEEEFF] text-sm outline-none focus:border-accent" value={form.category_id} onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))}>
          <option value="">-- Pilih Kategori --</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <Toggle label="Kursus Gratis" sub="Aktifkan untuk lead magnet / free course" value={form.is_free} onChange={() => setForm(p => ({ ...p, is_free: !p.is_free }))} />
      {!form.is_free && <Input label="Harga (IDR)" type="number" placeholder="299000" value={form.price} onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))} hint="Tanpa titik/koma. Contoh: 299000" />}
      <Toggle label="Publikasikan" sub={form.is_published ? 'Terlihat di store & homepage' : 'Draft — belum terlihat publik'} value={form.is_published} onChange={() => setForm(p => ({ ...p, is_published: !p.is_published }))} />

      {isNew && (
        <div className="p-4 bg-accent/5 border border-accent/20 rounded-xl flex items-start gap-3">
          <FileText size={16} className="text-accent-light shrink-0 mt-0.5" />
          <p className="text-sm text-text-muted">Setelah simpan, kamu wajib <span className="text-accent-light font-semibold">membuat Landing Page</span> agar produk bisa dilihat pembeli.</p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button onClick={handleSave} loading={saving} className="flex-1">{isNew ? 'Buat Produk & Lanjut →' : 'Simpan Perubahan'}</Button>
        <Button variant="ghost" onClick={() => router.back()}>Batal</Button>
      </div>

      {!isNew && (
        <div className="pt-2 border-t border-white/[0.07]">
          <Button variant="outline" size="sm" onClick={() => router.push(`/admin/landing-pages/${product.id}`)}>
            <FileText size={14} /> Edit Landing Page
          </Button>
        </div>
      )}
    </div>
  )
}

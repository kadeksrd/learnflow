'use client'
import { useState } from 'react'
import { Star, Eye, EyeOff, Trash2 } from 'lucide-react'

export function ReviewsManager({ reviews: initial }: { reviews: any[] }) {
  const [reviews, setReviews] = useState(initial)
  const [filter, setFilter] = useState<'all' | 'visible' | 'hidden'>('all')

  const filtered = reviews.filter(r =>
    filter === 'all' ? true : filter === 'visible' ? r.is_visible : !r.is_visible
  )
  const stats = {
    total: reviews.length,
    visible: reviews.filter(r => r.is_visible).length,
    hidden: reviews.filter(r => !r.is_visible).length,
    avg: reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '—',
  }

  const toggleVisible = async (id: string, current: boolean) => {
    const res = await fetch(`/api/admin/reviews/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_visible: !current }) })
    if (res.ok) setReviews(p => p.map(r => r.id === id ? { ...r, is_visible: !current } : r))
  }

  const deleteReview = async (id: string) => {
    if (!confirm('Hapus review ini?')) return
    const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' })
    if (res.ok) setReviews(p => p.filter(r => r.id !== id))
  }

  return (
    <div>
      {/* Stats - 2x2 on mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[[stats.total,'Total Review','#7C6BFF'],[stats.visible,'Tampil di LP','#10B981'],[stats.hidden,'Disembunyikan','#F59E0B'],[stats.avg,'Rating Rata²','#EF4444']].map(([v,l,c]) => (
          <div key={String(l)} className="bg-card border border-white/[0.07] rounded-xl p-3 sm:p-4">
            <div className="font-syne font-extrabold text-xl sm:text-2xl mb-1" style={{ color: String(c) }}>{v}</div>
            <div className="text-text-muted text-xs">{String(l)}</div>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-4">
        {[['all','Semua'],['visible','Visible'],['hidden','Hidden']].map(([id,label]) => (
          <button key={id} onClick={() => setFilter(id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${filter === id ? 'bg-accent/20 text-accent-light border border-accent/40' : 'bg-card border border-white/[0.07] text-text-muted'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Review list - card style on all sizes */}
      <div className="bg-card border border-white/[0.07] rounded-2xl overflow-hidden">
        {filtered.map((r, i) => (
          <div key={r.id} className={`p-4 ${i < filtered.length - 1 ? 'border-b border-white/[0.05]' : ''} ${!r.is_visible ? 'opacity-50' : ''}`}>
            <div className="flex items-start gap-3">
              {/* Stars */}
              <div className="flex gap-0.5 shrink-0 mt-0.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={12} fill={s <= r.rating ? '#F59E0B' : 'transparent'} className={s <= r.rating ? 'text-amber-400' : 'text-text-dim'} />
                ))}
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-sm">{r.user_name}</span>
                  <span className="text-text-dim text-xs hidden sm:inline">{r.user_email}</span>
                  <span className="text-text-muted text-xs">· {(r.products as any)?.title}</span>
                </div>
                {r.comment ? (
                  <p className="text-sm text-text-muted italic line-clamp-2">"{r.comment}"</p>
                ) : (
                  <p className="text-xs text-text-dim italic">Tidak ada komentar</p>
                )}
                <p className="text-text-dim text-xs mt-1">{new Date(r.created_at).toLocaleDateString('id-ID')}</p>
              </div>
              {/* Actions */}
              <div className="flex gap-1.5 shrink-0">
                <button onClick={() => toggleVisible(r.id, r.is_visible)} title={r.is_visible ? 'Sembunyikan' : 'Tampilkan'}
                  className={`p-2 rounded-lg transition-all ${r.is_visible ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : 'bg-white/5 text-text-muted hover:bg-white/10'}`}>
                  {r.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button onClick={() => deleteReview(r.id)}
                  className="p-2 rounded-lg bg-white/5 text-text-muted hover:bg-red-500/10 hover:text-red-400 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center py-12 text-text-muted text-sm">Belum ada review</div>}
      </div>

      <div className="mt-3 p-3 bg-surface border border-white/[0.06] rounded-xl">
        <p className="text-xs text-text-muted">
          <span className="text-green-400 font-semibold">👁 Visible</span> = tampil di landing page.
          {' '}<span className="font-semibold">Hidden</span> = tersimpan tapi tidak publik.
        </p>
      </div>
    </div>
  )
}

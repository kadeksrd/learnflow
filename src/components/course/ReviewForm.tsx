'use client'

import { useState } from 'react'
import { Star, Send, CheckCircle, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ReviewFormProps {
  productId: string
  existingReview?: {
    rating: number
    comment: string | null
  } | null
}

export function ReviewForm({ productId, existingReview }: ReviewFormProps) {
  const [rating,   setRating]   = useState(existingReview?.rating  || 0)
  const [hovered,  setHovered]  = useState(0)
  const [comment,  setComment]  = useState(existingReview?.comment || '')
  const [saving,   setSaving]   = useState(false)
  const [success,  setSuccess]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [editing,  setEditing]  = useState(!existingReview)

  const LABELS = ['', 'Sangat Buruk', 'Buruk', 'Cukup', 'Bagus', 'Sangat Bagus!']
  const COLORS = ['', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-lime-400', 'text-green-400']

  const handleSubmit = async () => {
    if (!rating) { setError('Pilih rating dulu'); return }
    setSaving(true); setError(null)

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, rating, comment }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Gagal menyimpan review')
      } else {
        setSuccess(true)
        setEditing(false)
        setTimeout(() => setSuccess(false), 4000)
      }
    } catch {
      setError('Koneksi gagal, coba lagi')
    } finally {
      setSaving(false)
    }
  }

  // ── Already reviewed, not editing ──
  if (existingReview && !editing) {
    return (
      <div className="bg-card border border-white/[0.07] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-syne font-bold text-sm">Rating Kamu</h3>
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 text-xs text-accent-light hover:underline transition-colors"
          >
            <Edit2 size={12} /> Ubah
          </button>
        </div>

        {success && (
          <div className="flex items-center gap-2 text-xs text-green-400 mb-3">
            <CheckCircle size={13} /> Review berhasil diperbarui!
          </div>
        )}

        <div className="flex items-center gap-1 mb-2">
          {[1,2,3,4,5].map(s => (
            <Star key={s} size={20}
              fill={s <= (existingReview?.rating || rating) ? '#F59E0B' : 'transparent'}
              className={s <= (existingReview?.rating || rating) ? 'text-amber-400' : 'text-text-dim'} />
          ))}
          <span className={`ml-2 text-sm font-semibold ${COLORS[existingReview?.rating || rating]}`}>
            {LABELS[existingReview?.rating || rating]}
          </span>
        </div>

        {(existingReview?.comment || comment) && (
          <p className="text-sm text-text-muted italic">
            &quot;{existingReview?.comment || comment}&quot;
          </p>
        )}
      </div>
    )
  }

  // ── Form ──
  return (
    <div className="bg-card border border-white/[0.07] rounded-2xl p-5">
      <h3 className="font-syne font-bold text-sm mb-4">
        {existingReview ? '✏️ Ubah Rating' : '⭐ Beri Rating Kursus Ini'}
      </h3>

      {/* Stars */}
      <div className="flex items-center gap-1 mb-2">
        {[1,2,3,4,5].map(s => (
          <button
            key={s}
            type="button"
            onClick={() => setRating(s)}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-125 active:scale-95"
          >
            <Star
              size={28}
              fill={s <= (hovered || rating) ? '#F59E0B' : 'transparent'}
              className={`transition-colors ${s <= (hovered || rating) ? 'text-amber-400' : 'text-text-dim'}`}
            />
          </button>
        ))}
        {(hovered || rating) > 0 && (
          <span className={`ml-3 text-sm font-semibold transition-all ${COLORS[hovered || rating]}`}>
            {LABELS[hovered || rating]}
          </span>
        )}
      </div>

      {/* Comment */}
      <div className="mt-4 mb-4">
        <textarea
          rows={3}
          placeholder="Ceritakan pengalamanmu belajar di kursus ini (opsional)..."
          value={comment}
          onChange={e => setComment(e.target.value)}
          maxLength={500}
          className="w-full px-4 py-3 bg-surface border border-white/[0.07] rounded-xl text-[#EEEEFF] placeholder:text-text-dim text-sm outline-none focus:border-accent transition-all resize-none"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-text-dim">
            Review kamu bisa ditampilkan di halaman kursus
          </span>
          <span className="text-xs text-text-dim">{comment.length}/500</span>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 mb-3">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={handleSubmit}
          loading={saving}
          disabled={!rating}
          size="sm"
          className="flex-1"
        >
          <Send size={13} /> {existingReview ? 'Perbarui Review' : 'Kirim Review'}
        </Button>
        {existingReview && (
          <Button variant="ghost" size="sm" onClick={() => { setEditing(false); setRating(existingReview.rating); setComment(existingReview.comment || '') }}>
            Batal
          </Button>
        )}
      </div>
    </div>
  )
}

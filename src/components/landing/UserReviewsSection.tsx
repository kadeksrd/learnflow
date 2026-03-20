'use client'
import { useEffect, useState } from 'react'
import { Star, ThumbsUp } from 'lucide-react'

interface Review {
  id: string; rating: number; comment: string | null
  created_at: string; user_name: string; user_avatar: string | null
}

interface ReviewStats {
  average: number; total: number; distribution: Record<number, number>
}

export function UserReviewsSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats,   setStats]   = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/reviews?product_id=${productId}`)
      .then(r => r.json())
      .then((data: Review[]) => {
        if (!Array.isArray(data)) return
        setReviews(data)
        if (data.length > 0) {
          const dist: Record<number, number> = { 1:0, 2:0, 3:0, 4:0, 5:0 }
          data.forEach(r => { dist[r.rating] = (dist[r.rating] || 0) + 1 })
          const avg = data.reduce((s, r) => s + r.rating, 0) / data.length
          setStats({ average: Math.round(avg * 10) / 10, total: data.length, distribution: dist })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [productId])

  if (loading || reviews.length === 0) return null

  const topReviews = reviews.filter(r => r.comment && r.comment.length > 20).slice(0, 6)

  return (
    <section className="py-10 sm:py-16 border-t border-white/[0.05]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-xs font-bold text-accent-light uppercase tracking-widest mb-3">Review Pelajar</p>
          <h2 className="font-syne font-extrabold text-2xl sm:text-4xl">Apa Kata Mereka?</h2>
        </div>

        {/* Stats block */}
        {stats && (
          <div className="max-w-xl mx-auto bg-card border border-white/[0.07] rounded-2xl p-5 sm:p-7 mb-10 sm:mb-12">
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              {/* Big score */}
              <div className="text-center shrink-0">
                <div className="font-syne font-extrabold text-6xl leading-none mb-2">{stats.average.toFixed(1)}</div>
                <div className="flex justify-center gap-0.5 mb-1">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={16}
                      fill={s <= Math.round(stats.average) ? '#F59E0B' : 'transparent'}
                      className={s <= Math.round(stats.average) ? 'text-amber-400' : 'text-text-dim'} />
                  ))}
                </div>
                <p className="text-text-muted text-xs">{stats.total} review</p>
              </div>
              {/* Bars */}
              <div className="flex flex-col gap-1.5 w-full">
                {[5,4,3,2,1].map(s => {
                  const count = stats.distribution[s] || 0
                  const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
                  return (
                    <div key={s} className="flex items-center gap-2">
                      <span className="text-xs text-text-muted w-3 shrink-0">{s}</span>
                      <Star size={11} fill="#F59E0B" className="text-amber-400 shrink-0" />
                      <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-text-muted w-5 text-right shrink-0">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Review cards */}
        {topReviews.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {topReviews.map(review => {
              const date = new Date(review.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
              return (
                <div key={review.id} className="bg-card border border-white/[0.07] rounded-2xl p-5 flex flex-col">
                  <div className="flex gap-0.5 mb-3">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={14} fill={s <= review.rating ? '#F59E0B' : 'transparent'}
                        className={s <= review.rating ? 'text-amber-400' : 'text-text-dim'} />
                    ))}
                  </div>
                  {review.comment && (
                    <p className="text-sm text-text-muted leading-relaxed mb-4 italic flex-1">&quot;{review.comment}&quot;</p>
                  )}
                  <div className="flex items-center gap-3 mt-auto">
                    {review.user_avatar ? (
                      <img src={review.user_avatar} alt={review.user_name} className="w-9 h-9 rounded-full object-cover shrink-0 border border-white/10" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {review.user_name[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate">{review.user_name}</div>
                      <div className="text-text-dim text-xs">{date}</div>
                    </div>
                    {review.rating === 5 && (
                      <span className="ml-auto shrink-0 flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                        <ThumbsUp size={10} /> Verified
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Only ratings, no long comments */}
        {topReviews.length === 0 && reviews.length > 0 && (
          <div className="text-center py-6">
            <div className="flex justify-center gap-1 mb-3">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={22}
                  fill={s <= Math.round(stats?.average || 0) ? '#F59E0B' : 'transparent'}
                  className={s <= Math.round(stats?.average || 0) ? 'text-amber-400' : 'text-text-dim'} />
              ))}
            </div>
            <p className="text-text-muted text-sm">{stats?.total} pelajar telah memberi rating</p>
          </div>
        )}
      </div>
    </section>
  )
}

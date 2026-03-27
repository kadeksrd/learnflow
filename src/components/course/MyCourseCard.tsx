'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface MyCourseCardProps {
  course: { id: string; title: string; products: { id: string; title: string; thumbnail: string | null; categories: { name: string } | null } | null }
  progress: number
  completedLessons: number
  totalLessons: number
}

export function MyCourseCard({ course, progress, completedLessons, totalLessons }: MyCourseCardProps) {
  const router = useRouter()
  const product = course.products

  return (
    <div className="group">
      <div className="bg-card border border-slate-200 rounded-2xl overflow-hidden hover:border-accent/40 hover:-translate-y-1 transition-all duration-300">
        <div className="relative h-36 overflow-hidden bg-surface flex items-center justify-center">
          {product?.thumbnail
            ? <img src={product.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            : <span className="text-4xl">📚</span>}
          {progress === 100 && (
            <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">✓</div>
          )}
        </div>
        <div className="p-4">
          <div className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-1.5">{product?.categories?.name || 'Course'}</div>
          <h3 className="font-syne font-bold text-sm leading-snug mb-3 line-clamp-2">{product?.title || course.title}</h3>
          <div className="h-1.5 bg-surface rounded-full overflow-hidden mb-2">
            <div className="h-full rounded-full bg-gradient-to-r from-accent to-accent-light transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-text-muted">{completedLessons}/{totalLessons} lesson</span>
            <span className="text-xs font-bold text-accent-light">{progress}%</span>
          </div>

          {progress === 100 ? (
            <div className="grid grid-cols-2 gap-2">
              <Link 
                href={`/certificate/${course.id}`}
                className="flex items-center justify-center gap-1 py-2 rounded-xl text-[10px] font-bold transition-all bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 hover:bg-yellow-400/20"
              >
                🏆 Sertifikat
              </Link>
              <Link
                href={`/dashboard/course/${course.id}`}
                className="flex items-center justify-center gap-1 py-2 rounded-xl text-[10px] font-bold transition-all border border-accent/30 text-accent-light hover:bg-accent/10"
              >
                ▶ Pelajari Ulang
              </Link>
            </div>
          ) : (
            <Link 
              href={`/dashboard/course/${course.id}`}
              className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all border border-accent/30 text-accent-light hover:bg-accent/10`}
            >
              {progress > 0 ? '▶ Lanjut Belajar' : '▶ Mulai Belajar'}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

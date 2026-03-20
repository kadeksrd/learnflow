import Link from 'next/link'

interface MyCourseCardProps {
  course: { id: string; title: string; products: { title: string; thumbnail: string | null; categories: { name: string } | null } | null }
  progress: number
  completedLessons: number
  totalLessons: number
}

export function MyCourseCard({ course, progress, completedLessons, totalLessons }: MyCourseCardProps) {
  const product = course.products
  return (
    <Link href={progress === 100 ? `/certificate/${course.id}` : `/dashboard/course/${course.id}`} className="group">
      <div className="bg-card border border-white/[0.07] rounded-2xl overflow-hidden hover:border-accent/40 hover:-translate-y-1 transition-all duration-300">
        <div className="relative h-36 overflow-hidden bg-surface flex items-center justify-center">
          {product?.thumbnail
            ? <img src={product.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            : <span className="text-4xl">📚</span>}
          {progress === 100 && (
            <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">✓</div>
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
          <div className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
            progress === 100
              ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20 group-hover:bg-yellow-400/20'
              : 'border-accent/30 text-accent-light group-hover:bg-accent/10'
          }`}>
            {progress === 100 ? '🏆 Lihat Sertifikat' : progress > 0 ? '▶ Lanjut Belajar' : '▶ Mulai Belajar'}
          </div>
        </div>
      </div>
    </Link>
  )
}

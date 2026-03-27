import Link from 'next/link'
import { BookOpen, Users, Star } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface CourseCardProps {
  product: {
    id: string
    title: string
    price: number
    is_free: boolean
    thumbnail: string | null
    categories: { name: string; slug: string } | null
    landing_pages: { slug: string }[] | null
    courses: Array<{ id: string; modules: Array<{ lessons: { id: string }[] }> }> | null
  }
}

const CATEGORY_EMOJI: Record<string, string> = {
  marketing: '📱', programming: '💻', business: '💼', technology: '🤖', design: '🎨',
}

export function CourseCard({ product }: CourseCardProps) {
  const lessonCount = product.courses?.[0]?.modules?.reduce((s, m) => s + m.lessons.length, 0) ?? 0
  const moduleCount = product.courses?.[0]?.modules?.length ?? 0
  const slug = product.landing_pages?.[0]?.slug ?? product.id

  return (
    <Link href={`/course/${slug}`} className="group">
      <div className="bg-card border border-slate-200 rounded-2xl overflow-hidden hover:border-accent/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 h-full flex flex-col shadow-sm">
        {/* Thumbnail */}
        <div className="relative h-44 overflow-hidden bg-surface shrink-0">
          {product.thumbnail ? (
            <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl opacity-80"
              style={{ background: `linear-gradient(135deg, hsl(${product.id.charCodeAt(0) * 3 % 360}, 60%, 90%), hsl(${product.id.charCodeAt(1) * 3 % 360}, 60%, 95%))` }}>
              {CATEGORY_EMOJI[product.categories?.slug ?? ''] ?? '📚'}
            </div>
          )}
          <span className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-full ${product.is_free ? 'bg-green-500 text-white' : 'bg-gradient-to-r from-accent to-purple-400 text-white'}`}>
            {product.is_free ? 'GRATIS' : 'PREMIUM'}
          </span>
          {product.categories && (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/60 backdrop-blur-md text-text-muted text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
              {product.categories.name}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-syne font-bold text-sm leading-snug mb-3 line-clamp-2 group-hover:text-accent transition-colors flex-1">
            {product.title}
          </h3>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {moduleCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-text-muted">
                <BookOpen size={11} /> {moduleCount} modul
              </span>
            )}
            {lessonCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-text-muted">
                <Users size={11} /> {lessonCount} lesson
              </span>
            )}
          </div>
          <div className="flex items-center justify-between mt-auto">
            <span className="font-syne font-extrabold text-lg">
              {product.is_free ? <span className="text-green-600">GRATIS</span> : <span>{formatPrice(product.price)}</span>}
            </span>
            <span className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              product.is_free
                ? 'bg-green-500/10 text-green-600 border border-green-500/20 group-hover:bg-green-600 group-hover:text-accent'
                : 'bg-cta text-black group-hover:bg-cta-hover'
            }`}>
              {product.is_free ? 'Ambil Gratis' : 'Beli Sekarang'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

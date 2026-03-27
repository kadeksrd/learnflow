import { Star } from 'lucide-react'
import type { Testimonial } from '@/types/database'

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="py-10 sm:py-16 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-xs font-bold text-accent-light uppercase tracking-widest mb-3">Testimoni</p>
          <h2 className="font-syne font-extrabold text-2xl sm:text-4xl">Kata Mereka</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-card border border-slate-200 rounded-2xl p-6 flex flex-col">
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating || 5 }).map((_, si) => (
                  <Star key={si} size={14} fill="#F59E0B" className="text-amber-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-sm text-text-muted leading-relaxed mb-6 italic flex-1">
                &quot;{t.text}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                {t.avatar_url ? (
                  <img
                    src={t.avatar_url}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-accent flex items-center justify-center font-bold text-white text-sm shrink-0">
                    {t.name?.[0] || '?'}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-text-muted text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

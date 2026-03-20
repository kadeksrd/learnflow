import { Play, Shield, Award, Users } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface HeroSectionProps {
  landingPage: { headline: string; subheadline: string | null; preview_video: string | null; theme_color: string; hero_image?: string | null }
  product: { price: number; is_free: boolean; thumbnail: string | null; courses: any[] }
  ctaText: string; onCTA: () => void; isProcessing: boolean
}

export function HeroSection({ landingPage, product, ctaText, onCTA, isProcessing }: HeroSectionProps) {
  const totalLessons = product.courses?.[0]?.modules?.reduce((s: number, m: any) => s + m.lessons.length, 0) ?? 0
  const totalModules = product.courses?.[0]?.modules?.length ?? 0
  const heroMedia = landingPage.hero_image || product.thumbnail

  const getEmbed = (url: string) => {
    const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
    if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0`
    const vm = url.match(/vimeo\.com\/(\d+)/)
    if (vm) return `https://player.vimeo.com/video/${vm[1]}`
    return url
  }

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 80% 60% at 20% 40%, ${landingPage.theme_color}, transparent)` }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-12 sm:pb-20 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

        {/* Copy */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
            style={{ background: `${landingPage.theme_color}20`, border: `1px solid ${landingPage.theme_color}40`, color: landingPage.theme_color }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: landingPage.theme_color }} />
            Course Online Terpercaya
          </div>

          <h1 className="font-syne font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4 tracking-tight">
            {landingPage.headline}
          </h1>

          {landingPage.subheadline && (
            <p className="text-text-muted text-base sm:text-lg leading-relaxed mb-6">{landingPage.subheadline}</p>
          )}

          {!product.is_free && (
            <div className="flex items-baseline flex-wrap gap-2 mb-6">
              <span className="font-syne font-extrabold text-3xl sm:text-4xl">{formatPrice(product.price)}</span>
              <span className="text-text-dim line-through text-lg">{formatPrice(product.price * 2)}</span>
              <span className="px-2 py-0.5 bg-red-500/15 text-red-400 border border-red-500/20 rounded text-xs font-bold">-50%</span>
            </div>
          )}

          {/* CTA — full width on mobile */}
          <button onClick={onCTA} disabled={isProcessing}
            className={`flex items-center gap-3 px-6 sm:px-8 py-4 sm:py-5 rounded-2xl font-syne font-extrabold text-base sm:text-lg w-full sm:max-w-md
              transition-all duration-300 hover:-translate-y-1 disabled:opacity-50
              ${product.is_free ? 'bg-green-500 hover:bg-green-400 text-white shadow-2xl shadow-green-500/25' : 'bg-cta hover:bg-cta-hover text-black shadow-2xl shadow-cta/30'}`}>
            <span className="text-xl">{product.is_free ? '🎁' : '🚀'}</span>
            <span className="flex-1 text-left">{isProcessing ? 'Memproses...' : ctaText}</span>
            <span>→</span>
          </button>

          <div className="flex flex-wrap gap-3 mt-5">
            {[{ icon: Shield, text: 'Garansi 30 hari' }, { icon: Award, text: 'Sertifikat resmi' }, { icon: Users, text: 'Akses seumur hidup' }].map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-1.5 text-xs sm:text-sm text-text-muted">
                <Icon size={13} className="text-green-400" /> {text}
              </span>
            ))}
          </div>
        </div>

        {/* Media card */}
        <div className="w-full">
          <div className="bg-card border border-white/[0.07] rounded-2xl overflow-hidden shadow-2xl shadow-black/20">
            {/* 16:9 media area */}
            <div className="relative w-full overflow-hidden bg-surface" style={{ aspectRatio: '16/9' }}>
              {landingPage.preview_video ? (
                <iframe src={getEmbed(landingPage.preview_video)} className="absolute inset-0 w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
              ) : heroMedia ? (
                <img src={heroMedia} alt={landingPage.headline} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                  style={{ background: 'linear-gradient(135deg, #0A0015, #1A0A2E)' }}>
                  <span className="text-4xl">🎬</span>
                  <div className="w-14 h-14 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center">
                    <Play size={20} className="text-white ml-1" />
                  </div>
                  <p className="text-text-muted text-sm">Preview tersedia setelah daftar</p>
                </div>
              )}
            </div>
            {/* Stats */}
            <div className="p-4">
              <p className="text-text-muted text-xs mb-3">Yang kamu dapatkan:</p>
              <div className="grid grid-cols-3 border border-white/[0.07] rounded-xl overflow-hidden">
                {[{ value: `${totalModules}`, label: 'Modul' }, { value: `${totalLessons}+`, label: 'Lesson' }, { value: '∞', label: 'Akses' }].map((s, i) => (
                  <div key={i} className={`p-3 text-center ${i < 2 ? 'border-r border-white/[0.07]' : ''}`}>
                    <div className="font-syne font-extrabold text-lg">{s.value}</div>
                    <div className="text-text-muted text-xs mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

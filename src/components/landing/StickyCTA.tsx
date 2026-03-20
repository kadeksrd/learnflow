'use client'

import { formatPrice } from '@/lib/utils'

interface StickyCTAProps {
  visible: boolean
  product: { title: string; price: number; is_free: boolean }
  ctaText: string
  onCTA: () => void
  isProcessing: boolean
}

export function StickyCTA({ visible, product, ctaText, onCTA, isProcessing }: StickyCTAProps) {
  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ${visible ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="bg-bg/95 backdrop-blur-xl border-t border-white/[0.07] px-4 sm:px-6 py-3.5 sm:py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          {/* Title + price — hide price label on very small screens */}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate leading-tight">{product.title}</div>
            <div className="text-text-muted text-xs mt-0.5">
              {product.is_free
                ? '🎁 GRATIS'
                : <><span className="hidden xs:inline">💎 </span>{formatPrice(product.price)}</>
              }
            </div>
          </div>

          {/* CTA button — shorter text on mobile */}
          <button
            onClick={onCTA}
            disabled={isProcessing}
            className={`shrink-0 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-syne font-bold text-xs sm:text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50 ${
              product.is_free
                ? 'bg-green-500 hover:bg-green-400 text-white'
                : 'bg-cta hover:bg-cta-hover text-black'
            }`}
          >
            {isProcessing ? '⏳' : (
              <>
                <span className="hidden sm:inline">{ctaText} →</span>
                <span className="sm:hidden">{product.is_free ? 'Ambil' : 'Beli'} →</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

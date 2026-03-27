import type { Benefit } from '@/types/database'

export function BenefitsSection({ benefits }: { benefits: Benefit[] }) {
  return (
    <section className="py-10 sm:py-16 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-xs font-bold text-accent-light uppercase tracking-widest mb-3">Yang Akan Kamu Pelajari</p>
          <h2 className="font-syne font-extrabold text-2xl sm:text-4xl">Kenapa Harus Kursus Ini?</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((benefit, i) => (
            <div key={i} className="bg-card border border-slate-200 rounded-2xl p-6 hover:border-accent/30 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center text-2xl mb-4">{benefit.icon}</div>
              <h3 className="font-syne font-bold mb-2">{benefit.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

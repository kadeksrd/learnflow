'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { CourseCard } from '@/components/course/CourseCard'

export function StoreClient({ initialProducts, categories }: { initialProducts: any[]; categories: any[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>(
    (searchParams.get('filter') as any) || 'all'
  )

  useEffect(() => {
    const cat = searchParams.get('category')
    const filter = searchParams.get('filter')
    if (cat) setSelectedCategory(cat)
    if (filter) setPriceFilter(filter as any)
  }, [searchParams])

  const filtered = useMemo(() => {
    return initialProducts.filter(p => {
      const ms = p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
      const mc = selectedCategory === 'all' || p.categories?.slug === selectedCategory
      const mp = priceFilter === 'all' || (priceFilter === 'free' && p.is_free) || (priceFilter === 'paid' && !p.is_free)
      return ms && mc && mp
    })
  }, [initialProducts, search, selectedCategory, priceFilter])

  const resetFilters = () => {
    setSearch(''); setSelectedCategory('all'); setPriceFilter('all')
    router.push('/store', { scroll: false })
  }

  const hasActive = search || selectedCategory !== 'all' || priceFilter !== 'all'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

      {/* Search bar — full width */}
      <div className="relative mb-3">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim" />
        <input
          type="text"
          placeholder="Cari kursus..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-3 bg-card border border-slate-200 rounded-xl text-sm text-text placeholder:text-text-dim outline-none focus:border-accent transition-colors"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text">
            <X size={15} />
          </button>
        )}
      </div>

      {/* Price filter — scrollable row on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
        {[
          { id: 'all',  label: 'Semua' },
          { id: 'free', label: '🎁 Gratis' },
          { id: 'paid', label: '💎 Premium' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setPriceFilter(f.id as any)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all shrink-0 ${
              priceFilter === f.id
                ? 'bg-accent/20 text-accent-light border border-accent/40'
                : 'bg-card border border-slate-200 text-text-muted hover:text-text'
            }`}
          >
            {f.label}
          </button>
        ))}
        {hasActive && (
          <button onClick={resetFilters} className="px-3 py-2 rounded-xl text-sm text-red-400 border border-red-500/20 hover:bg-red-500/5 transition-all shrink-0">
            ✕ Reset
          </button>
        )}
      </div>

      {/* Category pills — horizontally scrollable on mobile */}
      <div
        className="flex gap-2 overflow-x-auto pb-2 mb-6 border-b border-slate-200"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-accent text-white shadow-lg shadow-accent/25'
              : 'bg-card border border-slate-200 text-text-muted'
          }`}
        >
          Semua
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
              selectedCategory === cat.slug
                ? 'bg-accent text-white shadow-lg shadow-accent/25'
                : 'bg-card border border-slate-200 text-text-muted'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Result count */}
      <p className="text-sm text-text-muted mb-5">
        <span className="text-text font-semibold">{filtered.length}</span> kursus
        {search && <span className="ml-1">untuk &quot;<span className="text-accent-light">{search}</span>&quot;</span>}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filtered.map(p => <CourseCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="text-center py-16 sm:py-24">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-syne font-bold text-lg sm:text-xl mb-2">Tidak ada kursus</h3>
          <p className="text-text-muted text-sm mb-6">Coba kata kunci atau filter yang berbeda</p>
          <button onClick={resetFilters} className="px-6 py-3 bg-accent/20 text-accent-light rounded-xl text-sm font-semibold hover:bg-accent/30 transition-all">
            Reset Filter
          </button>
        </div>
      )}
    </div>
  )
}

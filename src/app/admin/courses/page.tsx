import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { BookOpen, Edit3, Eye, Layers, PlayCircle } from 'lucide-react'

export default async function AdminCoursesPage() {
  const supabase = await createClient()
  const { data: courses, error } = await supabase.from('courses')
    .select(`
      id, 
      title, 
      created_at, 
      products(id, title, thumbnail, is_published, landing_pages(slug)), 
      modules(id, lessons(id))
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('AdminCoursesPage Query Error:', error)
  }

  return (
    <div className="p-4 sm:p-10 space-y-8">
      <div>
        <h1 className="font-syne font-extrabold text-2xl sm:text-3xl mb-2 text-text">Course Builder</h1>
        <p className="text-text-muted text-sm font-medium">Kelola kurikulum, materi, dan struktur kursus kamu di sini.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {courses?.map((c: any) => {
          const lessons = c.modules?.reduce((s: number, m: any) => s + m.lessons.length, 0) || 0
          const isPublished = c.products?.is_published
          
          return (
            <div key={c.id} className="group bg-card border border-slate-200 rounded-[2.5rem] p-6 hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-300">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-2xl bg-surface flex items-center justify-center overflow-hidden shrink-0 border border-slate-100 shadow-inner group-hover:scale-105 transition-transform duration-500">
                  {c.products?.thumbnail ? (
                    <img src={c.products.thumbnail} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen size={28} className="text-accent-light opacity-40" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border",
                      isPublished 
                        ? "bg-green-500/10 text-green-500 border-green-500/20" 
                        : "bg-slate-50 text-text-dim border-slate-200"
                    )}>
                      {isPublished ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-[10px] font-bold text-text-muted flex items-center gap-1 uppercase tracking-widest leading-none bg-slate-50 px-2 py-1 rounded-md">
                       <Layers size={10} /> {c.modules?.length || 0} BAB
                    </span>
                  </div>
                  
                  <h3 className="font-syne font-extrabold text-lg sm:text-xl text-text truncate mb-2">
                    {c.products?.title || c.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-xs font-bold text-text-dim uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><PlayCircle size={14} className="text-accent" /> {lessons} Lessons</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="flex items-center gap-1.5"><Layers size={14} /> {c.modules?.length || 0} Modul</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 lg:border-l border-slate-100 lg:pl-8">
                  <Link 
                    href={`/admin/courses/${c.id}`}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-accent hover:bg-accent-light text-white font-syne font-bold text-sm rounded-2xl transition-all shadow-lg shadow-accent/20 active:scale-95 whitespace-nowrap"
                  >
                    <Edit3 size={16} /> Course Builder
                  </Link>
                  
                  <Link 
                    href={c.products?.landing_pages?.[0]?.slug ? `/course/${c.products.landing_pages[0].slug}` : `/admin/products/${c.products?.id}`}
                    target="_blank"
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-surface border border-slate-200 text-text-muted hover:text-text hover:bg-slate-50 font-syne font-bold text-sm rounded-2xl transition-all active:scale-95"
                  >
                    <Eye size={16} /> Preview
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
        
        {!courses?.length && (
          <div className="text-center py-24 bg-card border border-slate-200 rounded-[3rem] border-dashed">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-4xl">📚</div>
            <h3 className="font-syne font-bold text-xl mb-2 text-text">Belum ada kursus</h3>
            <p className="text-text-muted text-sm max-w-xs mx-auto mb-8 font-medium">Buat produk digital bertipe "Kursus Online" terlebih dahulu, maka kursus akan otomatis muncul di sini.</p>
            <Link href="/admin/products" className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-syne font-bold rounded-2xl hover:bg-accent-light transition-all shadow-xl shadow-accent/20">
              Buat Produk Baru
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

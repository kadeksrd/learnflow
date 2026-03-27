import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export default async function AdminCoursesPage() {
  const supabase = await createClient()
  const { data: courses } = await supabase.from('courses')
    .select('id, title, created_at, products(id, title, thumbnail, is_published), modules(id, lessons(id))')
    .order('created_at', { ascending: false })

  return (
    <div className="p-4 sm:p-8">
      <h1 className="font-syne font-extrabold text-2xl mb-2">Course Builder</h1>
      <p className="text-text-muted text-sm mb-8">Kelola modul dan lesson untuk setiap kursus</p>
      <div className="space-y-3">
        {courses?.map((c: any) => {
          const lessons = c.modules?.reduce((s: number, m: any) => s + m.lessons.length, 0) || 0
          return (
            <Link key={c.id} href={`/admin/courses/${c.id}`}
              className="flex items-center gap-4 p-5 bg-card border border-slate-200 rounded-2xl hover:border-accent/40 hover:-translate-y-0.5 transition-all">
              <div className="w-14 h-14 rounded-xl bg-surface flex items-center justify-center overflow-hidden shrink-0">
                {c.products?.thumbnail ? <img src={c.products.thumbnail} alt="" className="w-full h-full object-cover" /> : <BookOpen size={22} className="text-accent-light" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-syne font-bold truncate">{c.products?.title || c.title}</div>
                <div className="text-text-muted text-xs mt-0.5">{c.modules?.length || 0} modul · {lessons} lesson</div>
              </div>
              <span className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold ${c.products?.is_published ? 'bg-green-500/10 text-green-400' : 'bg-slate-50 text-text-muted'}`}>
                {c.products?.is_published ? 'Published' : 'Draft'}
              </span>
              <span className="text-text-dim text-sm shrink-0">Edit →</span>
            </Link>
          )
        })}
        {!courses?.length && (
          <div className="text-center py-16 text-text-muted">
            <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
            <p>Belum ada kursus. Buat produk dulu, kursus akan otomatis dibuat.</p>
          </div>
        )}
      </div>
    </div>
  )
}

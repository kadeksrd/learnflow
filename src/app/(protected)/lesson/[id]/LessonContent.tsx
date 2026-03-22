'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, CheckCircle, ExternalLink, StickyNote } from 'lucide-react'
import { cn, getEmbedUrl } from '@/lib/utils'

export function LessonContent({ lesson, course, prevLesson, nextLesson, isCompleted, completedLessonIds }: {
  lesson: any; course: any; prevLesson: any; nextLesson: any; isCompleted: boolean; completedLessonIds: string[]
}) {
  const [completed, setCompleted] = useState(isCompleted)
  const [autoNext, setAutoNext] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/progress/touch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lesson_id: lesson.id }),
    })
  }, [lesson.id])
  const embedUrl = getEmbedUrl(lesson.video_url)
  const allLessons = course.modules.flatMap((m: any) => m.lessons)
  const completedSet = new Set(completedLessonIds)
  const progress = Math.round((completedSet.size / allLessons.length) * 100)

  const markComplete = async () => {
    if (completed || saving) return
    setSaving(true)
    try {
      await fetch('/api/progress/complete', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lesson_id: lesson.id }),
      })
      setCompleted(true)
      if (autoNext && nextLesson) setTimeout(() => router.push(`/lesson/${nextLesson.id}`), 1200)
    } finally { setSaving(false) }
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-text-muted mb-4 flex-wrap">
          <button className="hover:text-[#EEEEFF] transition-colors" onClick={() => router.push(`/dashboard/course/${course.id}`)}>
            {course.products?.title || course.title}
          </button>
          <span>/</span><span>{lesson.modules.title}</span>
          <span>/</span><span className="text-[#EEEEFF] font-medium truncate max-w-[150px]">{lesson.title}</span>
        </div>

        <h1 className="font-syne font-extrabold text-xl sm:text-2xl mb-2">{lesson.title}</h1>
        {lesson.duration > 0 && <p className="text-text-muted text-sm mb-4">⏱ {Math.floor(lesson.duration / 60)} menit</p>}

        {/* Video */}
        <div className="bg-black rounded-2xl overflow-hidden mb-5 aspect-video shadow-2xl">
          {embedUrl ? (
            <iframe src={embedUrl} className="w-full h-full" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#0A0015] to-[#1A0A2E] flex flex-col items-center justify-center gap-4">
              <span className="text-4xl sm:text-5xl">🎬</span>
              <p className="text-text-muted text-sm">Video belum tersedia</p>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-5 p-3 bg-card border border-white/[0.07] rounded-xl">
          <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs text-text-muted shrink-0 font-semibold">{progress}%</span>
        </div>

        {/* Actions — stacked on mobile */}
        <div className="flex flex-col sm:flex-row gap-2.5 mb-6">
          <button onClick={markComplete} disabled={completed || saving}
            className={cn('flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all',
              completed ? 'bg-green-500/15 text-green-400 border border-green-500/20' : 'bg-accent hover:bg-accent-light text-white')}>
            <CheckCircle size={15} />
            {completed ? 'Lesson Selesai ✓' : saving ? 'Menyimpan...' : 'Tandai Selesai'}
          </button>

          <label className="flex items-center gap-2 px-4 py-3 bg-card border border-white/[0.07] rounded-xl cursor-pointer hover:border-accent/30 transition-all select-none">
            <input type="checkbox" checked={autoNext} onChange={e => setAutoNext(e.target.checked)} className="w-4 h-4 accent-purple-500" />
            <span className="text-sm text-text-muted">Auto-lanjut</span>
          </label>

          {/* Prev/Next inline on mobile too */}
          <div className="flex gap-2 sm:ml-auto">
            <button onClick={() => prevLesson && router.push(`/lesson/${prevLesson.id}`)} disabled={!prevLesson}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-3 bg-card border border-white/[0.07] rounded-xl text-sm text-text-muted hover:text-[#EEEEFF] hover:border-accent/30 transition-all disabled:opacity-40">
              <ChevronLeft size={16} /> Prev
            </button>
            <button onClick={() => nextLesson && router.push(`/lesson/${nextLesson.id}`)} disabled={!nextLesson}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-3 bg-accent hover:bg-accent-light rounded-xl text-sm text-white font-semibold transition-all disabled:opacity-40">
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Description */}
        {lesson.description && (
          <div className="bg-card border border-white/[0.07] rounded-2xl p-5 mb-5">
            <h2 className="font-syne font-bold text-base mb-3">📋 Tentang Lesson Ini</h2>
            <p className="text-text-muted text-sm leading-relaxed whitespace-pre-line">{lesson.description}</p>
          </div>
        )}

        {/* Notes */}
        {lesson.notes && (
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-5 mb-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-yellow-500/20 flex items-center justify-center shrink-0">
                <StickyNote size={14} className="text-yellow-400" />
              </div>
              <h2 className="font-syne font-bold text-base text-yellow-300">📝 Catatan & Tips</h2>
            </div>
            <pre className="text-sm text-yellow-100/70 leading-relaxed whitespace-pre-wrap font-sans">{lesson.notes}</pre>
          </div>
        )}

        {/* Suggestions */}
        {lesson.suggestions?.length > 0 && (
          <div>
            <h2 className="font-syne font-bold text-base mb-4">🔗 Tools & Resources</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {lesson.suggestions.map((s: any) => (
                <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-card border border-white/[0.07] rounded-xl hover:border-accent/40 hover:-translate-y-0.5 transition-all group">
                  <span className="text-2xl shrink-0">{s.icon || '🔗'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{s.title}</div>
                    <div className="text-text-muted text-xs mt-0.5 capitalize">{s.type}</div>
                  </div>
                  <ExternalLink size={14} className="text-text-dim group-hover:text-accent-light shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

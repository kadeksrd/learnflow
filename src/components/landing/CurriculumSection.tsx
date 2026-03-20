'use client'
import { useState } from 'react'
import { ChevronDown, Play, Lock, Clock, Layers, List } from 'lucide-react'

export function CurriculumSection({ course }: { course: any }) {
  const [expanded, setExpanded] = useState<number[]>([0])
  const toggle = (i: number) => setExpanded(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i])
  const useChapters = course.use_chapters !== false

  const totalLessons = course.modules?.reduce((s: number, m: any) => s + m.lessons.length, 0) || 0
  const totalDuration = course.modules?.reduce((s: number, m: any) =>
    s + m.lessons.reduce((ls: number, l: any) => ls + (l.duration || 0), 0), 0) || 0

  return (
    <section className="py-10 sm:py-16 border-t border-white/[0.05]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-xs font-bold text-accent-light uppercase tracking-widest mb-3">Kurikulum</p>
          <h2 className="font-syne font-extrabold text-2xl sm:text-4xl mb-3">Isi Kursus</h2>
          <div className="flex items-center justify-center gap-4 text-sm text-text-muted flex-wrap">
            <span className="flex items-center gap-1.5">{useChapters ? <Layers size={13}/> : <List size={13}/>} {course.modules?.length || 0} {useChapters ? 'Bab' : 'Sesi'}</span>
            <span>·</span>
            <span>{totalLessons} Lesson</span>
            {totalDuration > 0 && <><span>·</span><span className="flex items-center gap-1.5"><Clock size={13}/> {Math.round(totalDuration / 60)} menit</span></>}
          </div>
        </div>

        {/* Flat mode: no accordion, just list */}
        {!useChapters && course.modules?.[0] && (
          <div className="bg-card border border-white/[0.07] rounded-2xl overflow-hidden">
            {course.modules[0].lessons.map((lesson: any, li: number) => (
              <div key={li}
                className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.04] last:border-0 hover:bg-card-hover transition-colors">
                <div className="w-7 h-7 rounded-full border border-white/[0.1] flex items-center justify-center shrink-0">
                  {li < 2 ? <Play size={11} className="text-accent-light ml-0.5" /> : <Lock size={10} className="text-text-dim" />}
                </div>
                <span className="flex-1 text-sm text-text-muted">{lesson.title}</span>
                <div className="flex items-center gap-3 shrink-0">
                  {li < 2 && <span className="text-xs text-accent-light bg-accent/10 px-2 py-0.5 rounded-full">Preview</span>}
                  {lesson.duration > 0 && <span className="text-text-dim text-xs">{Math.floor(lesson.duration / 60)}m</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chapter mode: accordion */}
        {useChapters && (
          <div className="space-y-3">
            {course.modules?.map((mod: any, mi: number) => (
              <div key={mi} className="bg-card border border-white/[0.07] rounded-2xl overflow-hidden">
                <button onClick={() => toggle(mi)}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-card-hover transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-xs font-bold text-accent-light shrink-0">
                    {mi + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-syne font-semibold text-sm">{mod.title}</div>
                    {mod.description && <div className="text-text-muted text-xs mt-0.5">{mod.description}</div>}
                    <div className="text-text-dim text-xs mt-1">{mod.lessons.length} lesson{mod.lessons.some((l: any) => l.duration > 0) ? ` · ${Math.round(mod.lessons.reduce((s: number, l: any) => s + (l.duration || 0), 0) / 60)} menit` : ''}</div>
                  </div>
                  <ChevronDown size={16} className={`text-text-muted transition-transform shrink-0 ${expanded.includes(mi) ? 'rotate-180' : ''}`} />
                </button>
                {expanded.includes(mi) && (
                  <div className="border-t border-white/[0.06]">
                    {mod.lessons.map((lesson: any, li: number) => (
                      <div key={li} className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.04] last:border-0 hover:bg-surface/50 transition-colors">
                        <div className="w-6 h-6 rounded-full border border-white/[0.08] flex items-center justify-center shrink-0">
                          {mi === 0 && li === 0 ? <Play size={10} className="text-accent-light ml-0.5" /> : <Lock size={9} className="text-text-dim" />}
                        </div>
                        <span className="flex-1 text-sm text-text-muted">{lesson.title}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          {mi === 0 && li === 0 && <span className="text-xs text-accent-light bg-accent/10 px-2 py-0.5 rounded-full">Preview</span>}
                          {lesson.duration > 0 && <span className="text-text-dim text-xs">{Math.floor(lesson.duration / 60)}m</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

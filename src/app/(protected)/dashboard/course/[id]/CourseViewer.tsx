"use client";
import { useState, useCallback, useEffect, useMemo } from "react";
import { cn, getEmbedUrl, getYoutubeId } from "@/lib/utils";
import YouTube from "react-youtube";
import {
  CheckCircle,
  Play,
  ChevronDown,
  Menu,
  X,
  Layers,
  List,
  ChevronLeft,
  ChevronRight,
  Loader2,
  StickyNote,
  ExternalLink,
  Volume2,
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  duration: number;
  order: number;
  video_url?: string;
  description?: string;
  notes?: string;
  suggestions?: {
    id: string;
    title: string;
    url: string;
    type: string;
    icon?: string;
  }[];
}

interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  use_chapters?: boolean;
  products?: { title?: string; thumbnail?: string };
  modules: Module[];
}

export function CourseViewer({
  course,
  initialLessonId,
  completedLessonIds,
}: {
  course: Course;
  initialLessonId: string;
  completedLessonIds: string[];
}) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(
    new Set(completedLessonIds),
  );
  const [expanded, setExpanded] = useState<string[]>(
    course.modules.map((m) => m.id),
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(initialLessonId);
  const [saving, setSaving] = useState(false);
  const [autoNext, setAutoNext] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [player, setPlayer] = useState<any>(null);
  const [watchProgress, setWatchProgress] = useState(0);
  const [showMuteNotice, setShowMuteNotice] = useState(false);

  const youtubeOpts = useMemo(() => ({
    width: '100%',
    height: '100%',
    playerVars: {
      autoplay: autoPlay ? 1 : 0,
      mute: 0, 
      controls: 0,
      disablekb: 1,
      rel: 0,
      modestbranding: 1,
      origin: typeof window !== 'undefined' ? window.location.origin : undefined,
    },
  }), [autoPlay]);

  // Resume progress on load
  useEffect(() => {
    if (player && activeLessonId) {
      const savedTime = localStorage.getItem(`progress:${activeLessonId}`);
      if (savedTime) {
        const time = parseFloat(savedTime);
        player.seekTo(time);
        
        // Update percentage immediately
        const duration = player.getDuration();
        if (duration > 0) {
          setWatchProgress(Math.round((time / duration) * 100));
        }
      }
    }
  }, [player, activeLessonId]);

  // Simpan progress saat pause atau pindah
  const saveProgress = useCallback(() => {
    if (player && activeLessonId) {
      const currentTime = player.getCurrentTime();
      localStorage.setItem(`progress:${activeLessonId}`, currentTime.toString());
      
      const duration = player.getDuration();
      if (duration > 0) {
        setWatchProgress(Math.round((currentTime / duration) * 100));
      }
    }
  }, [player, activeLessonId]);

  // Real-time progress update while playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (player && activeLessonId) {
      interval = setInterval(() => {
        // Cek jika sedang PLAYING (1)
        if (player.getPlayerState?.() === 1) {
          const currentTime = player.getCurrentTime?.() || 0;
          const duration = player.getDuration?.() || 0;
          if (duration > 0) {
            setWatchProgress(Math.round((currentTime / duration) * 100));
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [player, activeLessonId]);

  useEffect(() => {
    setWatchProgress(0);
  }, [activeLessonId]);

  const useChapters = course.use_chapters !== false;
  const allLessons: Lesson[] = course.modules.flatMap((m) => m.lessons);
  const progress =
    allLessons.length > 0
      ? Math.round((completedIds.size / allLessons.length) * 100)
      : 0;

  const currentIndex = allLessons.findIndex((l) => l.id === activeLessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null;

  const activeLesson = activeLessonId
    ? (allLessons.find((l) => l.id === activeLessonId) ?? null)
    : null;

  const openLesson = useCallback((lessonId: string) => {
    setActiveLessonId(lessonId);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const markComplete = useCallback(async () => {
    if (!activeLessonId || completedIds.has(activeLessonId) || saving) return;
    setSaving(true);
    try {
      await fetch("/api/progress/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lesson_id: activeLessonId }),
      });
      setCompletedIds((prev) => {
        const next = new Set(Array.from(prev));
        next.add(activeLessonId);
        return next;
      });
      if (autoNext && nextLesson) {
        setTimeout(() => openLesson(nextLesson.id), 1200);
      }
    } finally {
      setSaving(false);
    }
  }, [activeLessonId, completedIds, saving, autoNext, nextLesson, openLesson]);

  // ─── Sidebar Content ──────────────────────────────────────────────────────
  const renderSidebarContent = () => (
    <>
      <div className="p-4 sm:p-5 border-b border-white/[0.07]">
        <h2 className="font-syne font-bold text-sm leading-snug mb-3">
          {course.products?.title || course.title}
        </h2>
        <div className="flex items-center gap-2 mb-1">
          <div className="flex-1 h-1.5 bg-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-bold text-accent-light">
            {progress}%
          </span>
        </div>
        <p className="text-xs text-text-muted">
          {completedIds.size}/{allLessons.length} lesson
        </p>
      </div>

      <div className="p-2 flex-1 overflow-auto">
        {!useChapters &&
          course.modules[0]?.lessons?.map((l) => {
            const done = completedIds.has(l.id);
            const active = activeLessonId === l.id;
            return (
              <button
                key={l.id}
                onClick={() => openLesson(l.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg mb-1 text-left transition-all text-xs",
                  active
                    ? "bg-accent/10 text-accent-light"
                    : done
                      ? "text-green-400 hover:bg-green-500/5"
                      : "text-text-muted hover:bg-white/5 hover:text-[#EEEEFF]",
                )}
              >
                <span className="shrink-0">
                  {done ? (
                    <CheckCircle size={13} className="text-green-400" />
                  ) : active ? (
                    <Play size={13} className="text-accent-light fill-accent-light" />
                  ) : (
                    <Play size={13} className="text-text-dim" />
                  )}
                </span>
                <span className="flex-1 truncate">{l.title}</span>
                {l.duration > 0 && (
                  <span className="text-text-dim shrink-0">
                    {Math.floor(l.duration / 60)}m
                  </span>
                )}
              </button>
            );
          })}

        {useChapters &&
          course.modules.map((m, mi) => (
            <div key={m.id} className="mb-1">
              <button
                onClick={() =>
                  setExpanded((p) =>
                    p.includes(m.id) ? p.filter((x) => x !== m.id) : [...p, m.id],
                  )
                }
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-white/5 text-left transition-colors"
              >
                <span className="w-5 h-5 rounded bg-accent/10 flex items-center justify-center text-[10px] font-bold text-accent-light shrink-0">
                  {mi + 1}
                </span>
                <span className="flex-1 text-xs font-semibold text-text-muted truncate">
                  {m.title}
                </span>
                <ChevronDown
                  size={13}
                  className={cn(
                    "text-text-dim transition-transform shrink-0",
                    expanded.includes(m.id) && "rotate-180",
                  )}
                />
              </button>

              {expanded.includes(m.id) && (
                <div className="space-y-0.5 ml-2">
                  {m.lessons.map((l) => {
                    const done = completedIds.has(l.id);
                    const active = activeLessonId === l.id;
                    return (
                      <button
                        key={l.id}
                        onClick={() => openLesson(l.id)}
                        className={cn(
                          "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all text-xs",
                          active
                            ? "bg-accent/10 text-accent-light"
                            : done
                              ? "text-green-400 hover:bg-green-500/5"
                              : "text-text-muted hover:bg-white/5 hover:text-[#EEEEFF]",
                        )}
                      >
                        <span className="shrink-0">
                          {done ? (
                            <CheckCircle size={12} className="text-green-400" />
                          ) : active ? (
                            <Play size={12} className="text-accent-light fill-accent-light" />
                          ) : (
                            <Play size={12} className="text-text-dim" />
                          )}
                        </span>
                        <span className="flex-1 truncate">{l.title}</span>
                        {l.duration > 0 && (
                          <span className="text-text-dim shrink-0">
                            {Math.floor(l.duration / 60)}m
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
      </div>
    </>
  );

  // ─── Main Content ─────────────────────────────────────────────────────────
  const renderMainContent = () => {
    if (!activeLessonId || !activeLesson) {
      return (
        <div className="flex items-center justify-center p-8 min-h-[400px]">
          <div className="text-center max-w-md">
            <div className="text-5xl mb-4">📚</div>
            <h2 className="font-syne font-bold text-xl mb-2">
              {course.products?.title || course.title}
            </h2>
            <p className="text-text-muted text-sm mb-6">
              {completedIds.size > 0
                ? `${completedIds.size} lesson selesai. Lanjutkan!`
                : "Pilih lesson dari sidebar untuk mulai belajar"}
            </p>
            {initialLessonId && (
              <button
                onClick={() => openLesson(initialLessonId)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-cta text-black font-syne font-bold rounded-xl hover:bg-cta-hover transition-all"
              >
                <Play size={16} />
                {completedIds.size > 0 ? "Lanjut Belajar" : "Mulai Belajar"}
              </button>
            )}
          </div>
        </div>
      );
    }

    const lesson = activeLesson;
    const isDone = completedIds.has(lesson.id);
    const embedUrl = getEmbedUrl(lesson.video_url ?? "");

    return (
      <div className="flex flex-col h-full">
        {/* Video Container */}
        <div className="w-full bg-black/40 py-4 sm:py-8 px-0 sm:px-4 border-b border-white/[0.05]">
          <div className="max-w-[1000px] mx-auto">
            <div className="relative w-full bg-black aspect-video rounded-none sm:rounded-2xl overflow-hidden shadow-2xl border-y sm:border border-white/[0.05]">
              {getYoutubeId(lesson.video_url || '') ? (
                <YouTube
                  key={lesson.id}
                  videoId={getYoutubeId(lesson.video_url!)!}
                  onEnd={() => {
                    saveProgress();
                    markComplete();
                  }}
                  onPause={saveProgress}
                  onReady={(e) => {
                    setPlayer(e.target);
                    if (autoPlay) {
                      e.target.playVideo();
                      e.target.unMute();
                      e.target.setVolume(100);
                      setTimeout(() => {
                        if (e.target.isMuted()) {
                          setShowMuteNotice(true);
                        }
                      }, 1000);
                    }
                  }}
                  opts={youtubeOpts}
                  className="w-full h-full"
                />
              ) : embedUrl ? (
                <iframe
                  key={lesson.id}
                  src={embedUrl}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#0A0015] to-[#1A0A2E] flex flex-col items-center justify-center gap-4">
                  <span className="text-4xl">🎬</span>
                  <p className="text-text-muted text-sm">Video belum tersedia</p>
                </div>
              )}

              {showMuteNotice && (
                <div className="absolute inset-0 flex items-end justify-center pb-6 sm:pb-10 px-4 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none">
                  <button
                    onClick={() => {
                      player?.unMute();
                      player?.setVolume(100);
                      setShowMuteNotice(false);
                    }}
                    className="pointer-events-auto flex items-center gap-2.5 px-6 py-3 bg-yellow-400 text-black rounded-full font-bold shadow-xl animate-bounce hover:animate-none scale-90 sm:scale-100"
                  >
                    <Volume2 size={18} />
                    <span className="text-sm">Klik untuk Aktifkan Suara</span>
                  </button>
                </div>
              )}
            </div>

            {/* Progress and Fallback */}
            {player && (
              <div className="flex items-center gap-2 mt-4 px-1">
                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-light rounded-full transition-all duration-300"
                    style={{ width: `${watchProgress}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-text-dim tabular-nums">
                  {watchProgress}% ditonton
                </span>
              </div>
            )}
            
            {getYoutubeId(lesson.video_url || '') && (
              <div className="mt-2 text-center">
                <a 
                  href={`https://www.youtube.com/watch?v=${getYoutubeId(lesson.video_url || '')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-[10px] text-text-dim hover:text-accent-light flex items-center justify-center gap-1"
                >
                  <ExternalLink size={10} /> Tonton di YouTube
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Lesson Info */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
          <div className="max-w-[1000px] mx-auto">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-1">
                <p className="text-xs text-text-muted mb-1">
                  Lesson {currentIndex + 1} dari {allLessons.length}
                </p>
                <h1 className="font-syne font-extrabold text-xl sm:text-2xl leading-tight">
                  {lesson.title}
                </h1>
              </div>
              {isDone && (
                <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full shrink-0">
                  <CheckCircle size={14} /> Selesai
                </span>
              )}
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={markComplete}
                disabled={isDone || saving}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-lg",
                  isDone
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-accent hover:bg-accent-light text-white"
                )}
              >
                <CheckCircle size={16} />
                {isDone ? "Selesai ✓" : saving ? "Saving..." : "Tandai Selesai"}
              </button>

              <div className="flex items-center gap-3 bg-card border border-white/[0.07] px-4 py-3 rounded-xl">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoNext}
                    onChange={(e) => setAutoNext(e.target.checked)}
                    className="w-4 h-4 accent-accent"
                  />
                  <span className="text-sm text-text-muted">Auto-Lanjut</span>
                </label>
                <div className="w-px h-4 bg-white/10" />
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoPlay}
                    onChange={(e) => setAutoPlay(e.target.checked)}
                    className="w-4 h-4 accent-accent"
                  />
                  <span className="text-sm text-text-muted">Auto-Putar</span>
                </label>
              </div>

              <div className="flex gap-2 sm:ml-auto">
                <button
                  onClick={() => prevLesson && openLesson(prevLesson.id)}
                  disabled={!prevLesson}
                  className="p-3 bg-card border border-white/[0.07] rounded-xl text-text-muted hover:text-white hover:border-accent/40 disabled:opacity-30"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => nextLesson && openLesson(nextLesson.id)}
                  disabled={!nextLesson}
                  className="flex items-center gap-2 px-5 py-3 bg-accent hover:bg-accent-light rounded-xl font-bold text-sm text-white disabled:opacity-30"
                >
                  Next <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Content Details */}
            <div className="space-y-6">
              {lesson.description && (
                <div className="bg-card/50 border border-white/[0.05] rounded-2xl p-6">
                  <h3 className="font-syne font-bold mb-3 flex items-center gap-2">
                    <span>📝</span> Deskripsi
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed whitespace-pre-line">
                    {lesson.description}
                  </p>
                </div>
              )}

              {lesson.notes && (
                <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-2xl p-6">
                  <h3 className="font-syne font-bold text-yellow-300 mb-3 flex items-center gap-2">
                    <span>📌</span> Catatan Penting
                  </h3>
                  <pre className="text-sm text-yellow-100/70 leading-relaxed whitespace-pre-wrap font-sans">
                    {lesson.notes}
                  </pre>
                </div>
              )}

              {lesson.suggestions && lesson.suggestions.length > 0 && (
                <div>
                  <h3 className="font-syne font-bold mb-4 flex items-center gap-2">
                    <span>🔗</span> Resources
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {lesson.suggestions.map((s) => (
                      <a
                        key={s.id}
                        href={s.url}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 bg-card border border-white/[0.07] rounded-xl hover:border-accent/40 hover:-translate-y-1 transition-all group"
                      >
                        <span className="text-2xl shrink-0">{s.icon || "📎"}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm truncate">{s.title}</div>
                          <div className="text-text-dim text-[10px] uppercase tracking-wider">{s.type}</div>
                        </div>
                        <ExternalLink size={14} className="text-text-dim group-hover:text-accent" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-bg overflow-hidden">
      {/* Mobile Top Bar */}
      <div className="lg:hidden h-14 bg-surface/90 backdrop-blur-md border-b border-white/[0.07] flex items-center justify-between px-4 shrink-0 z-50">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 -ml-2 text-accent-light"
        >
          <Menu size={20} />
        </button>
        <span className="font-syne font-bold text-sm truncate flex-1 text-center px-4">
          {activeLesson?.title || course.title}
        </span>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-[350px] bg-surface border-r border-white/[0.07] shrink-0">
          {renderSidebarContent()}
        </aside>

        {/* Shared Main Viewport */}
        <main className="flex-1 flex flex-col min-w-0 h-full relative z-10">
          {renderMainContent()}
        </main>

        {/* Mobile Sidebar Overlay */}
        {mobileOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <div className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-surface z-[70] lg:hidden flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
              <div className="p-4 border-b border-white/[0.07] flex items-center justify-between">
                <span className="font-syne font-bold">Menu Materi</span>
                <button onClick={() => setMobileOpen(false)} className="p-1 text-text-muted">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {renderSidebarContent()}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

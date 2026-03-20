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
  Trophy,
  Award,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";

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
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"notes" | "resources" | "quiz">("notes");

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
          saveProgress();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [player, activeLessonId, saveProgress]);

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
        
        // Cek jika ini adalah materi terakhir yang belum selesai
        if (next.size === allLessons.length) {
          setShowCompleteModal(true);
        }
        
        return next;
      });
      if (autoNext && nextLesson) {
        setTimeout(() => openLesson(nextLesson.id), 1200);
      }
    } finally {
      setSaving(false);
    }
  }, [activeLessonId, completedIds, saving, autoNext, nextLesson, openLesson, allLessons.length]);

  // ─── Sidebar Content ──────────────────────────────────────────────────────
  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 border-b border-gray-100">
        <h2 className="font-syne font-extrabold text-[#1A1A1A] text-lg leading-tight mb-4">
          {course.products?.title || course.title}
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-gray-400 uppercase">
            <span>{completedIds.size}/{allLessons.length} COMPLETED</span>
            <Trophy size={14} className="text-[#00C2A0]" />
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00C2A0] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-2 custom-scrollbar">
        <div className="space-y-1">
          {allLessons.map((l, idx) => {
            const done = completedIds.has(l.id);
            const active = activeLessonId === l.id;
            return (
              <button
                key={l.id}
                onClick={() => openLesson(l.id)}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-left transition-all group relative",
                  active
                    ? "bg-white shadow-md border border-gray-100"
                    : "hover:bg-gray-50",
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
                  active 
                    ? "border-blue-600 bg-blue-600 text-white" 
                    : done 
                      ? "border-[#00C2A0] text-[#00C2A0]" 
                      : "border-gray-200 text-gray-400 group-hover:border-gray-300"
                )}>
                  {idx + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    "text-sm font-bold truncate transition-colors",
                    active ? "text-blue-600" : done ? "text-gray-700" : "text-gray-500"
                  )}>
                    {l.title}
                  </div>
                  {done && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <CheckCircle size={10} className="text-[#00C2A0]" />
                      <span className="text-[10px] text-gray-400">Completed</span>
                    </div>
                  )}
                </div>

                {!done && !active && (
                   <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-400" />
                )}
                {active && (
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Mock Discussion Section */}
        <div className="mt-10 px-4">
          <h3 className="text-sm font-extrabold text-gray-900 mb-6">Discussion</h3>
          <div className="space-y-6">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0 overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Robin" alt="Avatar" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900">Robin Sherbasky</div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Cool stuff tutor! I&apos;m wondering where I can find the list of recommended resources..
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <button className="text-[10px] font-bold text-gray-400 hover:text-gray-600">Reply</button>
                  <button className="text-[10px] font-bold text-gray-400 hover:text-gray-600">Show 8 replies</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
      <div className="flex flex-col h-full overflow-y-auto">
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
              {/* Progress Overlay */}
              {player && (
                <>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-[50]">
                    <div 
                      className="h-full bg-accent shadow-[0_0_12px_rgba(168,85,247,0.6)] transition-all duration-300"
                      style={{ width: `${watchProgress}%` }}
                    />
                  </div>
                  <div className="absolute bottom-3 right-3 z-[50] bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-white tabular-nums border border-white/10 shadow-lg">
                    {watchProgress}%
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Lesson Info */}
        <div className="p-4 sm:p-6 lg:p-8 shrink-0">
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

              <button
                onClick={() => {
                  player?.seekTo(0);
                  player?.playVideo();
                }}
                className="flex items-center gap-2 px-5 py-3 bg-card border border-white/[0.07] hover:border-accent/40 rounded-xl font-bold text-sm text-text-muted hover:text-white transition-all shadow-lg active:scale-95 text-balance shrink-0"
              >
                <RotateCcw size={16} />
                Mulai Ulang
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
    <div className="flex flex-col h-screen bg-[#F8F9FB] text-[#1A1A1A] overflow-hidden font-sans">
      {/* Mobile Top Bar */}
      <div className="lg:hidden h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-50">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 -ml-2 text-blue-600"
        >
          <Menu size={20} />
        </button>
        <span className="font-syne font-bold text-sm truncate flex-1 text-center px-4 text-gray-900">
          {activeLesson?.title || course.title}
        </span>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Shared Main Viewport */}
        <main className="flex-1 flex flex-col min-w-0 h-full relative z-10 bg-white">
          {renderMainContent()}
        </main>

        {/* Desktop Sidebar (Right) */}
        <aside className="hidden lg:flex flex-col w-[380px] bg-white border-l border-gray-200 shrink-0 shadow-sm transition-all duration-300">
          {renderSidebarContent()}
        </aside>

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
      {/* Course Completion Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-500" 
            onClick={() => setShowCompleteModal(false)}
          />
          <div className="relative bg-[#1A0A2E] border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(168,85,247,0.2)] animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.3)] animate-bounce">
              <Trophy size={40} className="text-white" />
            </div>
            <h2 className="font-syne font-extrabold text-2xl mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Misi Berhasil! 🎉
            </h2>
            <p className="text-text-muted text-sm mb-8 leading-relaxed">
              Selamat! Kamu telah menyelesaikan seluruh materi di course ini. Sekarang saatnya memanen hasil belajarmu.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href={`/certificate/${course.id}`}
                className="flex items-center justify-center gap-2 w-full py-4 bg-accent hover:bg-accent-light text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95"
              >
                <Award size={18} />
                Ambil Sertifikat
              </Link>
              <button
                onClick={() => setShowCompleteModal(false)}
                className="text-text-dim text-xs hover:text-white transition-colors"
              >
                Nanti Saja
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

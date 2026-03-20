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
  Zap,
  ArrowLeft,
  PanelLeftClose,
  PanelLeftOpen,
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [videoReloadKey, setVideoReloadKey] = useState(0);
  const [activeTab, setActiveTab] = useState<"notes" | "resources">("notes");

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
        return next;
      });

      // Check if all lessons are completed after marking the current one
      if (allLessons.every((l) => l.id === activeLessonId || completedIds.has(l.id))) {
        setShowCompleteModal(true);
      }

      if (autoNext && nextLesson) {
        setTimeout(() => openLesson(nextLesson.id), 1200);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }, [activeLessonId, allLessons, completedIds, setShowCompleteModal, saving, autoNext, nextLesson, openLesson]);

  // ─── Sidebar Content ──────────────────────────────────────────────────────
  const renderSidebarContent = () => (
    <div className={cn("flex flex-col h-full bg-surface overscroll-contain transition-all duration-300", isSidebarCollapsed ? "w-[80px]" : "w-full")}>
      {/* Fixed Part */}
      <div className={cn("p-6 border-b border-white/[0.07] shrink-0", isSidebarCollapsed && "p-4")}>
        {/* Logo & Brand & Toggle */}
        <div className={cn("flex items-center justify-between gap-3 mb-8", isSidebarCollapsed && "flex-col mb-6")}>
          {!isSidebarCollapsed && (
            <Link href="/" className="flex items-center gap-3 group/logo truncate">
              <div className="w-9 h-9 rounded-xl bg-gradient-accent flex items-center justify-center shadow-lg shadow-accent/30 group-hover/logo:scale-110 transition-transform duration-300">
                <Zap size={18} className="text-white fill-white" />
              </div>
              <span className="font-syne font-extrabold text-xl text-white tracking-tight">LearnFlow</span>
            </Link>
          )}
          {isSidebarCollapsed && (
            <div className="w-9 h-9 rounded-xl bg-gradient-accent flex items-center justify-center shadow-lg shadow-accent/30 mb-2">
              <Zap size={18} className="text-white fill-white" />
            </div>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 text-text-dim hover:text-white hover:bg-white/5 rounded-lg transition-all"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>
        </div>

        {!isSidebarCollapsed && (
          <>
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-extrabold text-text-muted hover:text-white hover:bg-accent/10 hover:border-accent/30 transition-all w-full group/back mb-6"
            >
              <ArrowLeft size={16} className="group-hover/back:-translate-x-1 transition-transform" />
              <span>Kembali ke Dashboard</span>
            </Link>

            <h2 className="font-syne font-bold text-text-dim text-[11px] tracking-[0.15em] mb-4 uppercase truncate">
              {course.products?.title || course.title}
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-text-dim uppercase">
                <span>{completedIds.size}/{allLessons.length} SELESAI</span>
                <Trophy size={14} className="text-accent-light" />
              </div>
              <div className="h-1.5 bg-bg rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Scrollable List */}
      <div className={cn("flex-1 overflow-y-auto py-4 px-2 scrollbar-hide hover-scrollbar-show transition-all custom-scrollbar", isSidebarCollapsed && "px-1")}>
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
                    ? "bg-white/5 shadow-lg border border-white/[0.05]"
                    : "hover:bg-white/[0.02]",
                  isSidebarCollapsed && "justify-center px-0 py-4 h-12 w-12 mx-auto rounded-xl"
                )}
                title={isSidebarCollapsed ? l.title : undefined}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
                  active 
                    ? "border-accent bg-accent text-white" 
                    : done 
                      ? "border-green-500/50 text-green-400" 
                      : "border-white/10 text-text-dim group-hover:border-white/20",
                  isSidebarCollapsed && "w-7 h-7"
                )}>
                  {idx + 1}
                </div>
                
                {!isSidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      "text-sm font-bold truncate transition-colors",
                      active ? "text-accent-light" : done ? "text-green-400/90" : "text-text-muted"
                    )}>
                      {l.title}
                    </div>
                    {done && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <CheckCircle size={10} className="text-green-500" />
                        <span className="text-[10px] text-text-dim">Selesai</span>
                      </div>
                    )}
                  </div>
                )}

                {!isSidebarCollapsed && !done && !active && (
                   <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-400" />
                )}
                {!isSidebarCollapsed && active && (
                   <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ─── Main Content ─────────────────────────────────────────────────────────
  const renderMainContent = () => {
    if (!activeLessonId || !activeLesson) {
      return (
        <div className="flex items-center justify-center p-8 h-full bg-bg">
          <div className="text-center max-w-md animate-in fade-in zoom-in-95 duration-500">
            <div className="text-6xl mb-6">✨</div>
            <h2 className="font-syne font-extrabold text-2xl text-white mb-3">
              Ready to learn?
            </h2>
            <p className="text-text-muted text-sm mb-8 leading-relaxed">
              {completedIds.size > 0
                ? `You've already finished ${completedIds.size} lessons. Keep the momentum going!`
                : "Choose a lesson from the list on the right to begin your learning journey."}
            </p>
            {initialLessonId && (
              <button
                onClick={() => openLesson(initialLessonId)}
                className="inline-flex items-center gap-3 px-8 py-4 bg-cta text-black font-syne font-bold rounded-2xl hover:bg-cta-hover transition-all shadow-lg active:scale-95"
              >
                <Play size={18} fill="currentColor" />
                {completedIds.size > 0 ? "Continue Learning" : "Start Now"}
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
      <div className="flex flex-col h-full bg-bg overflow-y-auto overscroll-contain custom-scrollbar">
        {/* Anti-Header Hack */}
        <style jsx global>{`
          nav { display: none !important; }
          header.fixed { display: none !important; }
        `}</style>

        {/* Header Section */}
        <header className="px-6 sm:px-10 py-8">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3">
                <div className="flex-1 min-w-0 overflow-hidden marquee-mask relative py-2">
                  <div className="flex w-max animate-marquee-bounce">
                    <h1 className="font-syne font-extrabold text-3xl sm:text-4xl text-white leading-tight whitespace-nowrap">
                      {lesson.title}
                    </h1>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2 mr-2">
                   <button
                    onClick={() => setAutoNext(!autoNext)}
                    title="Otomatis Lanjutkan"
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider transition-all border",
                      autoNext 
                        ? "bg-accent/20 text-accent-light border-accent/30" 
                        : "bg-white/5 text-text-dim border-white/10 hover:text-white"
                    )}
                   >
                     <Zap size={12} fill={autoNext ? "currentColor" : "none"} />
                     <span className="hidden sm:inline">OTOMATIS LANJUTKAN</span>
                   </button>
                   <button
                    onClick={() => {
                      setWatchProgress(0);
                      setVideoReloadKey((prev) => prev + 1);
                    }}
                    title="Muat Ulang Video (Mulai dari 0)"
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-text-dim hover:text-white hover:bg-white/10 transition-all active:scale-95"
                   >
                     <RotateCcw size={14} />
                   </button>
                </div>

                <div className="hidden sm:block text-right whitespace-nowrap">
                  <span className="text-[10px] font-bold tracking-widest text-text-dim uppercase">MATERI {currentIndex + 1}/{allLessons.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={!prevLesson}
                    onClick={() => prevLesson && openLesson(prevLesson.id)}
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-text-muted hover:bg-white/5 hover:text-white transition-all disabled:opacity-30 shadow-sm"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    disabled={!nextLesson}
                    onClick={() => nextLesson && openLesson(nextLesson.id)}
                    className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white hover:bg-accent-light transition-all disabled:opacity-30 shadow-md shadow-accent/20"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Video Player */}
        <section className="px-4 sm:px-10 pb-8">
          <div className="max-w-[1200px] mx-auto">
            <div className="relative w-full bg-black aspect-video rounded-[2rem] overflow-hidden shadow-2xl border border-white/[0.05]">
              {getYoutubeId(lesson.video_url || '') ? (
                <YouTube
                  key={`${lesson.id}-${videoReloadKey}`}
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
                  key={`${lesson.id}-${videoReloadKey}`}
                  src={embedUrl}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#0A0015] to-[#1A0A2E] flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl">🎬</div>
                  <p className="text-text-muted text-sm font-bold">Video tidak tersedia</p>
                </div>
              )}

              {showMuteNotice && (
                <div className="absolute inset-0 flex items-end justify-center pb-6 sm:pb-10 px-4 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none">
                  <p className="text-white font-extrabold text-lg mb-2 leading-tight">Video dimulai tanpa suara</p>
                  <p className="text-white/60 text-[10px] font-bold mb-6 tracking-widest uppercase">Klik untuk mendengar</p>
                  <button
                    onClick={() => {
                      player?.unMute();
                      player?.setVolume(100);
                      setShowMuteNotice(false);
                    }}
                    className="pointer-events-auto flex items-center gap-2.5 px-6 py-3 bg-yellow-400 text-black rounded-full font-bold shadow-xl animate-bounce hover:animate-none scale-90 sm:scale-100 transition-transform active:scale-95"
                  >
                    <Volume2 size={18} />
                    <span className="text-sm">AKTIFKAN SUARA</span>
                  </button>
                </div>
              )}

              {/* Progress Overlay */}
              {player && (
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10 z-[50]">
                  <div
                    className="h-full bg-accent shadow-[0_0_15px_rgba(168,85,247,0.6)] transition-all duration-300 relative"
                    style={{ width: `${watchProgress}%` }}
                  >
                    {/* Percentage Indicator */}
                    <div className="absolute -top-7 -right-4 flex items-center justify-center px-1.5 py-0.5 bg-accent/90 backdrop-blur-sm text-[10px] font-bold text-white rounded-md shadow-lg border border-white/10 select-none">
                      {Math.round(watchProgress)}%
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content Tabs & Details */}
        <section className="px-6 sm:px-10 pb-20">
          <div className="max-w-[1200px] mx-auto">
            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-white/[0.05] mb-10 overflow-x-auto no-scrollbar">
              {[
                { id: "notes", label: "Catatan" },
                { id: "resources", label: "Materi" }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={cn(
                    "pb-4 text-sm font-bold transition-all relative whitespace-nowrap",
                    activeTab === t.id ? "text-accent-light" : "text-text-dim hover:text-white"
                  )}
                >
                  {t.label}
                  {activeTab === t.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-full" />
                  )}
                </button>
              ))}

              <div className="ml-auto flex items-center gap-4 pb-4">
                 <button
                  onClick={markComplete}
                  disabled={isDone || saving}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all",
                    isDone
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : "bg-accent hover:bg-accent-light text-white shadow-lg shadow-accent/10"
                  )}
                 >
                   <CheckCircle size={14} />
                   {isDone ? "Selesai" : saving ? "Menyimpan..." : "Tandai Selesai"}
                 </button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
              <div className="flex-1 space-y-8">
                {activeTab === "notes" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <p className="text-text-muted text-sm leading-8 whitespace-pre-line font-medium">
                      {lesson.description || "Tidak ada deskripsi untuk materi ini."}
                    </p>
                  </div>
                )}

                {activeTab === "resources" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {lesson.suggestions?.map((s) => (
                      <a
                        key={s.id}
                        href={s.url}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-4 p-5 bg-surface border border-white/5 rounded-2xl hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 transition-all group"
                      >
                        <span className="text-3xl shrink-0">{s.icon || "📎"}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm text-white truncate">{s.title}</div>
                          <div className="text-[10px] font-bold text-text-dim uppercase tracking-widest">{s.type}</div>
                        </div>
                        <ExternalLink size={14} className="text-text-dim group-hover:text-accent-light" />
                      </a>
                    )) || (
                       <p className="text-text-dim text-sm italic col-span-2">Tidak ada materi tambahan.</p>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-bg text-white overflow-hidden font-sans">
      {/* Mobile Top Bar */}
      <div className="lg:hidden h-14 bg-surface border-b border-white/5 flex items-center justify-between px-4 shrink-0 z-50">
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
        {/* Desktop Sidebar (Left) */}
        <aside className={cn(
          "hidden lg:flex flex-col bg-surface border-r border-white/5 shrink-0 shadow-sm transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "w-[80px]" : "w-[380px]"
        )}>
          {renderSidebarContent()}
        </aside>

        {/* Shared Main Viewport */}
        <main className="flex-1 flex flex-col min-w-0 h-full relative z-10 bg-bg">
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
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <span className="font-syne font-extrabold text-white">Menu Materi</span>
                <button onClick={() => setMobileOpen(false)} className="p-2 text-text-muted hover:text-white">
                  <X size={22} />
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
            className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500"
            onClick={() => setShowCompleteModal(false)}
          />
          <div className="relative bg-[#1A0A2E] border border-white/10 rounded-[3rem] p-10 max-w-sm w-full text-center shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-[2rem] mx-auto mb-8 flex items-center justify-center shadow-[0_20px_40px_rgba(234,179,8,0.3)] animate-bounce">
              <Trophy size={48} className="text-white" />
            </div>
            <h2 className="font-syne font-extrabold text-3xl mb-3 text-white leading-tight">
              Selamat! 🎉
            </h2>
            <p className="text-text-muted text-sm mb-10 leading-relaxed font-medium">
              Kamu telah menyelesaikan semua materi di kursus ini. Kamu bisa mengambil sertifikatmu sekarang.
            </p>
            <div className="flex flex-col gap-4">
              <Link
                href={`/certificate/${course.id}`}
                className="flex items-center justify-center gap-2 w-full py-5 bg-accent hover:bg-accent-light text-white font-extrabold rounded-[1.5rem] transition-all shadow-xl shadow-accent/20 active:scale-95"
              >
                <Award size={20} />
                Ambil Sertifikat
              </Link>
              <button
                onClick={() => setShowCompleteModal(false)}
                className="text-text-dim text-xs font-bold hover:text-white transition-colors py-2"
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

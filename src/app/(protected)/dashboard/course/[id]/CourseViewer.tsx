"use client";
import { useState, useCallback } from "react";
import { cn, getEmbedUrl } from "@/lib/utils";
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
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [autoNext, setAutoNext] = useState(true);

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
    // scroll main area to top on mobile
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
      setCompletedIds((prev) => new Set([...prev, activeLessonId]));
      if (autoNext && nextLesson) {
        setTimeout(() => openLesson(nextLesson.id), 1200);
      }
    } finally {
      setSaving(false);
    }
  }, [activeLessonId, completedIds, saving, autoNext, nextLesson, openLesson]);

  // ─── Sidebar ──────────────────────────────────────────────────────────────
  const SidebarContent = () => (
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
        {/* Flat mode */}
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
                    <Play
                      size={13}
                      className="text-accent-light fill-accent-light"
                    />
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

        {/* Chapter mode */}
        {useChapters &&
          course.modules.map((m, mi) => (
            <div key={m.id} className="mb-1">
              <button
                onClick={() =>
                  setExpanded((p) =>
                    p.includes(m.id)
                      ? p.filter((x) => x !== m.id)
                      : [...p, m.id],
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
                            <Play
                              size={12}
                              className="text-accent-light fill-accent-light"
                            />
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
  const MainContent = () => {
    if (!activeLessonId || !activeLesson) {
      return (
        <div className="flex items-center justify-center h-full p-8">
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
        {/* Video */}
        <div className="w-full bg-bg py-6 sm:py-10 px-4">
          {" "}
          {/* Tambah background & padding luar */}
          <div className="max-w-[960px] mx-auto">
            {" "}
            {/* Batasi lebar maksimal video */}
            <div className="w-full bg-black aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/[0.05]">
              {embedUrl ? (
                <iframe
                  key={lesson.id}
                  src={embedUrl}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#0A0015] to-[#1A0A2E] flex flex-col items-center justify-center gap-4">
                  <span className="text-4xl sm:text-5xl">🎬</span>
                  <p className="text-text-muted text-sm">
                    Video belum tersedia
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 flex-1">
          {/* Lesson header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-1">
              <p className="text-xs text-text-muted mb-1">
                Lesson {currentIndex + 1} dari {allLessons.length}
              </p>
              <h1 className="font-syne font-extrabold text-lg sm:text-xl leading-snug">
                {lesson.title}
              </h1>
              {lesson.duration > 0 && (
                <p className="text-text-muted text-xs mt-1">
                  ⏱ {Math.floor(lesson.duration / 60)} menit
                </p>
              )}
            </div>
            {isDone && (
              <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full shrink-0 mt-1">
                <CheckCircle size={12} /> Selesai
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-3 mb-5 p-3 bg-card border border-white/[0.07] rounded-xl">
            <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-text-muted shrink-0 font-semibold">
              {progress}%
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2.5 mb-6">
            <button
              onClick={markComplete}
              disabled={isDone || saving}
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all",
                isDone
                  ? "bg-green-500/15 text-green-400 border border-green-500/20"
                  : "bg-accent hover:bg-accent-light text-white",
              )}
            >
              <CheckCircle size={15} />
              {isDone
                ? "Lesson Selesai ✓"
                : saving
                  ? "Menyimpan..."
                  : "Tandai Selesai"}
            </button>

            <label className="flex items-center gap-2 px-4 py-3 bg-card border border-white/[0.07] rounded-xl cursor-pointer hover:border-accent/30 transition-all select-none">
              <input
                type="checkbox"
                checked={autoNext}
                onChange={(e) => setAutoNext(e.target.checked)}
                className="w-4 h-4 accent-purple-500"
              />
              <span className="text-sm text-text-muted">Auto-lanjut</span>
            </label>

            <div className="flex gap-2 sm:ml-auto">
              <button
                onClick={() => prevLesson && openLesson(prevLesson.id)}
                disabled={!prevLesson}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-3 bg-card border border-white/[0.07] rounded-xl text-sm text-text-muted hover:text-[#EEEEFF] hover:border-accent/30 transition-all disabled:opacity-40"
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <button
                onClick={() => nextLesson && openLesson(nextLesson.id)}
                disabled={!nextLesson}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-3 bg-accent hover:bg-accent-light rounded-xl text-sm text-white font-semibold transition-all disabled:opacity-40"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Description */}
          {lesson.description && (
            <div className="bg-card border border-white/[0.07] rounded-2xl p-5 mb-5">
              <h2 className="font-syne font-bold text-base mb-3">
                📋 Tentang Lesson Ini
              </h2>
              <p className="text-text-muted text-sm leading-relaxed whitespace-pre-line">
                {lesson.description}
              </p>
            </div>
          )}

          {/* Notes */}
          {lesson.notes && (
            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-5 mb-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-yellow-500/20 flex items-center justify-center shrink-0">
                  <StickyNote size={14} className="text-yellow-400" />
                </div>
                <h2 className="font-syne font-bold text-base text-yellow-300">
                  📝 Catatan & Tips
                </h2>
              </div>
              <pre className="text-sm text-yellow-100/70 leading-relaxed whitespace-pre-wrap font-sans">
                {lesson.notes}
              </pre>
            </div>
          )}

          {/* Suggestions */}
          {lesson.suggestions && lesson.suggestions.length > 0 && (
            <div>
              <h2 className="font-syne font-bold text-base mb-4">
                🔗 Tools & Resources
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lesson.suggestions.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-card border border-white/[0.07] rounded-xl hover:border-accent/40 hover:-translate-y-0.5 transition-all group"
                  >
                    <span className="text-2xl shrink-0">{s.icon || "🔗"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">
                        {s.title}
                      </div>
                      <div className="text-text-muted text-xs mt-0.5 capitalize">
                        {s.type}
                      </div>
                    </div>
                    <ExternalLink
                      size={14}
                      className="text-text-dim group-hover:text-accent-light shrink-0"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bg">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 bg-surface/95 backdrop-blur-xl border-b border-white/[0.07] px-4 h-12 flex items-center justify-between">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-1.5 text-xs text-accent-light shrink-0 ml-3"
        >
          <Menu size={15} /> Materi
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-syne font-bold text-sm truncate">
            {activeLesson?.title ?? course.products?.title}
          </span>
          {useChapters ? (
            <Layers size={14} className="text-text-dim shrink-0" />
          ) : (
            <List size={14} className="text-text-dim shrink-0" />
          )}
        </div>
      </div>

      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 left-0 bottom-0 w-80 bg-surface border-l border-white/[0.07] z-50 lg:hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/[0.07]">
              <span className="font-syne font-bold text-sm">Daftar Materi</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-auto flex flex-col">
              <SidebarContent />
            </div>
          </div>
        </>
      )}

      {/* Desktop: sidebar kiri tetap + konten inline kanan */}
      <div className="hidden lg:grid lg:grid-cols-[300px_1fr] min-h-[calc(100vh-64px)]">
        <aside className="bg-surface border-r border-white/[0.07] sticky top-16 h-[calc(100vh-64px)] overflow-y-auto flex flex-col">
          <SidebarContent />
        </aside>
        <main className="h-[calc(100vh-64px)] overflow-hidden flex flex-col">
          <MainContent />
        </main>
      </div>

      {/* Mobile: full width */}
      <div className="lg:hidden flex flex-col">
        <MainContent />
      </div>
    </div>
  );
}

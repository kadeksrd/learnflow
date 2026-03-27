"use client";

import React, { useState, memo, useCallback } from "react";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Save,
  Video,
  StickyNote,
  Link as LinkIcon,
  X,
  GripVertical,
  Layers,
  List,
  BookOpen,
  Clock,
  AlignLeft,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const SUGG_TYPES = [
  { value: "tool", label: "🛠️ Tool" },
  { value: "article", label: "📄 Artikel" },
  { value: "download", label: "⬇️ Download" },
  { value: "video", label: "🎬 Video" },
  { value: "website", label: "🌐 Website" },
];

interface Suggestion {
  id: string;
  title: string;
  url: string;
  type: string;
  icon: string | null;
}

// ─────────────────────────────────────────────────────────────
// 1. LESSON EDITOR (DIPINDAH KE LUAR AGAR FOKUS TETAP & UI UTUH)
// ─────────────────────────────────────────────────────────────
const LessonEditor = memo(
  ({
    lesson,
    modId,
    editTab,
    setEditTab,
    updateLesson,
    saveLesson,
    saving,
    addSuggestion,
    deleteSuggestion,
    suggestions,
    suggForm,
    setSuggForm,
  }: any) => (
    <div className="ml-5 sm:ml-7 mt-1.5 mb-2 bg-surface rounded-xl border border-slate-200 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {[
          { id: "content", icon: Video, label: "🎬 Video & Info" },
          { id: "notes", icon: StickyNote, label: "📝 Catatan" },
          { id: "suggestions", icon: LinkIcon, label: "🔗 Resources" },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setEditTab(id as any)}
            className={cn(
              "flex-1 py-2.5 text-xs font-semibold transition-all border-b-2",
              editTab === id
                ? "text-text border-accent"
                : "text-text-muted border-transparent hover:text-text",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab: Video & Info */}
      {editTab === "content" && (
        <div className="p-4 space-y-3">
          <Input
            label="URL Video (YouTube / Vimeo / direct)"
            placeholder="https://youtube.com/watch?v=..."
            value={lesson.video_url || ""}
            onChange={(e) =>
              updateLesson(modId, lesson.id, "video_url", e.target.value)
            }
          />
          {lesson.video_url && (
            <div className="text-xs text-green-400 flex items-center gap-1.5">
              <Video size={12} /> Video siap ·{" "}
              {lesson.video_url.includes("youtube")
                ? "YouTube"
                : lesson.video_url.includes("vimeo")
                  ? "Vimeo"
                  : "Direct URL"}
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-3">
            <Input
              label="Durasi (detik)"
              type="number"
              placeholder="600"
              value={lesson.duration || ""}
              onChange={(e) =>
                updateLesson(modId, lesson.id, "duration", e.target.value)
              }
              hint="600 = 10 menit, 3600 = 1 jam"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              Deskripsi Lesson
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 bg-card border border-slate-200 rounded-xl text-text text-sm outline-none focus:border-accent resize-none"
              placeholder="Ringkasan apa yang akan dipelajari di lesson ini..."
              value={lesson.description || ""}
              onChange={(e) =>
                updateLesson(modId, lesson.id, "description", e.target.value)
              }
            />
          </div>
          <Button
            size="sm"
            onClick={() => saveLesson(lesson)}
            loading={saving === lesson.id}
          >
            <Save size={13} /> Simpan
          </Button>
        </div>
      )}

      {/* Tab: Catatan */}
      {editTab === "notes" && (
        <div className="p-4 space-y-3">
          <div className="flex items-start gap-2 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
            <StickyNote size={14} className="text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-300/70">
              Catatan ini tampil sebagai highlight kuning di halaman lesson.
              Bisa berupa tips, poin penting, atau reminder untuk pelajar.
            </p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              Catatan / Notes
            </label>
            <textarea
              rows={7}
              className="w-full px-4 py-3 bg-card border border-yellow-500/20 rounded-xl text-text text-sm outline-none focus:border-yellow-400/50 resize-none font-mono"
              placeholder={
                "• Poin penting dari lesson ini\n• Tips dan trik\n• Referensi tambahan\n• Kesimpulan materi"
              }
              value={lesson.notes || ""}
              onChange={(e) =>
                updateLesson(modId, lesson.id, "notes", e.target.value)
              }
            />
          </div>
          <Button
            size="sm"
            onClick={() => saveLesson(lesson)}
            loading={saving === lesson.id}
          >
            <Save size={13} /> Simpan Catatan
          </Button>
        </div>
      )}

      {/* Tab: Resources */}
      {editTab === "suggestions" && (
        <div className="p-4 space-y-4">
          <div className="flex items-start gap-2 p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
            <LinkIcon size={14} className="text-green-400 shrink-0 mt-0.5" />
            <p className="text-xs text-green-300/70">
              Tambahkan tools, artikel, atau resource yang dipakai di lesson
              ini. Akan muncul sebagai kartu di bawah video.
            </p>
          </div>

          <div className="bg-card rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">
              + Tambah Resource Baru
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SUGG_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() =>
                    setSuggForm((p: any) => ({
                      ...p,
                      [lesson.id]: { ...(p[lesson.id] || {}), type: t.value },
                    }))
                  }
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
                    (suggForm[lesson.id]?.type || "tool") === t.value
                      ? "bg-accent/20 text-accent-light border border-accent/30"
                      : "bg-surface border border-slate-200 text-text-muted",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-[40px_1fr] gap-2">
              <input
                className="text-center px-2 py-2 bg-surface border border-slate-200 rounded-lg text-sm outline-none focus:border-accent text-text"
                placeholder="🔗"
                maxLength={2}
                value={suggForm[lesson.id]?.icon || ""}
                onChange={(e) =>
                  setSuggForm((p: any) => ({
                    ...p,
                    [lesson.id]: {
                      ...(p[lesson.id] || {}),
                      icon: e.target.value,
                    },
                  }))
                }
              />
              <input
                className="px-3 py-2 bg-surface border border-slate-200 rounded-lg text-sm text-text outline-none focus:border-accent"
                placeholder="Nama tool / resource"
                value={suggForm[lesson.id]?.title || ""}
                onChange={(e) =>
                  setSuggForm((p: any) => ({
                    ...p,
                    [lesson.id]: {
                      ...(p[lesson.id] || {}),
                      title: e.target.value,
                    },
                  }))
                }
              />
            </div>
            <input
              className="w-full px-3 py-2 bg-surface border border-slate-200 rounded-lg text-sm text-text outline-none focus:border-accent"
              placeholder="https://..."
              value={suggForm[lesson.id]?.url || ""}
              onChange={(e) =>
                setSuggForm((p: any) => ({
                  ...p,
                  [lesson.id]: { ...(p[lesson.id] || {}), url: e.target.value },
                }))
              }
              onKeyDown={(e) => e.key === "Enter" && addSuggestion(lesson.id)}
            />
            <Button
              size="sm"
              onClick={() => addSuggestion(lesson.id)}
              className="w-full justify-center"
            >
              <Plus size={13} /> Tambah Resource
            </Button>
          </div>

          {suggestions[lesson.id]?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Tersimpan ({suggestions[lesson.id].length})
              </p>
              {suggestions[lesson.id].map((s: any) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 p-3 bg-surface rounded-xl"
                >
                  <span className="text-lg shrink-0">{s.icon || "🔗"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {s.title}
                    </div>
                    <div className="text-text-muted text-xs capitalize">
                      {s.type}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteSuggestion(lesson.id, s.id)}
                    className="p-1.5 hover:bg-red-500/10 hover:text-red-400 text-text-dim rounded-lg transition-all shrink-0"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  ),
);
LessonEditor.displayName = "LessonEditor";

// ─────────────────────────────────────────────────────────────
// 2. LESSON ROW (DIPINDAH KE LUAR AGAR TIDAK RE-RENDER BERLEBIHAN)
// ─────────────────────────────────────────────────────────────
const LessonRow = memo(
  ({
    lesson,
    modId,
    index,
    editLesson,
    editTab,
    openLesson,
    updateLesson,
    saveLesson,
    deleteLesson,
    saving,
    setEditTab,
    ...editorProps
  }: any) => {
    const isEditing = editLesson === lesson.id;
    return (
      <div>
        <div
          className={cn(
            "flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors group",
            isEditing
              ? "bg-accent/5 border border-accent/20"
              : "bg-surface hover:bg-card-hover",
          )}
        >
          <span className="text-text-dim text-xs w-5 shrink-0 text-center">
            {index + 1}
          </span>
          <input
            className="flex-1 bg-transparent text-sm outline-none text-text placeholder:text-text-dim min-w-0"
            value={lesson.title}
            onChange={(e) =>
              updateLesson(modId, lesson.id, "title", e.target.value)
            }
            onBlur={() => saving !== lesson.id && saveLesson(lesson)}
            placeholder="Judul lesson"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            {lesson.video_url && (
              <span
                title="Video"
                className="w-4 h-4 rounded bg-accent/20 flex items-center justify-center"
              >
                <Video size={10} className="text-accent-light" />
              </span>
            )}
            {lesson.notes && (
              <span
                title="Catatan"
                className="w-4 h-4 rounded bg-yellow-500/20 flex items-center justify-center"
              >
                <StickyNote size={10} className="text-yellow-400" />
              </span>
            )}
            {lesson.duration > 0 && (
              <span className="text-text-dim text-xs">
                {Math.floor(lesson.duration / 60)}m
              </span>
            )}
          </div>
          <div className="flex gap-0.5 shrink-0">
            {(["content", "notes", "suggestions"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => openLesson(lesson.id, tab)}
                className={cn(
                  "w-7 h-7 rounded-lg transition-all flex items-center justify-center text-sm",
                  isEditing && editTab === tab
                    ? "bg-accent/20 text-accent-light"
                    : "text-text-dim hover:bg-slate-50 hover:text-text",
                )}
              >
                {tab === "content" ? "🎬" : tab === "notes" ? "📝" : "🔗"}
              </button>
            ))}
            <button
              onClick={() => deleteLesson(modId, lesson.id)}
              className="w-7 h-7 rounded-lg hover:bg-red-500/10 text-text-dim hover:text-red-400 transition-all flex items-center justify-center"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
        {isEditing && (
          <LessonEditor
            lesson={lesson}
            modId={modId}
            editTab={editTab}
            setEditTab={setEditTab}
            updateLesson={updateLesson}
            saveLesson={saveLesson}
            saving={saving}
            {...editorProps}
          />
        )}
      </div>
    );
  },
);
LessonRow.displayName = "LessonRow";

// ─────────────────────────────────────────────────────────────
// 3. KOMPONEN UTAMA (UI TETAP SAMA 100%)
// ─────────────────────────────────────────────────────────────
export function CourseBuilderClient({ course }: { course: any }) {
  const [modules, setModules] = useState<any[]>(course.modules || []);
  const [expanded, setExpanded] = useState<string[]>(
    (course.modules || []).map((m: any) => m.id),
  );
  const [saving, setSaving] = useState<string | null>(null);
  const [editLesson, setEditLesson] = useState<string | null>(null);
  const [editTab, setEditTab] = useState<"content" | "notes" | "suggestions">(
    "content",
  );
  const [useChapters, setUseChapters] = useState<boolean>(
    course.use_chapters !== false,
  );
  const [courseDesc, setCourseDesc] = useState<string>(
    course.description || "",
  );
  const [suggestions, setSuggestions] = useState<Record<string, Suggestion[]>>(
    {},
  );
  const [suggForm, setSuggForm] = useState<Record<string, any>>({});

  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [importingPlaylist, setImportingPlaylist] = useState(false);

  const defaultModule = modules[0];

  const handleImportPlaylist = async () => {
    const reg = /[&?]list=([^&]+)/i;
    const match = reg.exec(playlistUrl);
    const playlistId = match ? match[1] : null;

    if (!playlistId) return alert("URL Playlist tidak valid. Pastikan ada parameter 'list=' di URL.");

    setImportingPlaylist(true);
    try {
      const res = await fetch(`/api/admin/youtube/playlist?playlistId=${playlistId}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Gagal mengambil data playlist");
      }
      const videos = await res.json();
      if (videos.length === 0) throw new Error("Playlist kosong atau tidak ditemukan");

      // 1. Tambah Bab Baru
      const newMod = await addModule();

      // 2. Update Judul Bab (opsional, bisa pakai judul playlist kalau kita fetch)
      // Untuk sekarang kita biarkan admin ganti sendiri atau kita set default
      const moduleTitle = "Materi Playlist YouTube";
      await fetch(`/api/admin/modules/${newMod.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: moduleTitle }),
      });
      updateModule(newMod.id, "title", moduleTitle);

      // 3. Tambah semua video sebagai lesson
      const lessonPromises = videos.map((v: any, idx: number) =>
        fetch("/api/admin/lessons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            module_id: newMod.id,
            title: v.title,
            video_url: `https://www.youtube.com/watch?v=${v.video_id}`,
            order: idx,
            duration: 0,
          }),
        }).then((r) => r.json()),
      );

      const addedLessons = await Promise.all(lessonPromises);

      // 4. Update state lokal supaya langsung muncul
      setModules((p) =>
        p.map((m) => (m.id === newMod.id ? { ...m, lessons: addedLessons } : m)),
      );

      setShowPlaylistModal(false);
      setPlaylistUrl("");
      alert(`Berhasil mengimpor ${addedLessons.length} video!`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setImportingPlaylist(false);
    }
  };

  const saveCourseSettings = async (data: any) => {
    setSaving("course");
    await fetch("/api/admin/courses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: course.id, ...data }),
    });
    setSaving(null);
  };

  const toggleChapters = async () => {
    const next = !useChapters;
    setUseChapters(next);
    if (next && modules.length === 0) {
      await addModule();
    } else if (!next && modules.length === 0) {
      const res = await fetch("/api/admin/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_id: course.id,
          title: "Konten Kursus",
          order: 0,
        }),
      });
      const data = await res.json();
      if (res.ok) setModules([{ ...data, lessons: [] }]);
    }
    await saveCourseSettings({ use_chapters: next });
  };

  const loadSuggestions = useCallback(
    async (lessonId: string) => {
      if (suggestions[lessonId]) return;
      const res = await fetch(`/api/admin/suggestions?lesson_id=${lessonId}`);
      const data = res.ok ? await res.json() : [];
      setSuggestions((p) => ({ ...p, [lessonId]: data }));
      setSuggForm((p) => ({
        ...p,
        [lessonId]: { title: "", url: "", type: "tool", icon: "" },
      }));
    },
    [suggestions],
  );

  const addSuggestion = async (lessonId: string) => {
    const f = suggForm[lessonId];
    if (!f?.title?.trim() || !f?.url?.trim()) return;
    const res = await fetch("/api/admin/suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lesson_id: lessonId, ...f, icon: f.icon || null }),
    });
    if (res.ok) {
      const data = await res.json();
      setSuggestions((p) => ({
        ...p,
        [lessonId]: [data, ...(p[lessonId] || [])],
      }));
      setSuggForm((p) => ({
        ...p,
        [lessonId]: { title: "", url: "", type: "tool", icon: "" },
      }));
    }
  };

  const deleteSuggestion = async (lessonId: string, suggId: string) => {
    await fetch(`/api/admin/suggestions/${suggId}`, { method: "DELETE" });
    setSuggestions((p) => ({
      ...p,
      [lessonId]: p[lessonId].filter((s) => s.id !== suggId),
    }));
  };

  const addModule = async () => {
    const title = useChapters
      ? `Bab ${modules.length + 1}: Judul Bab`
      : "Konten Kursus";
    const res = await fetch("/api/admin/modules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        course_id: course.id,
        title,
        order: modules.length,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setModules((p) => [...p, { ...data, lessons: [] }]);
      setExpanded((p) => [...p, data.id]);
    }
    return data;
  };

  const saveModule = async (mod: any) => {
    setSaving(mod.id);
    await fetch(`/api/admin/modules/${mod.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: mod.title, description: mod.description }),
    });
    setSaving(null);
  };

  const deleteModule = async (id: string) => {
    if (!confirm("Hapus bab ini? Semua lesson di dalamnya juga terhapus."))
      return;
    const res = await fetch(`/api/admin/modules/${id}`, { method: "DELETE" });
    if (res.ok) setModules((p) => p.filter((m) => m.id !== id));
  };

  const updateModule = (id: string, key: string, val: any) =>
    setModules((p) => p.map((m) => (m.id === id ? { ...m, [key]: val } : m)));

  const addLesson = async (moduleId: string) => {
    const mod = modules.find((m) => m.id === moduleId)!;
    const res = await fetch("/api/admin/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        module_id: moduleId,
        title: `Lesson ${mod.lessons.length + 1}`,
        order: mod.lessons.length,
        duration: 0,
        notes: null,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setModules((p) =>
        p.map((m) =>
          m.id === moduleId ? { ...m, lessons: [...m.lessons, data] } : m,
        ),
      );
      setEditLesson(data.id);
      setEditTab("content");
    }
  };

  const updateLesson = useCallback(
    (modId: string, lessonId: string, field: string, val: any) =>
      setModules((p) =>
        p.map((m) =>
          m.id === modId
            ? {
                ...m,
                lessons: m.lessons.map((l: any) =>
                  l.id === lessonId ? { ...l, [field]: val } : l,
                ),
              }
            : m,
        ),
      ),
    [],
  );

  const saveLesson = useCallback(async (lesson: any) => {
    setSaving(lesson.id);
    await fetch(`/api/admin/lessons/${lesson.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: lesson.title,
        video_url: lesson.video_url,
        description: lesson.description,
        duration: Number(lesson.duration || 0),
        notes: lesson.notes,
      }),
    });
    setSaving(null);
    setEditLesson(null);
  }, []);

  const deleteLesson = useCallback(async (modId: string, lessonId: string) => {
    if (!confirm("Hapus lesson ini?")) return;
    const res = await fetch(`/api/admin/lessons/${lessonId}`, {
      method: "DELETE",
    });
    if (res.ok)
      setModules((p) =>
        p.map((m) =>
          m.id === modId
            ? { ...m, lessons: m.lessons.filter((l: any) => l.id !== lessonId) }
            : m,
        ),
      );
  }, []);

  const openLesson = useCallback(
    (lessonId: string, tab: "content" | "notes" | "suggestions") => {
      if (editLesson === lessonId && editTab === tab) {
        setEditLesson(null);
        return;
      }
      setEditLesson(lessonId);
      setEditTab(tab);
      if (tab === "suggestions") loadSuggestions(lessonId);
    },
    [editLesson, editTab, loadSuggestions],
  );

  const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);
  const totalDuration = modules.reduce(
    (s, m) =>
      s +
      m.lessons.reduce(
        (ls: number, l: any) => ls + (Number(l.duration) || 0),
        0,
      ),
    0,
  );

  // Bungkus props untuk LessonRow agar rapi
  const rowProps = {
    editLesson,
    editTab,
    openLesson,
    updateLesson,
    saveLesson,
    deleteLesson,
    saving,
    addSuggestion,
    deleteSuggestion,
    suggestions,
    suggForm,
    setSuggForm,
    setEditTab,
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="bg-card border border-slate-200 rounded-2xl p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-syne font-bold text-base">
              {course.products?.title || course.title}
            </h2>
            <div className="flex gap-3 mt-1.5 text-xs text-text-muted">
              <span className="flex items-center gap-1">
                <BookOpen size={11} /> {totalLessons} lesson
              </span>
              {totalDuration > 0 && (
                <span className="flex items-center gap-1">
                  <Clock size={11} /> {Math.round(totalDuration / 60)} menit
                </span>
              )}
              {useChapters && (
                <span className="flex items-center gap-1">
                  <Layers size={11} /> {modules.length} bab
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 p-1 bg-surface rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => toggleChapters()}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                useChapters
                  ? "bg-card text-text shadow-sm"
                  : "text-text-muted hover:text-text",
              )}
            >
              <Layers size={13} /> Pakai Bab
            </button>
            <button
              onClick={() => toggleChapters()}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                !useChapters
                  ? "bg-card text-text shadow-sm"
                  : "text-text-muted hover:text-text",
              )}
            >
              <List size={13} /> Langsung
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            Deskripsi Kursus (opsional)
          </label>
          <textarea
            rows={2}
            className="w-full px-4 py-3 bg-surface border border-slate-200 rounded-xl text-text text-sm outline-none focus:border-accent resize-none"
            placeholder="Ringkasan kursus ini untuk ditampilkan di course viewer..."
            value={courseDesc}
            onChange={(e) => setCourseDesc(e.target.value)}
            onBlur={() => saveCourseSettings({ description: courseDesc })}
          />
        </div>

        <div
          className={cn(
            "p-3 rounded-xl text-xs",
            useChapters
              ? "bg-accent/5 border border-accent/15 text-accent-light"
              : "bg-green-500/5 border border-green-500/15 text-green-400",
          )}
        >
          {useChapters
            ? "📚 Mode Bab — Lesson dikelompokkan dalam bab/chapter. Cocok untuk kursus panjang dengan topik berbeda."
            : "⚡ Mode Langsung — Semua lesson langsung tampil tanpa dikelompokkan. Cocok untuk kursus singkat atau mini-course."}
        </div>
      </div>

      {!useChapters && (
        <div className="bg-card border border-slate-200 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <span className="text-sm font-semibold">Daftar Lesson</span>
            <span className="text-xs text-text-muted">
              {defaultModule?.lessons?.length || 0} lesson
            </span>
          </div>
          <div className="p-3 space-y-1.5">
            {(defaultModule?.lessons || []).map((l: any, i: number) => (
              <LessonRow
                key={l.id}
                lesson={l}
                modId={defaultModule.id}
                index={i}
                {...rowProps}
              />
            ))}
            {defaultModule && (
              <button
                onClick={() => addLesson(defaultModule.id)}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-slate-300 rounded-xl text-xs text-text-muted hover:text-text hover:border-accent/30 hover:bg-accent/5 transition-all mt-1"
              >
                <Plus size={12} /> Tambah Lesson Baru
              </button>
            )}
          </div>
        </div>
      )}

      {useChapters &&
        modules.map((mod, mi) => (
          <div
            key={mod.id}
            className="bg-card border border-slate-200 rounded-2xl overflow-hidden mb-4"
          >
            <div className="flex items-center gap-3 p-4 bg-surface/50">
              <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-xs font-bold text-accent-light shrink-0">
                {mi + 1}
              </div>
              <div className="flex-1 min-w-0">
                <input
                  className="w-full bg-transparent text-sm font-semibold outline-none border-b border-transparent focus:border-accent/50 py-0.5 text-text"
                  value={mod.title}
                  onChange={(e) =>
                    updateModule(mod.id, "title", e.target.value)
                  }
                  onBlur={() => saveModule(mod)}
                  placeholder={`Bab ${mi + 1}: Judul Bab`}
                />
                <input
                  className="w-full bg-transparent text-xs outline-none text-text-muted placeholder:text-text-dim mt-1"
                  value={mod.description || ""}
                  onChange={(e) =>
                    updateModule(mod.id, "description", e.target.value)
                  }
                  onBlur={() => saveModule(mod)}
                  placeholder="Deskripsi singkat bab ini (opsional)"
                />
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-text-dim text-xs hidden sm:block">
                  {mod.lessons.length} lesson
                </span>
                <button
                  onClick={() => addLesson(mod.id)}
                  className="p-1.5 rounded-lg hover:bg-accent/10 text-accent-light transition-all"
                  title="Tambah lesson"
                >
                  <Plus size={14} />
                </button>
                <button
                  onClick={() => deleteModule(mod.id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-dim hover:text-red-400 transition-all"
                  title="Hapus bab"
                >
                  <Trash2 size={14} />
                </button>
                <button
                  onClick={() =>
                    setExpanded((p) =>
                      p.includes(mod.id)
                        ? p.filter((x) => x !== mod.id)
                        : [...p, mod.id],
                    )
                  }
                  className="p-1.5 rounded-lg hover:bg-slate-50 text-text-dim transition-all"
                >
                  {expanded.includes(mod.id) ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
              </div>
            </div>
            {expanded.includes(mod.id) && (
              <div className="px-4 pb-4 pt-2 space-y-1.5">
                {mod.lessons.map((l: any, li: number) => (
                  <LessonRow
                    key={l.id}
                    lesson={l}
                    modId={mod.id}
                    index={li}
                    {...rowProps}
                  />
                ))}
                <button
                  onClick={() => addLesson(mod.id)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-slate-300 rounded-xl text-xs text-text-muted hover:text-text hover:border-accent/30 hover:bg-accent/5 transition-all"
                >
                  <Plus size={12} /> Tambah Lesson di Bab Ini
                </button>
              </div>
            )}
          </div>
        ))}

      {useChapters && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={addModule}
              className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-dashed border-accent/20 rounded-2xl text-sm text-accent-light hover:bg-accent/5 hover:border-accent/40 transition-all font-semibold"
            >
              <Plus size={16} /> Tambah Bab Baru
            </button>
            <button
              onClick={() => setShowPlaylistModal(true)}
              className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-dashed border-red-500/20 rounded-2xl text-sm text-red-100 hover:bg-red-500/5 hover:border-red-500/40 transition-all font-semibold"
            >
              <Video size={16} /> Impor Playlist YouTube
            </button>
          </div>

          {showPlaylistModal && (
            <div className="bg-card border border-red-500/20 rounded-2xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Video size={14} className="text-red-400" /> Impor Playlist
                  YouTube
                </h3>
                <button
                  onClick={() => setShowPlaylistModal(false)}
                  className="text-text-dim hover:text-accent"
                >
                  <X size={14} />
                </button>
              </div>
              <p className="text-xs text-text-muted">
                Masukkan link playlist YouTube. Semua video di dalamnya akan
                otomatis jadi lesson dalam satu Bab baru.
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="https://www.youtube.com/playlist?list=..."
                  className="flex-1"
                  value={playlistUrl}
                  onChange={(e) => setPlaylistUrl(e.target.value)}
                />
                <Button
                  loading={importingPlaylist}
                  onClick={handleImportPlaylist}
                  className="bg-red-600 hover:bg-red-700 text-white border-none shrink-0"
                >
                  Impor
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

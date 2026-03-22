import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { MyCourseCard } from "@/components/course/MyCourseCard";
import { ReviewForm } from "@/components/course/ReviewForm";
import {
  BookOpen,
  Star,
  Target,
  Play,
  ChevronRight,
  Flame,
  Award,
  Clock,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Dashboard | LearnFlow" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: enrolled } = await supabase
    .from("user_courses")
    .select(
      `enrolled_at, courses(id, title, products(id, title, thumbnail, categories(name)), modules(id, lessons(id, title, duration, video_url)))`,
    )
    .eq("user_id", user!.id)
    .order("enrolled_at", { ascending: false });

  const allLessonIds = (enrolled || []).flatMap(
    (uc: any) =>
      uc.courses?.modules?.flatMap((m: any) =>
        m.lessons.map((l: any) => l.id),
      ) || [],
  );

  const { data: progressData } = await supabase
    .from("progress")
    .select("lesson_id, completed_at, status, updated_at")
    .eq("user_id", user!.id)
    .in("lesson_id", allLessonIds.length ? allLessonIds : ["none"])
    .order("updated_at", { ascending: false });

  const completedSet = new Set(
    progressData?.filter((p: any) => p.status === "completed").map((p: any) => p.lesson_id) || []
  );

  // Today's progress (lessons completed today)
  const today = new Date().toISOString().slice(0, 10);
  const todayCount =
    progressData?.filter(
      (p: any) => p.status === "completed" && p.completed_at?.startsWith(today)
    ).length || 0;

  // Find next lesson to continue
  let nextLesson: any = null;
  let nextCourse: any = null;

  // 1. Try to find the most recently active lesson
  const latestProgress = (progressData as any[])?.[0];
  if (latestProgress) {
    const ucMatch = (enrolled || []).find((uc: any) =>
      uc.courses?.modules?.some((m: any) =>
        m.lessons.some((l: any) => l.id === latestProgress.lesson_id)
      )
    );

    if (ucMatch) {
      const course = (ucMatch as any).courses;
      const allLessonsInCourse = course.modules
        .sort((a: any, b: any) => a.order - b.order)
        .flatMap((m: any) => m.lessons.sort((a: any, b: any) => a.order - b.order));
      
      const currentIdx = allLessonsInCourse.findIndex((l: any) => l.id === latestProgress.lesson_id);
      
      if (latestProgress.status === 'started') {
        // Continue the one we just started
        nextLesson = allLessonsInCourse[currentIdx];
        nextCourse = course;
      } else if (latestProgress.status === 'completed') {
        // Move to the next one in this course
        if (currentIdx < allLessonsInCourse.length - 1) {
          nextLesson = allLessonsInCourse[currentIdx + 1];
          nextCourse = course;
        }
      }
    }
  }

  // 2. Fallback to current logic: first uncompleted lesson across all enrolled courses
  if (!nextLesson) {
    for (const uc of (enrolled as any[] || [])) {
      const course = uc.courses;
      if (!course) continue;
      
      const allLessonsInCourse = (course.modules || [])
        .sort((a: any, b: any) => a.order - b.order)
        .flatMap((m: any) => (m.lessons || []).sort((a: any, b: any) => a.order - b.order));

      for (const lesson of allLessonsInCourse) {
        if (!completedSet.has(lesson.id) && lesson.video_url) {
          nextLesson = lesson;
          nextCourse = course;
          break;
        }
      }
      if (nextLesson) break;
    }
  }

  // Reviews
  const productIds = (enrolled || [])
    .map((uc: any) => uc.courses?.products?.id)
    .filter(Boolean);
  const { data: existingReviews } = await supabase
    .from('reviews').select('product_id, rating, comment').eq('user_id', user!.id)
    .in('product_id', productIds.length ? productIds : ['none'])
  const reviewMap = new Map(existingReviews?.map((r: any) => [r.product_id, r]) || [])

  const totalLessons = allLessonIds.length;
  const completedLessons = completedSet.size;
  const overallProgress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const userName =
    user?.user_metadata?.full_name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "Kamu";

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-syne font-extrabold text-2xl sm:text-3xl mb-1">
              {todayCount > 0
                ? `Semangat, ${userName}! 🔥`
                : `Halo, ${userName}! 👋`}
            </h1>
            <p className="text-text-muted text-sm">
              {todayCount > 0
                ? `Kamu sudah menyelesaikan ${todayCount} lesson hari ini. Terus!`
                : nextLesson
                  ? "Lanjutkan belajar hari ini"
                  : "Mulai perjalanan belajarmu"}
            </p>
          </div>
          <Link
            href="/store"
            className="px-3 sm:px-4 py-2 bg-card border border-white/[0.07] rounded-xl text-xs sm:text-sm text-text-muted hover:text-[#EEEEFF] hover:border-accent/30 transition-all shrink-0 ml-3"
          >
            + Kursus
          </Link>
        </div>

        {/* ── TODAY'S LESSON WIDGET ── */}
        {nextLesson && nextCourse && (
          <div className="mb-8">
            <div className="relative overflow-hidden bg-gradient-to-br from-accent/20 via-accent/10 to-transparent border border-accent/30 rounded-2xl p-5 sm:p-6">
              {/* Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative grid sm:grid-cols-[1fr_auto] gap-5 items-center">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-accent/20 border border-accent/30 rounded-full">
                      <Target size={12} className="text-accent-light" />
                      <span className="text-accent-light text-xs font-bold">
                        Belajar Hari Ini
                      </span>
                    </div>
                    {todayCount > 0 && (
                      <div className="flex items-center gap-1 px-2.5 py-1 bg-cta/15 border border-cta/25 rounded-full">
                        <Flame size={12} className="text-cta" />
                        <span className="text-cta text-xs font-bold">
                          {todayCount} selesai
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-text-muted text-xs mb-1 font-medium">
                    {nextCourse.products?.title}
                  </p>
                  <h2 className="font-syne font-extrabold text-lg sm:text-xl mb-3 leading-tight">
                    {nextLesson.title}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-text-muted flex-wrap">
                    {nextLesson.duration > 0 && (
                      <span className="flex items-center gap-1">
                        <Clock size={11} />{" "}
                        {Math.floor(nextLesson.duration / 60)} menit
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <BookOpen size={11} /> {completedLessons}/{totalLessons}{" "}
                      lesson selesai
                    </span>
                  </div>
                </div>
                <Link
                  href={`/dashboard/course/${nextCourse.id}${nextLesson ? `?lesson=${nextLesson.id}` : ''}`}
                  className="flex items-center gap-2.5 px-5 py-3.5 bg-accent hover:bg-accent-light text-white font-syne font-bold text-sm rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-accent/25 shrink-0"
                >
                  <Play size={16} /> Mulai Belajar
                </Link>
              </div>

              {/* Overall progress bar */}
              <div className="relative mt-5 pt-4 border-t border-white/[0.07]">
                <div className="flex justify-between text-xs text-text-muted mb-2">
                  <span>Progress keseluruhan</span>
                  <span className="font-semibold text-accent-light">
                    {overallProgress}%
                  </span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full transition-all"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            {
              icon: BookOpen,
              value: enrolled?.length || 0,
              label: "Kursus",
              color: "text-accent-light",
              bg: "bg-accent/10",
            },
            {
              icon: Award,
              value: completedLessons,
              label: "Lesson ✓",
              color: "text-green-400",
              bg: "bg-green-500/10",
            },
            {
              icon: Star,
              value: existingReviews?.length || 0,
              label: "Review",
              color: "text-cta",
              bg: "bg-cta/10",
            },
          ].map(({ icon: Icon, value, label, color, bg }) => (
            <div
              key={label}
              className="bg-card border border-white/[0.07] rounded-2xl p-3 sm:p-5"
            >
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 ${bg} rounded-xl flex items-center justify-center mb-2 sm:mb-3`}
              >
                <Icon size={16} className={color} />
              </div>
              <div
                className={`font-syne font-extrabold text-xl sm:text-2xl ${color}`}
              >
                {value}
              </div>
              <div className="text-text-muted text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Course list */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-syne font-bold text-lg sm:text-xl">
            Kursus Saya
          </h2>
        </div>

        {(enrolled?.length || 0) > 0 ? (
          <div className="space-y-4">
            {(enrolled || []).map((uc: any) => {
              const course = uc.courses;
              if (!course) return null;
              const product = course.products;
              const total =
                course.modules?.reduce(
                  (s: number, m: any) => s + m.lessons.length,
                  0,
                ) || 0;
              const done =
                course.modules?.reduce(
                  (s: number, m: any) =>
                    s +
                    m.lessons.filter((l: any) => completedSet.has(l.id)).length,
                  0,
                ) || 0;
              const progress = total > 0 ? Math.round((done / total) * 100) : 0;
              const review = product?.id ? reviewMap.get(product.id) : null;

              // Find this course's next lesson
              let courseNextLesson: any = null;
              for (const mod of course.modules || []) {
                for (const lesson of mod.lessons || []) {
                  if (!completedSet.has(lesson.id)) {
                    courseNextLesson = lesson;
                    break;
                  }
                }
                if (courseNextLesson) break;
              }

              return (
                <div
                  key={course.id}
                  className="bg-card border border-white/[0.07] rounded-2xl overflow-hidden hover:border-white/[0.12] transition-all"
                >
                  <div className="flex flex-col sm:grid sm:grid-cols-[260px_1fr]">
                    <div className="p-4 sm:p-5 sm:border-r border-b sm:border-b-0 border-white/[0.07]">
                      <MyCourseCard
                        course={course}
                        progress={progress}
                        completedLessons={done}
                        totalLessons={total}
                      />
                      {/* Quick actions: Continue */}
                      {courseNextLesson && progress < 100 && (
                        <Link
                          href={`/dashboard/course/${course.id}${courseNextLesson ? `?lesson=${courseNextLesson.id}` : ''}`}
                          className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 bg-accent/10 hover:bg-accent/20 text-accent-light text-xs font-semibold rounded-xl transition-all"
                        >
                          <Play size={12} /> Lanjut:{" "}
                          {courseNextLesson.title.slice(0, 28)}
                          {courseNextLesson.title.length > 28 ? "..." : ""}
                        </Link>
                      )}
                    </div>

                    <div className="p-4 sm:p-5">
                      {progress > 0 ? (
                        <>
                          <p className="text-xs text-text-muted mb-3 font-semibold uppercase tracking-wider">
                            {review
                              ? "⭐ Rating kamu"
                              : "💬 Bagikan pengalamanmu"}
                          </p>
                          {!review && (
                            <p className="text-xs text-text-dim mb-3 leading-relaxed">
                              Review kamu bisa tampil di halaman kursus dan
                              membantu pelajar lain.
                            </p>
                          )}
                          {product?.id && (
                            <ReviewForm
                              productId={product.id}
                              existingReview={(review as any) || null}
                            />
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-center h-full">
                          <div className="text-3xl mb-3">📚</div>
                          <p className="text-text-muted text-sm font-semibold mb-1">
                            Mulai belajar dulu!
                          </p>
                          <p className="text-text-dim text-xs mb-3">
                            Selesaikan 1 lesson untuk beri rating.
                          </p>
                          {courseNextLesson && (
                            <Link
                              href={`/dashboard/course/${course.id}${courseNextLesson ? `?lesson=${courseNextLesson.id}` : ''}`}
                              className="flex items-center gap-1.5 px-4 py-2 bg-accent rounded-lg text-white text-xs font-semibold hover:bg-accent-light transition-all"
                            >
                              <Play size={12} /> Mulai Lesson Pertama
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 bg-card border border-white/[0.07] rounded-2xl">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="font-syne font-bold text-lg mb-2">
              Belum ada kursus
            </h3>
            <p className="text-text-muted text-sm mb-6">
              Mulai belajar dengan memilih kursus favoritmu
            </p>
            <Link
              href="/store"
              className="inline-flex items-center gap-2 px-5 py-3 bg-accent rounded-xl text-sm font-bold hover:bg-accent-light transition-all"
            >
              Explore Kursus →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

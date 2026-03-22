import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { CourseViewer } from "./CourseViewer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: course } = (await supabase
    .from("courses")
    .select("title")
    .eq("id", id)
    .single()) as any;

  return {
    title: course?.title || "Kursus",
  };
}

export default async function CourseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lesson?: string }>;
}) {
  const { id } = await params;
  const { lesson: lessonIdFromUrl } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: access } = await supabase
    .from("user_courses")
    .select("id")
    .eq("user_id", user!.id)
    .eq("course_id", id)
    .single();
  if (!access) {
    const { data: course } = await supabase
      .from("courses")
      .select("products(landing_pages(slug))")
      .eq("id", id)
      .single();
    const slug = (course as any)?.products?.landing_pages?.[0]?.slug;
    redirect(slug ? `/course/${slug}` : "/store");
  }

  const { data: course } = (await supabase
    .from("courses")
    .select(
      "id, title, use_chapters, products(title, thumbnail), modules(id, title, order, lessons(id, title, duration, order, video_url, description, notes, suggestions(id, title, url, type, icon)))",
    )
    .eq("id", id)
    .single()) as any;

  if (!course) notFound();
  course.modules.sort((a: any, b: any) => a.order - b.order);
  const allLessons = course.modules.flatMap((m: any) => {
    m.lessons.sort((a: any, b: any) => a.order - b.order);
    return m.lessons;
  });

  const allLessonIds = allLessons.map((l: any) => l.id);

  // Get progress to find completed and last touched
  const { data: prog } = await supabase
    .from("progress")
    .select("lesson_id, status, updated_at")
    .eq("user_id", user!.id)
    .in("lesson_id", allLessonIds);

  const completedSet = new Set(
    (prog as any)?.filter((p: any) => p.status === "completed").map((p: any) => p.lesson_id) || [],
  );

  // Determine initial lesson
  let initialLessonId = lessonIdFromUrl;

  if (!initialLessonId) {
    // Priority 1: Last updated/touched lesson
    const lastTouched = (prog as any[])?.sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    )[0];

    if (lastTouched) {
      initialLessonId = lastTouched.lesson_id;
    } else {
      // Priority 2: First incomplete lesson
      const firstIncomplete = allLessons.find((l: any) => !completedSet.has(l.id));
      initialLessonId = firstIncomplete?.id || allLessons[0]?.id;
    }
  }

  return (
    <CourseViewer
      course={course}
      initialLessonId={initialLessonId!}
      completedLessonIds={Array.from(completedSet) as any[]}
    />
  );
}

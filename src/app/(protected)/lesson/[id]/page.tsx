import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { LessonContent } from "./LessonContent";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: lesson } = (await supabase
    .from("lessons")
    .select(
      "*, suggestions(*), modules(id, title, course_id, courses(id, title, products(title), modules(id, title, order, lessons(id, title, duration, order))))",
    )
    .eq("id", id)
    .single()) as any;

  if (!lesson) notFound()
  const course = ((lesson as any).modules)?.courses
  if (!course) notFound()

  const { data: access } = await supabase
    .from("user_courses")
    .select("id")
    .eq("user_id", user!.id)
    .eq("course_id", course.id)
    .single();
  if (!access) redirect("/dashboard");

  const { data: prog } = await supabase
    .from("progress")
    .select("lesson_id")
    .eq("user_id", user!.id);
  const completedSet = new Set(prog?.map((p: any) => p.lesson_id) || []);

  const modules = [...(course.modules || [])].sort(
    (a: any, b: any) => a.order - b.order,
  );
  modules.forEach((m: any) =>
    m.lessons.sort((a: any, b: any) => a.order - b.order),
  );
  const allLessons = modules.flatMap((m: any) => m.lessons);
  const idx = allLessons.findIndex((l: any) => l.id === id);
  const prevLesson = idx > 0 ? allLessons[idx - 1] : null;
  const nextLesson = idx < allLessons.length - 1 ? allLessons[idx + 1] : null;

  return (
    <LessonContent
      lesson={lesson}
      course={{ ...course, modules }}
      prevLesson={prevLesson}
      nextLesson={nextLesson}
      isCompleted={completedSet.has(id)}
      completedLessonIds={Array.from(completedSet)}
    />
  );
}

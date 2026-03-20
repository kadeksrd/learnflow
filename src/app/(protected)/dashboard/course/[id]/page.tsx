import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { CourseViewer } from "./CourseViewer";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const supabase = await createClient();
  const { data: course } = await supabase
    .from("courses")
    .select("title")
    .eq("id", params.id)
    .single();

  return {
    title: course?.title || "Kursus",
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: access } = await supabase
    .from("user_courses")
    .select("id")
    .eq("user_id", user!.id)
    .eq("course_id", params.id)
    .single();
  if (!access) {
    const { data: course } = await supabase
      .from("courses")
      .select("products(landing_pages(slug))")
      .eq("id", params.id)
      .single();
    const slug = (course as any)?.products?.landing_pages?.[0]?.slug;
    redirect(slug ? `/course/${slug}` : "/store");
  }

  const { data: course } = (await supabase
    .from("courses")
    .select(
      "id, title, use_chapters, products(title, thumbnail), modules(id, title, order, lessons(id, title, duration, order, video_url, description, notes, suggestions(id, title, url, type, icon)))",
    )
    .eq("id", params.id)
    .single()) as any;

  if (!course) notFound();
  course.modules.sort((a: any, b: any) => a.order - b.order);
  course.modules.forEach((m: any) =>
    m.lessons.sort((a: any, b: any) => a.order - b.order),
  );

  const allLessonIds = course.modules.flatMap((m: any) =>
    m.lessons.map((l: any) => l.id),
  );
  const { data: prog } = await supabase
    .from("progress")
    .select("lesson_id")
    .eq("user_id", user!.id)
    .in("lesson_id", allLessonIds);
  const completedSet = new Set(
    (prog as any)?.map((p: any) => p.lesson_id) || [],
  );
  const firstIncomplete = course.modules
    .flatMap((m: any) => m.lessons)
    .find((l: any) => !completedSet.has(l.id));
  const firstLessonId =
    firstIncomplete?.id || course.modules[0]?.lessons[0]?.id;

  return (
    <CourseViewer
      course={course}
      initialLessonId={firstLessonId}
      completedLessonIds={Array.from(completedSet) as any[]}
    />
  );
}

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { CourseBuilderClient } from "./CourseBuilderClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function CourseBuilderPage({
  params,
}: {
  params: { courseId: string };
}) {
  const supabase = await createClient();
  const { data: course } = (await supabase
    .from("courses")
    .select(
      `
      id, title, description, use_chapters,
      products(id, title),
      modules(
        id, title, description, order,
        lessons(id, title, description, video_url, duration, notes, order)
      )
    `,
    )
    .eq("id", params.courseId)
    .single()) as any;

  if (!course) notFound();

  // Sort by order
  const sorted = {
    ...course,
    use_chapters: course.use_chapters !== false, // default true
    modules: (course.modules || [])
      .sort((a: any, b: any) => a.order - b.order)
      .map((m: any) => ({
        ...m,
        lessons: [...m.lessons].sort((a: any, b: any) => a.order - b.order),
      })),
  };

  return (
    <div className="p-4 sm:p-8">
      {/* Back */}
      <div className="mb-6">
        <Link
          href="/admin/courses"
          className="flex items-center gap-1.5 text-sm text-text-muted hover:text-[#EEEEFF] transition-colors w-fit mb-4"
        >
          <ArrowLeft size={14} /> Kembali ke Daftar Kursus
        </Link>
        <h1 className="font-syne font-extrabold text-xl sm:text-2xl mb-1">
          Course Builder
        </h1>
        <p className="text-text-muted text-sm">
          {(course.products as any)?.title}
        </p>
      </div>
      <CourseBuilderClient course={sorted} />
    </div>
  );
}

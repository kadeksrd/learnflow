import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { CertificatePage } from "./CertificatePage";

export default async function CertificateRoute({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: access } = (await supabase
    .from("user_courses")
    .select("enrolled_at")
    .eq("user_id", user!.id)
    .eq("course_id", courseId)
    .single()) as any;
  if (!access) redirect("/dashboard");

  const { data: course } = await supabase
    .from("courses")
    .select("id, title, products(title), modules(lessons(id))")
    .eq("id", courseId)
    .single();
  if (!course) notFound();

  const allIds = ((course as any).modules as []).flatMap((m: any) =>
    m.lessons.map((l: any) => l.id),
  );
  const { data: prog } = await supabase
    .from("progress")
    .select("lesson_id")
    .eq("user_id", user!.id)
    .eq("status", "completed")
    .in("lesson_id", allIds.length ? allIds : ["none"]);

  if (!allIds.length || (prog?.length || 0) < allIds.length)
    redirect(`/dashboard/course/${courseId}`);

  return (
    <CertificatePage
      user={user!}
      course={course}
      enrolledAt={access.enrolled_at}
    />
  );
}

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { CertificatePage } from './CertificatePage'

export default async function CertificateRoute({ params }: { params: { courseId: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: access } = await supabase.from('user_courses').select('enrolled_at').eq('user_id', user!.id).eq('course_id', params.courseId).single()
  if (!access) redirect('/dashboard')

  const { data: course } = await supabase.from('courses')
    .select('id, title, products(title), modules(lessons(id))')
    .eq('id', params.courseId).single()
  if (!course) notFound()

  const allIds = (course.modules as any[]).flatMap((m: any) => m.lessons.map((l: any) => l.id))
  const { data: prog } = await supabase.from('progress').select('lesson_id').eq('user_id', user!.id).eq('status', 'completed').in('lesson_id', allIds.length ? allIds : ['none'])

  if (!allIds.length || (prog?.length || 0) < allIds.length) redirect(`/dashboard/course/${params.courseId}`)

  return <CertificatePage user={user!} course={course} enrolledAt={access.enrolled_at} />
}

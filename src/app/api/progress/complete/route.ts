import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { lesson_id } = await request.json()
    if (!lesson_id) return NextResponse.json({ message: 'lesson_id diperlukan' }, { status: 400 })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { data: lesson } = await supabase.from('lessons').select('id, modules(course_id)').eq('id', lesson_id).single()
    if (!lesson) return NextResponse.json({ message: 'Lesson tidak ditemukan' }, { status: 404 })

    const courseId = (lesson.modules as any)?.course_id
    const { data: access } = await supabase.from('user_courses').select('id').eq('user_id', user.id).eq('course_id', courseId).single()
    if (!access) return NextResponse.json({ message: 'Tidak punya akses' }, { status: 403 })

    const admin = await createAdminClient()
    await admin.from('progress').upsert(
      { user_id: user.id, lesson_id, status: 'completed', completed_at: new Date().toISOString() },
      { onConflict: 'user_id,lesson_id' }
    )

    return NextResponse.json({ message: 'Progress tersimpan!' })
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser, unauthorized, dbError, createAdminClient } from '@/lib/api-helpers'

export async function GET(req: NextRequest) {
  if (!await getAdminUser()) return unauthorized()
  const lessonId = req.nextUrl.searchParams.get('lesson_id')
  const s = await createAdminClient()
  let query = s.from('suggestions').select('*').order('created_at', { ascending: false })
  if (lessonId) query = query.eq('lesson_id', lessonId)
  const { data, error } = await query
  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (!await getAdminUser()) return unauthorized()
  const s = await createAdminClient()
  const { data, error } = await s.from('suggestions').insert(await req.json()).select().single()
  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

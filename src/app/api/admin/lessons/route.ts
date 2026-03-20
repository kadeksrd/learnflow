import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser, unauthorized, dbError, createAdminClient } from '@/lib/api-helpers'

export async function POST(req: NextRequest) {
  if (!await getAdminUser()) return unauthorized()
  const s = await createAdminClient()
  const { data, error } = await s.from('lessons').insert(await req.json()).select().single()
  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

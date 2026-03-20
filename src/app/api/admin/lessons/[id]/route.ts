import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser, unauthorized, dbError, createAdminClient } from '@/lib/api-helpers'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await getAdminUser()) return unauthorized()
  const s = await createAdminClient()
  const { data, error } = await s.from('lessons').update(await req.json()).eq('id', params.id).select().single()
  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await getAdminUser()) return unauthorized()
  const s = await createAdminClient()
  await s.from('lessons').delete().eq('id', params.id)
  return NextResponse.json({ message: 'Deleted' })
}

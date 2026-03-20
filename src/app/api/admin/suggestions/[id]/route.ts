import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser, unauthorized, dbError, createAdminClient } from '@/lib/api-helpers'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!await getAdminUser()) return unauthorized()

  const s = await createAdminClient()
  const { error } = await s.from('suggestions').delete().eq('id', params.id)

  if (error) return dbError(error)
  return NextResponse.json({ message: 'Deleted' })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!await getAdminUser()) return unauthorized()

  const body = await req.json()
  const s = await createAdminClient()
  const { data, error } = await s
    .from('suggestions')
    .update(body)
    .eq('id', params.id)
    .select()
    .single()

  if (error) return dbError(error)
  return NextResponse.json(data)
}

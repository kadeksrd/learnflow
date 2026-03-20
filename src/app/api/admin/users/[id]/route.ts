import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser, unauthorized, dbError, createAdminClient } from '@/lib/api-helpers'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!await getAdminUser()) return unauthorized()
  
  const { role } = await req.json()
  if (!role) return NextResponse.json({ message: 'Role is required' }, { status: 400 })

  const s = await createAdminClient()
  
  // Update user_metadata in auth.users
  const { data, error } = await s.auth.admin.updateUserById(id, {
    user_metadata: { role }
  })

  if (error) return dbError(error)
  return NextResponse.json(data.user)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!await getAdminUser()) return unauthorized()

  const s = await createAdminClient()
  const { error } = await s.auth.admin.deleteUser(id)

  if (error) return dbError(error)
  return NextResponse.json({ message: 'User deleted successfully' })
}

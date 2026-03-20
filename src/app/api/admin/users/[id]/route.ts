import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser, unauthorized, dbError, createAdminClient } from '@/lib/api-helpers'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!await getAdminUser()) return unauthorized()
  
  const { role, email } = await req.json()

  const s = await createAdminClient()
  
  // Update user in auth.users
  const { data, error } = await s.auth.admin.updateUserById(id, {
    email,
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

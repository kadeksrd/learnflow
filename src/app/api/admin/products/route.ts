import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser, unauthorized, dbError, createAdminClient } from '@/lib/api-helpers'

export async function POST(req: NextRequest) {
  if (!await getAdminUser()) return unauthorized()
  const body = await req.json()
  const s = await createAdminClient()
  
  const { data, error } = await s.from('products').insert(body).select().single()
  if (error) return NextResponse.json({ message: error.message }, { status: 500 })

  // Auto-create course linked to this product
  if (data) {
    await s.from('courses').insert({ product_id: data.id, title: data.title })
  }

  // Return with flag so frontend can redirect to landing page editor
  return NextResponse.json({ ...data, redirect_to_landing: true }, { status: 201 })
}

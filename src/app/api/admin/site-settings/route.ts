import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser, unauthorized, dbError, createClient, createAdminClient } from '@/lib/api-helpers'

// ... (GET logic stays same)
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  const s = await createClient()
  
  let query = s.from('site_settings').select('key, value, updated_at')
  if (key) query = query.eq('key', key)
  
  const { data, error } = await query
  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// PATCH /api/admin/site-settings
export async function PATCH(req: NextRequest) {
  const user = await getAdminUser()
  if (!user) return unauthorized()
  
  const { key, value } = await req.json()
  if (!key || !value) return NextResponse.json({ message: 'key and value required' }, { status: 400 })
  
  const s = await createAdminClient()
  const { data, error } = await s
    .from('site_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() } as any, { onConflict: 'key' })
    .select()
    .single() as any
  
  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json(data)
}

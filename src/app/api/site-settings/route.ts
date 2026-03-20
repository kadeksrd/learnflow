import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  const s = await createClient()
  let query = s.from('site_settings').select('key, value')
  if (key) query = query.eq('key', key)
  const { data, error } = await query
  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  // Return as flat map: { homepage: {...}, store: {...} }
  const map: Record<string, any> = {}
  for (const row of (data || [])) map[row.key] = row.value
  if (key) return NextResponse.json(map[key] || {})
  return NextResponse.json(map)
}

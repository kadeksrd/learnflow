import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { product_id } = await request.json()
    if (!product_id) return NextResponse.json({ message: 'product_id diperlukan' }, { status: 400 })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ message: 'Login dulu ya!' }, { status: 401 })

    const { data: product } = await supabase
      .from('products')
      .select('id, is_free, title, courses(id)')
      .eq('id', product_id)
      .eq('is_published', true)
      .single()

    if (!product) return NextResponse.json({ message: 'Produk tidak ditemukan' }, { status: 404 })
    if (!product.is_free) return NextResponse.json({ message: 'Produk ini berbayar, gunakan checkout' }, { status: 400 })

    const courseId = (product.courses as any)?.[0]?.id
    if (!courseId) return NextResponse.json({ message: 'Kursus belum tersedia' }, { status: 404 })

    // Cek sudah terdaftar
    const { data: existing } = await supabase
      .from('user_courses').select('id').eq('user_id', user.id).eq('course_id', courseId).single()
    if (existing) return NextResponse.json({ message: 'Sudah terdaftar!', already_enrolled: true }, { status: 200 })

    // Enroll
    const admin = await createAdminClient()
    const { error } = await admin.from('user_courses').insert({ user_id: user.id, course_id: courseId })
    if (error) return NextResponse.json({ message: 'Gagal mendaftar' }, { status: 500 })

    return NextResponse.json({ message: 'Berhasil mendaftar!', course_id: courseId })
  } catch (e) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

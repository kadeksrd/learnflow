import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/reviews?product_id=xxx  — top 5 reviews untuk landing page
export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get('product_id')
  if (!productId) return NextResponse.json({ message: 'product_id required' }, { status: 400 })

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('reviews')
    .select('id, rating, comment, created_at, user_id')
    .eq('product_id', productId)
    .eq('is_visible', true)
    .order('rating', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) return NextResponse.json({ message: error.message }, { status: 500 })

  // Ambil nama user (dari auth.users metadata) — pakai admin client
  const admin = await createAdminClient()
  const enriched = await Promise.all((data || []).map(async review => {
    try {
      const { data: userData } = await admin.auth.admin.getUserById(review.user_id)
      const meta = userData.user?.user_metadata || {}
      return {
        ...review,
        user_name: meta.full_name || userData.user?.email?.split('@')[0] || 'Pengguna',
        user_avatar: meta.avatar_url || null,
      }
    } catch {
      return { ...review, user_name: 'Pengguna', user_avatar: null }
    }
  }))

  return NextResponse.json(enriched)
}

// POST /api/reviews  — submit atau update review
export async function POST(request: NextRequest) {
  try {
    const { product_id, rating, comment } = await request.json()

    if (!product_id || !rating) {
      return NextResponse.json({ message: 'product_id dan rating wajib diisi' }, { status: 400 })
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ message: 'Rating harus antara 1-5' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ message: 'Login dulu ya' }, { status: 401 })

    // Cek user sudah enroll kursus ini
    const { data: product } = await supabase
      .from('products')
      .select('id, courses(id)')
      .eq('id', product_id)
      .single()

    const courseId = (product?.courses as any)?.[0]?.id
    if (!courseId) return NextResponse.json({ message: 'Produk tidak ditemukan' }, { status: 404 })

    const { data: access } = await supabase
      .from('user_courses')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single()

    if (!access) {
      return NextResponse.json({ message: 'Kamu belum enroll kursus ini' }, { status: 403 })
    }

    // Upsert review
    const admin = await createAdminClient()
    const { data, error } = await admin
      .from('reviews')
      .upsert({
        user_id: user.id,
        product_id,
        rating,
        comment: comment?.trim() || null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,product_id' })
      .select()
      .single()

    if (error) return NextResponse.json({ message: error.message }, { status: 500 })
    return NextResponse.json(data)

  } catch (e) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

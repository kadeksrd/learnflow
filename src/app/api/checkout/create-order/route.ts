import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { createXenditInvoice, createMidtransTransaction, createDokuPayment } from '@/lib/payment/gateways'

export async function POST(request: NextRequest) {
  try {
    const { product_id, gateway } = await request.json()
    if (!product_id || !gateway) return NextResponse.json({ message: 'product_id dan gateway diperlukan' }, { status: 400 })
    if (!['xendit','midtrans','doku'].includes(gateway)) return NextResponse.json({ message: 'Gateway tidak valid' }, { status: 400 })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { data: product } = await supabase.from('products').select('*, courses(id)').eq('id', product_id).eq('is_published', true).single()
    if (!product) return NextResponse.json({ message: 'Produk tidak ditemukan' }, { status: 404 })
    if (product.is_free) return NextResponse.json({ message: 'Gunakan /api/enroll untuk kursus gratis' }, { status: 400 })

    const courseId = (product.courses as any)?.[0]?.id
    if (courseId) {
      const { data: owned } = await supabase.from('user_courses').select('id').eq('user_id', user.id).eq('course_id', courseId).single()
      if (owned) return NextResponse.json({ message: 'Kamu sudah memiliki kursus ini', already_owned: true }, { status: 409 })
    }

    const admin = await createAdminClient()
    const { data: order, error: orderErr } = await admin.from('orders').insert({
      user_id: user.id, product_id: product.id, amount: product.price, status: 'pending', gateway,
    }).select().single()
    if (orderErr || !order) return NextResponse.json({ message: 'Gagal membuat order' }, { status: 500 })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL!
    const p = {
      orderId: order.id, amount: product.price, description: product.title,
      customerEmail: user.email!, customerName: user.user_metadata?.full_name || user.email!,
      successUrl: `${appUrl}/payment/success?order_id=${order.id}`,
      failureUrl: `${appUrl}/payment/failed?order_id=${order.id}`,
    }

    let paymentUrl: string
    if (gateway === 'xendit') paymentUrl = await createXenditInvoice(p)
    else if (gateway === 'midtrans') paymentUrl = await createMidtransTransaction(p)
    else paymentUrl = await createDokuPayment(p)

    return NextResponse.json({ payment_url: paymentUrl, order_id: order.id })
  } catch (e: any) {
    return NextResponse.json({ message: e.message || 'Server error' }, { status: 500 })
  }
}

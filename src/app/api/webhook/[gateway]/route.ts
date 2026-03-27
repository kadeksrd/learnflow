import { createAdminClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { verifyXenditWebhook, verifyMidtransWebhook } from '@/lib/payment/gateways'
import { headers } from 'next/headers'

export const runtime = 'nodejs'

export async function POST(request: NextRequest, { params }: { params: Promise<{ gateway: string }> }) {
  const { gateway } = await params
  const body = await request.json()
  const headersList = await headers()

  let orderId: string | null = null
  let paymentStatus: 'paid' | 'failed' | 'expired' | null = null
  let paymentRef: string | null = null

  try {
    if (gateway === 'xendit') {
      const token = headersList.get('x-callback-token') || ''
      if (!verifyXenditWebhook(token)) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
      }
      orderId = body.external_id
      paymentRef = body.id
      if (body.status === 'PAID') paymentStatus = 'paid'
      else if (body.status === 'EXPIRED') paymentStatus = 'expired'

    } else if (gateway === 'midtrans') {
      if (!verifyMidtransWebhook(body.order_id, body.status_code, body.gross_amount, body.signature_key)) {
        return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
      }
      orderId = body.order_id
      paymentRef = body.transaction_id
      if (['capture','settlement'].includes(body.transaction_status)) paymentStatus = 'paid'
      else if (['cancel','deny','failure'].includes(body.transaction_status)) paymentStatus = 'failed'
      else if (body.transaction_status === 'expire') paymentStatus = 'expired'

    } else if (gateway === 'doku') {
      orderId = body.order?.invoice_number
      paymentRef = body.transaction?.date
      if (body.transaction?.status === 'SUCCESS') paymentStatus = 'paid'
      else if (body.transaction?.status === 'FAILED') paymentStatus = 'failed'
    }

    if (!orderId || !paymentStatus) return NextResponse.json({ message: 'OK - skipped' })

    const supabase = (await createAdminClient()) as any
    const { data: order } = await supabase.from('orders').select('*, products(id, courses(id))').eq('id', orderId).single()
    if (!order) return NextResponse.json({ message: 'Order not found' })
    if (order.status === 'paid') return NextResponse.json({ message: 'Already processed' })

    const updateData = {
      status: paymentStatus,
      payment_ref: paymentRef,
      paid_at: paymentStatus === 'paid' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }

    await supabase.from('orders').update(updateData).eq('id', orderId)

    if (paymentStatus === 'paid') {
      const courseId = order.products?.courses?.[0]?.id
      if (courseId) {
        await supabase.from('user_courses').upsert(
          { user_id: order.user_id, course_id: courseId },
          { onConflict: 'user_id,course_id', ignoreDuplicates: true }
        )
      }
    }

    return NextResponse.json({ message: 'OK' })
  } catch (e) {
    return NextResponse.json({ message: 'Error handled' }) // Always 200
  }
}

export interface PaymentParams {
  orderId: string; amount: number; description: string
  customerEmail: string; customerName: string; successUrl: string; failureUrl: string
}

export async function createXenditInvoice(params: PaymentParams): Promise<string> {
  const res = await fetch('https://api.xendit.co/v2/invoices', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(process.env.XENDIT_SECRET_KEY! + ':').toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      external_id: params.orderId, amount: params.amount, description: params.description,
      payer_email: params.customerEmail,
      customer: { given_names: params.customerName, email: params.customerEmail },
      success_redirect_url: params.successUrl, failure_redirect_url: params.failureUrl,
      currency: 'IDR',
      payment_methods: ['BCA','BNI','BRI','MANDIRI','OVO','DANA','GOPAY','QRIS'],
      invoice_duration: 86400,
    }),
  })
  if (!res.ok) { const e = await res.json(); throw new Error(`Xendit: ${e.message}`) }
  return (await res.json()).invoice_url
}

export function verifyXenditWebhook(token: string): boolean {
  return token === process.env.XENDIT_WEBHOOK_TOKEN
}

export async function createMidtransTransaction(params: PaymentParams): Promise<string> {
  const isSandbox = process.env.MIDTRANS_SERVER_KEY?.startsWith('SB-')
  const url = isSandbox
    ? 'https://app.sandbox.midtrans.com/snap/v1/transactions'
    : 'https://app.midtrans.com/snap/v1/transactions'
  const auth = Buffer.from(process.env.MIDTRANS_SERVER_KEY! + ':').toString('base64')
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      transaction_details: { order_id: params.orderId, gross_amount: params.amount },
      customer_details: { email: params.customerEmail, first_name: params.customerName },
      callbacks: { finish: params.successUrl, error: params.failureUrl },
      expiry: { unit: 'hours', duration: 24 },
    }),
  })
  if (!res.ok) throw new Error(`Midtrans: ${await res.text()}`)
  return (await res.json()).redirect_url
}

export function verifyMidtransWebhook(orderId: string, statusCode: string, grossAmount: string, sig: string): boolean {
  const crypto = require('crypto')
  const expected = crypto.createHash('sha512').update(`${orderId}${statusCode}${grossAmount}${process.env.MIDTRANS_SERVER_KEY}`).digest('hex')
  return sig === expected
}

export async function createDokuPayment(params: PaymentParams): Promise<string> {
  const crypto = require('crypto')
  const ts = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')
  const target = '/checkout/v1/payment'
  const bodyObj = {
    order: { amount: params.amount, invoice_number: params.orderId, line_items: [{ name: params.description, price: params.amount, quantity: 1 }] },
    payment: { payment_due_date: 60, url_complete_payment: params.successUrl },
    customer: { name: params.customerName, email: params.customerEmail },
  }
  const digest = crypto.createHash('sha256').update(JSON.stringify(bodyObj)).digest('base64')
  const rawSig = `Client-Id:${process.env.DOKU_CLIENT_ID}\nRequest-Id:${params.orderId}\nRequest-Timestamp:${ts}\nRequest-Target:${target}\nDigest:${digest}`
  const signature = `HMACSHA256=${crypto.createHmac('sha256', process.env.DOKU_SECRET_KEY!).update(rawSig).digest('base64')}`
  const res = await fetch(`https://api-sandbox.doku.com${target}`, {
    method: 'POST',
    headers: { 'Client-Id': process.env.DOKU_CLIENT_ID!, 'Request-Id': params.orderId, 'Request-Timestamp': ts, Signature: signature, 'Content-Type': 'application/json' },
    body: JSON.stringify(bodyObj),
  })
  if (!res.ok) throw new Error(`DOKU: ${await res.text()}`)
  return (await res.json()).response.payment.url
}

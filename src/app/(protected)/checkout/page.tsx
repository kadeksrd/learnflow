import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CheckoutContent } from './CheckoutContent'

export default async function CheckoutPage({ searchParams }: { searchParams: { product_id?: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/checkout')

  const productId = searchParams.product_id
  if (!productId) redirect('/store')

  const [{ data: product }, { data: paySetting }] = await Promise.all([
    supabase.from('products').select('*, categories(name)').eq('id', productId).single(),
    supabase.from('site_settings').select('value').eq('key', 'payment').single(),
  ])
  if (!product) redirect('/store')

  const payConfig = paySetting?.value || {}
  const enabledGateways = (payConfig.active_gateways || ['xendit']).filter((gw: string) => (payConfig[gw] as any)?.enabled)

  return (
    <CheckoutContent
      product={product}
      user={user}
      enabledGateways={enabledGateways}
      gatewayConfig={payConfig}
      defaultGateway={payConfig.default_gateway || enabledGateways[0] || 'xendit'}
    />
  )
}

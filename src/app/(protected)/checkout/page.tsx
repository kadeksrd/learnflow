import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CheckoutContent } from "./CheckoutContent";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ product_id?: string }>;
}) {
  const { product_id: productId } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/checkout");

  if (!productId) redirect("/store");

  const results = await Promise.all([
    supabase
      .from("products")
      .select("*, categories(name)")
      .eq("id", productId)
      .single(),
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "payment")
      .single(),
  ]);

  const product = results[0].data as any;
  const paySetting = results[1].data as any;

  if (!product) redirect("/store");

  const payConfig = paySetting?.value || {};
  const enabledGateways = (payConfig.active_gateways || ["xendit"]).filter(
    (gw: string) => (payConfig[gw] as any)?.enabled,
  );

  return (
    <CheckoutContent
      product={product}
      user={user}
      enabledGateways={enabledGateways}
      gatewayConfig={payConfig}
      defaultGateway={
        payConfig.default_gateway || enabledGateways[0] || "xendit"
      }
    />
  );
}

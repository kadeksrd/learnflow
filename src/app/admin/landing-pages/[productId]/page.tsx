import { createClient } from "@/lib/supabase/server";
import { LandingPageEditor } from "./LandingPageEditor";

export const dynamic = "force-dynamic";

export default async function EditLandingPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const supabase = await createClient();
  const [{ data: product }, { data: landingPage }] = await Promise.all([
    supabase
      .from("products")
      .select("id, title, is_free")
      .eq("id", productId)
      .single(),
    supabase
      .from("landing_pages")
      .select("*")
      .eq("product_id", productId)
      .single(),
  ]) as any;
  if (!product)
    return <div className="p-8 text-text-muted">Produk tidak ditemukan</div>;
  return (
    <div className="p-4 sm:p-8">
      <h1 className="font-syne font-extrabold text-2xl mb-2">
        Landing Page Editor
      </h1>
      <p className="text-text-muted text-sm mb-8">
        Produk: <span className="text-accent-light">{product.title}</span>
      </p>
      <LandingPageEditor product={product} landingPage={landingPage} />
    </div>
  );
}

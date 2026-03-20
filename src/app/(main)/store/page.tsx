import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { StoreClient } from "./StoreClient";
import { Sparkles, BookOpen } from "lucide-react";

async function getStoreData() {
  const supabase = await createClient();
  const results = await Promise.all([
    supabase
      .from("products")
      .select(
        "*, categories(id,name,slug), landing_pages(slug), courses(id, modules(id, lessons(id)))",
      )
      .eq("is_published", true)
      .order("created_at", { ascending: false }),
    supabase.from("categories").select("*").order("name"),
    supabase.from("site_settings").select("value").eq("key", "store").single(),
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "seo_global")
      .single(),
  ]);

  const products = results[0].data;
  const categories = results[1].data;
  const storeSetting = results[2].data as any;
  const seoSetting = results[3].data as any;

  return {
    products: products || [],
    categories: categories || [],
    store: storeSetting?.value || {},
    seoGlobal: seoSetting?.value || {},
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const results = await Promise.all([
    supabase.from("site_settings").select("value").eq("key", "store").single(),
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "seo_global")
      .single(),
  ]);

  const storeData = results[0].data as any;
  const seoData = results[1].data as any;

  const store = storeData?.value || {};
  const seo = seoData?.value || {};
  const siteName = seo.site_name || "LearnFlow";

  const title = `Semua Kursus | ${siteName}`;
  const description =
    store.subheadline ||
    `Temukan kursus digital terbaik di ${siteName}. Belajar kapan saja, di mana saja.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: seo.og_image ? [{ url: seo.og_image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function StorePage() {
  const { products, categories, store, seoGlobal } = await getStoreData();

  const badge = store.badge || "Marketplace Kursus";
  const headline = store.headline || "Tingkatkan Skill Kamu";
  const headline_accent = store.headline_accent || "Mulai Sekarang";
  const subheadline =
    store.subheadline || `${products.length} kursus dari instruktur terpercaya`;
  const show_stats = store.show_stats !== false;

  const freeCount = products.filter((p: any) => p.is_free).length;
  const paidCount = products.filter((p: any) => !p.is_free).length;

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-white/[0.05]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-accent/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent-light text-xs font-bold mb-4">
            <Sparkles size={11} /> {badge}
          </div>
          <h1 className="font-syne font-extrabold text-3xl sm:text-4xl lg:text-5xl mb-3">
            {headline}
            <br className="hidden sm:block" />
            <span className="text-gradient"> {headline_accent}</span>
          </h1>
          <p className="text-text-muted text-sm sm:text-base mb-6 sm:mb-8 max-w-xl">
            {subheadline}
          </p>

          {show_stats && (
            <div
              className="flex gap-4 sm:gap-6 overflow-x-auto pb-1"
              style={{ scrollbarWidth: "none" }}
            >
              {[
                {
                  icon: BookOpen,
                  value: `${products.length}+`,
                  label: "Total Kursus",
                },
                {
                  icon: Sparkles,
                  value: `${freeCount}`,
                  label: "Kursus Gratis",
                },
                {
                  icon: BookOpen,
                  value: `${paidCount}`,
                  label: "Kursus Premium",
                },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-2 shrink-0">
                  <Icon size={14} className="text-accent-light" />
                  <span className="text-sm font-medium">
                    <span className="text-[#EEEEFF] font-bold">{value}</span>
                    <span className="text-text-muted ml-1">{label}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <StoreClient initialProducts={products} categories={categories} />
    </div>
  );
}

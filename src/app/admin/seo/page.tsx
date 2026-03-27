import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { GlobalSEOEditor } from "./GlobalSEOEditor";

export const metadata: Metadata = { title: "SEO Global — Admin LearnFlow" };

export default async function SeoPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "seo_global")
    .single();

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold mb-4">
          🔍 SEO Global
        </div>
        <h1 className="font-syne font-extrabold text-2xl mb-2">
          Pengaturan SEO Global
        </h1>
        <p className="text-text-muted text-sm max-w-xl">
          Berlaku untuk seluruh website — homepage, store, dan semua halaman
          yang tidak punya SEO custom. Setiap landing page kursus bisa override
          ini dari tab <strong className="text-text">SEO & Meta</strong> di
          editor landing page.
        </p>
      </div>
      <GlobalSEOEditor initialSettings={data?.value || {}} />
    </div>
  );
}

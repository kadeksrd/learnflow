import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLandingPagesPage() {
  const supabase = createClient();
  const { data: pages } = await supabase
    .from("landing_pages")
    .select("*, products(title, thumbnail)")
    .order("created_at", { ascending: false });

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-syne font-extrabold text-2xl mb-1">
            Landing Pages
          </h1>
          <p className="text-text-muted text-sm">
            {pages?.length || 0} landing page terdaftar
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {pages?.map((page) => (
          <div
            key={page.id}
            className="flex items-center gap-4 p-5 bg-card border border-white/[0.07] rounded-2xl hover:border-accent/30 transition-all"
          >
            <div className="w-14 h-10 rounded-lg bg-surface flex items-center justify-center overflow-hidden shrink-0">
              {(page.products as any)?.thumbnail ? (
                <img
                  src={(page.products as any).thumbnail}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl">📄</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">
                {(page.products as any)?.title}
              </div>
              <div className="text-text-muted text-xs mt-0.5">
                /course/{page.slug}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link
                href={`/course/${page.slug}`}
                target="_blank"
                className="px-3 py-1.5 rounded-lg border border-white/[0.07] text-xs text-text-muted hover:text-[#EEEEFF] transition-all"
              >
                Preview
              </Link>
              <Link
                href={`/admin/landing-pages/${page.product_id}`}
                className="px-3 py-1.5 rounded-lg border border-accent/30 text-xs text-accent-light hover:bg-accent/10 transition-all"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
        {!pages?.length && (
          <div className="text-center py-16 text-text-muted">
            <p>
              Belum ada landing page. Buat produk dulu, lalu edit landing
              page-nya di sini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

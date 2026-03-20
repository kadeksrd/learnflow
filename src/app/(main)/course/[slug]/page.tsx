import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { LandingPageContent } from "./LandingPageContent";
import { LandingPagePixels } from "./LandingPagePixels";
import type { Benefit, Testimonial, Database } from "@/types/database";

// Fungsi bypass cookies agar tidak error saat build/prerender
// Menggunakan @supabase/supabase-js agar tidak ada overhead cookie management saat build
const getStaticSupabase = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

export async function generateStaticParams() {
  const supabase = getStaticSupabase();
  const { data } = await supabase
    .from("landing_pages")
    .select("slug")
    .limit(100);
  return ((data as any[]) || []).map((lp) => ({ slug: lp.slug }));
}

async function getData(slug: string) {
  const supabase = getStaticSupabase();
  const { data: lp, error } = (await supabase
    .from("landing_pages")
    .select(
      `*,
      products(
        *,
        categories(name,slug),
        courses(
          id, title, use_chapters, description,
          modules(id, title, description, order,
            lessons(id, title, duration, order)
          )
        )
      )
    `,
    )
    .eq("slug", slug)
    .single()) as any;

  if (error || !lp) return null;
  const product = lp.products as any;
  if (!product?.is_published) return null;

  const course = (product.courses as any[])?.[0];
  if (course) {
    // Sort modules and lessons safely
    if (Array.isArray(course.modules)) {
      course.modules.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
      course.modules.forEach((m: any) => {
        if (Array.isArray(m.lessons)) {
          m.lessons.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        }
      });
    }
  }
  return { lp, product, course };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const d = await getData(params.slug);
  if (!d) return { title: "Kursus tidak ditemukan" };

  const { lp, product } = d;

  const title = lp.seo_title || lp.headline || product.title;
  const description =
    lp.seo_description || lp.subheadline || product.description || "";
  const ogImage = lp.og_image || lp.hero_image || product.thumbnail || "";

  return {
    title,
    description,
    keywords: lp.seo_keywords || undefined,
    robots: lp.robots || "index,follow",
    alternates: {
      canonical:
        lp.canonical_url || `https://learnflow.id/course/${params.slug}`,
    },
    openGraph: {
      type: "website",
      title: lp.og_title || title,
      description: lp.og_description || description,
      images: ogImage ? [{ url: ogImage }] : [],
      url: `https://learnflow.id/course/${params.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: lp.og_title || title,
      description: lp.og_description || description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function CourseLandingPage({
  params,
}: {
  params: { slug: string };
}) {
  const d = await getData(params.slug);
  if (!d) notFound();

  const { lp, product, course } = d;

  return (
    <>
      {/* 1. JSON-LD Schema */}
      {lp.schema_markup && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: lp.schema_markup }}
        />
      )}

      {/* 2. Pixel Tracking (Kirim prop flat agar sesuai dengan LandingPagePixels) */}
      <LandingPagePixels
        productId={product.id}
        productTitle={product.title}
        price={product.price}
        isFree={product.is_free}
        pixelFbId={lp.fb_pixel_id}
        pixelTiktokId={lp.tiktok_pixel_id}
        pixelGa4Id={lp.ga4_id}
        pixelGtmId={lp.gtm_id}
        pixelCustomHead={lp.custom_head_script}
      />

      {/* 3. Main Content (Kirim prop flat agar sesuai dengan LandingPageContent) */}
      <LandingPageContent
        landing_page={lp}
        product={product}
        course={course}
        benefits={(lp.benefits || []) as Benefit[]}
        testimonials={(lp.testimonials || []) as Testimonial[]}
      />
    </>
  );
}

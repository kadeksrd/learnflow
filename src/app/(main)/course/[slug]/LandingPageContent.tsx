"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { HeroSection } from "@/components/landing/HeroSection";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { UserReviewsSection } from "@/components/landing/UserReviewsSection";
import { CurriculumSection } from "@/components/landing/CurriculumSection";
import { StickyCTA } from "@/components/landing/StickyCTA";
import { formatPrice } from "@/lib/utils";

// PERBAIKAN DI SINI: Terima props secara langsung (flat) sesuai kiriman dari page.tsx
export function LandingPageContent({
  landing_page,
  product,
  course,
  benefits,
  testimonials,
}: {
  landing_page: any;
  product: any;
  course: any;
  benefits?: any[];
  testimonials?: any[];
}) {
  // HAPUS BARIS: const { landing_page, product, course } = data; (Karena sudah diterima di atas)

  const [stickyVisible, setStickyVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ctaError, setCtaError] = useState<string | null>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  // Safety check agar tidak crash jika data belum mendarat
  if (!landing_page || !product) return null;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    if (ctaRef.current) observer.observe(ctaRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCTA = async () => {
    setIsProcessing(true);
    setCtaError(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        sessionStorage.setItem(
          "cta_intent",
          JSON.stringify({
            product_id: product.id,
            slug: landing_page.slug,
            is_free: product.is_free,
          }),
        );
        router.push(`/login?redirect=/course/${landing_page.slug}`);
        return;
      }

      if (product.is_free) {
        const res = await fetch("/api/enroll", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_id: product.id }),
        });
        if (res.ok) {
          router.push("/dashboard?enrolled=true");
        } else {
          const err = await res.json();
          setCtaError(err.message || "Gagal mendaftar, coba lagi");
        }
      } else {
        router.push(`/checkout?product_id=${product.id}`);
      }
    } catch {
      setCtaError("Koneksi gagal, coba lagi");
    } finally {
      setIsProcessing(false);
    }
  };

  const ctaText = product.is_free
    ? landing_page.cta_text || "Ambil Gratis Sekarang"
    : landing_page.cta_text || "Beli Sekarang";

  return (
    <div className="bg-bg min-h-screen">
      <div ref={ctaRef} />

      {/* Hero */}
      <HeroSection
        landingPage={landing_page}
        product={product}
        ctaText={ctaText}
        onCTA={handleCTA}
        isProcessing={isProcessing}
      />

      {/* Benefits */}
      {benefits && benefits.length > 0 && (
        <BenefitsSection benefits={benefits} />
      )}

      {/* Admin-created testimonials (manual) */}
      {testimonials && testimonials.length > 0 && (
        <TestimonialsSection testimonials={testimonials} />
      )}
      {/* Real user reviews — otomatis dari database */}
      <UserReviewsSection productId={product.id} />

      {/* Curriculum */}
      {course && <CurriculumSection course={course} />}

      {/* Final CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="bg-card border border-white/[0.07] rounded-2xl p-6 sm:p-12">
          <h2 className="font-syne font-extrabold text-2xl sm:text-3xl mb-4">
            Siap Memulai?
          </h2>
          <p className="text-text-muted mb-8">
            Bergabung sekarang dan mulai perjalanan belajarmu.
          </p>
          {!product.is_free && (
            <p className="font-syne font-extrabold text-2xl sm:text-3xl mb-6">
              {formatPrice(product.price)}
            </p>
          )}
          <button
            onClick={handleCTA}
            disabled={isProcessing}
            className={`inline-flex items-center gap-3 px-6 sm:px-10 py-4 sm:py-5 rounded-2xl font-syne font-extrabold text-lg transition-all hover:-translate-y-1 disabled:opacity-50 ${
              product.is_free
                ? "bg-green-500 hover:bg-green-400 text-white shadow-xl shadow-green-500/20"
                : "bg-cta hover:bg-cta-hover text-black shadow-xl shadow-cta/30"
            }`}
          >
            {isProcessing ? "⏳ Memproses..." : `🚀 ${ctaText}`}
          </button>
        </div>
      </div>

      {ctaError && (
        <div className="fixed bottom-20 left-4 right-4 z-50 p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-sm text-red-400 text-center">
          {ctaError}
        </div>
      )}
      <StickyCTA
        visible={stickyVisible}
        product={product}
        ctaText={ctaText}
        onCTA={handleCTA}
        isProcessing={isProcessing}
      />
    </div>
  );
}

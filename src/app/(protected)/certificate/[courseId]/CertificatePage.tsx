"use client";
import { User } from "@supabase/supabase-js";
import { Download, Share2, Award } from "lucide-react";

export function CertificatePage({
  user,
  course,
  enrolledAt,
}: {
  user: any;
  course: any;
  enrolledAt: any;
}) {
  const name =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "Pengguna";
  const courseName = (course?.products as any)?.title || course.title;
  const date = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const certId = `LF-${user.id.slice(0, 6).toUpperCase()}-${course.id.slice(0, 6).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-bg">
      <div className="print:hidden max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
        <h1 className="font-syne font-bold text-xl">Sertifikat Kelulusan</h1>
        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 bg-cta text-black font-bold rounded-xl text-sm hover:bg-cta-hover transition-all"
          >
            <Download size={15} /> Unduh / Print
          </button>
          <button
            onClick={() =>
              navigator.share?.({
                title: `Sertifikat ${courseName}`,
                text: `Saya telah menyelesaikan ${courseName} di LearnFlow!`,
                url: window.location.href,
              })
            }
            className="flex items-center gap-2 px-4 py-2.5 bg-card border border-white/[0.07] rounded-xl text-sm text-text-muted hover:text-[#EEEEFF] transition-all"
          >
            <Share2 size={15} /> Bagikan
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-12 print:p-0 print:m-0 print:max-w-none print:w-full print:h-screen print:flex print:items-center print:justify-center">
        <div
          className="certificate-card relative text-gray-200 rounded-3xl overflow-hidden print:rounded-none print:w-full print:h-auto"
          style={{
            aspectRatio: "1.414/1",
            minHeight: "560px",
            background:
              "linear-gradient(135deg, #0A0020 0%, #1A0A3E 50%, #0A0020 100%)",
          }}
        >
          <div className="absolute inset-4 border-2 border-yellow-400/30 rounded-2xl pointer-events-none" />
          <div className="absolute inset-6 border border-yellow-400/15 rounded-xl pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-purple-500/20 blur-3xl pointer-events-none" />

          <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-3xl">⚡</span>
              <span className="font-bold text-2xl text-white tracking-wider">
                LearnFlow
              </span>
            </div>
            <div
              className="w-16 h-16 rounded-full border-2 border-yellow-400/50 flex items-center justify-center mb-4"
              style={{ background: "rgba(245,158,11,0.1)" }}
            >
              <Award size={32} className="text-yellow-400" />
            </div>
            <p className="text-yellow-400 text-xs font-bold tracking-widest uppercase mb-2">
              Certificate of Completion
            </p>
            <p className="text-gray-400 text-sm mb-4">Ini menyatakan bahwa</p>
            <h2
              className="text-white font-bold text-center mb-3"
              style={{
                fontSize: "clamp(22px, 4vw, 36px)",
                letterSpacing: "0.05em",
              }}
            >
              {name}
            </h2>
            <div className="w-48 h-px bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent mb-3" />
            <p className="text-gray-400 text-sm mb-2">
              telah berhasil menyelesaikan kursus
            </p>
            <h3
              className="text-white font-bold text-center mb-6"
              style={{ fontSize: "clamp(14px, 2.5vw, 22px)" }}
            >
              {courseName}
            </h3>
            <div className="flex items-center gap-8 text-gray-500 text-xs">
              <div className="text-center">
                <div className="text-gray-300 font-semibold">{date}</div>
                <div className="mt-0.5">Tanggal Selesai</div>
              </div>
              <div className="w-px h-8 bg-gray-700" />
              <div className="text-center">
                <div className="text-gray-300 font-mono font-semibold">
                  {certId}
                </div>
                <div className="mt-0.5">ID Sertifikat</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          /* Hide Navbar and other UI elements */
          header, 
          .print\\:hidden,
          footer { 
            display: none !important; 
          }
          
          /* Reset body and main container */
          body { 
            margin: 0 !important; 
            padding: 0 !important; 
            background: white !important;
          }
          
          /* Remove spacer if any */
          .h-16 { display: none !important; }

          /* Preserve colors and gradients */
          .certificate-card {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            width: 100vw !important;
            height: 100vh !important;
            max-width: none !important;
            border-radius: 0 !important;
          }

          @page {
            size: A4 landscape;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}

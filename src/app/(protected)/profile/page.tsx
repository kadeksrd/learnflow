import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ProfileHeader } from "@/app/(protected)/profile/ProfileHeader";
import { BasicInfoForm } from "@/app/(protected)/profile/BasicInfoForm";
import { PasswordForm } from "@/app/(protected)/profile/PasswordForm";
import { TwoFactorSection } from "@/app/(protected)/profile/TwoFactorSection";
import { User as UserIcon, Shield, Key } from "lucide-react";

export const metadata: Metadata = { title: "Profil & Keamanan — LearnFlow" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <ProfileHeader user={user} />

        <div className="space-y-6 mt-8">
          {/* Basic Info */}
          <section className="bg-card border border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/[0.07] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <UserIcon size={20} className="text-accent-light" />
              </div>
              <div>
                <h2 className="font-syne font-bold text-lg">Informasi Dasar</h2>
                <p className="text-text-dim text-xs">Kelola profil publik dan informasi akun Anda.</p>
              </div>
            </div>
            <div className="p-6">
              <BasicInfoForm user={user} />
            </div>
          </section>

          {/* Password Section */}
          <section className="bg-card border border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/[0.07] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cta/10 flex items-center justify-center">
                <Key size={20} className="text-cta" />
              </div>
              <div>
                <h2 className="font-syne font-bold text-lg">Keamanan Kata Sandi</h2>
                <p className="text-text-dim text-xs">Pastikan akun Anda tetap aman dengan password yang kuat.</p>
              </div>
            </div>
            <div className="p-6">
              <PasswordForm />
            </div>
          </section>

          {/* 2FA Section */}
          <section className="bg-card border border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/[0.07] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Shield size={20} className="text-green-400" />
              </div>
              <div>
                <h2 className="font-syne font-bold text-lg">Autentikasi 2 Faktor (2FA)</h2>
                <p className="text-text-dim text-xs">Tambahkan lapisan keamanan ekstra pada akun Anda.</p>
              </div>
            </div>
            <div className="p-6">
              <TwoFactorSection />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

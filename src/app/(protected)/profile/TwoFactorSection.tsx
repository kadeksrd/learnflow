'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ShieldCheck, ShieldAlert, Key, Trash2 } from 'lucide-react'

export function TwoFactorSection() {
  const [loading, setLoading] = useState(true)
  const [factors, setFactors] = useState<any[]>([])
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [enrollData, setEnrollData] = useState<{ id: string, totp: { qr_code: string, secret: string, uri: string } } | null>(null)
  const [verifyCode, setVerifyCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    fetchFactors()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchFactors = async () => {
    setLoading(true)
    const { data, error } = await supabase.auth.mfa.listFactors()
    if (!error) {
      setFactors(data.all || [])
    }
    setLoading(false)
  }

  const startEnrollment = async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      issuer: 'LearnFlow',
      friendlyName: 'Authenticator App'
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setEnrollData(data as any)
      setIsEnrolling(true)
      setLoading(false)
    }
  }

  const verifyEnrollment = async () => {
    if (!enrollData) return
    setLoading(true)
    setError(null)

    const challenge = await supabase.auth.mfa.challenge({ factorId: enrollData.id })
    if (challenge.error) {
      setError(challenge.error.message)
      setLoading(false)
      return
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: enrollData.id,
      challengeId: challenge.data.id,
      code: verifyCode
    })

    if (verifyError) {
      setError(verifyError.message)
    } else {
      setSuccess('MFA berhasil diaktifkan!')
      setIsEnrolling(false)
      setEnrollData(null)
      setVerifyCode('')
      fetchFactors()
    }
    setLoading(false)
  }

  const unenrollFactor = async (factorId: string) => {
    if (!confirm('Apakah Anda yakin ingin menonaktifkan MFA? Akun Anda akan menjadi kurang aman.')) return
    setLoading(true)
    const { error } = await supabase.auth.mfa.unenroll({ factorId })
    if (error) {
      setError(error.message)
    } else {
      setSuccess('MFA telah dinonaktifkan.')
      fetchFactors()
    }
    setLoading(false)
  }

  if (loading && factors.length === 0) return <div className="text-text-muted text-sm">Memuat status keamanan...</div>

  const activeFactors = factors.filter(f => f.status === 'verified')

  return (
    <div className="space-y-6">
      {error && <div className="p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm leading-relaxed">⚠️ {error}</div>}
      {success && <div className="p-4 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl text-sm leading-relaxed">✓ {success}</div>}

      {activeFactors.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-green-500/5 border border-green-500/10 rounded-2xl">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <ShieldCheck size={18} className="text-green-400" />
            </div>
            <div>
              <p className="font-bold text-green-400 text-sm">2FA Aktif</p>
              <p className="text-text-dim text-xs">Akun Anda dilindungi dengan autentikasi dua faktor.</p>
            </div>
          </div>
          
          <div className="space-y-2">
            {activeFactors.map(factor => (
              <div key={factor.id} className="flex items-center justify-between p-4 bg-surface/50 border border-white/[0.05] rounded-xl">
                <div className="flex items-center gap-3">
                  <Key size={16} className="text-text-muted" />
                  <div>
                    <p className="text-sm font-semibold">{factor.friendly_name || 'Authenticator'}</p>
                    <p className="text-[10px] text-text-dim uppercase tracking-wider">Metode: App TOTP</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/10" onClick={() => unenrollFactor(factor.id)}>
                   <Trash2 size={14} className="mr-2" /> Hapus
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : !isEnrolling ? (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/[0.1] rounded-3xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
             <ShieldAlert size={32} className="text-text-dim" />
          </div>
          <div>
            <h3 className="font-syne font-bold text-lg">2FA Belum Aktif</h3>
            <p className="text-text-dim text-sm max-w-sm mx-auto">Kami sangat menyarankan Anda untuk mengaktifkan 2FA demi keamanan ekstra pada akun Anda.</p>
          </div>
          <Button onClick={startEnrollment} className="px-8 font-syne" variant="primary">
            Aktifkan Sekarang
          </Button>
        </div>
      ) : null}

      {isEnrolling && enrollData && (
        <div className="p-6 bg-surface border border-accent/20 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-syne font-bold text-lg">Setup Authenticator</h3>
            <Button variant="ghost" size="sm" onClick={() => { setIsEnrolling(false); setEnrollData(null); }}>Batal</Button>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            <div className="bg-white p-3 rounded-2xl shadow-xl shadow-accent/10">
              <QRCodeSVG value={enrollData.totp.uri} size={150} />
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-xs font-bold text-text-dim uppercase tracking-widest mb-1">Langkah 1</p>
                <p className="text-sm">Scan QR Code di samping menggunakan aplikasi authenticator (Google Authenticator, Authy, dll).</p>
                <p className="text-xs text-text-muted mt-1 italic">Atau masukkan kode rahasia ini secara manual: <span className="font-mono text-accent-light break-all select-all">{enrollData.totp.secret}</span></p>
              </div>

              <div className="pt-2">
                <p className="text-xs font-bold text-text-dim uppercase tracking-widest mb-2">Langkah 2</p>
                <p className="text-sm mb-3">Masukkan 6 digit kode dari aplikasi Anda untuk memverifikasi.</p>
                <div className="flex gap-3">
                  <Input 
                    placeholder="Contoh: 123456" 
                    value={verifyCode} 
                    onChange={e => setVerifyCode(e.target.value)}
                    maxLength={6}
                    className="flex-1 font-mono tracking-widest text-lg py-2.5 text-center"
                  />
                  <Button onClick={verifyEnrollment} loading={loading} disabled={verifyCode.length !== 6}>Verifikasi</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { TrackingScripts, GTMNoScript } from '@/components/tracking/TrackingScripts'
import { createClient } from '@/lib/supabase/server'

const syne = Syne({ subsets: ['latin'], variable: '--font-syne', weight: ['400','500','600','700','800'] })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', weight: ['300','400','500','600'] })

async function getGlobalSEO() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('site_settings').select('value').eq('key', 'seo_global').single()
    return (data?.value || {}) as Record<string, any>
  } catch { return {} }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getGlobalSEO()
  return {
    title: {
      default: seo.site_title || 'LearnFlow | Platform Kursus Online',
      template: `%s | ${seo.site_name || 'LearnFlow'}`,
    },
    description: seo.site_description || 'Platform kursus digital terbaik.',
    keywords: seo.site_keywords || undefined,
    robots: seo.robots || 'index,follow',
    verification: {
      google: seo.google_site_verification || undefined,
      other: seo.bing_site_verification ? { 'msvalidate.01': seo.bing_site_verification } : undefined,
    },
    openGraph: {
      type: 'website',
      siteName: seo.site_name || 'LearnFlow',
      title: seo.site_title || 'LearnFlow',
      description: seo.site_description || '',
      images: seo.og_image ? [{ url: seo.og_image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      site: seo.twitter_handle || undefined,
    },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${syne.variable} ${dmSans.variable}`}>
      <head>
        <TrackingScripts />
      </head>
      <body className="bg-bg text-[#EEEEFF] font-dm-sans antialiased">
        <GTMNoScript />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

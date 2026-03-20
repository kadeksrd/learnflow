/**
 * TrackingScripts
 * Renders all pixel/analytics scripts based on settings from site_settings table.
 * Injected into root layout — runs on every page.
 */
import Script from 'next/script'
import { createClient } from '@/lib/supabase/server'

async function getTracking() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'tracking')
      .single()
    return (data?.value || {}) as Record<string, any>
  } catch {
    return {}
  }
}

export async function TrackingScripts() {
  const t = await getTracking()

  return (
    <>
      {/* ── Google Tag Manager ── */}
      {t.gtm_id && (
        <>
          <Script id="gtm-head" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${t.gtm_id}');`}
          </Script>
          {/* GTM noscript goes in body — injected via layout body tag */}
        </>
      )}

      {/* ── Google Analytics 4 (standalone, if no GTM) ── */}
      {t.ga4_id && !t.gtm_id && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${t.ga4_id}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${t.ga4_id}',{page_path:window.location.pathname});`}
          </Script>
        </>
      )}

      {/* ── Facebook / Meta Pixel ── */}
      {t.facebook_pixel_enabled && t.facebook_pixel_id && (
        <Script id="fb-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${t.facebook_pixel_id}');fbq('track','PageView');`}
        </Script>
      )}

      {/* ── TikTok Pixel ── */}
      {t.tiktok_pixel_enabled && t.tiktok_pixel_id && (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${t.tiktok_pixel_id}');ttq.page();}(window,document,'ttq');`}
        </Script>
      )}

      {/* ── Snapchat Pixel ── */}
      {t.snapchat_pixel_enabled && t.snapchat_pixel_id && (
        <Script id="snap-pixel" strategy="afterInteractive">
          {`(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};a.queue=[];var s='script';r=t.createElement(s);r.async=!0;r.src=n;var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u);})(window,document,'https://sc-static.net/scevent.min.js');snaptr('init','${t.snapchat_pixel_id}');snaptr('track','PAGE_VIEW');`}
        </Script>
      )}

      {/* ── Custom head scripts ── */}
      {t.head_scripts && (
        <Script id="custom-head" strategy="afterInteractive">
          {t.head_scripts}
        </Script>
      )}
    </>
  )
}

/** GTM noscript iframe — goes right after <body> open */
export async function GTMNoScript() {
  const t = await getTracking()
  if (!t.gtm_id) return null
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${t.gtm_id}`}
        height="0" width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  )
}

"use client";
import { useEffect } from "react";
import Script from "next/script";

interface Props {
  productId: string;
  productTitle: string;
  price: number;
  isFree: boolean;
  // Kita buat opsional sesuai kolom di database landing_pages
  pixelFbId?: string;
  pixelTiktokId?: string;
  pixelGa4Id?: string;
  pixelGtmId?: string;
  pixelCustomHead?: string;
}

export function LandingPagePixels({
  productId,
  productTitle,
  price,
  isFree,
  pixelFbId,
  pixelTiktokId,
  pixelGa4Id,
  pixelGtmId,
  pixelCustomHead,
}: Props) {
  // Nilai untuk tracking (biasanya rupiah utuh, bukan dibagi 1000)
  const trackingValue = isFree ? 0 : price;

  useEffect(() => {
    const fireViewContent = () => {
      if (typeof window === "undefined") return;

      // Facebook Pixel - ViewContent
      if ((window as any).fbq && pixelFbId) {
        (window as any).fbq("track", "ViewContent", {
          content_ids: [productId],
          content_name: productTitle,
          content_type: "product",
          value: trackingValue,
          currency: "IDR",
        });
      }

      // TikTok Pixel - ViewContent
      if ((window as any).ttq && pixelTiktokId) {
        (window as any).ttq.track("ViewContent", {
          contents: [
            {
              content_id: productId,
              content_name: productTitle,
              content_type: "product",
              price: trackingValue,
            },
          ],
          value: trackingValue,
          currency: "IDR",
        });
      }

      // Google Analytics 4 - view_item
      if ((window as any).gtag && pixelGa4Id) {
        (window as any).gtag("event", "view_item", {
          currency: "IDR",
          value: trackingValue,
          items: [
            {
              item_id: productId,
              item_name: productTitle,
              price: trackingValue,
              quantity: 1,
            },
          ],
        });
      }
    };

    // Kasih delay 500ms supaya script SDK (FB/TT) selesai loading dulu
    const timer = setTimeout(fireViewContent, 500);
    return () => clearTimeout(timer);
  }, [
    productId,
    productTitle,
    trackingValue,
    pixelFbId,
    pixelTiktokId,
    pixelGa4Id,
  ]);

  return (
    <>
      {/* Google Tag Manager */}
      {pixelGtmId && (
        <>
          <Script id={`gtm-lp-${productId}`} strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${pixelGtmId}');`}
          </Script>
        </>
      )}

      {/* GA4 (Hanya diload jika GTM tidak ada) */}
      {pixelGa4Id && !pixelGtmId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${pixelGa4Id}`}
            strategy="afterInteractive"
          />
          <Script id={`ga4-lp-${productId}`} strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${pixelGa4Id}');`}
          </Script>
        </>
      )}

      {/* Facebook Pixel */}
      {pixelFbId && (
        <Script id={`fb-lp-${productId}`} strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelFbId}');fbq('track','PageView');`}
        </Script>
      )}

      {/* TikTok Pixel */}
      {pixelTiktokId && (
        <Script id={`ttq-lp-${productId}`} strategy="afterInteractive">
          {`!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${pixelTiktokId}');ttq.page();}(window,document,'ttq');`}
        </Script>
      )}

      {/* Custom Script */}
      {pixelCustomHead && (
        <Script id={`custom-lp-${productId}`} strategy="afterInteractive">
          {pixelCustomHead}
        </Script>
      )}
    </>
  );
}

// Helpers untuk tracking event (Bisa dipanggil dari tombol beli)
export function firePurchaseEvent(
  orderId: string,
  productTitle: string,
  value: number,
) {
  if (typeof window === "undefined") return;
  if ((window as any).fbq)
  (window as any).fbq("track", "Purchase", {
    value,
    currency: "IDR",
    content_name: productTitle,
    content_ids: [orderId],
  });
  if ((window as any).ttq)
  (window as any).ttq.track("CompletePayment", {
    content_name: productTitle,
    value,
    currency: "IDR",
  });
  if ((window as any).gtag)
  (window as any).gtag("event", "purchase", {
    transaction_id: orderId,
    value,
    currency: "IDR",
    items: [{ item_name: productTitle, price: value }],
  });
}

export function fireCheckoutEvent(productTitle: string, value: number) {
  if (typeof window === "undefined") return;
  if ((window as any).fbq)
  (window as any).fbq("track", "InitiateCheckout", {
    value,
    currency: "IDR",
    content_name: productTitle,
  });
  if ((window as any).ttq)
  (window as any).ttq.track("InitiateCheckout", { value, currency: "IDR" });
  if ((window as any).gtag)
  (window as any).gtag("event", "begin_checkout", {
    currency: "IDR",
    value,
    items: [{ item_name: productTitle, price: value }],
  });
}

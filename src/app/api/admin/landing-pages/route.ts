import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser, unauthorized, dbError, createAdminClient } from '@/lib/api-helpers'

function buildLPPayload(body: any) {
  return {
    product_id:    body.product_id,
    slug:          body.slug,
    headline:      body.headline,
    subheadline:   body.subheadline,
    cta_text:      body.cta_text,
    theme_color:   body.theme_color,
    preview_video: body.preview_video,
    hero_image:    body.hero_image,
    benefits:      body.benefits,
    testimonials:  body.testimonials,
    // SEO fields
    seo_title:       body.seo_title       || null,
    seo_description: body.seo_description || null,
    seo_keywords:    body.seo_keywords    || null,
    og_title:        body.og_title        || null,
    og_description:  body.og_description  || null,
    og_image:        body.og_image        || null,
    robots:          body.robots          || 'index,follow',
    canonical_url:   body.canonical_url   || null,
    schema_markup:   body.schema_markup   || null,
    // Per-page pixel overrides
    pixel_override_enabled: body.pixel_override_enabled || false,
    // Legacy column names (existing schema)
    fb_pixel_id:       body.fb_pixel_id       || body.pixel_fb_id     || null,
    fb_pixel_enabled:  body.fb_pixel_enabled  || !!body.pixel_fb_id   || false,
    tiktok_pixel_id:   body.tiktok_pixel_id   || body.pixel_tiktok_id || null,
    tiktok_pixel_enabled: body.tiktok_pixel_enabled || !!body.pixel_tiktok_id || false,
    ga4_id:            body.ga4_id            || body.pixel_ga4_id    || null,
    ga4_enabled:       body.ga4_enabled       || !!body.pixel_ga4_id  || false,
    gtm_id:            body.gtm_id            || body.pixel_gtm_id    || null,
    gtm_enabled:       body.gtm_enabled       || !!body.pixel_gtm_id  || false,
    custom_head_script: body.custom_head_script || body.pixel_custom_head || null,
    // New column names (if migration ran)
    pixel_fb_id:       body.pixel_fb_id       || body.fb_pixel_id     || null,
    pixel_tiktok_id:   body.pixel_tiktok_id   || body.tiktok_pixel_id || null,
    pixel_ga4_id:      body.pixel_ga4_id      || body.ga4_id          || null,
    pixel_gtm_id:      body.pixel_gtm_id      || body.gtm_id          || null,
    pixel_custom_head: body.pixel_custom_head || body.custom_head_script || null,
    updated_at:        new Date().toISOString(),
  }
}

export async function POST(req: NextRequest) {
  if (!await getAdminUser()) return unauthorized()
  const body = await req.json()
  const s = await createAdminClient()
  const payload = buildLPPayload(body)
  const { data, error } = await (s.from('landing_pages') as any).insert(payload).select().single()
  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

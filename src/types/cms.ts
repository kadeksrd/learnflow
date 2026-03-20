/**
 * TypeScript interfaces for CMS / site_settings data shapes.
 * Replaces loose 'any' types in admin components.
 */

export interface CMSStat {
  value: string
  label: string
}

export interface CMSStep {
  num:   string
  title: string
  desc:  string
  icon:  string
}

export interface CMSTestimonial {
  name:   string
  role:   string
  text:   string
  avatar: string
  rating: number
}

export interface HomepageSettings {
  hero_badge:            string
  hero_headline:         string
  hero_subheadline:      string
  hero_cta_primary:      string
  hero_cta_secondary:    string
  stats:                 CMSStat[]
  featured_section_title:string
  featured_section_badge:string
  featured_product_ids:  string[]
  how_it_works:          CMSStep[]
  about_headline:        string
  about_body:            string
  founder_name:          string
  founder_role:          string
  founder_quote:         string
  testimonials:          CMSTestimonial[]
  cta_headline:          string
  cta_body:              string
  cta_primary:           string
  cta_secondary:         string
  // About stats
  about_stat1_value?:    string
  about_stat1_label?:    string
  about_stat2_value?:    string
  about_stat2_label?:    string
  about_stat3_value?:    string
  about_stat3_label?:    string
  about_stat4_value?:    string
  about_stat4_label?:    string
}

export interface StoreSettings {
  badge:           string
  headline:        string
  headline_accent: string
  subheadline:     string
  show_stats:      boolean
}

export interface TrackingSettings {
  gtm_id:                  string
  ga4_id:                  string
  facebook_pixel_id:       string
  facebook_pixel_enabled:  boolean
  tiktok_pixel_id:         string
  tiktok_pixel_enabled:    boolean
  snapchat_pixel_id:       string
  snapchat_pixel_enabled:  boolean
  head_scripts:            string
  body_scripts:            string
}

export interface SEOGlobalSettings {
  site_name:                string
  site_title:               string
  site_description:         string
  site_keywords:            string
  og_image:                 string
  twitter_handle:           string
  robots:                   string
  google_site_verification: string
  bing_site_verification:   string
}

export interface GatewayConfig {
  enabled:    boolean
  label:      string
  methods:    string[]
  logo:       string
  is_popular: boolean
}

export interface PaymentSettings {
  active_gateways: string[]
  default_gateway: string
  xendit:          GatewayConfig
  midtrans:        GatewayConfig
  doku:            GatewayConfig
}

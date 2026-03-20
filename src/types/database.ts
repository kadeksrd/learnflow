export type Json =
  | string | number | boolean | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
    Tables: {
      categories: {
        Row: { id: string; name: string; slug: string; created_at: string }
        Insert: { name: string; slug: string }
        Update: Partial<{ name: string; slug: string }>
        Relationships: any[]
        Relationships: any[]
      }
      products: {
        Row: {
          id: string; title: string; description: string | null
          price: number; is_free: boolean; thumbnail: string | null
          category_id: string | null; is_published: boolean
          created_at: string; updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
        Relationships: any[]
      }
      landing_pages: {
        Row: {
          id: string; product_id: string; slug: string
          headline: string; subheadline: string | null; cta_text: string
          benefits: Json; testimonials: Json; theme_color: string
          preview_video: string | null
          hero_image: string | null; seo_title?: string | null; seo_description?: string | null; seo_keywords?: string | null; og_title?: string | null; og_description?: string | null; og_image?: string | null; robots?: string | null; canonical_url?: string | null; schema_markup?: string | null; pixel_override_enabled?: boolean | null; fb_pixel_id?: string | null; fb_pixel_enabled?: boolean | null; tiktok_pixel_id?: string | null; tiktok_pixel_enabled?: boolean | null; ga4_id?: string | null; ga4_enabled?: boolean | null; gtm_id?: string | null; gtm_enabled?: boolean | null; custom_head_script?: string | null; pixel_fb_id?: string | null; pixel_tiktok_id?: string | null; pixel_ga4_id?: string | null; pixel_gtm_id?: string | null; pixel_custom_head?: string | null;
          created_at: string; updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['landing_pages']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['landing_pages']['Insert']>
        Relationships: any[]
      }
      courses: {
        Row: { id: string; product_id: string; title: string; created_at: string }
        Insert: Omit<Database['public']['Tables']['courses']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['courses']['Insert']>
        Relationships: any[]
      }
      modules: {
        Row: { id: string; course_id: string; title: string; order: number; created_at: string }
        Insert: Omit<Database['public']['Tables']['modules']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['modules']['Insert']>
        Relationships: any[]
      }
      lessons: {
        Row: {
          id: string; module_id: string; title: string; description: string | null
          video_url: string | null; duration: number; order: number
          notes: string | null; created_at: string
        }
        Insert: Omit<Database['public']['Tables']['lessons']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['lessons']['Insert']>
        Relationships: any[]
      }
      suggestions: {
        Row: { id: string; lesson_id: string; title: string; url: string; type: string; icon: string | null; created_at: string }
        Insert: Omit<Database['public']['Tables']['suggestions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['suggestions']['Insert']>
        Relationships: any[]
      }
      orders: {
        Row: {
          id: string; user_id: string; product_id: string; amount: number
          status: 'pending' | 'paid' | 'failed' | 'expired'
          payment_ref: string | null; gateway: string | null
          paid_at: string | null; created_at: string; updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
        Relationships: any[]
      }
      user_courses: {
        Row: { id: string; user_id: string; course_id: string; enrolled_at: string }
        Insert: { user_id: string; course_id: string }
        Update: never
        Relationships: any[]
      }
      progress: {
        Row: { id: string; user_id: string; lesson_id: string; status: 'started' | 'completed'; completed_at: string | null; created_at: string }
        Insert: Omit<Database['public']['Tables']['progress']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['progress']['Insert']>
        Relationships: any[]
      }
    }
  }
}

export type Product     = Database['public']['Tables']['products']['Row']
export type LandingPage = Database['public']['Tables']['landing_pages']['Row']
export type Course      = Database['public']['Tables']['courses']['Row']
export type Module      = Database['public']['Tables']['modules']['Row']
export type Lesson      = Database['public']['Tables']['lessons']['Row']
export type Order       = Database['public']['Tables']['orders']['Row']
export type UserCourse  = Database['public']['Tables']['user_courses']['Row']
export type Progress    = Database['public']['Tables']['progress']['Row']
export type Category    = Database['public']['Tables']['categories']['Row']
export type Suggestion  = Database['public']['Tables']['suggestions']['Row']

export interface Benefit {
  icon: string
  title: string
  description: string
}

export interface Testimonial {
  name: string
  role: string
  text: string
  avatar_url?: string   // URL foto profil (opsional)
  rating?: number
}

// Reviews
export interface Review {
  id: string
  user_id: string
  product_id: string
  rating: number
  comment: string | null
  is_visible: boolean
  created_at: string
  updated_at: string
}

// Review dengan data user (untuk tampil di landing page)
export interface ReviewWithUser extends Review {
  user_name: string
  user_avatar: string | null
}

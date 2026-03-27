export interface Benefit {
  icon: string;
  title: string;
  description: string;
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  avatar_url: string;
  rating: number;
}

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: { id: string; name: string; slug: string; created_at: string };
        Insert: { id?: string; name: string; slug: string; created_at?: string };
        Update: { id?: string; name?: string; slug?: string; created_at?: string };
        Relationships: any;
      };
      courses: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          use_chapters: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          use_chapters?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          use_chapters?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: any;
      };
      landing_pages: {
        Row: {
          id: string;
          product_id: string;
          slug: string;
          headline: string;
          subheadline: string;
          cta_text: string;
          theme_color: string;
          preview_video: string;
          hero_image: string;
          seo_title: string;
          seo_description: string;
          seo_keywords: string;
          og_title: string;
          og_description: string;
          og_image: string;
          robots: string;
          canonical_url: string;
          schema_markup: string;
          benefits: Benefit[];
          testimonials: Testimonial[];
          pixel_override_enabled: boolean;
          fb_pixel_enabled: boolean;
          fb_pixel_id: string;
          tiktok_pixel_enabled: boolean;
          tiktok_pixel_id: string;
          ga4_enabled: boolean;
          ga4_id: string;
          gtm_enabled: boolean;
          gtm_id: string;
          custom_head_script: string;
          created_at: string;
          updated_at: string;
        };
        Insert: { id?: string; product_id: string; slug: string; headline?: string; subheadline?: string; cta_text?: string; theme_color?: string; preview_video?: string; hero_image?: string; seo_title?: string; seo_description?: string; seo_keywords?: string; og_title?: string; og_description?: string; og_image?: string; robots?: string; canonical_url?: string; schema_markup?: string; benefits?: Benefit[]; testimonials?: Testimonial[]; pixel_override_enabled?: boolean; fb_pixel_enabled?: boolean; fb_pixel_id?: string; tiktok_pixel_enabled?: boolean; tiktok_pixel_id?: string; ga4_enabled?: boolean; ga4_id?: string; gtm_enabled?: boolean; gtm_id?: string; custom_head_script?: string; created_at?: string; updated_at?: string };
        Update: { id?: string; product_id?: string; slug?: string; headline?: string; subheadline?: string; cta_text?: string; theme_color?: string; preview_video?: string; hero_image?: string; seo_title?: string; seo_description?: string; seo_keywords?: string; og_title?: string; og_description?: string; og_image?: string; robots?: string; canonical_url?: string; schema_markup?: string; benefits?: Benefit[]; testimonials?: Testimonial[]; pixel_override_enabled?: boolean; fb_pixel_enabled?: boolean; fb_pixel_id?: string; tiktok_pixel_enabled?: boolean; tiktok_pixel_id?: string; ga4_enabled?: boolean; ga4_id?: string; gtm_enabled?: boolean; gtm_id?: string; custom_head_script?: string; created_at?: string; updated_at?: string };
        Relationships: any;
      };
      lessons: {
        Row: {
          id: string;
          module_id: string;
          title: string;
          video_url: string | null;
          description: string | null;
          duration: number;
          notes: string | null;
          order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: { id?: string; module_id: string; title: string; video_url?: string | null; description?: string | null; duration?: number; notes?: string | null; order?: number; created_at?: string; updated_at?: string };
        Update: { id?: string; module_id?: string; title?: string; video_url?: string | null; description?: string | null; duration?: number; notes?: string | null; order?: number; created_at?: string; updated_at?: string };
        Relationships: any;
      };
      modules: {
        Row: { id: string; course_id: string; title: string; description: string | null; order: number; created_at: string; updated_at: string };
        Insert: { id?: string; course_id: string; title: string; description?: string | null; order?: number; created_at?: string; updated_at?: string };
        Update: { id?: string; course_id?: string; title?: string; description?: string | null; order?: number; created_at?: string; updated_at?: string };
        Relationships: any;
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          amount: number;
          status: "pending" | "paid" | "failed" | "expired";
          payment_ref: string | null;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: { id?: string; user_id: string; product_id: string; amount: number; status?: "pending" | "paid" | "failed" | "expired"; payment_ref?: string | null; paid_at?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; user_id?: string; product_id?: string; amount?: number; status?: "pending" | "paid" | "failed" | "expired"; payment_ref?: string | null; paid_at?: string | null; created_at?: string; updated_at?: string };
        Relationships: any;
      };
      products: {
        Row: { id: string; title: string; description: string | null; price: number; thumbnail: string | null; category_id: string | null; is_published: boolean; is_free: boolean; created_at: string };
        Insert: { id?: string; title: string; description?: string | null; price: number; thumbnail?: string | null; category_id?: string | null; is_published?: boolean; is_free?: boolean; created_at?: string };
        Update: { id?: string; title?: string; description?: string | null; price?: number; thumbnail?: string | null; category_id?: string | null; is_published?: boolean; is_free?: boolean; created_at?: string };
        Relationships: any;
      };
      progress: {
        Row: { id: string; user_id: string; lesson_id: string; status: "completed"; created_at: string };
        Insert: { id?: string; user_id: string; lesson_id: string; status?: "completed"; created_at?: string };
        Update: { id?: string; user_id?: string; lesson_id?: string; status?: "completed"; created_at?: string };
        Relationships: any;
      };
      reviews: {
        Row: { id: string; user_id: string; product_id: string; rating: number; comment: string | null; created_at: string };
        Insert: { id?: string; user_id: string; product_id: string; rating: number; comment?: string | null; created_at?: string };
        Update: { id?: string; user_id?: string; product_id?: string; rating?: number; comment?: string | null; created_at?: string };
        Relationships: any;
      };
      site_settings: {
        Row: { id: string; key: string; value: any; created_at: string; updated_at: string };
        Insert: { id?: string; key: string; value: any; created_at?: string; updated_at?: string };
        Update: { id?: string; key?: string; value?: any; created_at?: string; updated_at?: string };
        Relationships: any;
      };
      suggestions: {
        Row: { id: string; lesson_id: string; title: string; url: string; type: string; icon: string | null; created_at: string };
        Insert: { id?: string; lesson_id: string; title: string; url: string; type: string; icon?: string | null; created_at?: string };
        Update: { id?: string; lesson_id?: string; title?: string; url?: string; type?: string; icon?: string | null; created_at?: string };
        Relationships: any;
      };
      user_courses: {
        Row: { id: string; user_id: string; course_id: string; enrolled_at: string };
        Insert: { id?: string; user_id: string; course_id: string; enrolled_at?: string };
        Update: { id?: string; user_id?: string; course_id?: string; enrolled_at?: string };
        Relationships: any;
      };
      users: {
        Row: { id: string; email: string; full_name: string | null; avatar_url: string | null; created_at: string };
        Insert: { id: string; email: string; full_name?: string | null; avatar_url?: string | null; created_at?: string };
        Update: { id?: string; email?: string; full_name?: string | null; avatar_url?: string | null; created_at?: string };
        Relationships: any;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}


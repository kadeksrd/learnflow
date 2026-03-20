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
        Insert: any;
        Update: any;
      };
      // Minimal placeholder for other tables to avoid broad 'any' errors
      [key: string]: any;
    };
    Views: {
      [key: string]: any;
    };
    Functions: {
      [key: string]: any;
    };
  };
}

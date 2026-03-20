const fs = require('fs');
let code = fs.readFileSync('src/types/database.ts', 'utf8');

// Add missing public views/functions/enums
code = code.replace(
  '    Tables: {',
  '    Views: Record<string, never>\n    Functions: Record<string, never>\n    Enums: Record<string, never>\n    CompositeTypes: Record<string, never>\n    Tables: {'
);

// Add Relationships to all tables
code = code.replace(/Update: Partial<([^>\n]+)>/g, 'Update: Partial<$1>\n        Relationships: any[]');
code = code.replace(/Update: never/g, 'Update: never\n        Relationships: any[]');
code = code.replace(/Update: Partial<\{([^\}\n]+)\}>/g, 'Update: Partial<{$1}>\n        Relationships: any[]');

// Insert extra tables
const additionalTables = `
      reviews: {
        Row: {
          id: string; user_id: string; product_id: string; rating: number;
          comment: string | null; is_visible: boolean; created_at: string; updated_at: string;
        }
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
        Relationships: any[]
      }
      site_settings: {
        Row: {
          id: string; key: string; value: Json;
          updated_at: string; updated_by: string | null;
        }
        Insert: Omit<Database['public']['Tables']['site_settings']['Row'], 'id' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['site_settings']['Insert']>
        Relationships: any[]
      }
`;

code = code.replace(/    \}\n  \}\n\}/, additionalTables + '    }\n  }\n}');

// Add tracking/seo columns to landing_pages
code = code.replace(
  'hero_image: string | null',
  'hero_image: string | null; seo_title?: string | null; seo_description?: string | null; seo_keywords?: string | null; og_title?: string | null; og_description?: string | null; og_image?: string | null; robots?: string | null; canonical_url?: string | null; schema_markup?: string | null; pixel_override_enabled?: boolean | null; fb_pixel_id?: string | null; fb_pixel_enabled?: boolean | null; tiktok_pixel_id?: string | null; tiktok_pixel_enabled?: boolean | null; ga4_id?: string | null; ga4_enabled?: boolean | null; gtm_id?: string | null; gtm_enabled?: boolean | null; custom_head_script?: string | null; pixel_fb_id?: string | null; pixel_tiktok_id?: string | null; pixel_ga4_id?: string | null; pixel_gtm_id?: string | null; pixel_custom_head?: string | null;'
);

fs.writeFileSync('src/types/database.ts', code);
console.log('Patched database.ts successfully');

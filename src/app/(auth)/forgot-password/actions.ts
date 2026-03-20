'use server'

import { createAdminClient } from '@/lib/supabase/server'

/**
 * Memeriksa apakah email terdaftar di auth.users (Supabase Auth).
 * Menggunakan admin client karena auth.users tidak dapat diakses secara publik.
 */
export async function checkEmailExists(email: string) {
  try {
    const supabase = createAdminClient()
    
    // Auth admin listUsers defaultnya mengambil 50 user, 
    // tapi kita hanya butuh mengecek apakah ada email yang cocok
    const { data: { users }, error } = await supabase.auth.admin.listUsers()

    if (error) {
      console.error('CheckEmailExists error:', error.message)
      return true // Mengembalikan true sebagai fallback agar flow tidak terhenti jika admin API error
    }

    return users.some(user => user.email === email)
  } catch (e) {
    console.error('CheckEmailExists exception:', e)
    return true
  }
}

/**
 * Shared helpers for API route handlers.
 * Centralizes auth checking and common response patterns.
 */
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/** Returns the admin user or null. Use with checkAdmin() guard. */
export async function getAdminUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user?.user_metadata?.role === 'admin') return user
  return null
}

/** Returns 401 response — use as early return guard in route handlers. */
export function unauthorized() {
  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
}

/** Returns 400 response with a message. */
export function badRequest(message: string) {
  return NextResponse.json({ message }, { status: 400 })
}

/** Returns 500 response from a Supabase error. */
export function dbError(error: { message: string }) {
  return NextResponse.json({ message: error.message }, { status: 500 })
}

/** Run a Supabase admin query with standard error handling. */
export { createClient, createAdminClient }

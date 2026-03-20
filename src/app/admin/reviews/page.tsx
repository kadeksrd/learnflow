import { createClient, createAdminClient } from '@/lib/supabase/server'
import { ReviewsManager } from './ReviewsManager'

export default async function AdminReviewsPage() {
  const supabase = await createClient()
  const admin    = await createAdminClient()

  const { data: reviews } = await admin
    .from('reviews')
    .select('*, products(title)')
    .order('created_at', { ascending: false })
    .limit(100)

  // Enrich with user names
  const enriched = await Promise.all((reviews || []).map(async review => {
    try {
      const { data: u } = await admin.auth.admin.getUserById(review.user_id)
      return {
        ...review,
        user_name:  u.user?.user_metadata?.full_name || u.user?.email?.split('@')[0] || 'Pengguna',
        user_email: u.user?.email || '',
      }
    } catch {
      return { ...review, user_name: 'Pengguna', user_email: '' }
    }
  }))

  return (
    <div className="p-4 sm:p-8">
      <h1 className="font-syne font-extrabold text-2xl mb-1">Reviews & Ratings</h1>
      <p className="text-text-muted text-sm mb-8">Kelola review dari pelajar. Review visible = tampil di landing page.</p>
      <ReviewsManager reviews={enriched} />
    </div>
  )
}

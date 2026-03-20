import { createClient } from '@/lib/supabase/server'
import { SuggestionManager } from './SuggestionManager'

export default async function SuggestionsPage() {
  const supabase = await createClient()
  const [{ data: lessons }, { data: suggestions }] = await Promise.all([
    supabase.from('lessons').select('id, title, modules(title, courses(products(title)))').order('created_at', { ascending: false }),
    supabase.from('suggestions').select('*').order('created_at', { ascending: false }),
  ])
  return (
    <div className="p-4 sm:p-8">
      <h1 className="font-syne font-extrabold text-2xl mb-1">Suggestion Manager</h1>
      <p className="text-text-muted text-sm mb-8">Tambahkan tools, artikel, dan link berguna ke setiap lesson</p>
      <SuggestionManager lessons={lessons || []} suggestions={suggestions || []} />
    </div>
  )
}

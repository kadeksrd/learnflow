import { createClient } from '@/lib/supabase/server'
import { ProductForm } from './ProductForm'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient()
  const [{ data: product }, { data: categories }] = await Promise.all([
    id === 'new' ? { data: null } : supabase.from('products').select('*').eq('id', id).single(),
    supabase.from('categories').select('*').order('name'),
  ])
  return (
    <div className="p-4 sm:p-8 max-w-2xl">
      <h1 className="font-syne font-extrabold text-2xl mb-8">{id === 'new' ? 'Tambah Produk Baru' : 'Edit Produk'}</h1>
      <ProductForm product={product} categories={categories || []} />
    </div>
  )
}

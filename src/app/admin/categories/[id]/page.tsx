'use client'

import EmojiSelector from '@/components/EmojiSelector'
import { Category } from '@/types'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function EditCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    subtitle: '',
    icon: '',
    description: '',
    order: 1,
    isActive: true
  })

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/admin/categories/${id}`)
        if (!response.ok) throw new Error('Categoria nu a fost găsită')
        const categoryData = await response.json()
        setCategory(categoryData)
        setFormData({
          name: categoryData.name,
          subtitle: categoryData.subtitle || '',
          icon: categoryData.icon || '',
          description: categoryData.description || '',
          order: categoryData.order,
          isActive: categoryData.isActive
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Eroare la încărcarea categoriei')
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchCategory()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Eroare la actualizarea categoriei')
      }
      router.push('/admin/categories')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la actualizarea categoriei')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-2 border-[#fbbf24]/20 border-t-[#fbbf24] rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="text-center py-20">
        <i className="fas fa-exclamation-triangle text-white/10 text-4xl mb-3"></i>
        <h2 className="text-lg text-white/60 mb-2">Categoria nu a fost găsită</h2>
        <Link href="/admin/categories" className="text-[#fbbf24] text-sm hover:underline">Înapoi la categorii</Link>
      </div>
    )
  }

  const inputClass = "w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#fbbf24]/40 focus:ring-1 focus:ring-[#fbbf24]/20 transition-colors"

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-white/30 mb-4">
          <Link href="/admin/categories" className="hover:text-white/60 transition-colors">Categorii</Link>
          <i className="fas fa-chevron-right text-[10px]"></i>
          <span className="text-white/60">Editare</span>
        </div>
        <h1 className="text-2xl font-light text-white" style={{fontFamily: "'Playfair Display', serif"}}>Editează categoria</h1>
      </div>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-4xl">
        {/* Form */}
        <div className="lg:col-span-2 bg-[#111111] rounded-xl border border-white/[0.06] p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Nume *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Ordine</label>
                <input type="number" min="0" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} className={inputClass} />
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Subtitlu</label>
              <input type="text" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className={inputClass} />
            </div>

            <div>
              <EmojiSelector
                value={formData.icon}
                onChange={(emoji) => setFormData({ ...formData, icon: emoji })}
                label="Icon (Emoji)"
              />
            </div>

            <div>
              <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Descriere</label>
              <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={inputClass} />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded border-white/20 bg-white/[0.04] text-[#fbbf24] focus:ring-[#fbbf24]/20"
              />
              <label htmlFor="isActive" className="text-sm text-white/60">Categorie activă</label>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
              <button type="submit" disabled={submitting} className="px-5 py-2.5 bg-[#fbbf24] text-[#0a0a0a] text-sm font-medium rounded-lg hover:bg-[#f59e0b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {submitting ? 'Se salvează...' : 'Salvează modificările'}
              </button>
              <Link href="/admin/categories" className="px-5 py-2.5 text-sm text-white/50 hover:text-white/80 transition-colors">
                Anulează
              </Link>
            </div>
          </form>
        </div>

        {/* Info panel */}
        <div className="bg-[#111111] rounded-xl border border-white/[0.06] p-5 h-fit">
          <h3 className="text-xs text-white/40 uppercase tracking-wider mb-4">Informații</h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-white/30">Slug URL</dt>
              <dd className="text-sm text-white/70">/{category.slug}</dd>
            </div>
            <div>
              <dt className="text-xs text-white/30">Evenimente</dt>
              <dd className="text-sm text-white/70">{category.events?.length || 0}</dd>
            </div>
            <div>
              <dt className="text-xs text-white/30">Creată</dt>
              <dd className="text-sm text-white/70">{new Date(category.createdAt).toLocaleDateString('ro-RO')}</dd>
            </div>
            <div>
              <dt className="text-xs text-white/30">Modificată</dt>
              <dd className="text-sm text-white/70">{new Date(category.updatedAt).toLocaleDateString('ro-RO')}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}

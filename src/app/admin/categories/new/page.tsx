'use client'

import EmojiSelector from '@/components/EmojiSelector'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function NewCategoryPage() {
  const [formData, setFormData] = useState({
    name: '',
    subtitle: '',
    icon: '',
    description: '',
    order: 0
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Eroare la crearea categoriei')
      }
      router.push('/admin/categories')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare necunoscută')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) || 0 : value
    }))
  }

  const inputClass = "w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#fbbf24]/40 focus:ring-1 focus:ring-[#fbbf24]/20 transition-colors"

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-white/30 mb-4">
          <Link href="/admin/categories" className="hover:text-white/60 transition-colors">Categorii</Link>
          <i className="fas fa-chevron-right text-[10px]"></i>
          <span className="text-white/60">Categorie nouă</span>
        </div>
        <h1 className="text-2xl font-light text-white" style={{fontFamily: "'Playfair Display', serif"}}>Categorie nouă</h1>
      </div>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <div className="bg-[#111111] rounded-xl border border-white/[0.06] p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Nume categorie *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className={inputClass} placeholder="ex: Nuntă" />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Ordine</label>
              <input type="number" name="order" value={formData.order} onChange={handleChange} className={inputClass} min="0" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Subtitlu</label>
            <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} className={inputClass} placeholder="ex: O zi, o viață de amintiri" />
          </div>

          <div>
            <EmojiSelector
              value={formData.icon}
              onChange={(emoji) => setFormData(prev => ({ ...prev, icon: emoji }))}
              label="Icon (Emoji)"
            />
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Descriere</label>
            <textarea name="description" rows={3} value={formData.description} onChange={handleChange} className={inputClass} placeholder="Descrierea categoriei..." />
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
            <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-[#fbbf24] text-[#0a0a0a] text-sm font-medium rounded-lg hover:bg-[#f59e0b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? 'Se salvează...' : 'Salvează categoria'}
            </button>
            <Link href="/admin/categories" className="px-5 py-2.5 text-sm text-white/50 hover:text-white/80 transition-colors">
              Anulează
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

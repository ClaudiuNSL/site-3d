'use client'

import { Category } from '@/types'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      if (!response.ok) throw new Error('Eroare la încărcarea categoriilor')
      const data = await response.json()
      setCategories(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare necunoscută')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Ești sigur că vrei să ștergi categoria "${name}"?`)) return
    try {
      const response = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Eroare la ștergerea categoriei')
      }
      setCategories(categories.filter(cat => cat.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Eroare la ștergerea categoriei')
    }
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      })
      if (!response.ok) throw new Error('Eroare la actualizarea statusului')
      const updatedCategory = await response.json()
      setCategories(categories.map(cat => cat.id === id ? updatedCategory : cat))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Eroare la actualizarea statusului')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-2 border-[#fbbf24]/20 border-t-[#fbbf24] rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-light text-white" style={{fontFamily: "'Playfair Display', serif"}}>Categorii</h1>
          <p className="text-white/40 text-sm mt-1">Gestionează categoriile pentru evenimentele foto</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#fbbf24] text-[#0a0a0a] text-sm font-medium rounded-lg hover:bg-[#f59e0b] transition-colors"
        >
          <i className="fas fa-plus text-xs"></i>
          Adaugă categorie
        </Link>
      </div>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-[#111111] rounded-xl border border-white/[0.06] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="px-5 py-3 text-left text-xs font-medium text-white/30 uppercase tracking-wider">Categorie</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-white/30 uppercase tracking-wider">Descriere</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-white/30 uppercase tracking-wider">Evenimente</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-white/30 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-white/30 uppercase tracking-wider">Ordine</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-4">
                  <div>
                    <p className="text-sm text-white/90 font-medium">{category.name}</p>
                    <p className="text-xs text-white/30">/{category.slug}</p>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm text-white/50 max-w-xs truncate">{category.description || '—'}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-white/60">{category.events?.length || 0}</span>
                </td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => toggleActive(category.id, category.isActive)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                      category.isActive
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${category.isActive ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                    {category.isActive ? 'Activă' : 'Inactivă'}
                  </button>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-white/50">{category.order}</span>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/categories/${category.id}`} className="text-white/40 hover:text-[#fbbf24] transition-colors" title="Editează">
                      <i className="fas fa-pen text-xs"></i>
                    </Link>
                    <button
                      onClick={() => handleDelete(category.id, category.name)}
                      disabled={category.events?.length ? category.events.length > 0 : false}
                      className="text-white/40 hover:text-red-400 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                      title="Șterge"
                    >
                      <i className="fas fa-trash text-xs"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {categories.length === 0 && (
          <div className="px-5 py-16 text-center">
            <i className="fas fa-folder-open text-white/10 text-4xl mb-3"></i>
            <p className="text-white/30 text-sm mb-3">Nu există categorii încă</p>
            <Link href="/admin/categories/new" className="text-[#fbbf24] text-sm hover:underline">
              Adaugă prima categorie
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

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
        if (!response.ok) {
          throw new Error('Categoria nu a fost găsită')
        }
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

    if (id) {
      fetchCategory()
    }
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
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
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Categoria nu a fost găsită</h2>
        <Link
          href="/admin/categories"
          className="text-purple-600 hover:text-purple-800"
        >
          Înapoi la categorii
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link href="/admin/dashboard" className="text-gray-500 hover:text-gray-700">
                Dashboard
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <Link href="/admin/categories" className="ml-4 text-gray-500 hover:text-gray-700">
                  Categorii
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-4 text-gray-900 font-medium">Editează categoria</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Editează categoria</h1>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nume categorie *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="ex. Nuntă"
            />
          </div>

          <div>
            <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-2">
              Subtitlu
            </label>
            <input
              type="text"
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="ex. O zi, o viață de amintiri"
            />
          </div>

          <div>
            <EmojiSelector
              value={formData.icon}
              onChange={(emoji) => setFormData({ ...formData, icon: emoji })}
              label="Icon (Emoji)"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descriere
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Descrierea categoriei..."
            />
          </div>

          <div>
            <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
              Ordine afișare
            </label>
            <input
              type="number"
              id="order"
              min="0"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Numărul care determină ordinea de afișare (mai mic = prima)
            </p>
          </div>

          <div className="flex items-center">
            <input
              id="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Categorie activă (va fi afișată pe site)
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Link
              href="/admin/categories"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Anulează
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Se salvează...' : 'Salvează modificările'}
            </button>
          </div>
        </form>

        {/* Category Info */}
        <div className="mt-8 bg-gray-50 rounded-md p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Informații categorie</h3>
          <dl className="space-y-1">
            <div className="flex justify-between text-sm">
              <dt className="text-gray-600">Slug URL:</dt>
              <dd className="text-gray-900">/{category.slug}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-600">Evenimente:</dt>
              <dd className="text-gray-900">{category.events?.length || 0}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-600">Data creării:</dt>
              <dd className="text-gray-900">
                {new Date(category.createdAt).toLocaleDateString('ro-RO')}
              </dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-600">Ultima modificare:</dt>
              <dd className="text-gray-900">
                {new Date(category.updatedAt).toLocaleDateString('ro-RO')}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
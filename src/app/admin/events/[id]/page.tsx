'use client'

import { Category, Event } from '@/types'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function EditEventPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [event, setEvent] = useState<Event | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    eventDate: '',
    location: '',
    isActive: true
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, categoriesRes] = await Promise.all([
          fetch(`/api/admin/events/${id}`),
          fetch('/api/admin/categories')
        ])

        if (!eventRes.ok) {
          throw new Error('Evenimentul nu a fost găsit')
        }

        if (!categoriesRes.ok) {
          throw new Error('Eroare la încărcarea categoriilor')
        }

        const [eventData, categoriesData] = await Promise.all([
          eventRes.json(),
          categoriesRes.json()
        ])

        setEvent(eventData)
        setCategories(categoriesData.filter((cat: Category) => cat.isActive))

        setFormData({
          name: eventData.name,
          description: eventData.description || '',
          categoryId: eventData.categoryId,
          eventDate: eventData.date ?
            new Date(eventData.date).toISOString().split('T')[0] : '',
          location: eventData.location || '',
          isActive: eventData.isActive
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Eroare la încărcarea datelor')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          eventDate: formData.eventDate || null
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Eroare la actualizarea evenimentului')
      }

      router.push('/admin/events')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la actualizarea evenimentului')
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

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Evenimentul nu a fost găsit</h2>
        <Link
          href="/admin/events"
          className="text-purple-600 hover:text-purple-800"
        >
          Înapoi la evenimente
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
                <Link href="/admin/events" className="ml-4 text-gray-500 hover:text-gray-700">
                  Evenimente
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-4 text-gray-900 font-medium">Editează evenimentul</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Editează evenimentul</h1>
          <Link
            href={`/admin/events/${event.id}/images`}
            className="inline-flex items-center px-4 py-2 border border-purple-600 text-sm font-medium rounded-md text-purple-600 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Gestionează imagini
          </Link>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
              Categorie *
            </label>
            <select
              id="categoryId"
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Selectează o categorie</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nume eveniment *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="ex. Nunta Mihai & Bianca"
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
              placeholder="Descrierea evenimentului..."
            />
          </div>

          <div>
            <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-2">
              Data evenimentului
            </label>
            <input
              type="date"
              id="eventDate"
              value={formData.eventDate}
              onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Locația
            </label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="ex. București, Romania"
            />
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
              Eveniment activ (va fi afișat pe site)
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Link
              href="/admin/events"
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

        {/* Event Info */}
        <div className="mt-8 bg-gray-50 rounded-md p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Informații eveniment</h3>
          <dl className="space-y-1">
            <div className="flex justify-between text-sm">
              <dt className="text-gray-600">Slug URL:</dt>
              <dd className="text-gray-900">/{event.category?.slug}/{event.slug}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-600">Imagini:</dt>
              <dd className="text-gray-900">{event.images?.length || 0}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-600">Data creării:</dt>
              <dd className="text-gray-900">
                {new Date(event.createdAt).toLocaleDateString('ro-RO')}
              </dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-600">Ultima modificare:</dt>
              <dd className="text-gray-900">
                {new Date(event.updatedAt).toLocaleDateString('ro-RO')}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
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
          throw new Error('Evenimentul nu a fost gasit')
        }

        if (!categoriesRes.ok) {
          throw new Error('Eroare la incarcarea categoriilor')
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
        setError(err instanceof Error ? err.message : 'Eroare la incarcarea datelor')
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

  const inputClass = "w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#fbbf24]/40 focus:ring-1 focus:ring-[#fbbf24]/20 transition-colors"

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-10 h-10 border-2 border-[#fbbf24]/20 border-t-[#fbbf24] rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-white mb-4">Evenimentul nu a fost gasit</h2>
        <Link
          href="/admin/events"
          className="text-[#fbbf24] hover:text-[#fbbf24]/80 transition-colors"
        >
          Inapoi la evenimente
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-3">
            <li>
              <Link href="/admin/dashboard" className="text-white/40 hover:text-white/60 transition-colors text-sm">
                Dashboard
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <i className="fa-solid fa-chevron-right text-white/20 text-xs"></i>
                <Link href="/admin/events" className="ml-3 text-white/40 hover:text-white/60 transition-colors text-sm">
                  Evenimente
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <i className="fa-solid fa-chevron-right text-white/20 text-xs"></i>
                <span className="ml-3 text-white font-medium text-sm">Editeaza evenimentul</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-['Playfair_Display'] text-2xl font-semibold text-white">Editeaza evenimentul</h1>
          <Link
            href={`/admin/events/${event.id}/images`}
            className="inline-flex items-center px-4 py-2.5 border border-[#fbbf24]/30 text-sm font-medium rounded-lg text-[#fbbf24] hover:bg-[#fbbf24]/10 focus:outline-none focus:ring-1 focus:ring-[#fbbf24]/20 transition-colors"
          >
            <i className="fa-solid fa-images w-4 h-4 mr-2"></i>
            Gestioneaza imagini
          </Link>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-white/60 mb-2">
              Categorie *
            </label>
            <select
              id="categoryId"
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className={inputClass}
              style={{ colorScheme: 'dark' }}
            >
              <option value="" className="bg-[#111111]">Selecteaza o categorie</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id} className="bg-[#111111]">
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white/60 mb-2">
              Nume eveniment *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={inputClass}
              placeholder="ex. Nunta Mihai & Bianca"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-white/60 mb-2">
              Descriere
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={inputClass}
              placeholder="Descrierea evenimentului..."
            />
          </div>

          <div>
            <label htmlFor="eventDate" className="block text-sm font-medium text-white/60 mb-2">
              Data evenimentului
            </label>
            <input
              type="date"
              id="eventDate"
              value={formData.eventDate}
              onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
              className={inputClass}
              style={{ colorScheme: 'dark' }}
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-white/60 mb-2">
              Locatia
            </label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className={inputClass}
              placeholder="ex. Bucuresti, Romania"
            />
          </div>

          <div className="flex items-center">
            <input
              id="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 bg-white/[0.04] border-white/[0.08] rounded text-[#fbbf24] focus:ring-[#fbbf24]/20 focus:ring-offset-0"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-white/80">
              Eveniment activ (va fi afisat pe site)
            </label>
          </div>

          <div className="flex justify-end items-center space-x-4 pt-6 border-t border-white/[0.06]">
            <Link
              href="/admin/events"
              className="text-sm text-white/40 hover:text-white/60 transition-colors"
            >
              Anuleaza
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 text-sm font-medium text-black bg-[#fbbf24] rounded-lg hover:bg-[#fbbf24]/90 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Se salveaza...' : 'Salveaza modificarile'}
            </button>
          </div>
        </form>

        {/* Event Info */}
        <div className="mt-8 bg-[#111111] border border-white/[0.06] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-2">Informatii eveniment</h3>
          <dl className="space-y-1">
            <div className="flex justify-between text-sm">
              <dt className="text-white/40">Slug URL:</dt>
              <dd className="text-white/80">/{event.category?.slug}/{event.slug}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-white/40">Imagini:</dt>
              <dd className="text-white/80">{event.images?.length || 0}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-white/40">Data crearii:</dt>
              <dd className="text-white/80">
                {new Date(event.createdAt).toLocaleDateString('ro-RO')}
              </dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-white/40">Ultima modificare:</dt>
              <dd className="text-white/80">
                {new Date(event.updatedAt).toLocaleDateString('ro-RO')}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}

'use client'

import { Category } from '@/types'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

function NewEventForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedCategoryId = searchParams.get('categoryId') || ''
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: preselectedCategoryId,
    eventDate: '',
    location: '',
    isActive: true
  })

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/admin/categories')
        if (!response.ok) {
          throw new Error('Eroare la incarcarea categoriilor')
        }
        const data = await response.json()
        setCategories(data.filter((cat: Category) => cat.isActive))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Eroare la incarcarea categoriilor')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          date: formData.eventDate || null
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Eroare la crearea evenimentului')
      }

      const eventData = await response.json()
      router.push(`/admin/events/${eventData.id}/images`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la crearea evenimentului')
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
                <span className="ml-3 text-white font-medium text-sm">Eveniment nou</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="max-w-2xl">
        <h1 className="font-['Playfair_Display'] text-2xl font-semibold text-white mb-6">Adauga eveniment nou</h1>

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
            {categories.length === 0 && (
              <p className="mt-1 text-sm text-red-400">
                Nu exista categorii active.
                <Link href="/admin/categories/new" className="underline ml-1 text-[#fbbf24] hover:text-[#fbbf24]/80">
                  Creeaza prima categorie
                </Link>
              </p>
            )}
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
              disabled={submitting || categories.length === 0}
              className="px-5 py-2.5 text-sm font-medium text-black bg-[#fbbf24] rounded-lg hover:bg-[#fbbf24]/90 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Se creeaza...' : 'Creeaza evenimentul'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function NewEventPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <div className="w-10 h-10 border-2 border-[#fbbf24]/20 border-t-[#fbbf24] rounded-full animate-spin"></div>
      </div>
    }>
      <NewEventForm />
    </Suspense>
  )
}

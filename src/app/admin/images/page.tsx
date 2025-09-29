'use client'

import { Category, Event, Image } from '@/types'
import NextImage from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface ImageWithEvent extends Image {
  event: Event & {
    category: Category
  }
}

export default function AllImagesPage() {
  const [images, setImages] = useState<ImageWithEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [categories, setCategories] = useState<Category[]>([])

  const fetchData = async () => {
    try {
      const [imagesRes, categoriesRes] = await Promise.all([
        fetch('/api/admin/images'),
        fetch('/api/admin/categories')
      ])

      if (!imagesRes.ok || !categoriesRes.ok) {
        throw new Error('Eroare la încărcarea datelor')
      }

      const [imagesData, categoriesData] = await Promise.all([
        imagesRes.json(),
        categoriesRes.json()
      ])

      setImages(imagesData)
      setCategories(categoriesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare necunoscută')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (imageId: string, fileName: string) => {
    if (!confirm(`Ești sigur că vrei să ștergi imaginea "${fileName}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/images/${imageId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Eroare la ștergerea imaginii')
      }

      setImages(images.filter(img => img.id !== imageId))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Eroare la ștergerea imaginii')
    }
  }

  const filteredImages = selectedCategory === 'all'
    ? images
    : images.filter(image => image.event?.category?.id === selectedCategory)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Toate imaginile</h1>
          <p className="mt-2 text-sm text-gray-700">
            Vizualizează și gestionează toate imaginile din evenimente.
          </p>
        </div>
      </div>

      {/* Filter by Category */}
      <div className="mt-6">
        <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
          Filtrează după categorie:
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="block w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="all">Toate categoriile</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total imagini</h3>
          <p className="text-2xl font-bold text-purple-600">{images.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Imagini filtrate</h3>
          <p className="text-2xl font-bold text-blue-600">{filteredImages.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Evenimente cu imagini</h3>
          <p className="text-2xl font-bold text-green-600">
            {new Set(images.map(img => img.eventId)).size}
          </p>
        </div>
      </div>

      {/* Images Grid */}
      <div className="mt-8">
        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-gray-500">
              {selectedCategory === 'all'
                ? 'Nu există imagini încă.'
                : 'Nu există imagini pentru categoria selectată.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <div key={image.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-w-16 aspect-h-12 bg-gray-100">
                  <NextImage
                    src={image.url}
                    alt={image.alt || image.filename}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="mb-2">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      {image.event?.category?.name}
                    </span>
                  </div>

                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    {image.event?.name}
                  </h3>

                  <p className="text-xs text-gray-500 mb-2 truncate">
                    {image.filename}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Ordine: {image.order}</span>
                    <span>
                      {new Date(image.createdAt).toLocaleDateString('ro-RO')}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <Link
                      href={`/admin/events/${image.eventId}/images`}
                      className="text-purple-600 hover:text-purple-800 text-xs"
                    >
                      Gestionează
                    </Link>

                    <button
                      onClick={() => handleDelete(image.id, image.filename)}
                      className="text-red-600 hover:text-red-800 text-xs"
                    >
                      Șterge
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
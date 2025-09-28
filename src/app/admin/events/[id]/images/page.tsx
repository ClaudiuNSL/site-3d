'use client'

import { Event, Image } from '@/types'
import NextImage from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export default function EventImagesPage() {
  const params = useParams()
  const eventId = params.id as string

  const [event, setEvent] = useState<Event | null>(null)
  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)

  const fetchEventData = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/events/${eventId}`)
      if (!response.ok) {
        throw new Error('Evenimentul nu a fost găsit')
      }
      const eventData = await response.json()
      setEvent(eventData)
      setImages(eventData.images || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea evenimentului')
    } finally {
      setLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    if (eventId) {
      fetchEventData()
    }
  }, [eventId, fetchEventData])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setSelectedFiles(files)
    }
  }

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      alert('Selectează cel puțin o imagine')
      return
    }

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      Array.from(selectedFiles).forEach((file) => {
        formData.append('images', file)
      })
      formData.append('eventId', eventId)

      const response = await fetch('/api/admin/images/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Eroare la încărcarea imaginilor')
      }

      const uploadedImages = await response.json()
      setImages([...images, ...uploadedImages])
      setSelectedFiles(null)

      // Reset file input
      const fileInput = document.getElementById('image-upload') as HTMLInputElement
      if (fileInput) {
        fileInput.value = ''
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea imaginilor')
    } finally {
      setUploading(false)
    }
  }

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

  const updateImageOrder = async (imageId: string, newOrder: number) => {
    try {
      const response = await fetch(`/api/admin/images/${imageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ order: newOrder })
      })

      if (!response.ok) {
        throw new Error('Eroare la actualizarea ordinii')
      }

      const updatedImage = await response.json()
      setImages(images.map(img =>
        img.id === imageId ? updatedImage : img
      ).sort((a, b) => a.order - b.order))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Eroare la actualizarea ordinii')
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
                <span className="ml-4 text-gray-900 font-medium">Imagini - {event.name}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Încarcă imagini noi</h2>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-2">
                Selectează imagini (JPEG, PNG, WebP)
              </label>
              <input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
              <p className="mt-1 text-sm text-gray-500">
                Poți selecta mai multe imagini simultan. Dimensiunea maximă: 50MB per imagine.
              </p>
            </div>

            {selectedFiles && selectedFiles.length > 0 && (
              <div>
                <p className="text-sm text-gray-700 mb-2">
                  Imagini selectate: {selectedFiles.length}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Array.from(selectedFiles).map((file, index) => (
                    <div key={index} className="bg-gray-100 rounded p-2">
                      <p className="text-xs text-gray-600 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!selectedFiles || selectedFiles.length === 0 || uploading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Se încarcă...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Încarcă imagini
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Imagini existente ({images.length})
          </h2>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-gray-500">Nu există imagini încă pentru acest eveniment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {images.map((image) => (
              <div key={image.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
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
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {image.filename}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Ordine: {image.order}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={image.order}
                        onChange={(e) => updateImageOrder(image.id, parseInt(e.target.value))}
                        className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                      <span className="text-xs text-gray-500">ordine</span>
                    </div>

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
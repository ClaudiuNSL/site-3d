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
        throw new Error('Evenimentul nu a fost gasit')
      }
      const eventData = await response.json()
      setEvent(eventData)
      setImages(eventData.images || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la incarcarea evenimentului')
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
      alert('Selecteaza cel putin o imagine')
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
        throw new Error(errorData.error || 'Eroare la incarcarea imaginilor')
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
      setError(err instanceof Error ? err.message : 'Eroare la incarcarea imaginilor')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (imageId: string, fileName: string) => {
    if (!confirm(`Esti sigur ca vrei sa stergi imaginea "${fileName}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/images/${imageId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Eroare la stergerea imaginii')
      }

      setImages(images.filter(img => img.id !== imageId))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Eroare la stergerea imaginii')
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
                <span className="ml-3 text-white font-medium text-sm">Imagini - {event.name}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="mb-8">
        <div className="bg-[#111111] border border-white/[0.06] rounded-lg p-6">
          <h2 className="font-['Playfair_Display'] text-lg font-medium text-white mb-4">Incarca imagini noi</h2>

          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="image-upload" className="block text-sm font-medium text-white/60 mb-2">
                Selecteaza imagini sau video-uri
              </label>
              <input
                id="image-upload"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="block w-full text-sm text-white/40 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#fbbf24]/10 file:text-[#fbbf24] hover:file:bg-[#fbbf24]/20 file:transition-colors file:cursor-pointer"
              />
              <p className="mt-1 text-sm text-white/30">
                Poti selecta imagini (JPEG, PNG, WebP, HEIC) si video-uri (MP4, MOV). Dimensiunea maxima: 500MB per fisier.
              </p>
            </div>

            {selectedFiles && selectedFiles.length > 0 && (
              <div>
                <p className="text-sm text-white/60 mb-2">
                  Imagini selectate: {selectedFiles.length}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Array.from(selectedFiles).map((file, index) => (
                    <div key={index} className="bg-white/[0.04] border border-white/[0.06] rounded-lg p-2">
                      <p className="text-xs text-white/60 truncate">{file.name}</p>
                      <p className="text-xs text-white/30">
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
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-black bg-[#fbbf24] rounded-lg hover:bg-[#fbbf24]/90 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin mr-2"></div>
                  Se incarca...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-cloud-arrow-up mr-2"></i>
                  Incarca imagini
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#111111] border border-white/[0.06] rounded-lg">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-lg font-medium text-white">
            Imagini existente ({images.length})
          </h2>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-12">
            <i className="fa-regular fa-image text-4xl text-white/20 mb-3 block"></i>
            <p className="text-white/40 text-sm">Nu exista imagini inca pentru acest eveniment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {images.map((image) => {
              const isVideo = image.mimeType?.startsWith('video/')

              return (
                <div key={image.id} className="bg-white/[0.02] border border-white/[0.06] rounded-lg overflow-hidden">
                  <div className="aspect-w-16 aspect-h-12 bg-white/[0.04] relative">
                    {isVideo ? (
                      <>
                        <video
                          src={image.url}
                          className="w-full h-48 object-cover"
                          controls
                          preload="metadata"
                        />
                        <div className="absolute top-2 right-2 bg-[#fbbf24] text-black text-xs px-2 py-1 rounded-md font-medium">
                          <i className="fa-solid fa-video mr-1"></i> Video
                        </div>
                      </>
                    ) : (
                      <NextImage
                        src={image.url}
                        alt={image.alt || image.filename}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-medium text-white truncate">
                      {image.filename}
                    </p>
                    <p className="text-xs text-white/30 mt-1">
                      Ordine: {image.order} {image.size && `• ${(image.size / 1024 / 1024).toFixed(1)}MB`}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={image.order}
                          onChange={(e) => updateImageOrder(image.id, parseInt(e.target.value))}
                          className="w-16 px-2 py-1 text-xs bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[#fbbf24]/40 focus:ring-1 focus:ring-[#fbbf24]/20 transition-colors"
                        />
                        <span className="text-xs text-white/30">ordine</span>
                      </div>

                      <button
                        onClick={() => handleDelete(image.id, image.filename)}
                        className="text-red-400 hover:text-red-300 text-xs transition-colors"
                      >
                        <i className="fa-solid fa-trash-can mr-1"></i>
                        Sterge
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

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
      if (!imagesRes.ok || !categoriesRes.ok) throw new Error('Eroare la încărcarea datelor')
      const [imagesData, categoriesData] = await Promise.all([imagesRes.json(), categoriesRes.json()])
      setImages(imagesData)
      setCategories(categoriesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare necunoscută')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async (imageId: string, fileName: string) => {
    if (!confirm(`Ești sigur că vrei să ștergi imaginea "${fileName}"?`)) return
    try {
      const response = await fetch(`/api/admin/images/${imageId}`, { method: 'DELETE' })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Eroare la ștergerea imaginii')
      }
      setImages(images.filter(img => img.id !== imageId))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Eroare la ștergerea imaginii')
    }
  }

  const filteredImages = selectedCategory === 'all' ? images : images.filter(image => image.event?.category?.id === selectedCategory)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-2 border-[#fbbf24]/20 border-t-[#fbbf24] rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-light text-white" style={{fontFamily: "'Playfair Display', serif"}}>Imagini</h1>
          <p className="text-white/40 text-sm mt-1">Toate imaginile din evenimente</p>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setSelectedCategory('all')} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedCategory === 'all' ? 'bg-[#fbbf24] text-[#0a0a0a] font-medium' : 'bg-[#111111] text-white/50 border border-white/[0.06] hover:text-white/80'}`}>
            Toate ({images.length})
          </button>
          {categories.map((category) => (
            <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedCategory === category.id ? 'bg-[#fbbf24] text-[#0a0a0a] font-medium' : 'bg-[#111111] text-white/50 border border-white/[0.06] hover:text-white/80'}`}>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#111111] rounded-xl border border-white/[0.06] px-4 py-3">
          <p className="text-xs text-white/30 mb-0.5">Total</p>
          <p className="text-xl font-light text-white">{images.length}</p>
        </div>
        <div className="bg-[#111111] rounded-xl border border-white/[0.06] px-4 py-3">
          <p className="text-xs text-white/30 mb-0.5">Filtrate</p>
          <p className="text-xl font-light text-white">{filteredImages.length}</p>
        </div>
        <div className="bg-[#111111] rounded-xl border border-white/[0.06] px-4 py-3">
          <p className="text-xs text-white/30 mb-0.5">Evenimente</p>
          <p className="text-xl font-light text-white">{new Set(images.map(img => img.eventId)).size}</p>
        </div>
      </div>

      {/* Grid */}
      {filteredImages.length === 0 ? (
        <div className="bg-[#111111] rounded-xl border border-white/[0.06] px-5 py-16 text-center">
          <i className="fas fa-images text-white/10 text-4xl mb-3"></i>
          <p className="text-white/30 text-sm">{selectedCategory === 'all' ? 'Nu există imagini încă' : 'Nu există imagini pentru categoria selectată'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredImages.map((image) => (
            <div key={image.id} className="group bg-[#111111] rounded-xl border border-white/[0.06] overflow-hidden hover:border-white/[0.12] transition-all">
              <div className="aspect-[4/3] relative bg-black/50">
                <NextImage
                  src={image.thumbnailUrl || image.url}
                  alt={image.alt || image.filename}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full bg-[#fbbf24]/10 text-[#fbbf24]">
                    {image.event?.category?.name}
                  </span>
                </div>
                <p className="text-xs text-white/70 mb-0.5 truncate">{image.event?.name}</p>
                <p className="text-[10px] text-white/30 truncate mb-2">{image.filename}</p>
                <div className="flex items-center justify-between">
                  <Link href={`/admin/events/${image.eventId}/images`} className="text-white/30 hover:text-[#fbbf24] transition-colors">
                    <i className="fas fa-pen text-[10px]"></i>
                  </Link>
                  <button onClick={() => handleDelete(image.id, image.filename)} className="text-white/30 hover:text-red-400 transition-colors">
                    <i className="fas fa-trash text-[10px]"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

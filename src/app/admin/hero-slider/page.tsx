'use client'

import { HeroSlide } from '@/types'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'

export default function HeroSliderPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchSlides = async () => {
    try {
      const res = await fetch('/api/admin/hero-slides')
      if (res.ok) {
        const data = await res.json()
        setSlides(data)
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSlides() }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    // Filtrăm DOAR imagini
    const imageFiles = files.filter(f => f.type.startsWith('image/'))
    setSelectedFiles(imageFiles)
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return
    setUploading(true)

    try {
      const formData = new FormData()
      selectedFiles.forEach(file => formData.append('images', file))

      const res = await fetch('/api/admin/hero-slides/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        setSelectedFiles([])
        if (fileInputRef.current) fileInputRef.current.value = ''
        await fetchSlides()
      } else {
        const err = await res.json()
        alert(err.error || 'Eroare la upload')
      }
    } catch (err) {
      console.error('Upload error:', err)
      alert('Eroare la încărcarea fișierelor')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Sigur vrei să ștergi acest slide?')) return

    try {
      const res = await fetch(`/api/admin/hero-slides/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setSlides(slides.filter(s => s.id !== id))
      }
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/hero-slides/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      })
      if (res.ok) {
        setSlides(slides.map(s => s.id === id ? { ...s, isActive: !isActive } : s))
      }
    } catch (err) {
      console.error('Toggle error:', err)
    }
  }

  const handleOrderChange = async (id: string, order: number) => {
    try {
      await fetch(`/api/admin/hero-slides/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order })
      })
      setSlides(slides.map(s => s.id === id ? { ...s, order } : s).sort((a, b) => a.order - b.order))
    } catch (err) {
      console.error('Order error:', err)
    }
  }

  const activeCount = slides.filter(s => s.isActive).length

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Hero Slider
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Gestionează imaginile care rulează pe pagina principală
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/30 px-3 py-1.5 bg-white/[0.04] rounded-lg">
            {activeCount} active din {slides.length}
          </span>
        </div>
      </div>

      {/* Info banner */}
      <div className="mb-6 bg-[#fbbf24]/5 border border-[#fbbf24]/10 rounded-xl p-4 flex items-start gap-3">
        <i className="fas fa-info-circle text-[#fbbf24] mt-0.5"></i>
        <div>
          <p className="text-sm text-white/60">
            Imaginile se schimbă automat la <strong className="text-white/80">3 secunde</strong> pe homepage.
            Prima imagine din listă apare prima. Doar <strong className="text-white/80">fotografii</strong> sunt acceptate (fără video).
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-[#111111] rounded-xl border border-white/[0.06] p-6 mb-6">
        <h2 className="text-sm font-medium text-white/70 mb-4">
          <i className="fas fa-cloud-upload-alt mr-2 text-[#fbbf24]"></i>
          Adaugă imagini noi
        </h2>
        <div className="flex items-center gap-4">
          <label className="flex-1 relative cursor-pointer">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="border-2 border-dashed border-white/[0.08] rounded-xl p-8 text-center hover:border-[#fbbf24]/30 transition-colors">
              <i className="fas fa-images text-2xl text-white/15 mb-3 block"></i>
              <p className="text-sm text-white/40">
                {selectedFiles.length > 0
                  ? `${selectedFiles.length} imagini selectate`
                  : 'Click sau drag & drop imagini aici'
                }
              </p>
              <p className="text-xs text-white/20 mt-1">JPG, PNG, WebP - Max 50MB</p>
            </div>
          </label>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {selectedFiles.map((file, i) => (
                <span key={i} className="text-xs bg-white/[0.04] text-white/50 px-2 py-1 rounded">
                  {file.name}
                </span>
              ))}
            </div>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-5 py-2.5 bg-[#fbbf24] text-[#0a0a0a] text-sm font-medium rounded-lg hover:bg-[#f59e0b] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0a0a0a]/20 border-t-[#0a0a0a] rounded-full animate-spin"></div>
                  Se încarcă...
                </>
              ) : (
                <>
                  <i className="fas fa-upload text-xs"></i>
                  Încarcă {selectedFiles.length} {selectedFiles.length === 1 ? 'imagine' : 'imagini'}
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Slides Grid */}
      {slides.length === 0 ? (
        <div className="bg-[#111111] rounded-xl border border-white/[0.06] p-16 text-center">
          <i className="fas fa-panorama text-4xl text-white/10 mb-4 block"></i>
          <p className="text-white/30 mb-2">Niciun slide încă</p>
          <p className="text-white/20 text-sm">Adaugă imagini pentru a le afișa pe homepage</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={`group bg-[#111111] rounded-xl border overflow-hidden transition-all ${
                slide.isActive ? 'border-white/[0.06]' : 'border-white/[0.03] opacity-50'
              }`}
            >
              {/* Image preview */}
              <div className="relative aspect-video">
                <Image
                  src={slide.url}
                  alt={slide.alt || 'Hero slide'}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
                {/* Overlay cu acțiuni */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleToggle(slide.id, slide.isActive)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      slide.isActive
                        ? 'bg-emerald-500/80 hover:bg-emerald-500'
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                    title={slide.isActive ? 'Dezactivează' : 'Activează'}
                  >
                    <i className={`fas ${slide.isActive ? 'fa-eye' : 'fa-eye-slash'} text-white text-xs`}></i>
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="w-10 h-10 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center transition-colors"
                    title="Șterge"
                  >
                    <i className="fas fa-trash text-white text-xs"></i>
                  </button>
                </div>
                {/* Status badge */}
                <div className={`absolute top-3 left-3 px-2 py-1 rounded text-[10px] font-medium ${
                  slide.isActive
                    ? 'bg-emerald-500/80 text-white'
                    : 'bg-white/20 text-white/60'
                }`}>
                  {slide.isActive ? 'ACTIV' : 'INACTIV'}
                </div>
                {/* Order badge */}
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                  #{slide.order}
                </div>
              </div>

              {/* Controls */}
              <div className="p-3 flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-white/50 truncate">{slide.originalName || slide.filename}</p>
                  {slide.size && (
                    <p className="text-[10px] text-white/25">{(slide.size / 1024 / 1024).toFixed(1)} MB</p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <label className="text-[10px] text-white/30">Ordine:</label>
                  <input
                    type="number"
                    min="0"
                    value={slide.order}
                    onChange={(e) => handleOrderChange(slide.id, parseInt(e.target.value) || 0)}
                    className="w-14 px-2 py-1 bg-white/[0.04] border border-white/[0.08] rounded text-xs text-white text-center focus:outline-none focus:border-[#fbbf24]/40"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

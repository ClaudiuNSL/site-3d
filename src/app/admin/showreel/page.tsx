'use client'

import { ShowreelVideo } from '@/types'
import { useEffect, useState } from 'react'

export default function ShowreelPage() {
  const [videos, setVideos] = useState<ShowreelVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form state
  const [editId, setEditId] = useState<string | null>(null)
  const [title, setTitle] = useState('Showreel')
  const [subtitle, setSubtitle] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/admin/showreel')
      if (res.ok) setVideos(await res.json())
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchVideos() }, [])

  const resetForm = () => {
    setEditId(null)
    setTitle('Showreel')
    setSubtitle('')
    setVideoUrl('')
    setThumbnailUrl('')
  }

  const handleSave = async () => {
    if (!videoUrl.trim()) {
      alert('Introdu un URL de YouTube sau Vimeo')
      return
    }
    setSaving(true)

    try {
      const body = { title, subtitle: subtitle || null, videoUrl, thumbnailUrl: thumbnailUrl || null }

      const res = editId
        ? await fetch(`/api/admin/showreel/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })
        : await fetch('/api/admin/showreel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })

      if (res.ok) {
        resetForm()
        await fetchVideos()
      } else {
        const err = await res.json()
        alert(err.error || 'Eroare la salvare')
      }
    } catch (err) {
      console.error('Save error:', err)
      alert('Eroare la salvare')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (video: ShowreelVideo) => {
    setEditId(video.id)
    setTitle(video.title)
    setSubtitle(video.subtitle || '')
    setVideoUrl(video.videoUrl)
    setThumbnailUrl(video.thumbnailUrl || '')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Sigur vrei să ștergi acest video?')) return

    try {
      const res = await fetch(`/api/admin/showreel/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setVideos(videos.filter(v => v.id !== id))
        if (editId === id) resetForm()
      }
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/showreel/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      })
      if (res.ok) {
        setVideos(videos.map(v => v.id === id ? { ...v, isActive: !isActive } : v))
      }
    } catch (err) {
      console.error('Toggle error:', err)
    }
  }

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    return match ? match[1] : null
  }

  const getEmbedUrl = (url: string) => {
    const ytId = getYouTubeId(url)
    if (ytId) return `https://www.youtube.com/embed/${ytId}`
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`
    return url
  }

  const getYouTubeThumbnail = (url: string) => {
    const ytId = getYouTubeId(url)
    if (ytId) return `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
    return null
  }

  const activeCount = videos.filter(v => v.isActive).length

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
            Video Showreel
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Gestionează videoclipul de pe homepage
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/30 px-3 py-1.5 bg-white/[0.04] rounded-lg">
            {activeCount} activ din {videos.length}
          </span>
        </div>
      </div>

      {/* Info banner */}
      <div className="mb-6 bg-[#fbbf24]/5 border border-[#fbbf24]/10 rounded-xl p-4 flex items-start gap-3">
        <i className="fas fa-info-circle text-[#fbbf24] mt-0.5"></i>
        <div>
          <p className="text-sm text-white/60">
            Adaugă un link <strong className="text-white/80">YouTube</strong> sau <strong className="text-white/80">Vimeo</strong>.
            Videoclipul va apărea pe homepage între secțiunea de statistici și galerie.
            Doar <strong className="text-white/80">un singur</strong> video poate fi activ la un moment dat.
          </p>
        </div>
      </div>

      {/* Add/Edit Form */}
      <div className="bg-[#111111] rounded-xl border border-white/[0.06] p-6 mb-6">
        <h2 className="text-sm font-medium text-white/70 mb-4">
          <i className={`fas ${editId ? 'fa-edit' : 'fa-plus-circle'} mr-2 text-[#fbbf24]`}></i>
          {editId ? 'Editează video' : 'Adaugă video nou'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Titlu</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="ex: Showreel 2024"
              className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#fbbf24]/40"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Subtitlu (opțional)</label>
            <input
              type="text"
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              placeholder="ex: Vezi cum surprindem momentele tale"
              className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#fbbf24]/40"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs text-white/40 mb-1.5">URL Video (YouTube / Vimeo) *</label>
          <input
            type="url"
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#fbbf24]/40"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs text-white/40 mb-1.5">URL Thumbnail personalizat (opțional)</label>
          <input
            type="url"
            value={thumbnailUrl}
            onChange={e => setThumbnailUrl(e.target.value)}
            placeholder="Se generează automat din YouTube dacă lași gol"
            className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#fbbf24]/40"
          />
        </div>

        {/* Preview */}
        {videoUrl && (
          <div className="mb-4 p-4 bg-white/[0.02] rounded-lg border border-white/[0.04]">
            <p className="text-xs text-white/30 mb-3">Preview:</p>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black max-w-lg">
              <iframe
                src={getEmbedUrl(videoUrl)}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {!thumbnailUrl && getYouTubeThumbnail(videoUrl) && (
              <p className="text-xs text-white/20 mt-2">
                <i className="fas fa-image mr-1"></i>
                Thumbnail automat: YouTube maxresdefault
              </p>
            )}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving || !videoUrl.trim()}
            className="px-5 py-2.5 bg-[#fbbf24] text-[#0a0a0a] text-sm font-medium rounded-lg hover:bg-[#f59e0b] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-[#0a0a0a]/20 border-t-[#0a0a0a] rounded-full animate-spin"></div>
                Se salvează...
              </>
            ) : (
              <>
                <i className={`fas ${editId ? 'fa-save' : 'fa-plus'} text-xs`}></i>
                {editId ? 'Salvează modificările' : 'Adaugă video'}
              </>
            )}
          </button>
          {editId && (
            <button
              onClick={resetForm}
              className="px-4 py-2.5 text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              Anulează
            </button>
          )}
        </div>
      </div>

      {/* Videos list */}
      {videos.length === 0 ? (
        <div className="bg-[#111111] rounded-xl border border-white/[0.06] p-16 text-center">
          <i className="fas fa-video text-4xl text-white/10 mb-4 block"></i>
          <p className="text-white/30 mb-2">Niciun video încă</p>
          <p className="text-white/20 text-sm">Adaugă un link YouTube sau Vimeo mai sus</p>
        </div>
      ) : (
        <div className="space-y-3">
          {videos.map(video => (
            <div
              key={video.id}
              className={`group bg-[#111111] rounded-xl border overflow-hidden transition-all ${
                video.isActive ? 'border-white/[0.06]' : 'border-white/[0.03] opacity-50'
              }`}
            >
              <div className="flex items-center gap-4 p-4">
                {/* Thumbnail */}
                <div className="relative w-40 aspect-video rounded-lg overflow-hidden bg-black/50 shrink-0">
                  {(video.thumbnailUrl || getYouTubeThumbnail(video.videoUrl)) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={(video.thumbnailUrl || getYouTubeThumbnail(video.videoUrl))!}
                      alt={video.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <i className="fas fa-video text-white/20 text-2xl"></i>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <i className="fas fa-play text-white text-xs ml-0.5"></i>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm text-white/80 font-medium">{video.title}</h3>
                  {video.subtitle && (
                    <p className="text-xs text-white/40 mt-0.5">{video.subtitle}</p>
                  )}
                  <p className="text-xs text-white/20 mt-1.5 truncate">{video.videoUrl}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded ${
                      video.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/30'
                    }`}>
                      {video.isActive ? 'ACTIV' : 'INACTIV'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(video)}
                    className="w-9 h-9 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center transition-colors"
                    title="Editează"
                  >
                    <i className="fas fa-edit text-white/40 text-xs"></i>
                  </button>
                  <button
                    onClick={() => handleToggle(video.id, video.isActive)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      video.isActive
                        ? 'bg-emerald-500/10 hover:bg-emerald-500/20'
                        : 'bg-white/[0.04] hover:bg-white/[0.08]'
                    }`}
                    title={video.isActive ? 'Dezactivează' : 'Activează'}
                  >
                    <i className={`fas ${video.isActive ? 'fa-eye' : 'fa-eye-slash'} text-xs ${
                      video.isActive ? 'text-emerald-400' : 'text-white/40'
                    }`}></i>
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="w-9 h-9 rounded-lg bg-white/[0.04] hover:bg-red-500/20 flex items-center justify-center transition-colors"
                    title="Șterge"
                  >
                    <i className="fas fa-trash text-white/40 hover:text-red-400 text-xs"></i>
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

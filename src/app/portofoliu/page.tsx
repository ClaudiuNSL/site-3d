'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { Category } from '@/types'
import '../styles.css'

// Icoane profesionale Font Awesome per categorie
const categoryIcons: Record<string, string> = {
  'nunta': 'fas fa-ring',
  'botez': 'fas fa-baby',
  'save-the-date': 'fas fa-heart',
  'cuplu': 'fas fa-hand-holding-heart',
  'familie': 'fas fa-users',
  'trash-the-dress': 'fas fa-magic',
  'absolvire': 'fas fa-graduation-cap',
  'profesional': 'fas fa-briefcase',
  'fotografii-amuzante': 'fas fa-theater-masks',
}

function CategoryIcon({ slug, fallbackIcon }: { slug: string; fallbackIcon?: string | null }) {
  const iconClass = categoryIcons[slug]
  if (iconClass) {
    return <i className={iconClass}></i>
  }
  if (fallbackIcon) {
    return <span>{fallbackIcon}</span>
  }
  return <i className="fa-solid fa-camera"></i>
}

export default function PortofoliuPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Fetch categorii din API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  // Toate imaginile din categoria activă
  const activeCategory = categories[activeCategoryIndex]
  const images = activeCategory?.events?.flatMap(event =>
    (event.images || []).map(img => ({
      url: img.url,
      thumbnailUrl: img.thumbnailUrl || img.url,
      alt: img.alt || activeCategory.name,
      eventName: event.name,
    }))
  ) || []

  // Lightbox navigation
  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
    document.body.style.overflow = 'auto'
  }

  const goToPrev = useCallback(() => {
    if (lightboxIndex === null || images.length === 0) return
    setLightboxIndex(lightboxIndex === 0 ? images.length - 1 : lightboxIndex - 1)
  }, [lightboxIndex, images.length])

  const goToNext = useCallback(() => {
    if (lightboxIndex === null || images.length === 0) return
    setLightboxIndex(lightboxIndex === images.length - 1 ? 0 : lightboxIndex + 1)
  }, [lightboxIndex, images.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex !== null) {
        if (e.key === 'ArrowLeft') goToPrev()
        if (e.key === 'ArrowRight') goToNext()
        if (e.key === 'Escape') closeLightbox()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex, goToPrev, goToNext])

  return (
    <div className="portfolio-page">
      {/* Header */}
      <header className="portfolio-header">
        <div className="portfolio-header-inner">
          <div>
            <h1>Portofoliu</h1>
            <p>Colecția mea de momente speciale</p>
          </div>
          <Link href="/" className="portfolio-back">
            <i className="fas fa-arrow-left"></i>
            <span>Acasă</span>
          </Link>
        </div>
      </header>

      <div className="portfolio-layout">
        {/* Aside cu categorii */}
        <aside className="portfolio-aside">
          <h3>Categorii</h3>
          <nav className="portfolio-aside-nav">
            {categories.map((category, index) => (
              <button
                key={category.id}
                className={`portfolio-aside-item ${index === activeCategoryIndex ? 'portfolio-aside-active' : ''}`}
                onClick={() => { setActiveCategoryIndex(index); setLightboxIndex(null) }}
              >
                <span className="portfolio-aside-icon">
                  <CategoryIcon slug={category.slug} fallbackIcon={category.icon} />
                </span>
                <div className="portfolio-aside-text">
                  <span className="portfolio-aside-name">{category.name}</span>
                  <span className="portfolio-aside-count">
                    {category.events?.reduce((sum, e) => sum + (e.images?.length || 0), 0) || 0} fotografii
                  </span>
                </div>
              </button>
            ))}
          </nav>
        </aside>

        {/* Grid cu fotografii */}
        <main className="portfolio-grid-area">
          {loading ? (
            <div className="portfolio-loading">
              <div className="slider-spinner"></div>
            </div>
          ) : images.length > 0 ? (
            <>
              <div className="portfolio-grid-header">
                <h2>{activeCategory?.name}</h2>
                <span>{images.length} fotografii</span>
              </div>
              <div className="portfolio-grid">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="portfolio-item"
                    onClick={() => openLightbox(index)}
                  >
                    <Image
                      src={img.thumbnailUrl}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      className="portfolio-item-image"
                    />
                    <div className="portfolio-item-overlay">
                      <span>{img.eventName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="portfolio-empty">
              <i className="fas fa-camera"></i>
              <p>Fotografii în curând pentru această categorie</p>
            </div>
          )}
        </main>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && images[lightboxIndex] && (
        <div className="portfolio-lightbox" onClick={closeLightbox}>
          <button className="lightbox-close-btn" onClick={closeLightbox}>
            <i className="fas fa-times"></i>
          </button>
          <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); goToPrev() }}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="lightbox-image-wrapper" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].alt}
              fill
              sizes="90vw"
              quality={95}
              className="lightbox-main-image"
            />
          </div>
          <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); goToNext() }}>
            <i className="fas fa-chevron-right"></i>
          </button>
          <div className="lightbox-counter">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  )
}

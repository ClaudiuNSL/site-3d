'use client'

import { Category, Image as ImageType, HeroSlide } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import './dashboard.css'

interface DashboardStats {
  categoriesCount: number
  eventsCount: number
  imagesCount: number
  heroSlidesCount: number
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    categoriesCount: 0,
    eventsCount: 0,
    imagesCount: 0,
    heroSlidesCount: 0,
  })
  const [recentImages, setRecentImages] = useState<ImageType[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [dashRes, heroRes] = await Promise.all([
          fetch('/api/admin/dashboard'),
          fetch('/api/admin/hero-slides'),
        ])

        if (dashRes.ok) {
          const data = await dashRes.json()
          setStats({
            ...data.stats,
            heroSlidesCount: 0, // Will update below
          })
          setRecentImages(data.recentItems?.images || [])
          setCategories(data.recentItems?.categories || [])
        }

        if (heroRes.ok) {
          const heroData = await heroRes.json()
          setHeroSlides(heroData)
          setStats(prev => ({ ...prev, heroSlidesCount: heroData.length }))
        }
      } catch (error) {
        console.error('Error fetching dashboard:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const greeting = (() => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Bună dimineața'
    if (hour < 18) return 'Bună ziua'
    return 'Bună seara'
  })()

  if (loading) {
    return (
      <div className="dash-loading">
        <div className="dash-loading-ring">
          <div className="dash-loading-ring-inner"></div>
        </div>
        <p>Se încarcă panoul...</p>
      </div>
    )
  }

  return (
    <div className="dash">
      {/* Welcome header */}
      <div className="dash-header">
        <div className="dash-header-text">
          <p className="dash-greeting">{greeting}</p>
          <h1 className="dash-title">Dashboard</h1>
        </div>
        <div className="dash-header-time">
          <span className="dash-date">
            {currentTime.toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="dash-stats">
        <Link href="/admin/categories" className="dash-stat-card">
          <div className="dash-stat-icon dash-stat-icon-blue">
            <i className="fas fa-folder-open"></i>
          </div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">{stats.categoriesCount}</span>
            <span className="dash-stat-label">Categorii</span>
          </div>
          <div className="dash-stat-arrow">
            <i className="fas fa-arrow-right"></i>
          </div>
        </Link>

        <Link href="/admin/images" className="dash-stat-card">
          <div className="dash-stat-icon dash-stat-icon-amber">
            <i className="fas fa-images"></i>
          </div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">{stats.imagesCount}</span>
            <span className="dash-stat-label">Fotografii</span>
          </div>
          <div className="dash-stat-arrow">
            <i className="fas fa-arrow-right"></i>
          </div>
        </Link>

        <Link href="/admin/hero-slider" className="dash-stat-card">
          <div className="dash-stat-icon dash-stat-icon-purple">
            <i className="fas fa-panorama"></i>
          </div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">{stats.heroSlidesCount}</span>
            <span className="dash-stat-label">Hero Slides</span>
          </div>
          <div className="dash-stat-arrow">
            <i className="fas fa-arrow-right"></i>
          </div>
        </Link>

        <div className="dash-stat-card dash-stat-card-highlight">
          <div className="dash-stat-icon dash-stat-icon-green">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">{stats.eventsCount}</span>
            <span className="dash-stat-label">Evenimente</span>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="dash-grid">
        {/* Quick Actions */}
        <div className="dash-card dash-actions-card">
          <div className="dash-card-header">
            <h2>Acțiuni rapide</h2>
          </div>
          <div className="dash-actions">
            <Link href="/admin/categories/new" className="dash-action">
              <div className="dash-action-icon">
                <i className="fas fa-folder-plus"></i>
              </div>
              <div>
                <span className="dash-action-title">Categorie nouă</span>
                <span className="dash-action-desc">Adaugă o categorie de fotografii</span>
              </div>
              <i className="fas fa-chevron-right dash-action-arrow"></i>
            </Link>
            <Link href="/admin/hero-slider" className="dash-action">
              <div className="dash-action-icon dash-action-icon-amber">
                <i className="fas fa-panorama"></i>
              </div>
              <div>
                <span className="dash-action-title">Hero Slider</span>
                <span className="dash-action-desc">Gestionează slider-ul de pe homepage</span>
              </div>
              <i className="fas fa-chevron-right dash-action-arrow"></i>
            </Link>
            <Link href="/admin/showreel" className="dash-action">
              <div className="dash-action-icon dash-action-icon-purple">
                <i className="fas fa-video"></i>
              </div>
              <div>
                <span className="dash-action-title">Video Showreel</span>
                <span className="dash-action-desc">Gestionează videoclipul de pe homepage</span>
              </div>
              <i className="fas fa-chevron-right dash-action-arrow"></i>
            </Link>
            <a href="/" target="_blank" rel="noopener noreferrer" className="dash-action">
              <div className="dash-action-icon dash-action-icon-green">
                <i className="fas fa-external-link-alt"></i>
              </div>
              <div>
                <span className="dash-action-title">Vezi site-ul</span>
                <span className="dash-action-desc">Deschide website-ul într-un tab nou</span>
              </div>
              <i className="fas fa-chevron-right dash-action-arrow"></i>
            </a>
          </div>
        </div>

        {/* Hero Slides Preview */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h2>Hero Slider</h2>
            <Link href="/admin/hero-slider" className="dash-card-link">
              Gestionează <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          {heroSlides.length > 0 ? (
            <div className="dash-hero-preview">
              {heroSlides.filter(s => s.isActive).slice(0, 4).map((slide) => (
                <div key={slide.id} className="dash-hero-thumb">
                  <Image
                    src={slide.url}
                    alt={slide.alt || 'Slide'}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                  <div className="dash-hero-thumb-order">#{slide.order}</div>
                </div>
              ))}
              {heroSlides.filter(s => s.isActive).length === 0 && (
                <div className="dash-empty-small">
                  <i className="fas fa-panorama"></i>
                  <p>Niciun slide activ</p>
                </div>
              )}
            </div>
          ) : (
            <div className="dash-empty-small">
              <i className="fas fa-panorama"></i>
              <p>Adaugă imagini în Hero Slider</p>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h2>Categorii</h2>
            <Link href="/admin/categories" className="dash-card-link">
              Vezi toate <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          {categories.length > 0 ? (
            <div className="dash-categories">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/admin/categories/${cat.id}`} className="dash-category-item">
                  <div className="dash-category-icon">
                    {cat.icon || <i className="fas fa-folder"></i>}
                  </div>
                  <div className="dash-category-info">
                    <span className="dash-category-name">{cat.name}</span>
                    <span className="dash-category-count">
                      {cat.events?.reduce((sum, e) => sum + (e.images?.length || 0), 0) || 0} fotografii
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="dash-empty-small">
              <i className="fas fa-folder-open"></i>
              <p>Nicio categorie încă</p>
            </div>
          )}
        </div>

        {/* Recent Images */}
        <div className="dash-card dash-card-wide">
          <div className="dash-card-header">
            <h2>Imagini recente</h2>
            <Link href="/admin/images" className="dash-card-link">
              Vezi toate <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          {recentImages.length > 0 ? (
            <div className="dash-recent-images">
              {recentImages.slice(0, 6).map((img) => (
                <div key={img.id} className="dash-recent-img">
                  <Image
                    src={img.thumbnailUrl || img.url}
                    alt={img.alt || 'Image'}
                    fill
                    sizes="150px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="dash-empty-small">
              <i className="fas fa-images"></i>
              <p>Nicio imagine încă</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

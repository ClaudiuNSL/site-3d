'use client'

import CategoryViewModal from '@/components/CategoryViewModal'
import AboutModal from '@/components/AboutModal'
import { Category, HeroSlide, ShowreelVideo } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState, useRef, useCallback } from 'react'
import './styles.css'

// Icoane profesionale Font Awesome per categorie (în loc de emoji)
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

// Count-up animation hook
function useCountUp(end: number, duration: number, start: boolean, suffix = '') {
  const [count, setCount] = useState('0' + suffix)
  useEffect(() => {
    if (!start) return
    let startTime: number
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      const current = Math.floor(eased * end)
      if (end >= 1000) {
        setCount(Math.floor(current / 1000) + 'k' + suffix)
      } else {
        setCount(current + suffix)
      }
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [start, end, duration, suffix])
  return count
}

function getYouTubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

function getEmbedUrl(url: string) {
  const ytId = getYouTubeId(url)
  if (ytId) return `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&showinfo=0&controls=0&iv_load_policy=3&disablekb=1`
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`
  return url
}

function getYouTubeThumbnail(url: string) {
  const ytId = getYouTubeId(url)
  if (ytId) return `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
  return null
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const [sliderPaused, setSliderPaused] = useState(false)
  const [preloaderDone, setPreloaderDone] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const [parallaxOffset, setParallaxOffset] = useState(0)
  const [activePackage, setActivePackage] = useState(0)
  const [showreelVideo, setShowreelVideo] = useState<ShowreelVideo | null>(null)
  const [showreelPlaying, setShowreelPlaying] = useState(false)

  const statsRef = useRef<HTMLElement>(null)

  // Count-up values
  const count1 = useCountUp(500, 2000, statsVisible, '+')
  const count2 = useCountUp(8, 2000, statsVisible)
  const count3 = useCountUp(1000, 2000, statsVisible, '+')
  const count4 = useCountUp(50000, 2000, statsVisible, '+')

  // Fetch categories + hero slides from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, heroRes, showreelRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/hero-slides'),
          fetch('/api/showreel'),
        ])
        if (catRes.ok) setCategories(await catRes.json())
        if (heroRes.ok) setHeroSlides(await heroRes.json())
        if (showreelRes.ok) {
          const data = await showreelRes.json()
          if (data) setShowreelVideo(data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle category card click
  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category)
    document.body.style.overflow = 'hidden'
  }

  // Close modal
  const closeModal = () => {
    setSelectedCategory(null)
    document.body.style.overflow = 'auto'
  }

  // Handle about modal
  const openAboutModal = useCallback(() => {
    setIsAboutModalOpen(true)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeAboutModal = () => {
    setIsAboutModalOpen(false)
    document.body.style.overflow = 'auto'
  }

  // Build slides from hero slides managed in admin
  const fallbackSlide = {
    url: '/assets/images/hero-image.png',
    alt: 'Banciu Costin Photography',
    title: '',
    isHero: true
  }

  const heroSlidesFormatted = heroSlides.map(slide => ({
    url: slide.url,
    alt: slide.alt || '',
    title: slide.title || '',
    isHero: false
  }))

  const allSlides = heroSlidesFormatted.length > 0
    ? [fallbackSlide, ...heroSlidesFormatted]
    : [fallbackSlide]

  // Navigare slider
  const goToPrevSlide = () => {
    setActiveSlide(prev => prev === 0 ? allSlides.length - 1 : prev - 1)
  }

  const goToNextSlide = () => {
    setActiveSlide(prev => prev === allSlides.length - 1 ? 0 : prev + 1)
  }

  // Auto-play slider - 3 secunde
  useEffect(() => {
    if (sliderPaused || allSlides.length <= 1) return
    const interval = setInterval(() => {
      setActiveSlide(prev => prev === allSlides.length - 1 ? 0 : prev + 1)
    }, 3000)
    return () => clearInterval(interval)
  }, [sliderPaused, allSlides.length])

  // Preloader + force scroll to top
  useEffect(() => {
    window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    const timer = setTimeout(() => setPreloaderDone(true), 2200)
    return () => clearTimeout(timer)
  }, [])

  // Scroll reveal, parallax, stats observer
  useEffect(() => {
    // === Scroll Reveal ===
    const revealElements = document.querySelectorAll('.reveal')
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
        }
      })
    }, { threshold: 0.15 })
    revealElements.forEach(el => revealObserver.observe(el))

    // === Stats Counter Observer ===
    const statsEl = statsRef.current
    if (statsEl) {
      const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setStatsVisible(true)
          statsObserver.disconnect()
        }
      }, { threshold: 0.5 })
      statsObserver.observe(statsEl)
    }

    // === Parallax on hero text ===
    const handleScroll = () => {
      const scrollY = window.scrollY
      setParallaxOffset(scrollY * 0.4)

      // Navbar background on scroll
      const navbar = document.querySelector('.navbar')
      if (scrollY > 50) {
        navbar?.classList.add('scrolled')
      } else {
        navbar?.classList.remove('scrolled')
      }
    }
    window.addEventListener('scroll', handleScroll)

    // === Mobile menu toggle ===
    const hamburger = document.querySelector('.hamburger')
    const navMenu = document.querySelector('.nav-menu')
    const socialIcons = document.querySelector('.social-icons')

    const toggleMobileMenu = () => {
      hamburger?.classList.toggle('active')
      navMenu?.classList.toggle('active')
      socialIcons?.classList.toggle('active')
    }

    hamburger?.addEventListener('click', toggleMobileMenu)

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger?.classList.remove('active')
        navMenu?.classList.remove('active')
        socialIcons?.classList.remove('active')
      })
    })

    // Smooth scrolling for navigation links
    const handleNavClick = (e: Event) => {
      e.preventDefault()
      const target = e.target as HTMLAnchorElement
      const targetId = target.getAttribute('href')

      if (targetId === '#despre') {
        openAboutModal()
        return
      }

      if (targetId === '#portofoliu') {
        window.location.href = '/portofoliu'
        return
      }

      const targetSection = document.querySelector(targetId!)
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    }

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', handleNavClick)
    })

    // Form submission
    const contactForm = document.getElementById('contact-form') as HTMLFormElement

    const handleFormSubmit = async (e: Event) => {
      e.preventDefault()

      const formData = new FormData(contactForm)
      const data = Object.fromEntries(formData)

      if (!data.name || !data.email || !data.phone || !data.service) {
        showNotification('Te rog să completezi toate câmpurile obligatorii.', 'error')
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email as string)) {
        showNotification('Te rog să introduci o adresă de email validă.', 'error')
        return
      }

      const phoneRegex = /^[\+]?[0-9\s\-()]{10,}$/
      if (!phoneRegex.test(data.phone as string)) {
        showNotification('Te rog să introduci un număr de telefon valid.', 'error')
        return
      }

      const submitBtn = contactForm.querySelector('.ct-submit') as HTMLButtonElement
      const originalText = submitBtn.innerHTML

      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Se trimite...'
      submitBtn.disabled = true

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })

        if (response.ok) {
          contactForm.reset()
          showNotification('Mulțumesc pentru mesaj! Voi reveni cu un răspuns în cel mai scurt timp.', 'success')
        } else {
          const error = await response.json()
          showNotification(error.error || 'A apărut o eroare. Te rog încearcă din nou.', 'error')
        }
      } catch (error) {
        console.error('Error submitting form:', error)
        showNotification('A apărut o eroare la trimiterea mesajului. Verifică conexiunea la internet.', 'error')
      } finally {
        submitBtn.innerHTML = originalText
        submitBtn.disabled = false
      }
    }

    if (contactForm) {
      contactForm.addEventListener('submit', handleFormSubmit)
    }

    // Handle keyboard events for modals
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedCategory) {
        closeModal()
      }
    }
    document.addEventListener('keydown', handleKeyDown)

    // Show notification function
    const showNotification = (message: string, type = 'info') => {
      const existingNotifications = document.querySelectorAll('.notification')
      existingNotifications.forEach(notification => notification.remove())

      const notification = document.createElement('div')
      notification.className = `notification notification-${type}`
      notification.innerHTML = `
        <div class="notification-content">
          <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
          <span>${message}</span>
          <button class="notification-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `

      notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 4000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
        backdrop-filter: blur(10px);
      `

      const notificationContent = notification.querySelector('.notification-content') as HTMLElement
      notificationContent.style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.75rem;
      `

      const closeBtn = notification.querySelector('.notification-close') as HTMLElement
      closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        margin-left: auto;
      `

      closeBtn.addEventListener('click', () => notification.remove())
      document.body.appendChild(notification)

      setTimeout(() => {
        if (notification.parentNode) notification.remove()
      }, 5000)
    }

    // Cleanup function
    return () => {
      hamburger?.removeEventListener('click', toggleMobileMenu)
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('keydown', handleKeyDown)
      if (contactForm) contactForm.removeEventListener('submit', handleFormSubmit)
      revealObserver.disconnect()
    }
  }, [selectedCategory, openAboutModal])

  return (
    <>
      {/* Preloader */}
      <div className={`preloader ${preloaderDone ? 'loaded' : ''}`}>
        <div className="preloader-logo">BC</div>
        <div className="preloader-line"></div>
        <div className="preloader-tagline">Photography</div>
      </div>

      {/* Fixed Navigation */}
      <nav className="navbar" id="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-mark">
              <span className="logo-initials">BC</span>
              <div className="logo-line"></div>
            </div>
            <div className="logo-text">
              <h2>Banciu Costin</h2>
              <p>PHOTOGRAPHY</p>
            </div>
          </div>

          <ul className="nav-menu" id="nav-menu">
            <li><a href="#home" className="nav-link">Acasă</a></li>
            <li><a href="#servicii" className="nav-link">Servicii</a></li>
            <li><a href="#portofoliu" className="nav-link">Portofoliu</a></li>
            <li><a href="#despre" className="nav-link">Despre</a></li>
            <li><a href="#contact" className="nav-link">Contact</a></li>
          </ul>

          <div className="social-icons">
            <a href="tel:+40753110407" className="social-link">
              <i className="fas fa-phone"></i>
            </a>
            <a href="https://www.facebook.com/CostinBanciuPhotography" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="social-link">
              <i className="fab fa-instagram"></i>
            </a>
          </div>

          <div className="hamburger" id="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* Hero Fullscreen Slider */}
      <section
        id="home"
        className="hero-slider"
        onMouseEnter={() => setSliderPaused(true)}
        onMouseLeave={() => setSliderPaused(false)}
      >
        {/* Slides */}
        {allSlides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === activeSlide ? 'hero-slide-active' : ''}`}
          >
            <Image
              src={slide.url}
              alt={slide.alt}
              fill
              sizes="100vw"
              quality={90}
              priority={index === 0}
              className="hero-slide-image"
            />
            <div className="hero-slide-overlay"></div>
          </div>
        ))}

        {/* Text overlay - doar pe hero slide, cu parallax */}
        <div
          className={`hero-text-overlay ${activeSlide === 0 ? 'hero-text-visible' : ''}`}
          style={{ transform: `translateY(${parallaxOffset}px)` }}
        >
          <h1>Banciu Costin</h1>
          <p className="hero-subtitle-text">F O T O G R A F</p>
          <p className="hero-tagline">Surprind momente, creez amintiri</p>
        </div>

        {/* Slide title - pe portfolio slides */}
        {activeSlide > 0 && allSlides[activeSlide]?.title && (
          <div className="hero-slide-label">
            <span className="hero-slide-number">
              {String(activeSlide).padStart(2, '0')}
            </span>
            <span className="hero-slide-catname">
              {allSlides[activeSlide].title}
            </span>
          </div>
        )}

        {/* Right side indicators */}
        <div className="hero-indicators">
          {allSlides.slice(0, Math.min(allSlides.length, 10)).map((_, index) => (
            <button
              key={index}
              className={`hero-indicator ${index === activeSlide ? 'hero-indicator-active' : ''}`}
              onClick={() => setActiveSlide(index)}
            />
          ))}
        </div>

        {/* Navigation arrows */}
        <button className="hero-nav hero-nav-prev" onClick={goToPrevSlide}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="hero-nav hero-nav-next" onClick={goToNextSlide}>
          <i className="fas fa-chevron-right"></i>
        </button>

        {/* Scroll hint */}
        <div className="hero-scroll-hint">
          <div className="hero-scroll-line"></div>
        </div>
      </section>

      {/* Stats Band - with count-up */}
      <section className="stats-band" ref={statsRef}>
        <div className="stats-inner">
          <div className="stat-item reveal">
            <span className="stat-number">{count1}</span>
            <span className="stat-label">Evenimente</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item reveal reveal-delay-1">
            <span className="stat-number">{count2}</span>
            <span className="stat-label">Ani Experiență</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item reveal reveal-delay-2">
            <span className="stat-number">{count3}</span>
            <span className="stat-label">Clienți Fericiți</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item reveal reveal-delay-3">
            <span className="stat-number">{count4}</span>
            <span className="stat-label">Fotografii Livrate</span>
          </div>
        </div>
      </section>

      {/* Video Showreel */}
      {showreelVideo && (
        <section className="showreel-section">
          <div className="showreel-inner">
            <div className="showreel-header">
              <span className="showreel-label">Video</span>
              <h2 className="showreel-title">{showreelVideo.title}</h2>
              {showreelVideo.subtitle && (
                <p className="showreel-subtitle">{showreelVideo.subtitle}</p>
              )}
            </div>
            <div className="showreel-player">
              {showreelPlaying ? (
                <div className="showreel-iframe-wrapper">
                  <iframe
                    src={getEmbedUrl(showreelVideo.videoUrl)}
                    className="showreel-iframe"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div
                  className="showreel-thumbnail"
                  onClick={() => setShowreelPlaying(true)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {(showreelVideo.thumbnailUrl || getYouTubeThumbnail(showreelVideo.videoUrl)) && (
                    <img
                      src={(showreelVideo.thumbnailUrl || getYouTubeThumbnail(showreelVideo.videoUrl))!}
                      alt={showreelVideo.title}
                      className="showreel-thumb-img"
                    />
                  )}
                  <div className="showreel-play-overlay">
                    <div className="showreel-play-btn">
                      <i className="fas fa-play"></i>
                    </div>
                    <span className="showreel-play-text">Apasă pentru a viziona</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Mosaic Gallery */}
      <section className="mosaic-section">
        <div className="mosaic-header reveal">
          <span className="mosaic-label">Portofoliu</span>
          <h2 className="mosaic-title">Momente care rămân</h2>
          <p className="mosaic-subtitle">O selecție din cele mai frumoase povești surprinse prin obiectiv</p>
        </div>
        {(() => {
          const mosaicImages = categories.flatMap(cat =>
            (cat.events || []).flatMap(event =>
              (event.images || []).map(img => ({
                url: img.url,
                alt: img.alt || cat.name,
                category: cat.name,
              }))
            )
          ).slice(0, 8)

          if (loading) {
            return (
              <div className="mosaic-grid">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`mosaic-item mosaic-item-${i + 1} shimmer`} style={{ minHeight: '280px' }}></div>
                ))}
              </div>
            )
          }

          return mosaicImages.length > 0 ? (
            <div className="mosaic-grid">
              {mosaicImages.map((img, i) => (
                <div key={i} className={`mosaic-item mosaic-item-${i + 1} reveal`}>
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="mosaic-image"
                  />
                  <div className="mosaic-overlay">
                    <div className="mosaic-overlay-icon">
                      <i className="fas fa-expand"></i>
                    </div>
                    <span className="mosaic-cat">{img.category}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mosaic-empty">
              <p>Galeria va fi disponibilă în curând</p>
            </div>
          )
        })()}
        <div className="mosaic-cta reveal">
          <Link href="/portofoliu" className="mosaic-btn">
            <span>Vezi tot portofoliul</span>
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </section>

      {/* Pachete Servicii */}
      <section id="servicii" className="packages-section">
        <div className="packages-inner">
          <div className="packages-header reveal">
            <span className="packages-label">Servicii</span>
            <h2 className="packages-title">Pachete Foto-Video</h2>
            <p className="packages-subtitle">Alege pachetul potrivit pentru evenimentul tău</p>
          </div>

          {/* Tab-uri pachete */}
          <div className="packages-tabs reveal">
            {[
              { name: 'Nuntă', icon: 'fas fa-ring' },
              { name: 'Botez', icon: 'fas fa-baby' },
              { name: 'Cununie Civilă', icon: 'fas fa-heart' },
              { name: 'Majorat', icon: 'fas fa-glass-cheers' },
            ].map((tab, i) => (
              <button
                key={i}
                className={`packages-tab ${activePackage === i ? 'packages-tab-active' : ''}`}
                onClick={() => setActivePackage(i)}
              >
                <i className={tab.icon}></i>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Pachet Nuntă */}
          {activePackage === 0 && (
            <div className="package-card">
              <div className="package-card-header">
                <div className="package-badge">Popular</div>
                <h3 className="package-name">Nuntă</h3>
                <div className="package-price">
                  <span className="package-amount">1500</span>
                  <span className="package-currency">Euro</span>
                </div>
                <p className="package-tier">Pachet Basic</p>
              </div>
              <div className="package-card-body">
                <div className="package-features">
                  <div className="package-feature"><i className="fas fa-camera"></i><span>1 Fotograf (acasă mirii, biserică, restaurant)</span></div>
                  <div className="package-feature"><i className="fas fa-video"></i><span>1 Videograf (acasă mirii, biserică, restaurant)</span></div>
                  <div className="package-feature"><i className="fas fa-heart"></i><span>Ședință foto ziua nunții</span></div>
                  <div className="package-feature"><i className="fas fa-images"></i><span>Fotografii nelimitate, selectate și editate</span></div>
                  <div className="package-feature"><i className="fas fa-film"></i><span>Filmare Full HD 2-3 ore din toată nunta</span></div>
                  <div className="package-feature"><i className="fas fa-play-circle"></i><span>Videoclip prezentare max 2 minute</span></div>
                  <div className="package-feature"><i className="fas fa-comments"></i><span>Consultanță ziua nunții</span></div>
                  <div className="package-feature"><i className="fas fa-link"></i><span>Link valabilitate 6 luni cu fotografiile + filmarea</span></div>
                  <div className="package-feature"><i className="fas fa-bolt"></i><span>Same day edit (20 fotografii editate în ziua evenimentului)</span></div>
                </div>

                <div className="package-extras">
                  <h4 className="package-extras-title">Servicii Extra</h4>
                  <div className="package-extra-item"><span>Second shooter acasă nașii, biserică, restaurant</span><span className="package-extra-price">350 €</span></div>
                  <div className="package-extra-item"><span>Second videograf acasă nașii, biserică, restaurant</span><span className="package-extra-price">350 €</span></div>
                  <div className="package-extra-item"><span>Ședință foto Save the Date</span><span className="package-extra-price">150 €</span></div>
                  <div className="package-extra-item"><span>Ședință foto Trash the Dress</span><span className="package-extra-price">200 €</span></div>
                  <div className="package-extra-item"><span>Stick 128 GB calitate 2.3 în carcasă personalizată</span><span className="package-extra-price">30 €</span></div>
                  <div className="package-extra-item"><span>Album foto carte 40 pag / 20 colaje, 30x30 cm</span><span className="package-extra-price">180 €</span></div>
                  <div className="package-extra-item"><span>Album foto carte 30 pag / 15 colaje, 20x20 cm</span><span className="package-extra-price">100 €</span></div>
                  <div className="package-extra-item"><span>Fotografii dronă</span><span className="package-extra-price">100 €</span></div>
                  <div className="package-extra-item"><span>Filmare dronă ziua nunții (unde permite zborul)</span><span className="package-extra-price">100 €</span></div>
                </div>

                <div className="package-notes">
                  <p><i className="fas fa-clock"></i> Predarea materialelor: 80 zile lucrătoare</p>
                  <p><i className="fas fa-file-signature"></i> Rezervare: contract + avans 30%</p>
                  <p><i className="fas fa-map-marker-alt"></i> În afara Constanței: transport/cazare de comun acord</p>
                </div>

                <a href="#contact" className="package-cta" onClick={(e) => {
                  e.preventDefault()
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
                }}>
                  <span>Solicită o ofertă</span>
                  <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>
          )}

          {/* Pachet Botez */}
          {activePackage === 1 && (
            <div className="package-card">
              <div className="package-card-header">
                <h3 className="package-name">Botez</h3>
                <div className="package-price">
                  <span className="package-amount">400</span>
                  <span className="package-currency">Euro</span>
                </div>
                <p className="package-tier">Pachet Basic</p>
              </div>
              <div className="package-card-body">
                <div className="package-features">
                  <div className="package-feature"><i className="fas fa-camera"></i><span>1 Fotograf (acasă copil, biserică)</span></div>
                  <div className="package-feature"><i className="fas fa-video"></i><span>1 Videograf (acasă copil, biserică)</span></div>
                  <div className="package-feature"><i className="fas fa-baby"></i><span>Ședință foto ziua botezului</span></div>
                  <div className="package-feature"><i className="fas fa-images"></i><span>Fotografii nelimitate, selectate și editate</span></div>
                  <div className="package-feature"><i className="fas fa-film"></i><span>Filmare Full HD (selecție, editare) 1-2 ore</span></div>
                  <div className="package-feature"><i className="fas fa-play-circle"></i><span>Videoclip prezentare max 2 minute</span></div>
                  <div className="package-feature"><i className="fas fa-comments"></i><span>Consultanță ziua botezului</span></div>
                  <div className="package-feature"><i className="fas fa-link"></i><span>Link valabilitate 6 luni cu fotografiile + filmarea</span></div>
                  <div className="package-feature"><i className="fas fa-bolt"></i><span>Same day edit (20 fotografii editate în ziua evenimentului)</span></div>
                </div>

                <div className="package-extras">
                  <h4 className="package-extras-title">Servicii Extra</h4>
                  <div className="package-extra-item"><span>Fotograf acasă</span><span className="package-extra-price">200 €</span></div>
                  <div className="package-extra-item"><span>Videograf acasă</span><span className="package-extra-price">200 €</span></div>
                  <div className="package-extra-item"><span>Fotograf biserică</span><span className="package-extra-price">200 €</span></div>
                  <div className="package-extra-item"><span>Videograf biserică</span><span className="package-extra-price">200 €</span></div>
                  <div className="package-extra-item"><span>Fotograf restaurant durată 3 ore</span><span className="package-extra-price">200 €</span></div>
                  <div className="package-extra-item"><span>Videograf restaurant durată 3 ore</span><span className="package-extra-price">200 €</span></div>
                  <div className="package-extra-item"><span>Stick 128 GB calitate 2.3 în carcasă personalizată</span><span className="package-extra-price">30 €</span></div>
                  <div className="package-extra-item"><span>Album foto carte 30 pag / 15 colaje, 20x20 cm</span><span className="package-extra-price">80 €</span></div>
                  <div className="package-extra-item"><span>Fotografii dronă</span><span className="package-extra-price">100 €</span></div>
                  <div className="package-extra-item"><span>Filmare dronă ziua botez (unde permite zborul)</span><span className="package-extra-price">100 €</span></div>
                </div>

                <div className="package-notes">
                  <p><i className="fas fa-clock"></i> Predarea materialelor: 60 zile lucrătoare</p>
                  <p><i className="fas fa-file-signature"></i> Rezervare: contract + avans 30%</p>
                  <p><i className="fas fa-exclamation-circle"></i> Ora maximă 23:30 — peste această oră: 100 €/h</p>
                  <p><i className="fas fa-map-marker-alt"></i> În afara Constanței: transport/cazare de comun acord</p>
                </div>

                <a href="#contact" className="package-cta" onClick={(e) => {
                  e.preventDefault()
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
                }}>
                  <span>Solicită o ofertă</span>
                  <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>
          )}

          {/* Pachet Cununie Civilă */}
          {activePackage === 2 && (
            <div className="package-card">
              <div className="package-card-header">
                <h3 className="package-name">Cununie Civilă</h3>
                <div className="package-price">
                  <span className="package-amount">350</span>
                  <span className="package-currency">Euro</span>
                </div>
                <p className="package-tier">Pachet Basic</p>
              </div>
              <div className="package-card-body">
                <div className="package-features">
                  <div className="package-feature"><i className="fas fa-camera"></i><span>1 Fotograf (casa căsătoriilor)</span></div>
                  <div className="package-feature"><i className="fas fa-video"></i><span>1 Videograf (casa căsătoriilor)</span></div>
                  <div className="package-feature"><i className="fas fa-heart"></i><span>Ședință foto casa căsătoriilor</span></div>
                  <div className="package-feature"><i className="fas fa-images"></i><span>Fotografii nelimitate, selectate și editate</span></div>
                  <div className="package-feature"><i className="fas fa-film"></i><span>Filmare Full HD (selecție, editare) 10-20 minute</span></div>
                  <div className="package-feature"><i className="fas fa-play-circle"></i><span>Videoclip prezentare max 2 minute</span></div>
                  <div className="package-feature"><i className="fas fa-link"></i><span>Link valabilitate 6 luni cu fotografiile + filmarea</span></div>
                  <div className="package-feature"><i className="fas fa-bolt"></i><span>Same day edit (20 fotografii editate în ziua evenimentului)</span></div>
                </div>

                <div className="package-extras">
                  <h4 className="package-extras-title">Servicii Extra</h4>
                  <div className="package-extra-item"><span>Fotograf casa căsătoriilor</span><span className="package-extra-price">200 €</span></div>
                  <div className="package-extra-item"><span>Videograf casa căsătoriilor</span><span className="package-extra-price">200 €</span></div>
                  <div className="package-extra-item"><span>Ședință foto</span><span className="package-extra-price">200 €</span></div>
                  <div className="package-extra-item"><span>Fotograf restaurant durată 3 ore</span><span className="package-extra-price">200 €</span></div>
                  <div className="package-extra-item"><span>Videograf restaurant durată 3 ore</span><span className="package-extra-price">200 €</span></div>
                  <div className="package-extra-item"><span>Stick 128 GB calitate 2.3 în carcasă</span><span className="package-extra-price">30 €</span></div>
                  <div className="package-extra-item"><span>Album foto carte 30 pag, 20x20 cm</span><span className="package-extra-price">80 €</span></div>
                  <div className="package-extra-item"><span>Filmare dronă (unde permite zborul)</span><span className="package-extra-price">100 €</span></div>
                </div>

                <div className="package-notes">
                  <p><i className="fas fa-clock"></i> Predarea materialelor: 50 zile lucrătoare</p>
                  <p><i className="fas fa-file-signature"></i> Rezervare: contract + avans 30%</p>
                  <p><i className="fas fa-map-marker-alt"></i> În afara Constanței: transport/cazare de comun acord</p>
                </div>

                <a href="#contact" className="package-cta" onClick={(e) => {
                  e.preventDefault()
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
                }}>
                  <span>Solicită o ofertă</span>
                  <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>
          )}

          {/* Pachet Majorat */}
          {activePackage === 3 && (
            <div className="package-card">
              <div className="package-card-header">
                <h3 className="package-name">Majorat</h3>
                <div className="package-price">
                  <span className="package-amount">450</span>
                  <span className="package-currency">Euro</span>
                </div>
                <p className="package-tier">Pachet Basic</p>
              </div>
              <div className="package-card-body">
                <div className="package-features">
                  <div className="package-feature"><i className="fas fa-camera"></i><span>1 Fotograf (restaurant max ora 24:00)</span></div>
                  <div className="package-feature"><i className="fas fa-video"></i><span>1 Videograf (restaurant max ora 24:00)</span></div>
                  <div className="package-feature"><i className="fas fa-star"></i><span>Ședință foto ziua evenimentului cu sărbătoritul/a</span></div>
                  <div className="package-feature"><i className="fas fa-images"></i><span>Fotografii nelimitate, selectate și editate</span></div>
                  <div className="package-feature"><i className="fas fa-film"></i><span>Filmare Full HD (selecție, editare) 1-2 ore</span></div>
                  <div className="package-feature"><i className="fas fa-play-circle"></i><span>Videoclip prezentare max 2 minute</span></div>
                  <div className="package-feature"><i className="fas fa-link"></i><span>Link valabilitate 6 luni cu fotografiile + filmarea</span></div>
                  <div className="package-feature"><i className="fas fa-bolt"></i><span>Same day edit (20 fotografii editate în ziua evenimentului)</span></div>
                </div>

                <div className="package-extras">
                  <h4 className="package-extras-title">Servicii Extra</h4>
                  <div className="package-extra-item"><span>Ședință foto</span><span className="package-extra-price">200 €</span></div>
                  <div className="package-extra-item"><span>Fotograf restaurant durată 3 ore</span><span className="package-extra-price">200 €</span></div>
                  <div className="package-extra-item"><span>Videograf restaurant durată 3 ore</span><span className="package-extra-price">200 €</span></div>
                  <div className="package-extra-item"><span>Stick 128 GB calitate 2.3 în carcasă</span><span className="package-extra-price">30 €</span></div>
                  <div className="package-extra-item"><span>Album foto carte 30 pag / 15 colaje, 20x20 cm</span><span className="package-extra-price">80 €</span></div>
                  <div className="package-extra-item"><span>Filmare dronă (unde permite zborul)</span><span className="package-extra-price">100 €</span></div>
                </div>

                <div className="package-notes">
                  <p><i className="fas fa-clock"></i> Predarea materialelor: 50 zile lucrătoare</p>
                  <p><i className="fas fa-file-signature"></i> Rezervare: contract + avans 30%</p>
                  <p><i className="fas fa-map-marker-alt"></i> În afara Constanței: transport/cazare de comun acord</p>
                </div>

                <a href="#contact" className="package-cta" onClick={(e) => {
                  e.preventDefault()
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
                }}>
                  <span>Solicită o ofertă</span>
                  <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="ct">
        <div className="ct-bg">
          <div className="ct-bg-glow"></div>
          <div className="ct-bg-grid"></div>
        </div>

        <div className="ct-inner">
          <div className="ct-header reveal">
            <span className="ct-label">Contact</span>
            <h2 className="ct-title">Hai să vorbim</h2>
            <p className="ct-subtitle">Fiecare poveste merită să fie spusă frumos. Spune-mi povestea ta.</p>
          </div>

          <div className="ct-layout">
            {/* Left - Contact Cards */}
            <div className="ct-cards">
              <a href="tel:+40753110407" className="ct-card reveal">
                <div className="ct-card-icon ct-card-icon-phone">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div className="ct-card-text">
                  <span className="ct-card-label">Telefon</span>
                  <span className="ct-card-value">+40 753 110 407</span>
                </div>
                <i className="fas fa-arrow-right ct-card-arrow"></i>
              </a>

              <a href="https://wa.me/40753110407" target="_blank" rel="noopener noreferrer" className="ct-card reveal reveal-delay-1">
                <div className="ct-card-icon ct-card-icon-whatsapp">
                  <i className="fab fa-whatsapp"></i>
                </div>
                <div className="ct-card-text">
                  <span className="ct-card-label">WhatsApp</span>
                  <span className="ct-card-value">Scrie-mi direct</span>
                </div>
                <i className="fas fa-arrow-right ct-card-arrow"></i>
              </a>

              <a href="mailto:costinfoto@gmail.com" className="ct-card reveal reveal-delay-2">
                <div className="ct-card-icon ct-card-icon-email">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="ct-card-text">
                  <span className="ct-card-label">Email</span>
                  <span className="ct-card-value">costinfoto@gmail.com</span>
                </div>
                <i className="fas fa-arrow-right ct-card-arrow"></i>
              </a>

              <div className="ct-card ct-card-location reveal reveal-delay-3">
                <div className="ct-card-icon ct-card-icon-location">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="ct-card-text">
                  <span className="ct-card-label">Locație</span>
                  <span className="ct-card-value">Constanța, România</span>
                </div>
              </div>

              <div className="ct-socials reveal reveal-delay-4">
                <a href="https://www.facebook.com/CostinBanciuPhotography" target="_blank" rel="noopener noreferrer" className="ct-social">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="ct-social">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://wa.me/40753110407" target="_blank" rel="noopener noreferrer" className="ct-social">
                  <i className="fab fa-whatsapp"></i>
                </a>
              </div>
            </div>

            {/* Right - Form */}
            <div className="ct-form-wrap reveal">
              <div className="ct-form-header">
                <h3>Trimite un mesaj</h3>
                <p>Completează formularul și voi reveni cu un răspuns cât mai curând</p>
              </div>
              <form id="contact-form" className="ct-form">
                <div className="ct-form-row">
                  <div className="ct-field">
                    <label>Nume *</label>
                    <input type="text" name="name" placeholder="Numele tău complet" required />
                  </div>
                  <div className="ct-field">
                    <label>Email *</label>
                    <input type="email" name="email" placeholder="email@exemplu.com" required />
                  </div>
                </div>
                <div className="ct-form-row">
                  <div className="ct-field">
                    <label>Telefon *</label>
                    <input type="tel" name="phone" placeholder="+40 7XX XXX XXX" required />
                  </div>
                  <div className="ct-field">
                    <label>Serviciu *</label>
                    <select name="service" required>
                      <option value="">Alege tipul evenimentului</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.slug}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="ct-field">
                  <label>Mesaj</label>
                  <textarea name="message" placeholder="Povestește-mi despre evenimentul tău - dată, locație, ce îți dorești..." rows={5}></textarea>
                </div>
                <button type="submit" className="ct-submit">
                  <span>Trimite mesajul</span>
                  <i className="fas fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Category View Modal */}
      {selectedCategory && (
        <CategoryViewModal
          category={selectedCategory}
          onClose={closeModal}
        />
      )}

      {/* About Modal */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={closeAboutModal}
      />

      {/* Footer - Enhanced */}
      <footer className="ft">
        <div className="ft-inner">
          <div className="ft-brand reveal">
            <div className="ft-logo">
              <span className="ft-initials">BC</span>
              <div className="ft-logo-line"></div>
            </div>
            <p className="ft-tagline">Surprind momente, creez amintiri</p>
          </div>

          <div className="ft-socials reveal">
            <a href="https://www.facebook.com/CostinBanciuPhotography" target="_blank" rel="noopener noreferrer" className="ft-social-link">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="ft-social-link">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://wa.me/40753110407" target="_blank" rel="noopener noreferrer" className="ft-social-link">
              <i className="fab fa-whatsapp"></i>
            </a>
            <a href="tel:+40753110407" className="ft-social-link">
              <i className="fas fa-phone"></i>
            </a>
          </div>

          <div className="ft-divider"></div>

          <div className="ft-links reveal">
            <a href="#home">Acasă</a>
            <a href="#portofoliu" onClick={() => { window.location.href = '/portofoliu' }}>Portofoliu</a>
            <a href="#despre" onClick={(e) => { e.preventDefault(); openAboutModal() }}>Despre</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="ft-copy">
            <p>&copy; {new Date().getFullYear()} Banciu Costin Photography</p>
            <p className="ft-copy-sub">Toate drepturile rezervate</p>
          </div>
        </div>
      </footer>
    </>
  )
}

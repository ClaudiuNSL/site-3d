'use client'

import CategoryViewModal from '@/components/CategoryViewModal'
import AboutModal from '@/components/AboutModal'
import { Category, HeroSlide } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
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

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const [sliderPaused, setSliderPaused] = useState(false)

  // Fetch categories + hero slides from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, heroRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/hero-slides'),
        ])
        if (catRes.ok) setCategories(await catRes.json())
        if (heroRes.ok) setHeroSlides(await heroRes.json())
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
  const openAboutModal = () => {
    setIsAboutModalOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeAboutModal = () => {
    setIsAboutModalOpen(false)
    document.body.style.overflow = 'auto'
  }

  // Build slides from hero slides managed in admin
  // First slide = photographer hero (always present), rest from admin hero slides
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

  useEffect(() => {
    // Mobile menu toggle
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
      
      // Handle special navigation
      if (targetId === '#despre') {
        openAboutModal()
        return
      }
      
      if (targetId === '#portofoliu') {
        window.location.href = '/portofoliu'
        return
      }
      
      // Normal scroll navigation
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

    // Navbar background on scroll
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar')
      const scrolled = window.scrollY > 50
      
      if (scrolled) {
        navbar?.classList.add('scrolled')
      } else {
        navbar?.classList.remove('scrolled')
      }
      
      // Parallax removed - using fullscreen slider now
    }

    window.addEventListener('scroll', handleScroll)

    // Form submission
    const contactForm = document.getElementById('contact-form') as HTMLFormElement

    const handleFormSubmit = async (e: Event) => {
      e.preventDefault()
      
      const formData = new FormData(contactForm)
      const data = Object.fromEntries(formData)
      
      // Basic validation
      if (!data.name || !data.email || !data.phone || !data.service) {
        showNotification('Te rog să completezi toate câmpurile obligatorii.', 'error')
        return
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email as string)) {
        showNotification('Te rog să introduci o adresă de email validă.', 'error')
        return
      }
      
      // Phone validation
      const phoneRegex = /^[\+]?[0-9\s\-()]{10,}$/
      if (!phoneRegex.test(data.phone as string)) {
        showNotification('Te rog să introduci un număr de telefon valid.', 'error')
        return
      }
      
      // Trimitem formularul către API
      const submitBtn = contactForm.querySelector('.submit-btn') as HTMLButtonElement
      const originalText = submitBtn.innerHTML
      
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Se trimite...'
      submitBtn.disabled = true
      
      try {
        // Facem request către API-ul nostru
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })

        if (response.ok) {
          // Succes! Email-ul a fost trimis
          contactForm.reset()
          showNotification('Mulțumesc pentru mesaj! Voi reveni cu un răspuns în cel mai scurt timp.', 'success')
        } else {
          // Eroare de la server
          const error = await response.json()
          showNotification(error.error || 'A apărut o eroare. Te rog încearcă din nou.', 'error')
        }
      } catch (error) {
        // Eroare de rețea
        console.error('Error submitting form:', error)
        showNotification('A apărut o eroare la trimiterea mesajului. Verifică conexiunea la internet.', 'error')
      } finally {
        // Resetăm butonul
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
      // Remove existing notifications
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
      
      // Add notification styles
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
      
      closeBtn.addEventListener('click', () => {
        notification.remove()
      })
      
      document.body.appendChild(notification)
      
      // Auto remove after 5 seconds
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove()
        }
      }, 5000)
    }

    console.log('Photography website loaded successfully!')

    // Cleanup function
    return () => {
      hamburger?.removeEventListener('click', toggleMobileMenu)
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('keydown', handleKeyDown)
      if (contactForm) {
        contactForm.removeEventListener('submit', handleFormSubmit)
      }
    }
  }, [selectedCategory])

  return (
    <>
      {/* Fixed Navigation */}
      <nav className="navbar" id="navbar">
        <div className="nav-container">
          {/* Logo profesional */}
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

          {/* Navigation Menu */}
          <ul className="nav-menu" id="nav-menu">
            <li><a href="#home" className="nav-link">Acasă</a></li>
            <li><a href="#servicii" className="nav-link">Servicii</a></li>
            <li><a href="#portofoliu" className="nav-link">Portofoliu</a></li>
            <li><a href="#despre" className="nav-link">Despre</a></li>
            <li><a href="#contact" className="nav-link">Contact</a></li>
          </ul>

          {/* Social Icons */}
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

          {/* Mobile Menu Toggle */}
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

        {/* Text overlay - doar pe hero slide */}
        <div className={`hero-text-overlay ${activeSlide === 0 ? 'hero-text-visible' : ''}`}>
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

      {/* Stats Band */}
      <section className="stats-band">
        <div className="stats-inner">
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Evenimente</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">8</span>
            <span className="stat-label">Ani Experiență</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">1000+</span>
            <span className="stat-label">Clienți Fericiți</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">50k+</span>
            <span className="stat-label">Fotografii Livrate</span>
          </div>
        </div>
      </section>

      {/* Mosaic Gallery */}
      <section className="mosaic-section">
        <div className="mosaic-header">
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

          return mosaicImages.length > 0 ? (
            <div className="mosaic-grid">
              {mosaicImages.map((img, i) => (
                <div key={i} className={`mosaic-item mosaic-item-${i + 1}`}>
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="mosaic-image"
                  />
                  <div className="mosaic-overlay">
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
        <div className="mosaic-cta">
          <Link href="/portofoliu" className="mosaic-btn">
            <span>Vezi tot portofoliul</span>
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="ct">
        {/* Background elements */}
        <div className="ct-bg">
          <div className="ct-bg-glow"></div>
          <div className="ct-bg-grid"></div>
        </div>

        <div className="ct-inner">
          {/* Header */}
          <div className="ct-header">
            <span className="ct-label">Contact</span>
            <h2 className="ct-title">Hai să vorbim</h2>
            <p className="ct-subtitle">Fiecare poveste merită să fie spusă frumos. Spune-mi povestea ta.</p>
          </div>

          <div className="ct-layout">
            {/* Left - Contact Cards */}
            <div className="ct-cards">
              <a href="tel:+40753110407" className="ct-card">
                <div className="ct-card-icon ct-card-icon-phone">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div className="ct-card-text">
                  <span className="ct-card-label">Telefon</span>
                  <span className="ct-card-value">+40 753 110 407</span>
                </div>
                <i className="fas fa-arrow-right ct-card-arrow"></i>
              </a>

              <a href="https://wa.me/40753110407" target="_blank" rel="noopener noreferrer" className="ct-card">
                <div className="ct-card-icon ct-card-icon-whatsapp">
                  <i className="fab fa-whatsapp"></i>
                </div>
                <div className="ct-card-text">
                  <span className="ct-card-label">WhatsApp</span>
                  <span className="ct-card-value">Scrie-mi direct</span>
                </div>
                <i className="fas fa-arrow-right ct-card-arrow"></i>
              </a>

              <a href="mailto:costinfoto@gmail.com" className="ct-card">
                <div className="ct-card-icon ct-card-icon-email">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="ct-card-text">
                  <span className="ct-card-label">Email</span>
                  <span className="ct-card-value">costinfoto@gmail.com</span>
                </div>
                <i className="fas fa-arrow-right ct-card-arrow"></i>
              </a>

              <div className="ct-card ct-card-location">
                <div className="ct-card-icon ct-card-icon-location">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="ct-card-text">
                  <span className="ct-card-label">Locație</span>
                  <span className="ct-card-value">Constanța, România</span>
                </div>
              </div>

              {/* Social links */}
              <div className="ct-socials">
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
            <div className="ct-form-wrap">
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

      {/* Footer */}
      <footer className="ft">
        <div className="ft-inner">
          <div className="ft-brand">
            <div className="ft-logo">
              <span className="ft-initials">BC</span>
              <div className="ft-logo-line"></div>
            </div>
            <p className="ft-tagline">Surprind momente, creez amintiri</p>
          </div>
          <div className="ft-links">
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

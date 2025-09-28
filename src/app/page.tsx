'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import './styles.css'

export default function Home() {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [currentGallery, setCurrentGallery] = useState('')
  const [currentImage, setCurrentImage] = useState('')
  const [galleryTitle, setGalleryTitle] = useState('')

  // Gallery data for each service
  const galleryData = {
    nunta: [
      '/assets/images/nunta/MihaiBianca/001-002.jpg',
      '/assets/images/nunta/MihaiBianca/007-008.jpg',
      '/assets/images/nunta/MihaiBianca/011-012.jpg',
      '/assets/images/nunta/MihaiBianca/013-014.jpg',
      '/assets/images/nunta/MihaiBianca/019-020.jpg',
      '/assets/images/nunta/MihaiBianca/021-022.jpg',
      '/assets/images/nunta/MihaiBianca/023-024.jpg',
      '/assets/images/nunta/MihaiBianca/033-034.jpg'
    ],
    botez: [
      '/assets/images/Botez/NOAH/001-002.jpg',
      '/assets/images/Botez/NOAH/005-006.jpg',
      '/assets/images/Botez/NOAH/007-008.jpg',
      '/assets/images/Botez/NOAH/009-010.jpg',
      '/assets/images/Botez/NOAH/011-012.jpg',
      '/assets/images/Botez/NOAH/013-014.jpg',
      '/assets/images/Botez/NOAH/015-016.jpg',
      '/assets/images/Botez/NOAH/017-018.jpg',
      '/assets/images/Botez/NOAH/019-020.jpg',
      '/assets/images/Botez/NOAH/021-022.jpg',
      '/assets/images/Botez/NOAH/023-024.jpg',
      '/assets/images/Botez/NOAH/025-026.jpg',
      '/assets/images/Botez/NOAH/027-028.jpg',
      '/assets/images/Botez/NOAH/029-030.jpg'
    ],
    'save-date': [
      '/assets/images/saveTheDate/112A1791-Enhanced-NR.jpg',
      '/assets/images/saveTheDate/112A1836-Enhanced-NR.jpg',
      '/assets/images/saveTheDate/112A1877-Enhanced-NR.jpg',
      '/assets/images/saveTheDate/112A1895-Enhanced-NR.jpg',
      '/assets/images/saveTheDate/112A1916-Enhanced-NR.jpg',
      '/assets/images/saveTheDate/112A1931-Enhanced-NR.jpg',
      '/assets/images/saveTheDate/112A1973-Enhanced-NR.jpg',
      '/assets/images/saveTheDate/112A1977-Enhanced-NR.jpg',
      '/assets/images/saveTheDate/112A1986-Enhanced-NR.jpg',
      '/assets/images/saveTheDate/5J9A3445-Enhanced-NR.jpg',
      '/assets/images/saveTheDate/5J9A3459-Enhanced-NR.jpg',
      '/assets/images/saveTheDate/5J9A3464-Enhanced-NR.jpg',
      '/assets/images/saveTheDate/5J9A3468-Enhanced-NR.jpg',
      '/assets/images/saveTheDate/5J9A3470-Enhanced-NR.jpg',
      '/assets/images/saveTheDate/5J9A3499-Enhanced-NR-2.jpg'
    ]
  }

  // Service titles for gallery modal
  const serviceTitles = {
    nunta: 'Galerie Nuntă',
    botez: 'Galerie Botez',
    'save-date': 'Galerie Save the Date'
  }

  // Open gallery modal
  const openGallery = (serviceType: string) => {
    const images = galleryData[serviceType as keyof typeof galleryData]
    const title = serviceTitles[serviceType as keyof typeof serviceTitles]
    
    if (!images || images.length === 0) {
      console.error('No images found for service:', serviceType)
      return
    }
    
    setCurrentGallery(serviceType)
    setGalleryTitle(title)
    setIsGalleryOpen(true)
    document.body.style.overflow = 'hidden'
  }

  // Close gallery modal
  const closeGallery = () => {
    setIsGalleryOpen(false)
    document.body.style.overflow = 'auto'
  }

  // Open lightbox
  const openLightbox = (imageSrc: string) => {
    setCurrentImage(imageSrc)
    setIsLightboxOpen(true)
  }

  // Close lightbox
  const closeLightbox = () => {
    setIsLightboxOpen(false)
    setCurrentImage('')
  }

  // Handle service card clicks
  const handleServiceCardClick = (serviceType: string) => {
    openGallery(serviceType)
  }

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
      
      // Add parallax effect to hero section
      const hero = document.querySelector('.hero')
      const heroImage = document.querySelector('.hero-image img') as HTMLImageElement
      
      if (hero && heroImage) {
        const scrollPercent = window.scrollY / window.innerHeight
        heroImage.style.transform = `translateY(${scrollPercent * 50}px)`
      }
    }

    window.addEventListener('scroll', handleScroll)

    // Form submission
    const contactForm = document.getElementById('contact-form') as HTMLFormElement

    const handleFormSubmit = (e: Event) => {
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
      
      // Simulate form submission
      const submitBtn = contactForm.querySelector('.submit-btn') as HTMLButtonElement
      const originalText = submitBtn.innerHTML
      
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Se trimite...'
      submitBtn.disabled = true
      
      setTimeout(() => {
        submitBtn.innerHTML = originalText
        submitBtn.disabled = false
        contactForm.reset()
        showNotification('Mulțumesc pentru mesaj! Voi reveni cu un răspuns în cel mai scurt timp.', 'success')
      }, 2000)
    }

    if (contactForm) {
      contactForm.addEventListener('submit', handleFormSubmit)
    }

    // Handle keyboard events for modals
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) {
          closeLightbox()
        } else if (isGalleryOpen) {
          closeGallery()
        }
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
  }, [isGalleryOpen, isLightboxOpen])

  return (
    <>
      {/* Fixed Navigation */}
      <nav className="navbar" id="navbar">
        <div className="nav-container">
          {/* Premium 3D Logo */}
          <div className="nav-logo">
            <div className="logo-3d">
              <div className="logo-face logo-front">
                <span>BC</span>
                <i className="fas fa-camera logo-icon"></i>
              </div>
              <div className="logo-face logo-back">
                <span>BC</span>
              </div>
              <div className="logo-face logo-right"></div>
              <div className="logo-face logo-left"></div>
              <div className="logo-face logo-top"></div>
              <div className="logo-face logo-bottom"></div>
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

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Banciu Costin</h1>
            <p className="subtitle">F O T O G R A F </p>
            <p className="hero-description">Surprind momente, creez amintiri</p>
            <button className="cta-button">
              <span>Descoperă serviciile</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
        <div className="hero-image">
          <Image src="/assets/images/hero-image.png" alt="Banciu Costin Photography" width={600} height={400} />
        </div>
        <div className="hero-overlay"></div>
      </section>

      {/* Services Section */}
      <section id="servicii" className="services">
        <div className="services-background">
          <div className="bg-element bg-element-1"></div>
          <div className="bg-element bg-element-2"></div>
          <div className="bg-element bg-element-3"></div>
          <div className="bg-pattern"></div>
        </div>
        
        <div className="container">
          <h2 className="section-title">Serviciile Mele</h2>
          <p className="section-subtitle">Fiecare moment are povestea lui. Lasă-mă să o surprind pentru tine.</p>
          
          <div className="service-grid">
            {/* Wedding */}
            <div className="service-card" data-service="nunta">
              <div className="card-inner">
                <div className="card-front">
                  <div className="service-icon">💍</div>
                  <h3>Nuntă</h3>
                  <h4>O zi, o viață de amintiri</h4>
                  <p>Într-o zi, două suflete spun &ldquo;da&rdquo; pentru totdeauna. Nunta nu este doar un eveniment – este începutul unei povești...</p>
                  <div className="card-hint">
                    <i className="fas fa-camera"></i>
                    <span>Hover pentru preview</span>
                  </div>
                </div>
                <div className="card-back">
                  <Image src="/placeholder.svg?height=400&width=600&text=Wedding+Photography" alt="Wedding Photography" width={600} height={400} />
                  <div className="card-overlay">
                    <h3>Nuntă</h3>
                    <p>O zi, o viață de amintiri</p>
                    <button className="view-gallery-btn" onClick={() => handleServiceCardClick('nunta')}>
                      <i className="fas fa-camera"></i>
                      <span>Vezi galeria →</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Baptism */}
            <div className="service-card" data-service="botez">
              <div className="card-inner">
                <div className="card-front">
                  <div className="service-icon">👶</div>
                  <h3>Botez</h3>
                  <h4>Magia începuturilor</h4>
                  <p>Sunt zile care trec și zile care rămân în suflet pentru totdeauna. Prima băiță în cristelniță...</p>
                  <div className="card-hint">
                    <i className="fas fa-camera"></i>
                    <span>Hover pentru preview</span>
                  </div>
                </div>
                <div className="card-back">
                  <Image src="/placeholder.svg?height=400&width=600&text=Baptism+Photography" alt="Baptism Photography" width={600} height={400} />
                  <div className="card-overlay">
                    <h3>Botez</h3>
                    <p>Magia începuturilor</p>
                    <button className="view-gallery-btn" onClick={() => handleServiceCardClick('botez')}>
                      <i className="fas fa-camera"></i>
                      <span>Vezi galeria →</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Save the Date */}
            <div className="service-card" data-service="save-date">
              <div className="card-inner">
                <div className="card-front">
                  <div className="service-icon">📅</div>
                  <h3>Save the Date</h3>
                  <h4>Primul capitol din povestea voastră de nuntă</h4>
                  <p>Totul începe cu o întrebare și un &ldquo;da&rdquo; spus din inimă. Urmează planuri, visuri, idei...</p>
                  <div className="card-hint">
                    <i className="fas fa-camera"></i>
                    <span>Hover pentru preview</span>
                  </div>
                </div>
                <div className="card-back">
                  <Image src="/placeholder.svg?height=400&width=600&text=Save+the+Date" alt="Save the Date" width={600} height={400} />
                  <div className="card-overlay">
                    <h3>Save the Date</h3>
                    <p>Primul capitol din povestea voastră</p>
                    <button className="view-gallery-btn" onClick={() => handleServiceCardClick('save-date')}>
                      <i className="fas fa-camera"></i>
                      <span>Vezi galeria →</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2 className="section-title">Să creăm împreună amintiri</h2>
          <p className="section-subtitle">Fiecare poveste merită să fie spusă frumos. <br />Spune-mi povestea ta.</p>
          
          <div className="contact-content">
            <div className="contact-info">
              <h3>Banciu Costin</h3>
              <p>Fotograf Profesionist</p>
              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <a href="tel:+40753110407">+40 753 110 407</a>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fab fa-whatsapp"></i>
                  </div>
                  <a href="https://wa.me/40753110407" target="_blank" rel="noopener noreferrer">+40 753 110 407 (WhatsApp)</a>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <a href="mailto:costinfoto@gmail.com">costinfoto@gmail.com</a>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <span>Constanta, Romania</span>
                </div>
              </div>
            </div>
            
            <div className="contact-form">
              <form id="contact-form">
                <div className="form-row">
                  <input type="text" name="name" placeholder="Numele tău" required />
                  <input type="email" name="email" placeholder="Email" required />
                </div>
                <input type="tel" name="phone" placeholder="Telefon" required />
                <select name="service" required>
                  <option value="">Selectează serviciul</option>
                  <option value="nunta">Nuntă</option>
                  <option value="botez">Botez</option>
                  <option value="cuplu">Cuplu</option>
                  <option value="familie">Familie</option>
                  <option value="amuzante">Fotografii amuzante</option>
                  <option value="save-date">Save the Date</option>
                  <option value="trash-dress">Trash the Dress</option>
                  <option value="absolvire">Absolvire</option>
                  <option value="profesional">Profesional</option>
                </select>
                <textarea name="message" placeholder="Spune-mi despre evenimentul tău..." rows={5}></textarea>
                <button type="submit" className="submit-btn">
                  <span>Trimite mesajul</span>
                  <i className="fas fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Modal */}
      <div id="gallery-modal" className="gallery-modal" style={{ display: isGalleryOpen ? 'block' : 'none' }}>
        <div className="gallery-content">
          <div className="gallery-header">
            <h2 id="gallery-title">{galleryTitle}</h2>
            <button className="close-gallery" id="close-gallery" onClick={closeGallery}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="gallery-grid" id="gallery-grid">
            {isGalleryOpen && currentGallery && galleryData[currentGallery as keyof typeof galleryData]?.map((imageSrc, index) => (
              <div key={index} className="gallery-item" onClick={() => openLightbox(imageSrc)}>
                <Image src={imageSrc} alt={`${galleryTitle} ${index + 1}`} width={300} height={200} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      <div id="lightbox" className="lightbox" style={{ display: isLightboxOpen ? 'block' : 'none' }} onClick={closeLightbox}>
        <div className="lightbox-content">
          <Image id="lightbox-image" src={currentImage} alt="" width={800} height={600} />
          <button className="close-lightbox" id="close-lightbox" onClick={closeLightbox}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Banciu Costin Photography. Toate drepturile rezervate.</p>
        </div>
      </footer>
    </>
  )
}

'use client'

import CategoryViewModal from '@/components/CategoryViewModal'
import { Category } from '@/types'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import './styles.css'

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch categories from API
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
            {/* <button className="cta-button">
              <span>Descoperă serviciile</span>
              <i className="fas fa-arrow-right"></i>
            </button> */}
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
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
            </div>
          ) : categories.length > 0 ? (
            <div className="service-grid">
              {categories.map((category) => {
                // Get first image from first event for preview
                const previewImage = category.events?.[0]?.images?.[0]
                const truncatedDescription = category.description 
                  ? category.description.length > 120 
                    ? category.description.substring(0, 120) + '...' 
                    : category.description
                  : ''

                return (
                  <div key={category.id} className="service-card" data-service={category.slug}>
                    <div className="card-inner">
                      <div className="card-front">
                        {category.icon && <div className="service-icon">{category.icon}</div>}
                        <h3>{category.name}</h3>
                        {category.subtitle && <h4>{category.subtitle}</h4>}
                        <p>{truncatedDescription}</p>
                        <div className="card-hint">
                          <i className="fas fa-camera"></i>
                          <span>Hover pentru preview</span>
                        </div>
                      </div>
                      <div className="card-back">
                        {previewImage ? (
                          <Image 
                            src={previewImage.thumbnailUrl || previewImage.url} 
                            alt={category.name} 
                            width={600} 
                            height={400} 
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center">
                            {category.icon && <span className="text-8xl opacity-30">{category.icon}</span>}
                          </div>
                        )}
                        <div className="card-overlay">
                          <h3>{category.name}</h3>
                          {category.subtitle && <p>{category.subtitle}</p>}
                          <button 
                            className="view-gallery-btn" 
                            onClick={() => handleCategoryClick(category)}
                          >
                            <i className="fas fa-camera"></i>
                            <span>Vezi galeria →</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">Serviciile vor fi disponibile în curând.</p>
            </div>
          )}
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
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
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

      {/* Category View Modal */}
      {selectedCategory && (
        <CategoryViewModal
          category={selectedCategory}
          onClose={closeModal}
        />
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Banciu Costin Photography. Toate drepturile rezervate.</p>
        </div>
      </footer>
    </>
  )
}

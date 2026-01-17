'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

// Tipuri pentru imagini
interface PortfolioImage {
  id: string
  src: string
  alt: string
  category: string
}

// Imagini demo - înlocuiește cu imaginile tale
const portfolioImages: PortfolioImage[] = [
  // Nuntă
  { id: '1', src: '/assets/images/nunta/MihaiBianca/001-002.jpg', alt: 'Nuntă 1', category: 'Nuntă' },
  { id: '2', src: '/assets/images/nunta/MihaiBianca/007-008.jpg', alt: 'Nuntă 2', category: 'Nuntă' },
  { id: '3', src: '/assets/images/nunta/MihaiBianca/011-012.jpg', alt: 'Nuntă 3', category: 'Nuntă' },
  { id: '4', src: '/assets/images/nunta/MihaiBianca/013-014.jpg', alt: 'Nuntă 4', category: 'Nuntă' },
  { id: '5', src: '/assets/images/nunta/MihaiBianca/019-020.jpg', alt: 'Nuntă 5', category: 'Nuntă' },
  { id: '6', src: '/assets/images/nunta/MihaiBianca/021-022.jpg', alt: 'Nuntă 6', category: 'Nuntă' },
  { id: '7', src: '/assets/images/nunta/MihaiBianca/023-024.jpg', alt: 'Nuntă 7', category: 'Nuntă' },
  { id: '8', src: '/assets/images/nunta/MihaiBianca/033-034.jpg', alt: 'Nuntă 8', category: 'Nuntă' },
  
  // Botez
  { id: '9', src: '/assets/images/Botez/NOAH/001-002.jpg', alt: 'Botez 1', category: 'Botez' },
  { id: '10', src: '/assets/images/Botez/NOAH/005-006.jpg', alt: 'Botez 2', category: 'Botez' },
  { id: '11', src: '/assets/images/Botez/NOAH/007-008.jpg', alt: 'Botez 3', category: 'Botez' },
  { id: '12', src: '/assets/images/Botez/NOAH/009-010.jpg', alt: 'Botez 4', category: 'Botez' },
  { id: '13', src: '/assets/images/Botez/NOAH/011-012.jpg', alt: 'Botez 5', category: 'Botez' },
  { id: '14', src: '/assets/images/Botez/NOAH/013-014.jpg', alt: 'Botez 6', category: 'Botez' },
  { id: '15', src: '/assets/images/Botez/NOAH/015-016.jpg', alt: 'Botez 7', category: 'Botez' },
  { id: '16', src: '/assets/images/Botez/NOAH/017-018.jpg', alt: 'Botez 8', category: 'Botez' },
  
  // Save the Date
  { id: '17', src: '/assets/images/saveTheDate/112A1791-Enhanced-NR.jpg', alt: 'Save the Date 1', category: 'Save the Date' },
  { id: '18', src: '/assets/images/saveTheDate/112A1836-Enhanced-NR.jpg', alt: 'Save the Date 2', category: 'Save the Date' },
  { id: '19', src: '/assets/images/saveTheDate/112A1877-Enhanced-NR.jpg', alt: 'Save the Date 3', category: 'Save the Date' },
  { id: '20', src: '/assets/images/saveTheDate/112A1895-Enhanced-NR.jpg', alt: 'Save the Date 4', category: 'Save the Date' },
  { id: '21', src: '/assets/images/saveTheDate/112A1916-Enhanced-NR.jpg', alt: 'Save the Date 5', category: 'Save the Date' },
  { id: '22', src: '/assets/images/saveTheDate/112A1931-Enhanced-NR.jpg', alt: 'Save the Date 6', category: 'Save the Date' },
]

export default function PortofoliuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Toate')
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [filteredImages, setFilteredImages] = useState<PortfolioImage[]>(portfolioImages)

  const categories = ['Toate', 'Nuntă', 'Botez', 'Save the Date']

  // Filtrează imaginile pe categorii
  useEffect(() => {
    if (selectedCategory === 'Toate') {
      setFilteredImages(portfolioImages)
    } else {
      setFilteredImages(portfolioImages.filter(img => img.category === selectedCategory))
    }
  }, [selectedCategory])

  // Deschide sliderul
  const openSlider = (index: number) => {
    setSelectedImageIndex(index)
    document.body.style.overflow = 'hidden'
  }

  // Închide sliderul
  const closeSlider = () => {
    setSelectedImageIndex(null)
    document.body.style.overflow = 'auto'
  }

  // Navigare în slider
  const goToPrevious = () => {
    if (selectedImageIndex !== null) {
      const newIndex = selectedImageIndex === 0 ? filteredImages.length - 1 : selectedImageIndex - 1
      setSelectedImageIndex(newIndex)
    }
  }

  const goToNext = () => {
    if (selectedImageIndex !== null) {
      const newIndex = selectedImageIndex === filteredImages.length - 1 ? 0 : selectedImageIndex + 1
      setSelectedImageIndex(newIndex)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex !== null) {
        if (e.key === 'ArrowLeft') goToPrevious()
        if (e.key === 'ArrowRight') goToNext()
        if (e.key === 'Escape') closeSlider()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImageIndex])

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        padding: '2rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>
              Portofoliu
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '0.5rem 0 0 0' }}>
              Colecția mea de momente speciale
            </p>
          </div>
          
          <Link 
            href="/"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '50px',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            ← Înapoi Acasă
          </Link>
        </div>
      </div>

      {/* Filtre categorii */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              background: selectedCategory === category 
                ? 'rgba(255, 255, 255, 0.9)' 
                : 'rgba(255, 255, 255, 0.2)',
              color: selectedCategory === category ? '#333' : 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '0.75rem 1.5rem',
              borderRadius: '50px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontWeight: selectedCategory === category ? '600' : '400'
            }}
            onMouseEnter={(e) => {
              if (selectedCategory !== category) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCategory !== category) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            {category} ({category === 'Toate' ? portfolioImages.length : portfolioImages.filter(img => img.category === category).length})
          </button>
        ))}
      </div>

      {/* Galeria de imagini */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem 4rem 2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {filteredImages.map((image, index) => (
          <div
            key={image.id}
            onClick={() => openSlider(index)}
            style={{
              position: 'relative',
              aspectRatio: '4/3',
              borderRadius: '15px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)'
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)'
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)'
            }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Overlay cu categoria */}
            <div style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              {image.category}
            </div>

            {/* Hover overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
            >
              <div style={{
                color: 'white',
                fontSize: '3rem',
                transform: 'scale(0.8)',
                transition: 'transform 0.3s ease'
              }}>
                🔍
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slider Modal */}
      {selectedImageIndex !== null && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.95)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Close button */}
          <button
            onClick={closeSlider}
            style={{
              position: 'absolute',
              top: '2rem',
              right: '2rem',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              zIndex: 1001,
              transition: 'background 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            ✕
          </button>

          {/* Previous button */}
          <button
            onClick={goToPrevious}
            style={{
              position: 'absolute',
              left: '2rem',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              zIndex: 1001,
              transition: 'background 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            ←
          </button>

          {/* Next button */}
          <button
            onClick={goToNext}
            style={{
              position: 'absolute',
              right: '2rem',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              zIndex: 1001,
              transition: 'background 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            →
          </button>

          {/* Image */}
          <div style={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
            width: 'auto',
            height: 'auto'
          }}>
            <Image
              src={filteredImages[selectedImageIndex].src}
              alt={filteredImages[selectedImageIndex].alt}
              width={1200}
              height={800}
              style={{
                maxWidth: '100%',
                maxHeight: '90vh',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain'
              }}
            />
          </div>

          {/* Image counter */}
          <div style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '25px',
            fontSize: '1rem'
          }}>
            {selectedImageIndex + 1} / {filteredImages.length}
          </div>
        </div>
      )}
    </div>
  )
}
'use client'

import Image from 'next/image'

interface AboutModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 4000,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header cu buton close */}
        <div style={{
          position: 'sticky',
          top: 0,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '2rem',
          borderRadius: '20px 20px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
            Despre Mine
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              transition: 'background 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '2rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: '2rem',
            alignItems: 'start'
          }}>
            {/* Poza ta */}
            <div style={{
              position: 'relative',
              borderRadius: '15px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
            }}>
              <Image
                src="/assets/images/despre-mine.jpg"
                alt="Banciu Costin - Fotograf"
                width={300}
                height={400}
                priority={true}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                  filter: 'grayscale(100%)'
                }}
              />
            </div>

            {/* Detalii despre tine */}
            <div style={{ color: '#374151' }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#111827'
              }}>
                Banciu Costin
              </h3>
              
              <p style={{
                fontSize: '1.1rem',
                fontWeight: '500',
                color: '#6366f1',
                marginBottom: '1.5rem'
              }}>
                Fotograf Profesionist
              </p>

              <div style={{ lineHeight: '1.8', fontSize: '1rem' }}>
                <p style={{ marginBottom: '1.5rem' }}>
                  Bună! Sunt Costin și sunt pasionat de fotografie de peste <strong>10 ani</strong>. 
                  Specializarea mea principală este fotografia de evenimente - nunți, botezuri, 
                  și momente speciale din viața oamenilor.
                </p>

                <p style={{ marginBottom: '1.5rem' }}>
                  Cred că fiecare moment are povestea lui unică și rolul meu este să surprind 
                  emoțiile autentice, zâmbetele sincere și gesturile care vorbesc despre dragoste.
                </p>

                <p style={{ marginBottom: '1.5rem' }}>
                  Am avut privilegiul să documentez peste <strong>200 de nunți</strong> și 
                  sute de alte evenimente speciale, fiecare cu propria sa magie și unicitate.
                </p>

                {/* Detalii de contact */}
                <div style={{
                  background: '#f8fafc',
                  padding: '1.5rem',
                  borderRadius: '10px',
                  marginTop: '2rem'
                }}>
                  <h4 style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '1rem',
                    color: '#111827'
                  }}>
                    Să vorbim despre proiectul tău:
                  </h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ color: '#6366f1' }}>📧</span>
                      <a href="mailto:costinfoto@gmail.com" style={{ color: '#6366f1', textDecoration: 'none' }}>
                        costinfoto@gmail.com
                      </a>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ color: '#6366f1' }}>📱</span>
                      <a href="tel:+40753110407" style={{ color: '#6366f1', textDecoration: 'none' }}>
                        +40 753 110 407
                      </a>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ color: '#6366f1' }}>💬</span>
                      <a 
                        href="https://wa.me/40753110407" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: '#6366f1', textDecoration: 'none' }}
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile responsive */}
          <style jsx>{`
            @media (max-width: 768px) {
              .about-content {
                grid-template-columns: 1fr !important;
                text-align: center;
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  )
}
'use client'

import { Category, Event } from '@/types'
import Image from 'next/image'
import { useState } from 'react'
import EventViewModal from './EventViewModal'

interface CategoryViewModalProps {
  category: Category | null
  onClose: () => void
}

export default function CategoryViewModal({ category, onClose }: CategoryViewModalProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  if (!category) return null

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
  }

  const handleCloseEventModal = () => {
    setSelectedEvent(null)
  }

  return (
    <>
      <style jsx>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 3000,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(12px)',
          animation: 'modalFadeIn 0.3s ease'
        }}
        onClick={onClose}
      >
        <div
          style={{
            position: 'fixed',
            top: '1rem',
            left: '1rem',
            right: '1rem',
            bottom: '1rem',
            zIndex: 3001,
            backgroundColor: '#0a0a0a',
            borderRadius: '1rem',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255,255,255,0.06)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            animation: 'modalSlideUp 0.4s ease'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Gold theme */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(251,191,36,0.12) 0%, rgba(245,158,11,0.06) 100%)',
              borderBottom: '1px solid rgba(251,191,36,0.12)',
              color: 'white',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {category.icon && <span style={{ fontSize: '2rem' }}>{category.icon}</span>}
              <div>
                <h2 style={{
                  fontSize: '1.6rem',
                  fontWeight: 300,
                  margin: 0,
                  fontFamily: "'Playfair Display', serif"
                }}>
                  {category.name}
                </h2>
                {category.subtitle && (
                  <p style={{
                    color: 'rgba(251,191,36,0.6)',
                    fontSize: '0.8rem',
                    margin: 0,
                    marginTop: '0.25rem',
                    letterSpacing: '0.05em'
                  }}>
                    {category.subtitle}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                flexShrink: 0,
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(251,191,36,0.1)'
                e.currentTarget.style.borderColor = 'rgba(251,191,36,0.3)'
                e.currentTarget.style.color = '#fbbf24'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
              }}
              aria-label="Close"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
            {category.description && (
              <p style={{
                fontSize: '1.1rem',
                fontWeight: 300,
                marginBottom: '2rem',
                fontStyle: 'italic',
                padding: '1rem 2rem',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.4)',
                lineHeight: '1.6',
                fontFamily: "'Playfair Display', serif"
              }}>
                {category.description}
              </p>
            )}

            {category.events && category.events.length > 0 ? (
              <>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.4)',
                  marginBottom: '1.5rem',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em'
                }}>
                  Evenimente ({category.events.length})
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1.25rem',
                    padding: '0 0.5rem',
                    justifyContent: 'center'
                  }}
                >
                  {category.events.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => handleEventClick(event)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: 'rgba(255,255,255,0.02)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.06)',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        width: '280px',
                        maxWidth: '100%'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(251,191,36,0.2)'
                        e.currentTarget.style.background = 'rgba(251,191,36,0.03)'
                        e.currentTarget.style.transform = 'translateY(-4px)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                    >
                      {event.images && event.images.length > 0 && (
                        <div style={{
                          aspectRatio: '16/9',
                          backgroundColor: '#111',
                          overflow: 'hidden'
                        }}>
                          <Image
                            src={event.images[0].thumbnailUrl || event.images[0].url}
                            alt={event.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.5s ease'
                            }}
                            width={300}
                            height={169}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          />
                        </div>
                      )}
                      <div style={{ padding: '1rem' }}>
                        <h4 style={{
                          fontWeight: 400,
                          color: 'white',
                          marginBottom: '0.4rem',
                          fontSize: '1rem',
                          fontFamily: "'Playfair Display', serif"
                        }}>
                          {event.name}
                        </h4>
                        {event.description && (
                          <p style={{
                            fontSize: '0.8rem',
                            color: 'rgba(255,255,255,0.35)',
                            lineHeight: '1.5',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {event.description}
                          </p>
                        )}
                        <div style={{
                          marginTop: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.8rem'
                        }}>
                          <span style={{ color: 'rgba(255,255,255,0.25)' }}>
                            {event.images?.length || 0} fotografii
                          </span>
                          <span style={{
                            color: '#fbbf24',
                            fontWeight: 400,
                            fontSize: '0.75rem',
                            letterSpacing: '0.05em'
                          }}>
                            Vezi galeria →
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px'
              }}>
                <div style={{
                  textAlign: 'center',
                  maxWidth: '24rem',
                  margin: '0 auto',
                  padding: '0 1.5rem'
                }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '5rem',
                    height: '5rem',
                    borderRadius: '50%',
                    border: '1px solid rgba(251,191,36,0.15)',
                    background: 'rgba(251,191,36,0.05)',
                    marginBottom: '1.5rem'
                  }}>
                    <i className="fas fa-camera" style={{ fontSize: '2rem', color: 'rgba(251,191,36,0.4)' }}></i>
                  </div>

                  <h3 style={{
                    fontSize: '1.6rem',
                    fontWeight: 300,
                    color: 'white',
                    marginBottom: '0.75rem',
                    fontFamily: "'Playfair Display', serif"
                  }}>
                    În curând
                  </h3>

                  <p style={{
                    fontSize: '0.95rem',
                    color: 'rgba(255,255,255,0.3)',
                    lineHeight: '1.6'
                  }}>
                    Evenimente noi vor fi adăugate în această categorie.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {selectedEvent && (
        <EventViewModal
          event={selectedEvent}
          onClose={handleCloseEventModal}
          onBack={() => setSelectedEvent(null)}
        />
      )}
    </>
  )
}

'use client'

import { Event } from '@/types'
import Image from 'next/image'
import { useState } from 'react'

interface EventViewModalProps {
  event: Event | null
  onClose: () => void
  onBack: () => void
}

export default function EventViewModal({ event, onClose, onBack }: EventViewModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  if (!event) return null

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index)
  }

  const handleCloseLightbox = () => {
    setSelectedImageIndex(null)
  }

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedImageIndex !== null && event.images) {
      setSelectedImageIndex((selectedImageIndex - 1 + event.images.length) % event.images.length)
    }
  }

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedImageIndex !== null && event.images) {
      setSelectedImageIndex((selectedImageIndex + 1) % event.images.length)
    }
  }

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 3500,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(4px)'
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
            zIndex: 3501,
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            background: 'linear-gradient(to right, #4f46e5, #7c3aed)',
            color: 'white',
            padding: '1rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
              <button
                onClick={onBack}
                style={{
                  flexShrink: 0,
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                aria-label="Back"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>{event.name}</h2>
                {event.date && (
                  <p style={{
                    color: '#c7d2fe',
                    fontSize: '0.875rem',
                    margin: 0,
                    marginTop: '0.25rem'
                  }}>
                    {new Date(event.date).toLocaleDateString('ro-RO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
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
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s',
                marginLeft: '0.75rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
              aria-label="Close"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem 1rem'
          }}>
            {event.description && (
              <p style={{
                color: '#6b7280',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                lineHeight: '1.6'
              }}>
                {event.description}
              </p>
            )}

            {event.images && event.images.length > 0 ? (
              <>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.5rem'
                }}>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0
                  }}>
                    Galerie fotografii
                  </h3>
                  <span style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    backgroundColor: '#f3f4f6',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px'
                  }}>
                    {event.images.length} {event.images.length === 1 ? 'fotografie' : 'fotografii'}
                  </span>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.75rem'
                }}>
                  {event.images.map((image, index) => {
                    const isVideo = image.mimeType?.startsWith('video/')
                    
                    return (
                      <div
                        key={image.id}
                        onClick={() => handleImageClick(index)}
                        style={{
                          cursor: 'pointer',
                          aspectRatio: '1/1',
                          backgroundColor: '#f3f4f6',
                          borderRadius: '0.5rem',
                          overflow: 'hidden',
                          position: 'relative'
                        }}
                      >
                        {isVideo ? (
                          <>
                            <video
                              src={image.url}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                              preload="metadata"
                            />
                            <div style={{
                              position: 'absolute',
                              top: '0.5rem',
                              right: '0.5rem',
                              backgroundColor: 'rgba(147, 51, 234, 0.9)',
                              color: 'white',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '0.25rem',
                              fontSize: '0.75rem',
                              fontWeight: '600'
                            }}>
                              🎥 Video
                            </div>
                          </>
                        ) : (
                          <Image
                            src={image.thumbnailUrl || image.url}
                            alt={image.alt || `${event.name} - Image ${index + 1}`}
                            fill
                            style={{
                              objectFit: 'cover',
                              transition: 'transform 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          />
                        )}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(0, 0, 0, 0)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background-color 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0)'}
                        >
                          <svg 
                            style={{
                              width: '2rem',
                              height: '2rem',
                              color: 'white',
                              opacity: 0,
                              transition: 'opacity 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" 
                            />
                          </svg>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '3rem 0'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🖼️</div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '0.5rem',
                  margin: 0
                }}>
                  Nicio fotografie încă
                </h3>
                <p style={{
                  color: '#6b7280',
                  margin: 0
                }}>
                  Fotografiile vor fi adăugate în curând.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImageIndex !== null && event.images && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 4000,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={handleCloseLightbox}
        >
          <button
            onClick={handleCloseLightbox}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              zIndex: 10,
              width: '3rem',
              height: '3rem',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
            aria-label="Close lightbox"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {event.images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  zIndex: 10,
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                aria-label="Previous image"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={handleNextImage}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  zIndex: 10,
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                aria-label="Next image"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <div style={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh'
          }} onClick={(e) => e.stopPropagation()}>
            {event.images[selectedImageIndex].mimeType?.startsWith('video/') ? (
              <video
                src={event.images[selectedImageIndex].url}
                controls
                autoPlay
                style={{
                  maxWidth: '100%',
                  maxHeight: '90vh',
                  width: 'auto',
                  height: 'auto'
                }}
              />
            ) : (
              <Image
                src={event.images[selectedImageIndex].url}
                alt={event.images[selectedImageIndex].alt || `${event.name} - Image ${selectedImageIndex + 1}`}
                width={event.images[selectedImageIndex].width || 1200}
                height={event.images[selectedImageIndex].height || 800}
                style={{
                  maxWidth: '100%',
                  maxHeight: '90vh',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain'
                }}
              />
            )}
            
            <div style={{
              position: 'absolute',
              bottom: '1rem',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.875rem'
            }}>
              {selectedImageIndex + 1} / {event.images.length}
            </div>
          </div>
        </div>
      )}
    </>
  )
}


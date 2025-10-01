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
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 3000,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
            zIndex: 3001,
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
          <div 
            style={{
              background: 'linear-gradient(to right, #9333ea, #7c3aed)',
              color: 'white',
              padding: '1rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {category.icon && <span style={{ fontSize: '2.5rem' }}>{category.icon}</span>}
              <div>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: 0 }}>
                  {category.name}
                </h2>
                {category.subtitle && (
                  <p style={{ 
                    color: '#e9d5ff', 
                    fontSize: '0.875rem', 
                    margin: 0,
                    marginTop: '0.25rem'
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
              aria-label="Close"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
            {category.description && (
              <p style={{
                fontSize: '1.25rem',
                fontWeight: 500,
                marginBottom: '2rem',
                fontStyle: 'italic',
                padding: '1.5rem 2.5rem',
                textAlign: 'center',
                color: '#6b7280',
                lineHeight: '1.6'
              }}>
                {category.description}
              </p>
            )}

            {category.events && category.events.length > 0 ? (
              <>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '1.5rem',
                  textAlign: 'center'
                }}>
                  Evenimente disponibile ({category.events.length})
                </h3>
                <div 
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                    padding: '0 1rem',
                    justifyContent: 'center'
                  }}
                >
                  {category.events.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => handleEventClick(event)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: 'white',
                        borderRadius: '0.75rem',
                        border: '2px solid #e5e7eb',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        width: '300px',
                        maxWidth: '100%'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#a855f7'
                        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb'
                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      {event.images && event.images.length > 0 && (
                        <div style={{
                          aspectRatio: '16/9',
                          backgroundColor: '#f3f4f6',
                          overflow: 'hidden'
                        }}>
                          <Image
                            src={event.images[0].thumbnailUrl || event.images[0].url}
                            alt={event.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.3s ease'
                            }}
                            width={300}
                            height={169}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          />
                        </div>
                      )}
                      <div style={{ padding: '1rem' }}>
                        <h4 style={{
                          fontWeight: '600',
                          color: '#111827',
                          marginBottom: '0.5rem',
                          fontSize: '1.125rem',
                          transition: 'color 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#9333ea'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#111827'}
                        >
                          {event.name}
                        </h4>
                        {event.description && (
                          <p style={{
                            fontSize: '0.875rem',
                            color: '#6b7280',
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
                          fontSize: '0.875rem'
                        }}>
                          <span style={{ color: '#6b7280' }}>
                            {event.images?.length || 0} fotografii
                          </span>
                          <span style={{
                            color: '#9333ea',
                            fontWeight: '500',
                            transition: 'transform 0.3s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                          >
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
                  {/* Icon container with subtle background */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '6rem',
                    height: '6rem',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #faf5ff, #e9d5ff)',
                    marginBottom: '2rem'
                  }}>
                    <span style={{ fontSize: '3rem' }}>📸</span>
                  </div>
                  
                  {/* Heading */}
                  <h3 style={{
                    fontSize: '2.25rem',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '1.25rem'
                  }}>
                    În curând
                  </h3>
                  
                  {/* Description */}
                  <p style={{
                    fontSize: '1.125rem',
                    color: '#6b7280',
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


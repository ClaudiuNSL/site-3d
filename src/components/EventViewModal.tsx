// =============================================
// COMPONENTA EVENT VIEW MODAL (EventViewModal.tsx)
// Aceasta este fereastra popup care afișează un EVENIMENT individual
// Conține galeria de fotografii a evenimentului și un lightbox
// Se deschide din CategoryViewModal când dai click pe un eveniment
// =============================================

// 'use client' = componenta rulează în browser (necesară pentru interactivitate)
'use client'

// Event = tipul TypeScript care descrie structura unui eveniment
import { Event } from '@/types'
// Image = componenta Next.js optimizată pentru imagini
import Image from 'next/image'
// useState = hook React pentru a stoca date care se schimbă
import { useState } from 'react'

// interface = definim tipurile proprietăților componentei
// event = evenimentul de afișat (sau null dacă nu e selectat)
// onClose = funcția care închide COMPLET modalul
// onBack = funcția care revine la modalul de categorie (un pas înapoi)
interface EventViewModalProps {
  event: Event | null
  onClose: () => void
  onBack: () => void
}

// Componenta principală EventViewModal
export default function EventViewModal({ event, onClose, onBack }: EventViewModalProps) {
  // selectedImageIndex = indexul imaginii selectate pentru lightbox
  // null = nicio imagine selectată (lightbox-ul e închis)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  // Dacă nu avem un eveniment, nu afișăm nimic
  if (!event) return null

  // Funcție care se apelează când utilizatorul dă click pe o imagine din galerie
  // Salvează indexul imaginii și deschide lightbox-ul
  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index)
  }

  // Funcție care închide lightbox-ul (resetează indexul la null)
  const handleCloseLightbox = () => {
    setSelectedImageIndex(null)
  }

  // Funcție pentru a naviga la imaginea ANTERIOARĂ în lightbox
  // e.stopPropagation() = oprește click-ul să se propage la overlay
  // Formula: (index - 1 + total) % total = face navigarea circulară
  // Exemplu: dacă suntem la imagine 0 și avem 5 imagini: (0 - 1 + 5) % 5 = 4 (ultima)
  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedImageIndex !== null && event.images) {
      setSelectedImageIndex((selectedImageIndex - 1 + event.images.length) % event.images.length)
    }
  }

  // Funcție pentru a naviga la imaginea URMĂTOARE în lightbox
  // Formula: (index + 1) % total = face navigarea circulară
  // Exemplu: dacă suntem la imagine 4 (ultima) și avem 5: (4 + 1) % 5 = 0 (prima)
  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedImageIndex !== null && event.images) {
      setSelectedImageIndex((selectedImageIndex + 1) % event.images.length)
    }
  }

  return (
    // Fragment (<> </>) = container invizibil care grupează mai multe elemente
    <>
      {/* =============================================
          OVERLAY-UL (fundalul întunecat)
          position: fixed = acoperă tot ecranul
          zIndex: 3500 = apare deasupra CategoryViewModal (care e la 3000)
          onClick={onClose} = click pe fundal închide modalul
          ============================================= */}
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
        {/* =============================================
            CUTIA PRINCIPALĂ A MODALULUI
            Conține header-ul și galeria de fotografii
            e.stopPropagation() = click pe modal nu închide overlay-ul
            ============================================= */}
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

          {/* =============================================
              HEADER-UL MODALULUI
              Conține butonul înapoi, numele evenimentului, data și butonul X
              background: linear-gradient = fundal cu gradient violet
              ============================================= */}
          <div style={{
            background: 'linear-gradient(to right, #4f46e5, #7c3aed)',
            color: 'white',
            padding: '1rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            {/* Partea stângă: butonul înapoi și detaliile evenimentului */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
              {/* Butonul "Înapoi" (săgeata stânga) - revine la lista de evenimente */}
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
                {/* SVG = o imagine vectorială (săgeata stânga) */}
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Detaliile evenimentului */}
              <div style={{ minWidth: 0, flex: 1 }}>
                {/* Numele evenimentului */}
                {/* textOverflow: ellipsis = dacă textul e prea lung, adaugă "..." */}
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>{event.name}</h2>

                {/* Data evenimentului (opțional) - formatată în română */}
                {/* toLocaleDateString('ro-RO') = formatul românesc al datei */}
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

            {/* Butonul de închidere (X) */}
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
              {/* SVG = iconița X (două linii care se intersectează) */}
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* =============================================
              CONȚINUTUL MODALULUI - GALERIA DE FOTOGRAFII
              flex: 1 = ocupă tot spațiul disponibil
              overflowY: auto = bară de scroll verticală dacă e nevoie
              ============================================= */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem 1rem'
          }}>
            {/* Descrierea evenimentului (opțional) */}
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

            {/* Verificăm dacă evenimentul are imagini */}
            {event.images && event.images.length > 0 ? (
              // Dacă DA - afișăm galeria
              <>
                {/* Header-ul galeriei cu titlu și numărul de fotografii */}
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
                  {/* Numărul de fotografii într-un badge rotunjit */}
                  {/* borderRadius: 9999px = face forma de pastilă (foarte rotunjit) */}
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

                {/* Grila de imagini - 2 coloane */}
                {/* display: grid = layout în grilă */}
                {/* gridTemplateColumns: repeat(2, 1fr) = 2 coloane egale */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.75rem'
                }}>
                  {/* Parcurgem fiecare imagine din eveniment */}
                  {event.images.map((image, index) => {
                    // Verificăm dacă este un video (nu o imagine)
                    // mimeType = tipul fișierului (ex: "image/jpeg" sau "video/mp4")
                    const isVideo = image.mimeType?.startsWith('video/')

                    return (
                      <div
                        key={image.id}
                        // La click pe imagine/video, deschidem lightbox-ul
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
                        {/* Dacă este video, afișăm un element <video> */}
                        {isVideo ? (
                          <>
                            {/* Elementul video - afișează primul cadru */}
                            {/* preload="metadata" = încarcă doar informațiile, nu tot videoul */}
                            <video
                              src={image.url}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                              preload="metadata"
                            />
                            {/* Badge-ul "Video" - indicator vizual în colțul din dreapta sus */}
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
                          // Dacă este imagine, afișăm componenta Image din Next.js
                          // fill = imaginea umple containerul
                          // La hover: imaginea se mărește ușor (efect zoom)
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

                        {/* Overlay peste imagine - apare la hover cu iconița de lupă */}
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
                          {/* SVG-ul lupei (iconița de zoom/mărire) */}
                          {/* opacity: 0 = invizibil inițial, devine vizibil la hover */}
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
              // Dacă NU avem imagini - afișăm un mesaj
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

      {/* =============================================
          LIGHTBOX - VIZUALIZARE IMAGINE PE TOT ECRANUL
          Apare doar când selectedImageIndex nu este null și avem imagini
          zIndex: 4000 = apare deasupra tuturor celorlalte elemente
          ============================================= */}
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
          // Click pe fundal închide lightbox-ul
          onClick={handleCloseLightbox}
        >
          {/* Butonul X de închidere a lightbox-ului (colțul dreapta sus) */}
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

          {/* Butoanele de navigare (săgeți stânga/dreapta) - doar dacă avem mai mult de 1 imagine */}
          {event.images.length > 1 && (
            <>
              {/* Butonul săgeată stânga (imaginea anterioară) */}
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

              {/* Butonul săgeată dreapta (imaginea următoare) */}
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

          {/* =============================================
              IMAGINEA/VIDEOUL DIN LIGHTBOX
              Afișează imaginea selectată la dimensiune mare
              e.stopPropagation() = click pe imagine nu închide lightbox-ul
              ============================================= */}
          <div style={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Verificăm dacă este video sau imagine */}
            {event.images[selectedImageIndex].mimeType?.startsWith('video/') ? (
              // Dacă este VIDEO - afișăm player video cu controale
              // autoPlay = pornește automat
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
              // Dacă este IMAGINE - afișăm cu componenta Image
              // objectFit: contain = imaginea se potrivește în container fără a se tăia
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

            {/* Contorul de imagini (ex: "3 / 15") - afișat jos centrat */}
            {/* borderRadius: 9999px = formă de pastilă */}
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
